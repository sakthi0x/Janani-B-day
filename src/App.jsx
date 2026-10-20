import React, { useState, useRef, useEffect } from "react";
import { C } from "./constants";
import { playSealCrack, playPaperRustle } from "./audio";
import AudioControls from "./components/AudioControls";
import AmbientParticles from "./components/AmbientParticles";
import PolaroidGallery from "./components/PolaroidGallery";
import GiftBox from "./components/GiftBox";
import MemoryTimeline from "./components/MemoryTimeline";
import CakeSection from "./components/Cake";

/* =====================================================================
   EDIT THESE VALUES to personalize the site. This is the main place
   you can customize for a birthday letter.
   ===================================================================== */
const CONFIG = {
  name: "Janani",
  senderName: "Sakthimurugan",
  message: `Another year of being an amazing person! ❤️ Hope you have a happy and peaceful day filled with things that make you smile. May this year bring you even more happiness and good things than the last one! 🎉
    `,
  greeting: "Happy Birthday, JAAN!!",

  // "age" shows the age they're turning. "countdown" counts down to a date.
  mode: "age",
  dob: "2004-10-21",
  targetDate: "2026-10-21T00:00:00",

  // Photos stored in public/images
  photos: [
    "/images/Jan%201.jpeg",
    "/images/Jan%202.jpeg",
    "/images/Jan%203.jpeg",
    "/images/Jan%204.jpeg",
    "/images/Jan%205.mp4",
  ],

  // Redeemable birthday gift vouchers
  vouchers: [
    { id: 1, title: "🧸 Fluffy Toy & Chocolate", desc: "A soft, cuddly surprise paired with your favorite chocolate treat." },
    { id: 2, title: "🍫 Chocolate & Ornaments", desc: "Your choice of delicious chocolate and beautiful ornaments, like a chain or earrings." },
    { id: 3, title: "📖 The Book You Wish For", desc: "Choose any book you have been wanting to read, and it is yours." },
    { id: 4, title: "✨ Any Wish", desc: "Make one birthday wish, and I will do my best to make it come true." },
  ],

  // Special memory cards / appreciation timeline
  memories: [
    { title: "Always genuine and true to yourself", text: "No matter the situation, you stay kind, sincere, and true to who you are." },
    { title: "Always ready to talk with a smile", text: "Your warm smile makes every conversation brighter and turns ordinary moments into happy memories." },
    { title: "Always curious to learn more", text: "Your curiosity and eagerness to learn make every conversation and adventure with you truly special." },
  ],
};

export default function App() {
  const [stage, setStage] = useState("closed"); // closed -> cracking -> opening -> open
  const [wishMade, setWishMade] = useState(false);
  const canvasRef = useRef(null);
  const cakeRef = useRef(null);

  const handleSealClick = () => {
    if (stage !== "closed") return;
    playSealCrack();
    setStage("cracking");
    setTimeout(() => {
      playPaperRustle();
      setStage("opening");
    }, 450);
    setTimeout(() => setStage("open"), 1500);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden font-serif"
      style={{ background: C.background }}
    >
      <GlobalStyle />
      <AmbientParticles />
      <AudioControls />

      <Envelope stage={stage} config={CONFIG} onSealClick={handleSealClick} />

      <div
        className="transition-opacity ease-out"
        style={{
          transitionDuration: "900ms",
          transitionDelay: stage === "open" ? "150ms" : "0ms",
          opacity: stage === "open" ? 1 : 0,
          pointerEvents: stage === "open" ? "auto" : "none",
        }}
      >
        <LetterContent
          config={CONFIG}
          wishMade={wishMade}
          setWishMade={setWishMade}
          cakeRef={cakeRef}
          canvasRef={canvasRef}
        />
      </div>

      <ConfettiCanvas canvasRef={canvasRef} />
    </div>
  );
}

