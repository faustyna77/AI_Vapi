import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth";
import GpioControl from "./GpioControl";
import VapiAssistant from "./VapiAssistant";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return user ? (
    <div>
      <button onClick={handleLogout} className="mb-4 p-2 bg-red-500 text-white rounded">
        Wyloguj
      </button>
      <GpioControl />
      <VapiAssistant 
        publicApiKey={process.env.REACT_APP_VAPI_PUBLIC_API_KEY}
        assistantId={process.env.REACT_APP_VAPI_ASSISTANT_ID}
      />
    </div>
  ) : (
    <Auth />
  );
}
