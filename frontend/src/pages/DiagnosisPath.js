// src/pages/Diagnosis.jsx

import React from 'react';

function Diagnosis() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">KidneyCare</div>

          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/diagnosis" className="text-blue-600 font-semibold">
              Diagnosis
            </a>
            <a href="/prediction" className="hover:text-blue-600">Prediction</a>
            <a href="/stages" className="hover:text-blue-600">Stages</a>
            <a href="/treatment" className="hover:text-blue-600">Treatment</a>
          </div>

          <a
            href="#"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
          >
            Consult Nephrologist
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="hero-bg text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1576091160550-2173db99920c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Accurate Diagnosis of Renal Failure & CKD
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Already at high risk or suspect kidney problems?
            <br />
            Get the right tests for confirmation + proper staging
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#tests"
              className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
            >
              Know Your Tests →
            </a>

            <a
              href="#"
              className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-700 transition"
            >
              Calculate eGFR Risk
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Intro */}
        <div className="prose max-w-3xl mx-auto text-center mb-16">
          <p className="text-xl text-gray-600">
            Early and accurate diagnosis saves kidneys.
            <br />
            If you have <strong>diabetes • hypertension • family history • proteinuria</strong> →
            regular testing is very critical
          </p>
        </div>

        {/* ==================== MAIN TESTS SECTION ==================== */}
        <section id="tests" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Key Diagnostic Tests for CKD Confirmation
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-6">🩸</div>
              <h3 className="text-2xl font-semibold mb-3">eGFR (Blood Test)</h3>
              <p className="text-gray-600 mb-4">
                Most important test • Uses serum creatinine • CKD-EPI 2021 equation
              </p>
              <p className="text-blue-600 font-medium">
                Stage 1 → 5 is decided mainly by this value
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-6">🧪</div>
              <h3 className="text-2xl font-semibold mb-3">
                uACR / Albuminuria (Urine)
              </h3>
              <p className="text-gray-600 mb-4">
                Albumin Creatinine Ratio → detects protein leak very early
              </p>
              <p className="text-amber-600 font-medium">
                &gt; 30 mg/g = already high risk zone
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-6">📷</div>
              <h3 className="text-2xl font-semibold mb-3">Kidney Ultrasound</h3>
              <p className="text-gray-600">
                Checks size, shape, stones, cysts, obstruction
                <br />
                Usually first imaging test
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-6">🔬</div>
              <h3 className="text-2xl font-semibold mb-3">Other Important Tests</h3>
              <p className="text-gray-600">
                Urine routine + microscopy
                <br />
                Electrolytes, Cystatin C (sometimes better)
                <br />
                Kidney biopsy (rare cases)
              </p>
            </div>
          </div>
        </section>

        {/* ==================== STAGING TABLE ==================== */}
        <section className="mb-20 bg-white p-8 md:p-10 rounded-3xl shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            CKD Stages (KDIGO latest)
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Stage</th>
                  <th className="p-4 text-left">eGFR</th>
                  <th className="p-4 text-left">Meaning</th>
                  <th className="p-4">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-medium">G1</td>
                  <td className="p-4">≥90</td>
                  <td>Normal but damage present</td>
                  <td>Low-Moderate</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">G2</td>
                  <td className="p-4">60–89</td>
                  <td>Mildly decreased</td>
                  <td>Moderate</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">G3a</td>
                  <td className="p-4">45–59</td>
                  <td>Mild-moderate decrease</td>
                  <td>High</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">G3b</td>
                  <td className="p-4">30–44</td>
                  <td>Moderate-severe</td>
                  <td>Very High</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">G4</td>
                  <td className="p-4">15–29</td>
                  <td>Severely decreased</td>
                  <td>Very High</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">G5</td>
                  <td className="p-4">&lt;15</td>
                  <td>Kidney Failure</td>
                  <td>Critical</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center">
            * Full risk assessment = eGFR + uACR (A1-A3)
          </p>
        </section>

        {/* Next Steps */}
        <section className="bg-blue-50 p-10 md:p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-8">What Should You Do Right Now?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-white p-6 rounded-xl shadow">
              1. Get <strong>eGFR + uACR</strong> done today
              <br />
              <span className="text-sm text-gray-500">(repeat after 3 months if borderline)</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              2. Consult <strong>Nephrologist</strong> as early as possible
              <br />
              especially if eGFR &lt; 60 or high protein
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              3. Control BP • Sugar • Avoid painkillers • Stay hydrated
            </div>
          </div>

          <button className="mt-10 bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
            Book Nephrologist Appointment →
          </button>
        </section>
      </main>

      {/* Footer Disclaimer */}
      <div className="bg-gray-900 text-gray-400 py-12 px-6 text-center text-sm">
        <p>
          This is for educational purpose only • Not a substitute for professional medical advice
        </p>
        <p className="mt-3">
          Based on KDIGO 2024 Guidelines • National Kidney Foundation • Indian CKD Guidelines
        </p>
      </div>
    </div>
  );
}

export default Diagnosis;