import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaMicrophone, FaTimes, FaPaperPlane, FaHeartbeat, FaShieldAlt, FaWater } from "react-icons/fa";

// Global Speech Recognition setup
const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function DrBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false); // Track listening state
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      // Handle start
      recognition.onstart = () => {
        setIsListening(true);
      };

      // Handle result
      recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();

  setInput(transcript);

  // Direct message send
  setTimeout(() => {
    sendMessage(transcript);
  }, 100);
};

      // Handle end (Critical for fixing your error)
      recognition.onend = () => {
        setIsListening(false);
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);
  useEffect(() => {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const smartReply = (msg) => {
  const lower = msg.toLowerCase().trim();

  // Greeting
  if (lower.match(/\b(hi|hello|hey)\b/)) {
    return "Hello! Dr BOT is ready. Tell me your symptoms clearly.";
  }

  // Fever
  if (lower.includes("fever") || lower.includes("temperature") || lower.includes("viral")) {
    return `Fever:

 Causes: Viral, bacterial infection
 Symptoms: High temp, chills, body pain
 Tips: Rest, fluids, paracetamol
 Doctor if: >3 days or >103°F`;
  }

  // Cold & cough
  if (lower.includes("cough") || lower.includes("cold") || lower.includes("sore throat")) {
    return `Cold/Cough:

  Causes: Viral infection
    Tips: Steam, warm water, rest
    Doctor if: >1 week or severe`;
  }

  // Headache
  if (lower.includes("headache") || lower.includes("migraine")) {
    return `Headache:

    Causes: Stress, dehydration, migraine
    Tips: Rest, hydrate
    Warning: Severe/sudden → doctor`;
  }

  // Dizziness
  if (lower.includes("dizziness") || lower.includes("chakkar")) {
    return `Dizziness:

    Causes: Low BP, dehydration, weakness
    Tips: Drink water, rest
    Doctor if: Frequent or fainting`;
  }

  // Stomach / digestion
  if (lower.includes("stomach") || lower.includes("gas") || lower.includes("acidity")) {
    return `Stomach Issues:

    Causes: Gas, acidity, bad food
    Tips: Avoid oily food, eat light
    Doctor if: Severe pain`;
  }

  // Diarrhea
  if (lower.includes("diarrhea") || lower.includes("loose motion")) {
    return `Diarrhea:

    Risk: Dehydration
    Tips: ORS, fluids
    Doctor if: Blood or weakness`;
  }

  // Constipation
  if (lower.includes("constipation") || lower.includes("hard stool")) {
    return `Constipation:

    Causes: Low fiber, less water
    Tips: Fiber food, water, exercise`;
  }

  // Vomiting
  if (lower.includes("vomit") || lower.includes("nausea")) {
    return `Vomiting:

    Causes: Infection, acidity
    Tips: Small sips water
    Doctor if: Continuous`;
  }

  // Body / muscle / joint pain
  if (lower.includes("body pain") || lower.includes("muscle") || lower.includes("joint")) {
    return `Body Pain:

    Causes: Weakness, viral
    Tips: Rest, hydration
    Doctor if: Long-term pain`;
  }

  // Chest pain
  if (lower.includes("chest pain")) {
    return `⚠️ Chest Pain:

    Could be heart issue
    If severe → call emergency (108)
    Do NOT ignore`;
  }

  // Breathing
  if (lower.includes("breathing") || lower.includes("asthma")) {
    return `Breathing Issue:

    Causes: Asthma, infection
    Severe case → immediate doctor visit`;
  }

  // Heartbeat / palpitations
  if (lower.includes("heartbeat") || lower.includes("palpitation")) {
    return `Palpitations:

    Causes: Stress, caffeine, heart issue
    Doctor if: Frequent or dizziness`;
  }

  // BP
  if (lower.includes("bp") || lower.includes("pressure")) {
    return `Blood Pressure:

    Normal: <130/80
    Control salt, stress
    Check regularly`;
  }

  // Diabetes
  if (lower.includes("diabetes") || lower.includes("sugar")) {
    return `Diabetes:

    Symptoms: Thirst, urination, fatigue
    Control diet & exercise
    Check HbA1c`;
  }

  // Kidney
  if (lower.includes("kidney") || lower.includes("urine")) {
    return `Kidney Health:

    Signs: Swelling, urine changes
    Drink water, control BP & sugar
    Test: Creatinine`;
  }

  // Skin
  if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch")) {
    return `Skin Issue:

    Causes: Allergy, infection
    Tips: Clean skin, avoid scratching`;
  }

  // Hair fall
  if (lower.includes("hair fall") || lower.includes("hair loss")) {
    return `Hair Fall:

    Causes: Stress, deficiency
    Tips: Balanced diet, reduce stress`;
  }

  // Eye
  if (lower.includes("eye") || lower.includes("vision")) {
    return `Eye Problem:

    Causes: Screen strain, infection
    Tips: Rest eyes, reduce screen`;
  }

  // Ear
  if (lower.includes("ear")) {
    return `Ear Issue:

    Causes: Infection, wax
    Doctor if: Pain or discharge`;
  }

  // Tooth
  if (lower.includes("tooth") || lower.includes("teeth")) {
    return `Dental Issue:

    Causes: Cavities, infection
    Brush regularly
    Visit dentist`;
  }

  // Weakness
  if (lower.includes("weak") || lower.includes("fatigue")) {
    return `Weakness:

    Causes: Low vitamins, anemia
    Tips: Good diet, sleep`;
  }

  // Sleep
  if (lower.includes("sleep") || lower.includes("insomnia")) {
    return `Sleep Problem:

    Causes: Stress, screen
    Tips: Fixed sleep time, avoid phone`;
  }

  // Stress / anxiety
  if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("tension")) {
    return `Stress/Anxiety:

    Causes: Mental pressure
    Tips: Relaxation, breathing, exercise`;
  }

  // Weight
  if (lower.includes("weight")) {
    return `Weight Issue:

    Maintain balanced diet
    Exercise regularly`;
  }

  // Generic pain fallback
  if (lower.includes("pain")) {
    return `Pain:

    Could be injury or internal issue
    If persistent → consult doctor`;
  }

  // FINAL fallback
  return `Tell me your symptom clearly (fever, pain, stomach, etc.)

I can help with:
    Heart, kidney, BP, diabetes
    Fever, cough, pain
    Skin, eye, ear, stomach
    Mental health & more

⚠️ Not a real doctor — consult physician for diagnosis.`;
};
  
  const speak = (text) => {
  if (!text) return;

  const speech = new SpeechSynthesisUtterance(text);

  // Indian English settings
  speech.lang = "en-IN";
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  // Try to find Indian voice
  let indianVoice =
    voices.find(v => v.lang === "en-IN") ||
    voices.find(v => v.name.toLowerCase().includes("india")) ||
    voices.find(v => v.name.toLowerCase().includes("hindi")) ||
    voices[0];

  if (indianVoice) speech.voice = indianVoice;

  const bgMusic = document.getElementById("bg-music");

  speech.onstart = () => {
    if (bgMusic) bgMusic.pause();
  };

  speech.onend = () => {
    if (bgMusic) bgMusic.play();
  };

  window.speechSynthesis.speak(speech);
};
  const sendMessage = async (text = null) => {

  const messageText = (text || input).trim();
  if (!messageText) return;

  // First check if we have a smart rule-based reply
  const quickReply = smartReply(messageText);
  if (quickReply && quickReply !== "Main kidney, heart, BP, sugar, thakan wagairah pe madad kar sakta hoon.\nAur batao kya dikkat hai? 🌿") {
    setMessages((prev) => [...prev, { text: messageText, sender: "user" }]);
    setMessages((prev) => [...prev, { text: quickReply, sender: "bot" }]);
    speak(quickReply);
    setInput("");
    return;
  }

  setMessages((prev) => [...prev, { text: messageText, sender: "user" }]);
  setLoading(true);
  setInput("");

  try {

    const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });

    const data = await response.json();

    const botReply = data.reply;

    setMessages((prev) => [
      ...prev,
      { text: botReply, sender: "bot" }
    ]);

    speak(botReply);

  } catch (error) {

    const errorReply = "Server error. Please try again.";

    setMessages((prev) => [
      ...prev,
      { text: errorReply, sender: "bot" }
    ]);

  }

  setLoading(false);
};


const startVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("Start error handled:", e);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quantico:wght@700&family=Orbitron:wght@700;900&family=Exo+2:wght@300;400;600&display=swap');

        :root {
          --neon-cyan: #00d4ff;
          --neon-purple: #9d00ff;
          --text: #e8faff;
          --overlay: rgba(4,12,35,0.68);
          --card-bg: rgba(20,30,60,0.55);
        }

        body {
          margin: 0;
          font-family: 'Exo 2', sans-serif;
          background: #020817;
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .video-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
          filter: brightness(1.15) contrast(1.25) saturate(1.5);
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(to bottom, rgba(4,12,35,0.65) 0%, rgba(4,12,35,0.78) 50%, #020817 100%);
          z-index: -1;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 6rem 2rem 14rem;
          text-align: center;
        }

        .hero {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 6rem;
        }

        .title-container {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .title {
          font-family: 'Quantico', 'Orbitron', monospace;
          font-size: clamp(4.8rem, 12vw, 8.5rem);
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #40c4ff 0%, #7c4dff 50%, #aa00ff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: titleFlow 24s ease infinite;
          text-shadow: 0 0 4px rgba(64,196,255,0.6), 0 0 10px rgba(124,77,255,0.4);
          margin: 0;
          line-height: 1;
        }

        @keyframes titleFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .doctor-img {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 0 25px rgba(0,212,255,0.7);
          border: 3px solid rgba(0,212,255,0.5);
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .hero { flex-direction: column; gap: 1rem; }
          .title-container { flex-direction: column; }
          .doctor-img { width: 110px; height: 110px; }
        }

        .subtitle {
          font-size: 1.6rem;
          max-width: 900px;
          margin: 0 auto 3rem;
          color: #88ddff;
          line-height: 1.6;
        }

        .stats-grid, .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
          max-width: 1200px;
          margin: 4rem auto;
        }

        .card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 16px;
          padding: 2rem 1.8rem;
          transition: all 0.4s ease;
        }

        .card:hover {
          transform: translateY(-8px);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 30px rgba(0,212,255,0.35);
        }

        .card-icon { font-size: 2.8rem; margin-bottom: 1rem; color: var(--neon-cyan); }
        .card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #40c4ff; }

        .why-section {
          max-width: 1000px;
          margin: 6rem auto;
          background: rgba(20,30,60,0.45);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 20px;
          padding: 3rem 2.5rem;
        }

        .why-section h2 { font-size: 2.5rem; margin-bottom: 1.8rem; color: var(--neon-cyan); }

        .why-list { list-style: none; padding: 0; font-size: 1.15rem; line-height: 1.8; }
        .why-list li { margin-bottom: 1rem; padding-left: 1.8rem; position: relative; }
        .why-list li::before { content: "→"; position: absolute; left: 0; color: var(--neon-cyan); }

        .cta {
          margin: 6rem auto 4rem;
          max-width: 900px;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(170,0,255,0.12));
          border-radius: 20px;
          border: 1px solid rgba(0,212,255,0.3);
        }

        .cta h2 { font-size: 2.2rem; margin-bottom: 1.5rem; color: #40c4ff; }

        .fab {
          position: fixed;
          bottom: 50px;
          right: 50px;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #00d4ff, #9d00ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(0,212,255,0.6);
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(4,12,35,0.94);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8vh;
          z-index: 2000;
        }

        .chat-container {
          width: 100%;
          max-width: 1100px;
          height: 82vh;
          background: rgba(20,30,60,0.68);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(0,212,255,0.4);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 18px 28px;
          background: linear-gradient(90deg, rgba(0,170,255,0.18), rgba(170,0,255,0.18));
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,212,255,0.35);
        }

        .chat-header h2 {
          margin: 0;
          font-size: 2rem;
          background: linear-gradient(90deg, #00d4ff, #9d00ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .messages {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .msg {
          max-width: 78%;
          padding: 16px 22px;
          border-radius: 20px;
          line-height: 1.55;
          font-size: 1.1rem;
        }

        .user { align-self: flex-end; background: linear-gradient(135deg, #00aaff, #00d4ff); color: #001122; }
        .bot { align-self: flex-start; background: rgba(10,20,50,0.75); border: 1px solid rgba(0,212,255,0.35); color: #e0f7ff; }

        .input-row {
          padding: 18px 28px;
          border-top: 1px solid rgba(0,212,255,0.3);
          display: flex;
          gap: 14px;
          background: rgba(10,20,50,0.65);
        }

        input {
          flex: 1;
          padding: 18px 22px;
          border: 1px solid rgba(0,212,255,0.45);
          border-radius: 16px;
          background: rgba(20,30,60,0.65);
          color: white;
          font-size: 1.15rem;
        }

        .btn {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #9d00ff, #00aaff);
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .mic-active {
          background: #ff4b2b !important;
          box-shadow: 0 0 15px #ff4b2b;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .loading {
          align-self: flex-start;
          background: rgba(0,212,255,0.18);
          padding: 16px 22px;
          border-radius: 20px;
          border: 1px solid rgba(0,212,255,0.35);
          color: #88ddff;
          animation: blink 1.8s infinite;
        }

        @keyframes blink {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
      `}</style>

      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="/grok-video-6d56db37-322f-4f75-bb6e-031bdf156d91.mp4" type="video/mp4" />
      </video>
      
      <div className="overlay" />

      <div className="content">
        <div className="hero">
          <div className="title-container">
            <h1 className="title">DR. BOT</h1>
            <img src="/ChatGPT Image Jan 29, 2026, 02_48_28 PM.png" alt="Doctor" className="doctor-img" />
          </div>
        </div>

        <p className="subtitle">Your advanced AI health companion — focused on kidney care & full-body wellness</p>

        <div className="stats-grid">
          <div className="card">
            <div className="card-icon"><FaHeartbeat /></div>
            <h3>850 Million</h3>
            <p>People worldwide affected by chronic kidney disease (CKD)</p>
          </div>
          <div className="card">
            <div className="card-icon"><FaShieldAlt /></div>
            <h3>1 in 10</h3>
            <p>Adults in India at risk — early detection can save lives</p>
          </div>
          <div className="card">
            <div className="card-icon"><FaWater /></div>
            <h3>2.5–3 L</h3>
            <p>Daily water intake — first line of kidney protection</p>
          </div>
        </div>

        <div className="tips-grid">
          <div className="card">
            <h3>Control BP & Sugar</h3>
            <p>Keep BP &lt;130/80 &amp; HbA1c &lt;7% — biggest kidney protectors</p>
          </div>
          <div className="card">
            <h3>Avoid Painkillers</h3>
            <p>Limit NSAIDs (ibuprofen, etc.) — they damage kidneys over time</p>
          </div>
          <div className="card">
            <h3>Low Salt Diet</h3>
            <p>Less than 5g salt/day — reduces strain on kidneys & heart</p>
          </div>
        </div>

        <div className="why-section">
          <h2>Why Choose Dr. BOT?</h2>
          <ul className="why-list">
            <li>24/7 instant answers about kidney health & other issues</li>
            <li>Voice input — speak your symptoms in Hindi/English</li>
            <li>Simple language — no medical jargon</li>
            <li>Focus on prevention — not just treatment</li>
          </ul>
        </div>

        <div className="cta">
          <h2>Ready to take care of your kidneys?</h2>
          <p>Click the bot icon below to start chatting — ask anything!</p>
        </div>

        {!open && (
          <div className="fab" onClick={() => setOpen(true)}>
            <FaRobot size={38} />
          </div>
        )}

        {open && (
          <div className="modal" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            <div className="chat-container">
              <div className="chat-header">
                <h2>DR. BOT</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#88ddff', fontSize: '2rem', cursor: 'pointer' }}>
                  <FaTimes />
                </button>
              </div>

              <div className="messages">
                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.sender === 'user' ? 'user' : 'bot'}`}>
                    {m.text}
                  </div>
                ))}
                {loading && <div className="loading">Analyzing...</div>}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-row">
                <button 
                  className={`btn ${isListening ? 'mic-active' : ''}`} 
                  onClick={startVoice} 
                  title={isListening ? "Listening..." : "Speak"}
                >
                  <FaMicrophone />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Kidney or any health related question?"
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn" onClick={() => sendMessage()}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}