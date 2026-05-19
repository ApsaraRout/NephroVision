import { FaHeartbeat, FaVial, FaMicroscope } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaVial />,
      title: "Lab-Based Predictions",
      desc: "AI analyzes creatinine, urea, hemoglobin, and lab data.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Risk Stratification",
      desc: "Predicts mild, moderate, or severe kidney failure risk.",
    },
    {
      icon: <FaMicroscope />,
      title: "Medical Accuracy",
      desc: "Built using evidence-based medical research.",
    },
  ];

  return (
    <section className="py-20 grid gap-10 grid-cols-1 md:grid-cols-3 px-10">
      {features.map((f, i) => (
        <div key={i} className="bg-card p-8 rounded-2xl shadow-xl text-center">
          <div className="text-5xl text-primary mb-4 flex justify-center">
            {f.icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{f.title}</h3>
          <p className="text-gray-600">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
