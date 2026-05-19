// src/pages/EgfrCalculatorPage.jsx
import React, { useState } from 'react';

export default function EgfrCalculatorPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend se eGFR stage calculate karne ka function
  const calculateFromBackend = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Yeh values static hain — agar form se lene hain toh form add kar sakti hai
    const payload = {
      age: 30,
      gender: 'male',
      serum_creatinine: 1.2, // change kar ke test kar sakti hai
      race: 'non-black',
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/calculate-egfr/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (err) {
      setError('Server connection error — Django chal raha hai?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w- mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          {/* Tumhara heading */}
        </h1>
        <p className="text-center text-xl text-gray-300 mb-10">
          {/* Tumhara description */}
        </p>

        <iframe
          src="/eGFRcal.html"
          width="100%"
          height="1500px"
          style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            background: 'transparent'
          }}
          title="eGFR Calculator Tool"
        />
        {/* Backend se eGFR stage result dikhane ka part */}
<div className="mt-10 text-center">
  <button
    onClick={async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/calculate-egfr/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: 45,
            gender: 'female',
            serum_creatinine: 0.8,
            race: 'non-black',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Backend Model Prediction:\nStage: ${data.egfr_stage}\nAccuracy: ${data.model_accuracy}`);
        } else {
          alert('Error: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        alert('Connection error');
      }
    }}
    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
  >
    Predict eGFR Stage from AI Model
  </button>
</div>

        {/* Backend se result dikhane ka section (iframe ke neeche) */}
        <div className="mt-10">
          <button
            onClick={calculateFromBackend}
            disabled={loading}
            className={`w-full md:w-auto px-8 py-4 rounded-xl font-medium text-white transition ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600'
            }`}
          >
            {loading ? 'Calculating from Model...' : 'Calculate eGFR Stage from AI Model'}
          </button>

          {error && (
            <p className="text-red-400 text-center mt-6 text-lg">{error}</p>
          )}

          {result && (
            <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-cyan-700 shadow-2xl text-center">
              <p className="text-2xl font-bold text-cyan-300 mb-4">
                AI Model Prediction (KDIGO Stage)
              </p>
              <p className="text-5xl font-extrabold text-white mb-2">
                {result.egfr_stage}
              </p>
              <p className="text-gray-400">
                Model Accuracy: {result.model_accuracy}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                {result.message}
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-400 text-sm">
          {/* Tumhara disclaimer */}
        </p>
      </div>
    </div>
  );
}