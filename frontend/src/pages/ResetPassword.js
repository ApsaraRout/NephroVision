import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: '',
    otp: '',
    new_password: ''
  });

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/accounts/reset-password-confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Password updated successfully!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-6 rounded w-80">
        <h2 className="text-white text-xl mb-4 text-center">Reset Password</h2>

        {msg && <p className="text-green-400">{msg}</p>}
        {error && <p className="text-red-400">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-2"
            onChange={handleChange}
            required
          />

          <input
            name="otp"
            placeholder="OTP"
            className="w-full p-2 mb-2"
            onChange={handleChange}
            required
          />

          <input
            name="new_password"
            type="password"
            placeholder="New Password"
            className="w-full p-2 mb-3"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-green-500 p-2 text-white">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}