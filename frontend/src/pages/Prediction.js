import React, { useState } from "react";
import axios from 'axios';

/* ================= DONUT CHART ================= */
const DonutChart = ({ label, value, min, max, unit, status, color }) => {
  if (!value) return null;
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="mt-3 p-5 rounded-2xl border border-cyan-400/30 bg-transparent backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_55px_rgba(6,182,212,0.45)] hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-5">
        <svg width="110" height="110" className="drop-shadow-[0_0_18px_rgba(6,182,212,0.7)]">
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke="#33415560"
            strokeWidth="14"
            fill="none"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={color}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            className="drop-shadow-[0_0_15px_currentColor] transition-all duration-500"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-lg font-black fill-white drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]"
          >
            {Math.round(percent)}%
          </text>
        </svg>

        <div>
          <p className="font-black text-white text-xl drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            {label}: {value} {unit}
          </p>
          <p
            className={`text-lg font-bold tracking-wide drop-shadow-md ${
              status === "Low Risk" ? "text-emerald-400" :
              status === "Moderate Risk" ? "text-amber-400" :
              "text-red-400"
            }`}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Prediction() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    swelling: false,
    puffyFace: false,
    foamyUrine: false,
    darkUrine: false,
    lessUrine: false,
    nocturia: false,
    burningUrination: false,
    bloodInUrine: false,
    fatigue: false,
    lowEnergy: false,
    lossOfAppetite: false,
    nausea: false,
    metallicTaste: false,
    shortnessOfBreath: false,
    itchySkin: false,
    muscleCramps: false,
    brainFog: false,
    highBP: false,
    chestPain: false,
    veryLittleUrine: false,
    severeSymptoms: false,
    diabetes: false,
    hypertension: false,
    overweight: false,
    familyHistory: false,
    frequentPainkillers: false,
    smokingAlcohol: false,
    lowWaterIntake: false,
    frequentUTIs: false,
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playEnglish, setPlayEnglish] = useState(false);
  const [playHindi, setPlayHindi] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPredictionResult(null);
    setLoading(true);

    // Basic validation — sirf age aur gender zaroori
    if (!formData.age || !formData.gender) {
      setError("kindly enter inputs for age and gender");
      setLoading(false);
      return;
    }

    if (isNaN(formData.age) || Number(formData.age) < 1) {
      setError("Kindly enter your age (positive value)");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        age: Number(formData.age),
        gender: formData.gender.toLowerCase(),
        // Symptoms aur risk factors sab bhej rahe hain — backend mein score calculate kar sakta hai
        swelling: formData.swelling,
        puffyFace: formData.puffyFace,
        foamyUrine: formData.foamyUrine,
        darkUrine: formData.darkUrine,
        lessUrine: formData.lessUrine,
        nocturia: formData.nocturia,
        burningUrination: formData.burningUrination,
        bloodInUrine: formData.bloodInUrine,
        fatigue: formData.fatigue,
        lowEnergy: formData.lowEnergy,
        lossOfAppetite: formData.lossOfAppetite,
        nausea: formData.nausea,
        metallicTaste: formData.metallicTaste,
        shortnessOfBreath: formData.shortnessOfBreath,
        itchySkin: formData.itchySkin,
        muscleCramps: formData.muscleCramps,
        brainFog: formData.brainFog,
        highBP: formData.highBP,
        chestPain: formData.chestPain,
        veryLittleUrine: formData.veryLittleUrine,
        severeSymptoms: formData.severeSymptoms,
        diabetes: formData.diabetes,
        hypertension: formData.hypertension,
        overweight: formData.overweight,
        familyHistory: formData.familyHistory,
        frequentPainkillers: formData.frequentPainkillers,
        smokingAlcohol: formData.smokingAlcohol,
        lowWaterIntake: formData.lowWaterIntake,
        frequentUTIs: formData.frequentUTIs,
      };

