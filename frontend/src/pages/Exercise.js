import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaWalking, FaHeartbeat, FaDumbbell, FaPrayingHands } from "react-icons/fa";

export default function Exercise() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const routines = [
    {
      icon: <FaWalking className="text-blue-600 text-6xl mb-4" />,
      title: "Beginner Routine",
      desc: "Perfect for patients starting their fitness journey. Low-impact moves that support kidney health.",
      steps: [
        "10 min slow walk",
        "5 min deep breathing",
        "Gentle neck & shoulder stretches",
        "5 min light yoga poses",
      ],
    },
    {
      icon: <FaHeartbeat className="text-red-500 text-6xl mb-4" />,
      title: "Intermediate Routine",
      desc: "For those who exercise regularly. Helps improve blood flow and reduce blood pressure.",
      steps: [
        "20 min brisk walking",
        "10 min step-ups",
        "Arm circles & side bends",
        "Beginner Surya Namaskar (2 sets)",
      ],
    },
    {
      icon: <FaDumbbell className="text-purple-600 text-6xl mb-4" />,
      title: "Advanced Routine",
      desc: "For patients without major restrictions. Increases stamina & builds strength safely.",
      steps: [
        "30 min walk/jog mix",
        "Light resistance band training",
        "Squats (10–12 reps)",
        "Core breathing + balance exercises",
      ],
    },
    {
      icon: <FaPrayingHands className="text-green-600 text-6xl mb-4" />,
      title: "Relaxation & Mindfulness",
      desc: "Reduces stress on kidneys and improves emotional well-being.",
      steps: [
        "10 min meditation",
        "Slow breathing (4-7-8 method)",
        "Progressive muscle relaxation",
        "5 min gratitude journaling",
      ],
    },
  ];

  const precautions = [
    "Avoid heavy lifting if you have high creatinine.",
    "Stop immediately if you feel dizziness or chest pain.",
    "Drink water but don’t overhydrate.",
    "Wear comfortable shoes and avoid overexertion.",
    "Consult your doctor before advanced exercises.",
    "If swelling or shortness of breath occurs, rest immediately.",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-16 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold text-[#2d2f7f] mb-10"
      >
        Kidney-Friendly Exercise Plans
      </motion.h1>

      {/* Routine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
        {routines.map((routine, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            data-aos="fade-up"
            className="bg-white shadow-xl rounded-2xl p-6 text-center border-t-4 border-[#2d2f7f]"
          >
            {routine.icon}
            <h2 className="text-2xl font-semibold text-[#2d2f7f] mb-2">
              {routine.title}
            </h2>
            <p className="mb-4 text-gray-600 text-sm">{routine.desc}</p>
            <ul className="text-left text-gray-700 space-y-2">
              {routine.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#2d2f7f] font-bold">•</span> {step}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Precautions Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-[#2d2f7f] text-white rounded-2xl shadow-xl mt-16 p-10 max-w-4xl"
      >
        <h3 className="text-3xl font-semibold mb-4 text-center">
          Important Precautions
        </h3>
        <ul className="space-y-3">
          {precautions.map((p, index) => (
            <li key={index} className="flex items-start gap-2 text-lg">
              <span className="text-yellow-400 text-xl">⚠️</span> {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
