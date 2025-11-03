import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Dashboard({ onLogout }) {
  const [lampOn, setLampOn] = useState(false);

  const toggleLamp = async () => {
    const newState = !lampOn;
    setLampOn(newState);
    try {
      await fetch(`http://<TWOJE_IP_ESP32>/lamp?state=${newState ? "on" : "off"}`);
    } catch (err) {
      console.error("Błąd wysyłania do ESP32:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">💡 Magic Lamp</h1>
      <button
        onClick={toggleLamp}
        className={`px-10 py-4 rounded-xl text-xl font-semibold transition ${
          lampOn ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        {lampOn ? "Wyłącz Lampę" : "Włącz Lampę"}
      </button>
      <button
        onClick={() => {
          signOut(auth);
          onLogout();
        }}
        className="mt-8 text-sm text-red-500 hover:text-red-700"
      >
        Wyloguj się
      </button>
    </div>
  );
}
