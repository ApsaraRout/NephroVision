// src/components/TiltCard.js
import React from "react";
import Tilt from "react-parallax-tilt";

/**
 * Props:
 * - icon: JSX icon
 * - title: string
 * - children: description
 * - accent: tailwind color classes for icon (optional)
 */
export default function TiltCard({ icon, title, children, accent = "text-white" }) {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.12}
      scale={1.03}
      transitionSpeed={400}
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      className="w-full"
    >
      <div className="relative bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[220px] flex flex-col items-center justify-start gap-4 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
        <div className={`text-5xl p-4 rounded-xl ${accent} bg-white/5`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
        <p className="text-sm text-white/80 text-center">{children}</p>

        {/* subtle floating bubble */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-16 h-16 rounded-full bg-gradient-to-tr from-white/10 to-white/4 blur-xl opacity-50" />
      </div>
    </Tilt>
  );
}