/* ===================== GLOBAL STYLE / KEYFRAMES ===================== */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Work+Sans:wght@400;500;600&display=swap');
      .font-serif { font-family: 'Fraunces', Georgia, serif; }
      .font-sans { font-family: 'Work Sans', sans-serif; }
      .paper-line { background-image: repeating-linear-gradient(
          to bottom, transparent, transparent 34px, rgba(140,58,58,0.08) 35px
        ); }
      @keyframes crack {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        60% { transform: scale(1.15) rotate(-6deg); opacity: 1; }
        100% { transform: scale(0.4) rotate(8deg); opacity: 0; }
      }
      .seal-crack { animation: crack 420ms ease-in forwards; }
      @keyframes flicker {
        0% { transform: scaleY(1) rotate(-2deg); }
        100% { transform: scaleY(1.1) rotate(2deg); }
      }
      .flame { transform-origin: center bottom; animation: flicker 1.3s ease-in-out infinite alternate; }
      .flame.out { animation: none; opacity: 0; transition: opacity 0.4s ease; }
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes ambientDrift {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.55; }
        50% { transform: translate3d(18px, -14px, 0) scale(1.08); opacity: 0.85; }
      }
      @keyframes sealGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(122,46,46,0.2), 0 8px 20px rgba(56,28,8,0.3); }
        50% { box-shadow: 0 0 0 10px rgba(122,46,46,0), 0 10px 26px rgba(56,28,8,0.38); }
      }
      @keyframes shimmer {
        0% { transform: translateX(-120%); }
        55%, 100% { transform: translateX(120%); }
      }
      .envelope-glow { animation: ambientDrift 8s ease-in-out infinite; }
      .seal-glow { animation: sealGlow 2.6s ease-in-out infinite; }
      .envelope-shimmer { animation: shimmer 4.8s ease-in-out infinite; }
    `}</style>
  );
}

/* ===================== ENVELOPE ===================== */
function Envelope({ stage, config, onSealClick }) {
  if (stage === "open") return null;

  const flapOpen = stage === "opening";
  const letterOut = stage === "opening";

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{
        background: `radial-gradient(circle at 50% 42%, rgba(255,242,185,0.5), transparent 27%), linear-gradient(145deg, #f7d76d 0%, ${C.background} 48%, #d99f37 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 38% at 12% 20%, rgba(255,250,210,0.38), transparent 70%), radial-gradient(55% 45% at 92% 85%, rgba(122,46,46,0.18), transparent 70%), linear-gradient(rgba(91,54,14,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(91,54,14,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 42px 42px, 42px 42px",
        }}
      />
      <div className="envelope-glow absolute -left-16 top-24 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
      <div className="envelope-glow absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-red-900/10 blur-3xl" style={{ animationDelay: "-3s" }} />
      <div className="absolute inset-5 rounded-[2rem] border border-white/30 pointer-events-none" />

      <p
        className="relative mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.38em]"
        style={{ color: C.wax }}
      >
        A keepsake, sealed with love
      </p>
      <div className="relative mb-9 flex items-center gap-3">
        <span className="h-px w-8 bg-red-900/25" />
        <span className="font-serif text-2xl italic" style={{ color: C.ink2 }}>
          For {config.name}
        </span>
        <span className="h-px w-8 bg-red-900/25" />
      </div>

      <div
        className="relative rounded-xl border border-white/50 bg-white/10 p-3 shadow-[0_24px_60px_rgba(91,54,14,0.22)] backdrop-blur-sm"
        style={{ width: "min(370px, 88vw)", perspective: "1200px" }}
      >
        <div className="pointer-events-none absolute inset-1 rounded-lg border border-red-900/10" />
        {/* Letter, slides up out of the envelope */}
        <div
          className="absolute left-1/2 overflow-hidden rounded-sm shadow-xl transition-all ease-out"
          style={{
            background: C.parchment,
            bottom: "18%",
            width: "86%",
            aspectRatio: "3/4",
            transitionDuration: "1000ms",
            transform: letterOut
              ? "translate(-50%, -145%) scale(1)"
              : "translate(-50%, 0%) scale(0.94)",
            opacity: letterOut ? 1 : 0,
            zIndex: 1,
          }}
        >
          <div className="absolute left-0 top-0 h-1 w-full" style={{ background: `linear-gradient(90deg, ${C.wax}, ${C.goldLight}, ${C.wax})` }} />
          <div
            className="p-5 font-serif italic text-sm leading-relaxed"
            style={{ color: C.ink3 }}
          >
            Happy Birthday, {config.name}…
          </div>
        </div>

        {/* Envelope body */}
        <div
          className="relative overflow-hidden rounded-sm shadow-2xl"
          style={{
            background: `linear-gradient(145deg, ${C.envelope} 0%, #d6c299 100%)`,
            aspectRatio: "3/2",
            zIndex: 2,
            boxShadow: "0 16px 28px rgba(73,39,9,0.28), inset 0 0 0 1px rgba(255,255,255,0.35)",
          }}
        >
          <div className="envelope-shimmer pointer-events-none absolute -inset-y-10 left-0 z-10 w-1/4 -skew-x-12 bg-white/20 blur-xl" />
          {/* Body seams */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 49%, rgba(0,0,0,0.06) 50%, transparent 51%), linear-gradient(45deg, transparent 49%, rgba(0,0,0,0.06) 50%, transparent 51%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mt-5 text-center">
              <p className="font-sans text-[9px] uppercase tracking-[0.35em]" style={{ color: "#765d3d", opacity: 0.8 }}>
                A private letter
              </p>
              <p className="mt-1 font-serif text-xl font-medium tracking-wide" style={{ color: "#5b4632", opacity: 0.9 }}>
                For {config.name}
              </p>
            </div>
          </div>

          {/* Flap */}
          <div
            className="absolute left-0 top-0 w-full origin-top transition-transform ease-in-out"
            style={{
              height: "58%",
              transformStyle: "preserve-3d",
              transitionDuration: "900ms",
              transform: flapOpen ? "rotateX(178deg)" : "rotateX(0deg)",
              zIndex: 3,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background: C.parchmentDark,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
          </div>

          {/* Wax seal */}
          {stage !== "opening" && (
            <button
              onClick={onSealClick}
              aria-label="Open the letter"
              className={`absolute left-1/2 w-14 h-14 rounded-full flex items-center justify-center focus:outline-none ${
                stage === "cracking" ? "seal-crack" : "cursor-pointer"
              } ${stage === "closed" ? "seal-glow" : ""}`}
              style={{
                top: "52%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle at 35% 30%, ${C.waxLight}, ${C.wax} 70%)`,
                border: "1px solid rgba(255,218,164,0.38)",
                boxShadow: "0 8px 20px rgba(56,28,8,0.3)",
                zIndex: 4,
              }}
            >
              <span className="absolute inset-1 rounded-full border border-white/20" />
              <span
                className="font-serif text-xl"
                style={{ color: "#f0d9a8", opacity: 0.95 }}
              >
                {config.senderName ? config.senderName.charAt(0) : "S"}
              </span>
            </button>
          )}
        </div>
      </div>

      {stage === "closed" && (
        <p
          className="relative mt-9 rounded-full border border-red-900/15 bg-white/20 px-5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.25em]"
          style={{ color: C.hint, animation: "floatSlow 2.4s ease-in-out infinite" }}
        >
          tap the seal to begin
        </p>
      )}
    </div>
  );
}

/* ===================== MAIN LETTER CONTENT ===================== */
function LetterContent({ config, wishMade, setWishMade, cakeRef, canvasRef }) {
  return (
    <div className="font-sans relative z-20" style={{ background: C.background, color: C.ink3 }}>
      {/* Hero Header */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 paper-line">
        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: C.wax }}>
          a letter for
        </p>
        <h1
          className="font-serif leading-none"
          style={{ fontSize: "clamp(2.5rem,8.5vw,5rem)", lineHeight: 1.05, color: C.ink2 }}
        >
          {config.name}
        </h1>
        <p className="mt-5 text-sm md:text-base font-serif italic" style={{ color: C.muted, maxWidth: "34ch" }}>
          keep scrolling — a few special surprises await below.
        </p>
      </section>

      <Divider />

      {/* Main Message */}
      <section className="max-w-xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.wax }}>
          from the heart
        </p>
        <p
          className="font-serif italic leading-relaxed pl-6"
          style={{
            fontSize: "clamp(1.15rem,2.4vw,1.5rem)",
            color: C.ink2,
            borderLeft: `3px solid ${C.gold}`,
          }}
        >
          {config.message}
        </p>
        <p className="mt-8 text-center font-serif text-2xl font-semibold" style={{ color: C.wax }}>
          {config.greeting}
        </p>
        <p className="mt-6 font-serif italic text-right text-lg" style={{ color: C.muted }}>
          — With love, {config.senderName}
        </p>
      </section>

      <Divider />

      {/* Age / Countdown Section */}
      <AgeSection config={config} />

      <Divider />

      {/* Memory Timeline ("Reasons You Are Loved") */}
      <MemoryTimeline memories={config.memories} />
      <p className="px-6 py-8 text-center font-serif text-xl font-semibold" style={{ color: C.wax }}>
        BE THE SAME JAAN, ALWAYSSS!! 🩵
      </p>

      <Divider />

      {/* Polaroid Photo Gallery */}
      <PolaroidGallery photos={config.photos} />

      <Divider />

      {/* Interactive Gift Box with Redeemable Vouchers */}
      <GiftBox vouchers={config.vouchers} />

      <Divider />

      {/* Interactive Birthday Cake */}
      <CakeSection
        wishMade={wishMade}
        setWishMade={setWishMade}
        cakeRef={cakeRef}
        canvasRef={canvasRef}
      />

      <Divider />

      <footer className="text-center px-6 py-14 text-sm font-sans" style={{ color: C.faint }}>
        made with <span style={{ color: C.wax }}>♥</span> for {config.name} by {config.senderName}
      </footer>
    </div>
  );
}

