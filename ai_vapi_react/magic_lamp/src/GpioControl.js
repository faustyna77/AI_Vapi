// GpioControl.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, onValue, update } from "firebase/database";

export default function GpioControl() {
  const [gpio, setGpio] = useState({ gpio1: false, gpio2: false });

  // Nasłuchuj zmian w Firebase
  useEffect(() => {
    const gpioRef = ref(db, "device1");
    const unsubscribe = onValue(gpioRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setGpio({
          gpio1: !!val.gpio1,
          gpio2: !!val.gpio2,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleGpio = (pin) => {
    const newState = !gpio[pin];
    console.log("Kliknięto:", pin, "Nowy stan:", newState);

    update(ref(db, "device1"), { [pin]: newState })
      .then(() => console.log("Update success"))
      .catch((err) => console.error("Update error:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
      <h1 className="text-3xl font-bold mb-4">💡 Magic Lamp - Sterowanie GPIO</h1>

      <button
        onClick={() => toggleGpio("gpio1")}
        className={`px-6 py-3 rounded-xl text-lg font-semibold ${
          gpio.gpio1 ? "bg-green-500" : "bg-red-500"
        }`}
      >
        GPIO1: {gpio.gpio1 ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => toggleGpio("gpio2")}
        className={`px-6 py-3 rounded-xl text-lg font-semibold ${
          gpio.gpio2 ? "bg-green-500" : "bg-red-500"
        }`}
      >
        GPIO2: {gpio.gpio2 ? "ON" : "OFF"}
      </button>
    </div>
  );
}
