import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError(""); // wyczyść błąd
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">🔐 Magic Lamp</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={login}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition mb-2"
        >
          Zaloguj się
        </button>

        <button
          onClick={register}
          className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition mb-4"
        >
          Zarejestruj się
        </button>

        <div className="flex items-center justify-center mb-2">
          <span className="border-b w-1/4 border-gray-300"></span>
          <span className="mx-2 text-gray-500 text-sm">lub</span>
          <span className="border-b w-1/4 border-gray-300"></span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 48 48"
          >
            <path
              fill="#fff"
              d="M44.5 20H24v8.5h11.7C34.1 34 30 38 24 38c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.7 1.4 9.1 3.7l6.4-6.4C36.6 4.5 30.8 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11.2 0 21-9.2 21-21 0-1.4-.1-2.5-.5-3z"
            />
          </svg>
          Zaloguj przez Google
        </button>
      </div>
    </div>
  );
}