function Divider() {
  return <div className="w-16 h-px mx-auto my-4" style={{ background: "rgba(58,46,34,0.15)" }} />;
}

function ConfettiCanvas({ canvasRef }) {
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

/* ===================== AGE / COUNTDOWN ===================== */
function AgeSection({ config }) {
  if (config.mode === "age" && config.dob) {
    const age = calculateAge(config.dob);

    return (
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-widest mb-2" style={{ color: C.wax }}>
          celebrating
        </p>
        <div
          className="font-serif leading-none font-semibold"
          style={{ fontSize: "clamp(3.5rem,16vw,6.5rem)", color: C.ink2 }}
        >
          {age}
        </div>
        <p className="mt-3 font-serif italic text-base" style={{ color: C.muted }}>
          wonderful years, and just getting started.
        </p>
      </section>
    );
  }

  if (config.mode === "countdown") {
    return <Countdown targetDate={config.targetDate} />;
  }

  return null;
}

function calculateAge(dob) {
  const birthDate = new Date(`${dob}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!birthdayPassed) age -= 1;
  return Math.max(age, 0);
}

function Countdown({ targetDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);
      diff -= h * 3600000;
      const m = Math.floor(diff / 60000);
      diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      setTime({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }) => (
    <div className="text-center p-3 rounded-md min-w-[70px]" style={{ background: C.parchmentDark }}>
      <span className="font-serif text-3xl font-bold block" style={{ color: C.ink2 }}>{value}</span>
      <span className="text-xs uppercase tracking-wider block" style={{ color: C.faint }}>{label}</span>
    </div>
  );

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.wax }}>
        counting down to the big day
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Unit value={time.d} label="days" />
        <Unit value={time.h} label="hrs" />
        <Unit value={time.m} label="min" />
        <Unit value={time.s} label="sec" />
      </div>
    </section>
  );
}