const response = await axios.post(
  "http://127.0.0.1:8000/api/predict-risk/",
  payload,
  {
    withCredentials: true   // 🔥 BAS YEH ADD KARNA HAI
  }
);
      const data = response.data;

      // Backend se aane wale data ko UI-friendly format mein convert
      let chartStatus = "Unknown";
      let chartColor = "#6b7280"; // gray default

      if (data.risk_level?.includes("Low") || data.risk_level?.includes("Normal")) {
        chartStatus = "Low Risk";
        chartColor = "#10b981"; // green
      } else if (data.risk_level?.includes("Moderate") || data.risk_level?.includes("Mild")) {
        chartStatus = "Moderate Risk";
        chartColor = "#f59e0b"; // amber/yellow
      } else {
        chartStatus = "High Risk";
        chartColor = "#ef4444"; // red
      }

      setPredictionResult({
        score: data.score || 0, // agar backend score bhej raha hai (0-100)
        risk_level: chartStatus,
        color: chartColor,
        advice: data.advice || "Risk is calculated based on your symptoms. Kindly consult your Doctor.",
      });
    } catch (err) {
      console.error("Backend prediction error:", err);
      setError(
        err.response?.data?.error ||
        "Connection failed. Is the Django server running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-80 brightness-110"
      >
        <source
          src="/grok-video-9da71095-cbeb-4e33-901e-db80b618a12e (1).mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-0 pointer-events-none"></div>

      {/* Glow orbs */}
      <div className="fixed inset-0 opacity-30 pointer-events-none z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-teal-900/30 rounded-full blur-3xl animate-pulse-slow delay-1500"></div>
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-800/25 rounded-full blur-3xl animate-pulse-slow delay-3000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-20 pt-20 md:pt-24 lg:pt-28 pb-8">
        {/* Title */}
        <h1
          className={`
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
            font-black
            tracking-tight
            text-center
            text-transparent
            bg-clip-text
            bg-gradient-to-br from-cyan-100 via-cyan-300 to-teal-200
            drop-shadow-[0_10px_20px_rgba(0,0,0,0.8),0_5px_10px_rgba(6,182,212,0.4)]
            [text-shadow:0_2px_0_#0ea5e9,0_3px_0_#0891b2,0_4px_0_#0e7490,
                         0_5px_0_#155e75,0_6px_0_#164e63,0_7px_0_#1e293b,
                         0_8px_0_#0f172a,0_12px_25px_rgba(6,182,212,0.6)]
            relative
            before:content-['Renal_Risk_Prediction']
            before:absolute before:inset-0
            before:bg-gradient-to-t before:from-transparent before:via-white/15 before:to-transparent
            before:opacity-40 before:blur-md
            before:pointer-events-none
            font-['Orbitron','Quantico',monospace]
          `}
        >
          Renal Risk Prediction
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12 md:mt-16">
          {/* LEFT - FORM */}
          <div className="bg-transparent backdrop-blur-xl rounded-3xl border border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-6 md:p-8 lg:p-9 hover:shadow-[0_0_60px_rgba(6,182,212,0.45)] transition-all duration-400">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-6 text-center drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]">
              Your Information & Symptoms
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Basic Info - creatinine hata diya */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-base font-bold text-gray-200 mb-1.5 drop-shadow-sm">Name (optional)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-cyan-400/30 rounded-xl bg-gray-900/50 backdrop-blur-md focus:ring-4 focus:ring-cyan-500/40 focus:border-cyan-400 text-white placeholder-gray-500 hover:border-cyan-400/70 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-200 mb-1.5 drop-shadow-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-cyan-400/30 rounded-xl bg-gray-900/50 backdrop-blur-md focus:ring-4 focus:ring-cyan-500/40 focus:border-cyan-400 text-white hover:border-cyan-400/70 transition-all duration-300"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-base font-bold text-gray-200 mb-1.5 drop-shadow-sm">Age (years)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 42"
                    className="w-full px-4 py-3 border border-cyan-400/30 rounded-xl bg-gray-900/50 backdrop-blur-md focus:ring-4 focus:ring-cyan-500/40 focus:border-cyan-400 text-white placeholder-gray-500 hover:border-cyan-400/70 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2.5 mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  Symptoms (Check all that apply)
                </h3>
                {[
                  ["Swelling in feet, ankles, or legs?", "swelling"],
                  ["Puffy face or eyes in the morning?", "puffyFace"],
                  ["Foamy or bubbly urine?", "foamyUrine"],
                  ["Dark yellow/brown urine?", "darkUrine"],
                  ["Less urine than usual?", "lessUrine"],
                  ["Wake up at night to urinate?", "nocturia"],
                  ["Pain or burning while urinating?", "burningUrination"],
                  ["Blood in urine?", "bloodInUrine"],
                  ["Feeling tired despite rest?", "fatigue"],
                  ["Low energy or dizziness?", "lowEnergy"],
                  ["Loss of appetite?", "lossOfAppetite"],
                  ["Nausea or vomiting?", "nausea"],
                  ["Metallic taste or bad breath?", "metallicTaste"],
                  ["Shortness of breath?", "shortnessOfBreath"],
                  ["Dry, itchy skin?", "itchySkin"],
                  ["Muscle cramps at night?", "muscleCramps"],
                  ["Difficulty concentrating or brain fog?", "brainFog"],
                ].map(([question, name]) => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer py-2.5 px-4 hover:bg-cyan-950/10 rounded-xl transition-all duration-300 group border border-cyan-400/15 hover:border-cyan-400/30">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                      className="w-5 h-5 accent-cyan-400 rounded-md group-hover:scale-110 transition-transform"
                    />
                    <span className="text-gray-200 text-base group-hover:text-cyan-300 transition-colors">{question}</span>
                  </label>
                ))}
              </div>

              {/* Emergency Signs */}
              <div className="mb-8 p-5 bg-transparent border border-red-500/25 rounded-2xl shadow-[inset_0_0_20px_rgba(239,68,68,0.15)]">
                <h3 className="text-lg md:text-xl font-bold text-red-300 mb-4 drop-shadow-md">Very Serious / Emergency Signs</h3>
                {[
                  ["Very little or no urine?", "veryLittleUrine"],
                  ["Severe swelling, fainting, or seizures?", "severeSymptoms"],
                  ["Chest pain or extreme breathlessness?", "chestPain"],
                ].map(([question, name]) => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer py-2.5 px-4 hover:bg-red-950/10 rounded-xl transition-all duration-300 group border border-red-400/15 hover:border-red-400/30">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                      className="w-5 h-5 accent-red-400 rounded-md group-hover:scale-110 transition-transform"
                    />
                    <span className="text-red-200 text-base group-hover:text-red-300 transition-colors">{question}</span>
                  </label>
                ))}
              </div>

              {/* Risk Factors */}
              <div className="space-y-2.5 mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  Risk Factors
                </h3>
                {[
                  ["Diabetes?", "diabetes"],
                  ["High blood pressure?", "hypertension"],
                  ["Overweight or obese?", "overweight"],
                  ["Family history of kidney disease?", "familyHistory"],
                  ["Frequent painkiller use?", "frequentPainkillers"],
                  ["Smoking or alcohol use?", "smokingAlcohol"],
                  ["Drink less water than recommended?", "lowWaterIntake"],
                  ["Frequent UTIs?", "frequentUTIs"],
                ].map(([question, name]) => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer py-2.5 px-4 hover:bg-cyan-950/10 rounded-xl transition-all duration-300 group border border-cyan-400/15 hover:border-cyan-400/30">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                      className="w-5 h-5 accent-cyan-400 rounded-md group-hover:scale-110 transition-transform"
                    />
                    <span className="text-gray-200 text-base group-hover:text-cyan-300 transition-colors">{question}</span>
                  </label>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-12 md:px-16 py-5 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white font-extrabold text-lg md:text-xl shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_80px_rgba(6,182,212,0.7)] hover:scale-110 transition-all duration-400 border border-cyan-400/30 flex items-center justify-center gap-3 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Calculating Risk...
                    </>
                  ) : (
                    "Calculate Renal Risk Score"
                  )}
                </button>
              </div>

              {error && (
                <p className="text-center text-red-400 font-medium mt-6 drop-shadow-md">{error}</p>
              )}
            </form>
          </div>

          {/* RIGHT SIDE - Results */}
          <div className="space-y-8 md:space-y-10">
            {/* Risk Summary */}
            <div className="bg-transparent backdrop-blur-xl rounded-3xl border border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-8 md:p-10 hover:shadow-[0_0_60px_rgba(6,182,212,0.45)] transition-all duration-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-6 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]">
                  Your Renal Risk Result
                </h2>

                {predictionResult ? (
                  <div>
                    <DonutChart
                      label="Risk Score"
                      value={predictionResult.score}
                      min={0}
                      max={100}
                      unit="%"
                      status={predictionResult.risk_level}
                      color={predictionResult.color}
                    />
                    <div className="mt-6 text-center">
                      <p className="text-xl font-bold" style={{ color: predictionResult.color }}>
                        {predictionResult.risk_level}
                      </p>
                      <p className="text-gray-300 mt-2 leading-relaxed">
                        {predictionResult.advice}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-gray-400 italic">
                      
                    </p>
                  </div>
                ) : (
                  <p className="text-lg md:text-xl text-gray-400 italic drop-shadow-sm">
                   Fill in your details and click the button to see your risk score...
                  </p>
                )}
              </div>
            </div>

            {/* English Video */}
            <div className="bg-transparent backdrop-blur-xl rounded-3xl border border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-8 md:p-10 hover:shadow-[0_0_60px_rgba(6,182,212,0.45)] transition-all duration-400">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-4 text-center drop-shadow-[0_0_18px_rgba(6,182,212,0.6)]">
                10 Signs Your Kidneys Are Crying For Help (English)
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden border-4 border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.3)] relative">
                {!playEnglish && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 cursor-pointer hover:bg-black/60 transition-all duration-300"
                    onClick={() => setPlayEnglish(true)}
                  >
                    <button className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full font-bold text-base md:text-lg shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:shadow-[0_0_70px_rgba(6,182,212,0.8)] transform hover:scale-110 transition-all duration-400">
                      Watch Now
                    </button>
                  </div>
                )}
                {playEnglish && (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/NFEnRTIsxvg?autoplay=1&mute=1"
                    title="10 Signs Your Kidneys Are Crying For Help"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Hindi Video */}
            <div className="bg-transparent backdrop-blur-xl rounded-3xl border border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-8 md:p-10 hover:shadow-[0_0_60px_rgba(6,182,212,0.45)] transition-all duration-400">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-4 text-center drop-shadow-[0_0_18px_rgba(6,182,212,0.6)]">
                किडनी खराब होने से पहले मिलते हैं ये 6 संकेत (Hindi)
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden border-4 border-cyan-400/25 shadow-[0_0_35px_rgba(6,182,212,0.3)] relative">
                {!playHindi && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 cursor-pointer hover:bg-black/60 transition-all duration-300"
                    onClick={() => setPlayHindi(true)}
                  >
                    <button className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full font-bold text-base md:text-lg shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:shadow-[0_0_70px_rgba(6,182,212,0.8)] transform hover:scale-110 transition-all duration-400">
                      अब देखें
                    </button>
                  </div>
                )}
                {playHindi && (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/CBO3QRWKyOw?autoplay=1&mute=1"
                    title="किडनी खराब होने से पहले मिलते हैं ये 6 संकेत"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Why Kidney Health Is Extremely Important */}
            <div className="bg-transparent backdrop-blur-xl border-l-8 border-cyan-400/30 rounded-3xl p-8 md:p-10 shadow-[0_0_45px_rgba(6,182,212,0.25)] hover:shadow-[0_0_75px_rgba(6,182,212,0.45)] transition-all duration-400">
              <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-6 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]">
                Why Kidney Health Is Extremely Important
              </h3>
              <p className="text-gray-200 leading-relaxed text-base md:text-lg drop-shadow-sm">
                Kidneys are vital organs that filter about 180 liters of blood every day, remove waste products, maintain fluid and electrolyte balance, regulate blood pressure, and produce important hormones like erythropoietin (for red blood cell production) and active vitamin D.
              </p>
              <p className="mt-4 text-gray-200 leading-relaxed text-base md:text-lg drop-shadow-sm">
                Chronic Kidney Disease (CKD) is often called a "silent killer" because it usually shows no obvious symptoms until the kidneys have lost 70-80% of their function. By the time symptoms appear, significant irreversible damage may have already occurred. Early detection through regular checkups and awareness of risk factors (like diabetes, hypertension, family history, obesity, smoking) can dramatically slow progression and prevent the need for dialysis or kidney transplant.
              </p>
              <p className="mt-4 text-gray-100 font-bold italic text-lg md:text-xl drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                Protect your kidneys today — they work quietly 24/7 for your entire life!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}