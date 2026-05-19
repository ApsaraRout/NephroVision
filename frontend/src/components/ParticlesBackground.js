import React, { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: false,
        background: { color: "transparent" },

        particles: {
          number: { value: 40, density: { enable: true, area: 800 } },

          shape: { type: "polygon", polygon: { sides: 4 } },

          color: { value: ["#00eaff", "#ff00f2", "#ffd500", "#7cffcb"] },

          rotate: { value: 45, animation: { enable: true, speed: 5 } },

          move: { enable: true, speed: 1, random: true, outModes: "out" },

          opacity: { value: 0.8 },
          size: { value: { min: 10, max: 18 } },

          shadow: { enable: true, color: "#ffffff", blur: 8 },
        },
      }}
    />
  );
}
