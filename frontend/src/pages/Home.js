// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaHeartbeat, FaCapsules, FaLaptopMedical, FaAppleAlt, 
  FaStethoscope, FaRunning, FaFlask, FaRocket, FaUserMd, 
  FaBell, FaMoon, FaSun 
} from "react-icons/fa";

// ────────────────────────────────────────────────
// HELPERS & UTILITIES
// ────────────────────────────────────────────────
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function useWindowSize() {
  const [size, setSize] = useState({ w: 1200, h: 800 });
  useEffect(() => {
    function update() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

// ────────────────────────────────────────────────
// FEATURE CARD COMPONENT
// ────────────────────────────────────────────────
function FeatureCard({ icon, title, accent = "text-blue-400", children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-br from-slate-950/92 to-slate-900/82 border border-blue-500/30 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] ${className}`}
    >
      <div className="flex items-start gap-5">
        <div className={`text-5xl ${accent} drop-shadow-[0_0_15px_currentColor]`}>{icon}</div>
        <div className="flex-1">
          <h4 className="text-xl font-bold mb-3 text-white/95">{title}</h4>
          <p className="text-base text-white/80 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// ANIMATED FLOATING DOCTORS BADGES
// ────────────────────────────────────────────────
function AnimatedDoctors({ size = 120, position = "bottom-left" }) {
  const positions = {
    "bottom-left": { left: 40, bottom: 60 },
    "bottom-right": { right: 40, bottom: 60 },
    "top-right": { right: 40, top: 60 },
    "top-left": { left: 40, top: 60 },
  };
  const pos = positions[position] || positions["bottom-left"];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ y: [0, -15, 0], opacity: [0, 1, 1], scale: [0.9, 1.05, 0.9] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1.5 }}
      className="absolute pointer-events-none z-10"
      style={{ width: size, height: size, ...pos }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-5xl backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(14,165,233,0.30))",
          boxShadow: "0 0 40px rgba(59,130,246,0.5), inset 0 0 20px rgba(255,255,255,0.12)",
          border: "2px solid rgba(59,130,246,0.35)",
        }}
      >
        <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">👩‍⚕️</div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
// BACKGROUND VARIANTS
// ────────────────────────────────────────────────
function OrbsBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const count = 8;
    for (let i = 0; i < count; i++) {
      const orb = document.createElement("div");
      orb.className = "absolute rounded-full pointer-events-none";
      orb.style.opacity = 0.18 + Math.random() * 0.22;
      const sz = 180 + Math.random() * 420;
      orb.style.width = `${sz}px`;
      orb.style.height = `${sz}px`;
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.filter = `blur(${30 + Math.random() * 80}px)`;
      orb.style.background = `radial-gradient(circle at 40% 40%, rgba(59,130,246,0.42), rgba(14,165,233,0.28), transparent 70%)`;
      orb.style.transform = `translate(-50%,-50%)`;
      orb.style.transition = `all ${18 + Math.random() * 35}s ease-in-out`;
      el.appendChild(orb);
      setInterval(() => {
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
      }, 12000 + Math.random() * 18000);
    }
    return () => { el.innerHTML = ""; };
  }, []);
  return <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden />;
}

function SparksBackground() {
  const canvasRef = useRef(null);
  const size = useWindowSize();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles = Array.from({ length: 280 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.25 - Math.random() * 0.7,
      alpha: Math.random() * 0.6 + 0.35,
    }));
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    let raf;
    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -40) {
          p.y = h + 40;
          p.x = Math.random() * w;
        }
        if (p.x < -40 || p.x > w + 40) p.x = Math.random() * w;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 12);
        grad.addColorStop(0, "rgba(59,130,246,0.9)");
        grad.addColorStop(0.45, "rgba(14,165,233,0.72)");
        grad.addColorStop(1, "rgba(59,130,246,0)");
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 9, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [size.w, size.h]);
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-none" />;
}

function BlobBackground() {
  return (
    <div className="absolute inset-0 -z-15 overflow-hidden pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl animate-blob"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(59,130,246,0.16), rgba(14,165,233,0.11), transparent 65%)`,
            width: `${320 + i * 100 + Math.random() * 180}px`,
            height: `${320 + i * 100 + Math.random() * 180}px`,
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 5 + Math.random() * 6}s`,
            opacity: 0.4 + Math.random() * 0.25,
          }}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
// HOLOGRAPHIC NEON KIDNEY COMPONENT
// ────────────────────────────────────────────────
function HolographicNeonKidney({ size = 300, position = "top-right" }) {
  const positions = {
    "top-right": { right: 40, top: 100 },
    "bottom-left": { left: 40, bottom: 100 },
  };
  const pos = positions[position] || positions["top-right"];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
      animate={{ opacity: [0.5, 1, 0.7], scale: [0.8, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
      className="absolute pointer-events-none z-20"
      style={{ width: size, height: size, ...pos }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          background: "transparent",
          filter: "drop-shadow(0 0 20px rgba(59,130,246,0.8)) drop-shadow(0 0 40px rgba(14,165,233,0.6))",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <div
          className="text-[10rem] animate-pulse"
          style={{
            color: "transparent",
            backgroundClip: "text",
            backgroundImage: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
            transform: "rotateY(20deg) rotateX(10deg)",
          }}
        >
          🫘
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
// STATISTICAL ANALYSIS SECTION
// ────────────────────────────────────────────────
function KidneyStatsSection() {
  const stats = [
    { year: 1990, affected: 378, label: "378 Million Affected Globally", details: "According to GBD Study, starting point of tracked increase." },
    { year: 2010, affected: 550, label: "Estimated 550 Million Affected", details: "Interpolated growth based on trends from 1990 to 2023." },
    { year: 2023, affected: 788, label: "788 Million Affected Globally", details: "Doubled from 1990, with age-standardized prevalence at 14.2%." },
    { year: 2030, affected: 900, label: "Projected 900+ Million Affected", details: "Continuing upward trend, potentially reaching over 900 million based on current projections." },
  ];
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold mb-12 text-center text-white/95 drop-shadow-[0_0_12px_#3b82f6]">
          Rising Kidney Disease Risks: Enhanced Statistical Analysis
        </h2>
        <p className="text-lg text-white/80 mb-10 text-center max-w-3xl mx-auto">
          Chronic Kidney Disease (CKD) is escalating globally, affecting hundreds of millions. Data from the Global Burden of Disease (GBD) Study shows a near doubling in prevalence from 1990 to 2023. Factors like diabetes, hypertension, and aging populations contribute to this rise. Early detection and lifestyle changes can mitigate risks.
        </p>
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-slate-950/92 to-slate-900/82 border border-blue-500/30 backdrop-blur-xl shadow-2xl"
            >
              <div className="text-3xl font-bold text-blue-300 mb-2">{stat.year}</div>
              <div className="text-xl text-cyan-300 mb-4">{stat.label}</div>
              <div className="h-32 bg-slate-800/50 rounded-lg flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(stat.affected / 900) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-white/70">{stat.details}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center text-white/60 text-sm">
          <p>Source: Global Burden of Disease Study 2023 (The Lancet). Additional projections based on trends indicating continued increase due to risk factors like diabetes and hypertension.</p>
          <p>Global age-standardized prevalence rose 3.5% from 1990 to 2023, now at 14.2%. CKD is the 9th leading cause of death globally.</p>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────
// MAIN HOME COMPONENT
// ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const staggerParent = {
  show: { transition: { staggerChildren: 0.16 } },
};

const neonText = "drop-shadow-[0_0_12px_#3b82f6] drop-shadow-[0_0_24px_#60a5fa]";
const embossedCard = "shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_-6px_20px_rgba(255,255,255,0.08)] border border-blue-500/35 bg-gradient-to-br from-slate-950/96 to-slate-900/88 backdrop-blur-2xl";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, delay: 80 });
  }, []);

  const [bg, setBg] = useState("sparks");
  const [theme, setTheme] = useState("dark");
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowNav(y < lastY || y < 80);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans antialiased text-white">
      {/* ── BACKGROUNDS ── */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover -z-10 brightness-[0.6]"
        >
          <source src="/hologrambody.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Floating doctor badges + backgrounds (kept as original) */}
      {/* ── Sticky Nav ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: showNav ? 0 : -100, opacity: showNav ? 1 : 0.7 }}
        transition={{ duration: 0.6 }}
        className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/8 border border-blue-500/30 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 w-12 h-12 flex items-center justify-center text-white shadow-lg shadow-blue-600/40">
            <FaUserMd className="text-2xl" />
          </div>
          <div>
            <div className="flex flex-col items-start gap-0.5">
              <div className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                KidneyCare <span className="font-light italic text-white/90">AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-4 bg-blue-500/50"></span>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-blue-200/70">
                  Smart Monitoring • Early Detection
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/predict"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold shadow-lg shadow-blue-600/40 hover:shadow-cyan-600/50 transform hover:scale-105 transition-all"
          >
            Start Prediction
          </a>
        </div>
      </motion.nav>

      {/* ── HERO SECTION ── */}
      <header className="relative pt-40 pb-32 z-10">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className={`text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight ${neonText}`}>
              KidneyCare <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">AI</span>
            </h1>
            
            {/* UPDATED THEORY CONTENT: WHY + WHAT IT CAN DO */}
            <p className="mt-8 text-xl lg:text-2xl text-blue-100/90 max-w-2xl leading-relaxed">
              This website is built to help protect you from kidney disease through early detection and daily monitoring. 
              What can it do? Predict renal risk based on your symptoms, analyze your food with <strong>Renalradar</strong>, 
              track your water intake with <strong>Nephrolife</strong>, get health guidance from the <strong>Dr.Bot</strong> chatbot, 
              calculate your eGFR, and more.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <motion.a
                whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(59,130,246,0.55)" }}
                whileTap={{ scale: 0.97 }}
                href="/predict"
                className="px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-lg shadow-2xl shadow-blue-700/45 hover:shadow-cyan-600/55"
              >
                Begin AI Screening →
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.06 }}
                href="/learn"
                className="px-10 py-5 rounded-full border-2 border-blue-400/60 bg-white/8 backdrop-blur-lg font-semibold hover:bg-white/14"
              >
                How It Works
              </motion.a>
            </div>

            {/* UPDATED QUICK FEATURES */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg">
              {[
                { emoji: "📈", label: "Renal Risk Prediction" },
                { emoji: "🍲", label: "Renalradar Food Analyzer" },
                { emoji: "💧", label: "Nephrolife Water Tracker" },
                { emoji: "💬", label: "Dr.Bot Health Guide" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-white/8 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-medium text-blue-200">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerParent} initial="hidden" animate="show" className="relative">
            <div className="absolute -top-32 right-0 w-4/5 lg:w-full opacity-70 pointer-events-none z-0">
              <div className="text-[18rem] lg:text-[24rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-400 animate-pulse-slow opacity-40">
                🫘
              </div>
            </div>

            {/* UPDATED FEATURE CARDS — ALL FUNCTIONALITIES WITH DESCRIPTIONS */}
            <div className="grid gap-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaLaptopMedical />} title="Renal Risk Prediction" accent="text-blue-300" className={embossedCard}>
                    Get an instant kidney risk score and prevention tips using AI based on your symptoms. 
                    The most powerful tool for early detection.
                  </FeatureCard>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaRunning />} title="Water Intake Tracker - Nephrolife" accent="text-cyan-300" className={embossedCard}>
                    Track your daily water intake, get smart reminders, and maintain perfect hydration for your kidneys.
                  </FeatureCard>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaAppleAlt />} title="Food Analyzer - Renalradar" accent="text-cyan-400" className={embossedCard}>
                    Log or scan your meals — Renalradar will tell you if they are safe or harmful for your kidneys and suggest better options.
                  </FeatureCard>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaStethoscope />} title="Health Chatbot - Dr.Bot" accent="text-blue-300" className={embossedCard}>
                    Talk to Dr.Bot 24/7 — get personalized guidance on symptoms, diet, and lifestyle for better kidney health.
                  </FeatureCard>
                </motion.div>
              </div>

              {/* EXTRA ROW FOR eGFR + REPORT (as requested) */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaFlask />} title="eGFR Calculator" accent="text-cyan-400" className={embossedCard}>
                    Instantly calculate your estimated Glomerular Filtration Rate (eGFR) — the most important number for kidney function.
                  </FeatureCard>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <FeatureCard icon={<FaRocket />} title="Kidney Health Insights" accent="text-blue-300" className={embossedCard}>
                    Get comprehensive insights and personalized recommendations to support your kidney health journey.
                  </FeatureCard>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Statistical Analysis Section */}
      <KidneyStatsSection />

      {/* CTA */}
      <section className="py-32 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/65 via-cyan-950/60 to-blue-950/65" />
        <div className="relative max-w-6xl mx-auto px-8 text-center">
          <h2 className={`text-5xl lg:text-6xl font-extrabold mb-10 ${neonText}`}>
            Protect Your Kidneys Today
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto">
            Early action changes outcomes. Start your AI-powered kidney health journey now with Renalradar, Nephrolife, Dr.Bot &amp; more.
          </p>
          <motion.a
            whileHover={{ scale: 1.1, boxShadow: "0 0 60px rgba(59,130,246,0.65)" }}
            href="/predict"
            className="inline-block px-16 py-7 text-2xl font-bold rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 shadow-2xl shadow-blue-800/55"
          >
            Launch KidneyCare AI →
          </motion.a>
        </div>
      </section>

      <footer className="py-16 text-center bg-black/45 border-t border-blue-900/45 relative z-10">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-blue-200/70">© {new Date().getFullYear()} KidneyCare AI – Built with care for better kidney health.</p>
        </div>
      </footer>
    </div>
  );
}