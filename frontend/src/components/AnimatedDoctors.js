// src/components/AnimatedDoctors.js
import React from "react";

export default function AnimatedDoctors({ position = "bottom-left", size = "100px" }) {
  const positions = {
    "bottom-left": "absolute bottom-4 left-4",
    "bottom-right": "absolute bottom-4 right-4",
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
  };

  return (
    <video
      src="/AnimatedDoctor.mp4" // put the MP4 in public folder
      className={`${positions[position]} w-[${size}] h-auto pointer-events-none`}
      autoPlay
      loop
      muted
    />
  );
}
