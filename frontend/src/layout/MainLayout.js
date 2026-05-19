import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);

  const startMusic = () => {
    if (audioRef.current && !musicStarted) {
      audioRef.current.play()
        .then(() => {
          console.log("Background music started successfully!");
          setMusicStarted(true);
        })
        .catch((err) => {
          console.log("Play failed:", err.message);
          // Common error: "The play() request was interrupted..." or "NotAllowedError"
        });
    }
  };

  // Listen for first real user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      startMusic();
      // Remove listeners after first real interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // Add listeners for both mouse click and touch (mobile)
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [musicStarted]);

  return (
    <div className="relative min-h-screen font-sans">

      {/* Background Music */}
      <audio
        id="bg-music"
        ref={audioRef}
        src="/audio/medical-146988.mp3"
        loop
        // Do NOT add muted={true} — we want sound
      />

      {/* Navbar */}
      <Navbar />

      {/* Optional: Small hint if music not started yet */}
      {!musicStarted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full z-50 text-sm backdrop-blur-md shadow-lg">
          Tap anywhere to play background music
        </div>
      )}

      {/* Page Content */}
      <Outlet />
    </div>
  );
} 