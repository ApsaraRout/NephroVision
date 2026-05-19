import React from "react";
import { FaHeartbeat, FaStethoscope, FaPills, FaSyringe } from "react-icons/fa";

function FloatingIcons() {
  const icons = [
    <FaHeartbeat key="1" className="text-red-400 animate-bounce" />,
    <FaStethoscope key="2" className="text-blue-400 animate-bounce" />,
    <FaPills key="3" className="text-green-400 animate-bounce" />,
    <FaSyringe key="4" className="text-purple-400 animate-bounce" />,
  ];

  return (
    <div className="fixed top-20 right-10 space-y-6 z-10">
      {icons.map((icon, idx) => (
        <div key={idx} className="text-5xl opacity-60">{icon}</div>
      ))}
    </div>
  );
}

export default FloatingIcons;
