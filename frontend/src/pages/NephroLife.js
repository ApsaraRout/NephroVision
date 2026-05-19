import React, { useState, useEffect } from 'react';

export default function NephroLife() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mlWater, setMlWater] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/nephro-profile/', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched profile data:', data); // Debug: new data check karne ke liye
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const formData = new FormData(e.target);

  const updatedData = {
    age: Number(formData.get('age')) || profile?.age || 40,
    gender: formData.get('gender') || profile?.gender || 'female',
    serum_creatinine: Number(formData.get('serum_creatinine')) || profile?.serum_creatinine || 0.9,
    egfr: Number(formData.get('egfr')) || profile?.egfr || 90,
    weight_kg: Number(formData.get('weight_kg')) || profile?.weight_kg || 68,

    height_cm: Number(formData.get('height_cm')) || profile?.height_cm || 165,
    activity_level: formData.get('activity_level') || profile?.activity_level || 'Moderate',
    climate_temp_c: Number(formData.get('climate_temp_c')) || profile?.climate_temp_c || 28,
    has_edema: formData.get('has_edema') === 'on',
    has_heart_failure: formData.get('has_heart_failure') === 'on',
    urine_output_ml: Number(formData.get('urine_output_ml')) || profile?.urine_output_ml || 1500,
  };

  console.log('Sending updated data to backend:', updatedData);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/nephro-profile/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status ${response.status} - ${errorText}`);
    }

    // Profile refresh after successful update
    await fetchProfile();
    await getWaterPrediction(updatedData);

  } catch (err) {
    let errorMsg = err.message || 'Failed to update profile';
    if (errorMsg.includes('401')) {
      errorMsg = 'Please login to save changes and get updated kidney risk prediction';
    }
    setError(errorMsg);
    console.error('Update error:', err);
  } finally {
    setLoading(false);
  }
};
  const getWaterPrediction = async (data) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/water-predict/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: 1,
        eGFR: data.egfr,
        gender: data.gender === 'male' ? 1 : 0,
        weight_kg: data.weight_kg,
        age: data.age,
        height_cm: data.height_cm || 165,
        activity_level: data.activity_level === 'Active' ? 2 :
                        data.activity_level === 'Moderate' ? 1 : 0,
        climate_temp_c: data.climate_temp_c || 28,
        has_edema: data.has_edema ? 1 : 0,
        has_heart_failure: data.has_heart_failure ? 1 : 0,
        urine_output_ml: data.urine_output_ml || 1500
      })
    });

    const result = await res.json();
    console.log("ML Water Prediction:", result);

    setMlWater(result.recommended_water_liters);

  } catch (err) {
    console.error("Water prediction error:", err);
  }
};
  const calculateWaterIntake = () => {
  if (!profile) return 0;

  // Destructure all relevant fields (with safe defaults)
  const {
    age = 40,
    gender = 'female',              // 'male' or 'female'
    weight_kg = 68,
    height_cm = 165,                // used optionally for BMI if you want later
    egfr = 90,                      // or eGFR
    activity_level = 'Moderate',    // 'Sedentary' | 'Moderate' | 'Active'
    climate_temp_c = 28,            // Mumbai-like default ~28–32 °C
    has_edema = false,              // 0 or false
    has_heart_failure = false,      // 0 or false
    urine_output_ml = 1500,         // fallback if not measured
    serum_creatinine = 0.9,         // still keep if you want to use it
  } = profile;

  // ────────────────────────────────────────────────
  // Base calculation (ml/day) — roughly 30–35 ml/kg
  // ────────────────────────────────────────────────
  let recommended_ml = weight_kg * 32.5;

  // Gender adjustment (men usually need ~400–600 ml more)
  if (gender.toLowerCase() === 'male') {
    recommended_ml += 500;
  }

  // Activity level bonus
  if (activity_level === 'Active') {
    recommended_ml += 700;
  } else if (activity_level === 'Moderate') {
    recommended_ml += 400;
  } // Sedentary → no extra

  // Climate / heat adjustment (Mumbai / India summer relevant)
  if (climate_temp_c > 32) {
    recommended_ml += 600;
  } else if (climate_temp_c > 28) {
    recommended_ml += 400;
  } else if (climate_temp_c > 24) {
    recommended_ml += 200;
  }

  // ────────────────────────────────────────────────
  // Kidney function (eGFR) based adjustment
  // ────────────────────────────────────────────────
  if (egfr > 60) {
    // Normal / mild → full amount or slight increase possible
    // (we already have base + extras)
  } else if (egfr >= 30 && egfr <= 60) {
    // CKD stage 3 → often safe to increase a bit (WIT trial style)
    let extra = 0;
    if (gender.toLowerCase() === 'female') {
      extra = weight_kg < 70 ? 1000 : 1250;
    } else {
      extra = weight_kg < 70 ? 1250 : 1500;
    }
    recommended_ml += extra;
  } else {
    // Advanced CKD (stage 4–5) → restrict or base on urine output
    recommended_ml = urine_output_ml + 800; // insensible losses ~500–1000 ml
  }

  // ────────────────────────────────────────────────
  // Safety restrictions – very important!
  // ────────────────────────────────────────────────
  if (has_edema || has_heart_failure) {
    recommended_ml = Math.min(recommended_ml, 1800); // strict fluid restriction
  }

  // Age > 65 → slightly lower (reduced thirst + risk of overload)
  if (age > 65) {
    recommended_ml *= 0.9;
  }

  // Hard safety limits (avoid extreme hypo/hypernatremia risk)
  recommended_ml = Math.max(1200, Math.min(recommended_ml, 4500));

  return Math.round(recommended_ml);
};
  const goalInLiters = profile ? (calculateWaterIntake() / 1000).toFixed(1) : '0.0';
  return (
    <div className="min-h-screen pt-28 pb-32 px-5 md:px-12 relative overflow-hidden">
      {/* Full-screen waterglass background video */}
      <div className="fixed inset-0 z-[-2] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/waterglass.mp4"
        >
          <source src="/waterglass.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Subtle animated glows */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute -left-32 top-10 w-[700px] h-[700px] bg-teal-900/12 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -right-32 bottom-10 w-[800px] h-[800px] bg-cyan-900/12 rounded-full blur-3xl animate-pulse-slow animation-delay-3000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-28">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent"
            style={{
              textShadow: '0 6px 24px rgba(0,0,0,0.8), 0 3px 12px rgba(103,232,249,0.3)',
            }}
          >
            NephroLife
          </h1>
          <p className="text-2xl md:text-3xl text-teal-200/90 font-light mb-6">
            Supporting Kidney Health Through Informed Choices
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Evidence-based daily habits • Gentle exercise guidance • Hydration tracking
          </p>
        </div>

        {/* Case Study */}
        <section className="mb-28">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-200">
            The Rising Reality of Kidney Health in India
          </h2>

          <div className="backdrop-blur-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl shadow-black/40">
            <div className="max-w-4xl mx-auto text-lg text-gray-200 leading-relaxed space-y-10">
              <p className="text-xl font-medium text-teal-300 text-center mb-10">
                Chronic Kidney Disease (CKD) has become a major public health concern in India — often progressing silently until advanced stages.
              </p>

              <div className="grid md:grid-cols-3 gap-8 my-12 text-center">
                <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800/40 shadow-inner">
                  <div className="text-6xl font-extrabold text-cyan-300 mb-3">13–16%</div>
                  <p className="text-gray-300 mt-2">Prevalence among adults</p>
                </div>
                <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800/40 shadow-inner">
                  <div className="text-6xl font-extrabold text-cyan-300 mb-3">138+ Million</div>
                  <p className="text-gray-300 mt-2">Estimated affected individuals</p>
                </div>
                <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800/40 shadow-inner">
                  <div className="text-6xl font-extrabold text-cyan-300 mb-3">2nd Globally</div>
                  <p className="text-gray-300 mt-2">Highest CKD burden worldwide</p>
                </div>
              </div>

              <p className="text-center italic text-gray-400 text-xl leading-relaxed px-4">
                Driven primarily by diabetes, hypertension, delayed screening, and lifestyle factors — many of which are modifiable.
              </p>

              <div className="text-center mt-12">
                <span className="text-2xl font-semibold text-teal-300 block leading-relaxed">
                  Early awareness and consistent habits can significantly reduce risk and slow progression.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise Routine */}
        <section className="mb-28">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-200">
            Evidence-Based Movement for Kidney Support
          </h2>

          <div className="text-center mb-12 px-4">
            <p className="text-xl text-teal-200 mb-4">
              Target 150 minutes of moderate activity per week • Start gradually • Consult your doctor first
            </p>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Regular movement improves circulation, helps control blood pressure & blood sugar, and reduces inflammation — all beneficial for kidney function.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-2 md:px-0">
            {[
              { day: "Most Days", focus: "Brisk Walking", time: "30–40 min", desc: "Most accessible & effective for BP/sugar control" },
              { day: "3–4×/week", focus: "Gentle Yoga", time: "20–30 min", desc: "Improves flexibility, reduces stress & enhances blood flow" },
              { day: "2–3×/week", focus: "Cycling or Stationary Bike", time: "25–40 min", desc: "Low-impact cardio that supports heart & kidney health" },
              { day: "As possible", focus: "Water-based Activity", time: "20–40 min", desc: "Very gentle on joints — excellent for circulation" },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-900/40 hover:border-cyan-700/60 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-cyan-300 mb-4 text-center">{item.focus}</h3>
                <p className="text-xl text-teal-200 mb-3 text-center">{item.day}</p>
                <p className="text-gray-300 mb-4 text-center">{item.time}</p>
                <p className="text-gray-400 text-center text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center px-4">
            <p className="text-xl text-teal-300 font-medium">
              Consistency matters more than intensity. Even short sessions provide meaningful benefits.
            </p>
          </div>
        </section>

        {/* Tips & Recommendations */}
        <section className="mb-28">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-200">
            Practical Recommendations for Kidney Protection
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0">
            {[
              {
                title: "Hydration Strategy",
                text: "Aim for 2.5–3 liters of fluid daily (spread evenly), primarily plain water. Adjust based on medical advice.",
                benefit: "Supports optimal kidney filtration and prevents concentration of waste products.",
              },
              {
                title: "Sodium Reduction",
                text: "Target < 5 g salt per day. Flavor with herbs, lemon, spices instead of added salt.",
                benefit: "Reduces blood pressure — a leading cause of kidney damage.",
              },
              {
                title: "Balanced Meals",
                text: "Prioritize home-cooked meals with fresh vegetables, whole grains, limited processed foods.",
                benefit: "Minimizes hidden sodium, phosphorus, and additives that burden kidneys.",
              },
              {
                title: "Medication Caution",
                text: "Avoid regular use of NSAIDs (ibuprofen, diclofenac) without medical supervision.",
                benefit: "Prevents direct kidney injury from common over-the-counter pain relievers.",
              },
              {
                title: "Blood Sugar Management",
                text: "Limit refined sugars & carbohydrates. Monitor HbA1c and fasting glucose regularly.",
                benefit: "Diabetes remains the top cause of kidney failure in India.",
              },
              {
                title: "Rest & Recovery",
                text: "Prioritize 7–8 hours sleep nightly + short daily stress-reduction practices.",
                benefit: "Reduces cortisol and systemic inflammation that indirectly affects kidney function.",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="backdrop-blur-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-900/40 hover:border-cyan-700/60 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-cyan-300 mb-5 text-center md:text-left">{tip.title}</h3>
                <p className="text-gray-200 mb-6 leading-relaxed">{tip.text}</p>
                <p className="text-sm text-teal-200/90 italic">
                  Benefit: {tip.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Personalized Water Recommendation Questionnaire & Result */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-cyan-300">
            Personalized Daily Water & Kidney Risk Recommendation
          </h2>

          <div className="backdrop-blur-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
            {/* Form */}
            <div className="text-center text-gray-300 mb-12">
              <p className="text-xl mb-8">
                Fill these 5 details to get your safe daily water recommendation
              </p>

            <form onSubmit={handleSubmit} className="grid gap-6 text-left max-w-md mx-auto">
  <div>
    <label className="block text-teal-200 mb-2 font-medium">Age (years)</label>
    <input 
      type="number" 
      name="age" 
      min="18" max="100" 
      placeholder="Enter your age"  // ← yeh dikhega blank mein
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" 
      required 
    />
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Gender</label>
    <select 
      name="gender" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
    >
      <option value="">Select Gender</option>  {/* ← blank option pehle */}
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Serum Creatinine (mg/dL)</label>
    <input 
      type="number" 
      name="serum_creatinine" 
      step="0.1" min="0.4" max="5" 
      placeholder="e.g. 0.9" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" 
      required 
    />
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">eGFR (ml/min/1.73m²)</label>
    <input 
      type="number" 
      name="egfr" 
      min="5" max="140" 
      placeholder="e.g. 85" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" 
      required 
    />
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Weight (kg)</label>
    <input 
      type="number" 
      name="weight_kg" 
      min="35" max="120" 
      placeholder="e.g. 62" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" 
      required 
    />
  </div>

  {/* Naye fields – inme bhi defaultValue hata diya */}
  <div>
    <label className="block text-teal-200 mb-2 font-medium">Height (cm) - optional</label>
    <input 
      type="number" 
      name="height_cm" 
      min="140" max="200" 
      placeholder="e.g. 165" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
    />
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Activity Level</label>
    <select 
      name="activity_level" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
    >
      <option value="">Select Activity Level</option>
      <option value="Sedentary">Sedentary (office job, little movement)</option>
      <option value="Moderate">Moderate (walk/light exercise 3-5 days)</option>
      <option value="Active">Active (gym/sports 5-7 days)</option>
    </select>
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Today's Temperature in Mumbai (°C) - optional</label>
    <input 
      type="number" 
      name="climate_temp_c" 
      min="10" max="45" step="0.5" 
      placeholder="e.g. 32 (leave blank for ~28°C default)" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
    />
  </div>

  <div className="flex items-center gap-3">
    <input 
      type="checkbox" 
      name="has_edema" 
      className="w-5 h-5 accent-cyan-500"
    />
    <label className="text-teal-200 font-medium">I have swelling (edema) in my legs or face</label>
  </div>

  <div className="flex items-center gap-3">
    <input 
      type="checkbox" 
      name="has_heart_failure" 
      className="w-5 h-5 accent-cyan-500"
    />
    <label className="text-teal-200 font-medium">I have heart failure or fluid congestion</label>
  </div>

  <div>
    <label className="block text-teal-200 mb-2 font-medium">Daily Urine Output (ml)</label>
    <input 
      type="number" 
      name="urine_output_ml" 
      min="300" max="4000" 
      placeholder="e.g. 1500 ml (normal range)" 
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className={`mt-6 px-8 py-4 rounded-xl font-medium transition w-full text-white ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600'}`}
  >
    {loading ? 'Updating...' : 'Update & Calculate'}
  </button>
