import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

export default function VapiAssistant({ publicApiKey, assistantId }) {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);

  // Zapisane wypowiedzi asystenta
  const [assistantResponses, setAssistantResponses] = useState([]);

  // Załaduj zapisane wypowiedzi przy starcie
  useEffect(() => {
    const saved = localStorage.getItem("assistantResponses");
    if (saved) setAssistantResponses(JSON.parse(saved));
  }, []);

  // Tworzymy instancję Vapi tylko raz przy montażu komponentu
  useEffect(() => {
    const vapiInstance = new Vapi(publicApiKey);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setIsLoading(false);
    });

    vapiInstance.on("speech-start", () => setIsSpeaking(true));
    vapiInstance.on("speech-end", () => setIsSpeaking(false));

    vapiInstance.on("message", (msg) => {
      if (msg.type === "transcript") {
        const newMessage = {
          role: msg.role,
          text: msg.transcript,
          timestamp: new Date(),
        };
        setTranscript((prev) => [...prev, newMessage]);

        if (msg.role === "assistant") {
          setAssistantResponses((prev) => {
            const updated = [...prev, msg.transcript];
            localStorage.setItem("assistantResponses", JSON.stringify(updated));
            return updated;
          });
        }
      }

      if (msg.type === "function-call") {
        console.log("Wywołanie funkcji:", msg.functionCall);
      }
    });

    vapiInstance.on("error", (err) => {
      console.error("Błąd Vapi:", err);
      setError("Wystąpił błąd podczas połączenia");
      setIsLoading(false);
      setIsConnected(false);
    });

    return () => vapiInstance.stop();
  }, [publicApiKey]); // tylko publicApiKey jako zależność

  // Start rozmowy
  const startCall = async () => {
    if (!vapi || isConnected || isLoading) return;

    setIsLoading(true);
    setError(null);
    setTranscript([]);

    try {
      await vapi.start(assistantId);
      setIsLoading(false);
    } catch (err) {
      setError("Nie udało się rozpocząć rozmowy");
      setIsLoading(false);
    }
  };

  const endCall = () => vapi?.stop();

  const clearAllData = () => {
    setTranscript([]);
    setAssistantResponses([]);
    localStorage.removeItem("assistantResponses");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🎤 Vapi Assistant</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="text-center mb-6">
        {!isConnected ? (
          <button
            onClick={startCall}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg text-white font-semibold ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Łączenie..." : "Rozpocznij rozmowę"}
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Zakończ rozmowę
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Wyczyść dane
            </button>
          </div>
        )}
      </div>

      {/* Transkrypcja */}
      <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
        {transcript.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Transkrypcja rozmowy pojawi się tutaj...</p>
        ) : (
          transcript.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-300"
              }`}>
                <div className="text-xs opacity-70">{msg.role}</div>
                <div>{msg.text}</div>
                <div className="text-xs opacity-50">{msg.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
