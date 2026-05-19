export default function Hero() {
  return (
    <section className="py-24 bg-white text-center px-6">
      <h1 className="text-5xl font-bold text-blue-900">
        ACCURATE DIAGNOSIS AND PREDICTION OF RENAL FAILURE
      </h1>

      <p className="text-gray-700 mt-6 text-lg max-w-3xl mx-auto leading-relaxed">
        Good health is the foundation of a happy and productive life. Even small health issues,
        if ignored, can escalate into serious conditions. Kidney failure is one of the most
        critical health risks today, affecting millions worldwide. Early detection and proactive
        monitoring are key to prevention and effective management.
      </p>

      <p className="text-gray-700 mt-4 text-lg max-w-3xl mx-auto leading-relaxed">
        Our AI-powered medical platform allows you to assess the risk of renal failure
        accurately and quickly, using key health parameters such as blood pressure,
        serum creatinine, blood urea, and more. Stay informed, stay healthy.
      </p>

      <a
        href="/predict"
        className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Start Prediction
      </a>
    </section>
  );
}
