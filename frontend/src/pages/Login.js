// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/login/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",   // 🔥 ADD THIS
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();

      if (res.ok) {
  localStorage.setItem("token", data.token);   // 🔥 SAVE TOKEN
  login(data.user);
  navigate("/");
} else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <div className="w-full max-w-md bg-black/40 p-8 rounded-xl border border-cyan-500/30">

        <h2 className="text-2xl text-cyan-400 text-center mb-6">
          Login
        </h2>

        {error && (
          <div className="text-red-400 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-cyan-500/40 text-white"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-cyan-500/40 text-white"
            required
          />

          {/* ❌ REMOVED FORGOT PASSWORD */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded text-white"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-cyan-200 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}