import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAppleAlt,
  FaRunning,
  FaPills,
  FaTint,
  FaStethoscope,
  FaWater,
  FaBed,
  FaBan,
  FaHeartbeat,
  FaDumbbell,
  FaLeaf,
  FaShieldAlt,
} from "react-icons/fa";

export default function Recommendations() {
  const [step, setStep] = useState(0);

  const caseStudy = [
    {
      title: "Meet Raj",
      desc: "Raj ignored kidney health for years — high salt diet, no exercise, no BP checkups.",
      color: "from-yellow-500/20 to-amber-500/10",
    },
    {
      title: "Warning Signs Appeared",
      desc: "Swelling in legs, constant fatigue, mild back pain — but he thought it was normal aging.",
      color: "from-orange-500/20 to-red-500/10",
    },
    {
      title: "Diagnosis Moment",
      desc: "Tests revealed high creatinine and low eGFR. Raj was heading toward chronic kidney disease.",
      color: "from-red-600/30 to-rose-600/20",
    },
    {
      title: "Turning Point",
      desc: "Raj adopted healthy habits, followed medical advice & improved his kidney function significantly.",
      color: "from-emerald-500/20 to-green-600/10",
    },
  ];

  const tips = [
    { icon: FaAppleAlt, title: "Kidney-Friendly Diet", desc: "Low sodium, controlled protein & potassium", color: "text-emerald-400" },
    { icon: FaPills, title: "Follow Medications", desc: "Never skip prescribed drugs. Avoid self-medication", color: "text-cyan-400" },
    { icon: FaRunning, title: "Stay Active", desc: "30 min daily walk, yoga or light exercise", color: "text-orange-400" },
    { icon: FaTint, title: "Smart Hydration", desc: "Drink adequate water — but not excessively", color: "text-blue-400" },
    { icon: FaWater, title: "No Sugary Drinks", desc: "Avoid colas, energy drinks & packaged juices", color: "text-indigo-400" },
    { icon: FaBan, title: "Quit Smoking", desc: "Smoking damages kidney blood vessels severely", color: "text-red-500" },
    { icon: FaBed, title: "Quality Sleep", desc: "Aim for 7–8 hours of restful sleep", color: "text-purple-400" },
    { icon: FaStethoscope, title: "Regular Monitoring", desc: "Check BP, sugar, creatinine & eGFR periodically", color: "text-teal-400" },
    { icon: FaLeaf, title: "Antioxidant Rich Foods", desc: "Berries, cabbage, bell peppers, apples", color: "text-lime-400" },
    { icon: FaDumbbell, title: "Maintain Healthy Weight", desc: "Obesity puts extra pressure on kidneys", color: "text-amber-400" },
    { icon: FaShieldAlt, title: "Avoid Harmful Painkillers", desc: "Long-term NSAIDs can seriously damage kidneys", color: "text-rose-400" },
    { icon: FaHeartbeat, title: "Control BP & Diabetes", desc: "Most important protectors of kidney health", color: "text-pink-400" },
  ];

  const nextStep = () => setStep((prev) => (prev + 1) % caseStudy.length);
  const prevStep = () => setStep((prev) => (prev - 1 + caseStudy.length) % caseStudy.length);

  return (
    <div 
      className="
        min-h-screen 
        bg-gradient-to-b from-slate-950 via-slate-900 to-black 
        text-white 
        pt-24          /* mobile - basic space below navbar */
        md:pt-28       /* medium screens */
        lg:pt-32       /* large screens - more breathing room */
        pb-16 px-5 md:px-10
      "
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-16 md:mb-20"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Protect Your Kidneys – Take Action Today
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
          Small daily habits can make a huge difference in preventing or slowing chronic kidney disease.
        </p>
      </motion.div>

      {/* Case Study Carousel */}
      <div className="max-w-4xl mx-auto mb-20 md:mb-24">
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className={`p-8 rounded-xl bg-gradient-to-br ${caseStudy[step].color} border border-white/10`}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                {caseStudy[step].title}
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed">
                {caseStudy[step].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-4 mt-8">
            {caseStudy.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  i === step
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 scale-125 shadow-lg shadow-purple-500/50"
                    : "bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <button
              onClick={prevStep}
              disabled={step === 0}
              aria-label="Previous story"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              aria-label="Next story"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-medium transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
          12 Powerful Ways to Protect Your Kidneys
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.04, y: -8 }}
              className="group bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className={`text-5xl mb-5 ${tip.color} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                {React.createElement(tip.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                {tip.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-20 md:mt-24 text-slate-300 text-lg"
      >
        <p className="mb-6">Your kidneys work hard every day — give them the care they deserve.</p>
        <p className="text-xl font-medium text-cyan-400">
          Start small. Stay consistent. Live healthier.
        </p>
      </motion.div>
    </div>
  );
}