</form>
            </div>

            {/* Result */}
            {loading ? (
              <p className="text-center text-xl text-gray-300">Updating & calculating...</p>
            ) : error ? (
              <p className="text-center text-xl text-red-400">Error: {error}</p>
            ) : profile && (
              <div className="text-center mt-12 pt-8 border-t border-gray-700">
              <div className="text-center mb-6 text-yellow-300 font-medium text-lg bg-yellow-900/30 p-4 rounded-xl border border-yellow-600/50">
               ⚠️ This is only an estimate! If there is an advanced kidney problem, heart failure, or swelling, strictly follow the fluid limit given by your doctor.
              </div>
                <p className="text-xl text-teal-200 mb-4">General Water Intake Recommendation for Healthy Adults:</p>
                <p className="text-5xl font-bold text-cyan-300 mb-6">{goalInLiters} L / day</p>
                {/* AI Recommendation - Highlight Box */}
{mlWater && (
  <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 
                  border-2 border-green-500/70 
                  rounded-2xl p-6 md:p-8 my-8 mx-auto max-w-2xl
                  shadow-lg shadow-green-500/20
                  text-center">
    <p className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
      🤖 Recommended Water Intake
    </p>
    <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
      {mlWater} L / day
    </p>
    <p className="text-base md:text-lg text-green-300/90 mt-3">
      AI-based suggestion for your profile
    </p>
  </div>
)}

                {profile.risk_level !== undefined ? (
                  <div className="mt-10">
                    <p className="text-xl text-teal-200 mb-4">
                      Kidney Risk Level (Classification Model):
                    </p>
                    <p className={`text-3xl font-bold mb-2 ${
                      profile.risk_level === 'Low' || profile.risk_level === '0' || profile.risk_level === 0 ? 'text-green-400' :
                      profile.risk_level === 'Moderate' || profile.risk_level === '1' || profile.risk_level === 1 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {profile.risk_level}
                    </p>
                    <p className="text-lg text-gray-300">
                      {profile.confidence}% confidence
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {profile.model_used} • {profile.model_accuracy} training accuracy
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-400 mt-8">
                   
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Final disclaimer */}
        <p className="text-center text-gray-400 text-base mt-24 italic opacity-80 px-4">
          NephroLife provides general information and awareness content only.<br />
          Always consult a qualified nephrologist or healthcare professional for personalized medical advice.
        </p>
      </div>
    </div>
  );
}