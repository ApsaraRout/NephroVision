// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: ""
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // ✅ ONLY name + email
        body: JSON.stringify({
          email: form.email,
          full_name: form.full_name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔥 GENERATED PASSWORD SHOW
        alert("Your password: " + data.generated_password);

        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <div className="w-full max-w-md bg-black/40 p-8 rounded-xl border border-cyan-500/30">
        
        <h2 className="text-2xl text-cyan-400 text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="text-red-400 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ✅ FULL NAME */}
          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-cyan-500/40 text-white"
            required
          />

          {/* ✅ EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-cyan-500/40 text-white"
            required
          />

          {/* ✅ REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded text-white"
          >
            {loading ? 'Creating...' : 'REGISTER'}
          </button>
        </form>

        {/* ✅ LOGIN LINK */}
        <p className="text-center text-sm text-cyan-200 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}