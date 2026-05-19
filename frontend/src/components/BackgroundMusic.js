import React from "react";
import { motion } from "framer-motion";

function Prediction() {
  return (
    <>
      {/* Main prediction section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800">
          Accurate Prediction of Renal Failure
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-center text-gray-600 max-w-2xl">
          Input your medical data to get accurate renal failure prediction
          results. Early detection can save lives.
        </p>

        <button className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600 transition">
          Start Prediction
        </button>
      </section>

      {/* Floating medical icons */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute bottom-28 right-20 text-7xl text-red-400 opacity-60"
      >
        💉
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute bottom-10 left-10 text-7xl text-green-400 opacity-60"
      >
        🩺
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute top-20 left-1/2 text-7xl text-blue-400 opacity-60"
      >
        🧬
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-10 right-1/3 text-7xl text-purple-400 opacity-60"
      >
        🫀
      </motion.div>
    </>
  );
}

export default Prediction;
