import React, { useCallback } from "react";
import { C } from "../constants";
import { playBlowOutSound } from "../audio";

export default function CakeSection({ wishMade, setWishMade, cakeRef, canvasRef }) {
  const burstConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    const cakeEl = cakeRef.current;
    if (!canvas || !cakeEl) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rect = cakeEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.25;
    const colors = [C.wax, C.gold, C.goldLight, "#e26d5c", "#38b000", "#7209b7", C.ink3];
    let particles = [];
    for (let i = 0; i < 110; i++) {
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -10 - 4,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        life: 0,
        maxLife: 90 + Math.random() * 50,
      });
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += 0.2;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      particles = particles.filter((p) => p.life < p.maxLife);
      if (particles.length > 0) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    frame();
  }, [canvasRef, cakeRef]);

  const handleClick = () => {
    if (wishMade) {
      setWishMade(false);
      return;
    }
    playBlowOutSound();
    setWishMade(true);
    burstConfetti();
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="text-sm mb-2 uppercase tracking-widest" style={{ color: C.wax }}>
        one more thing
      </p>
      <h2 className="font-serif text-2xl md:text-3xl mb-2 italic" style={{ color: C.ink2 }}>
        Make a Birthday Wish
      </h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Tap the candle to blow out the flame & make a wish!
      </p>

      {/* SVG Cake */}
      <div className="relative inline-block my-2">
        <svg
          ref={cakeRef}
          onClick={handleClick}
          viewBox="0 0 200 160"
          className="mx-auto cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{ width: "min(260px, 65vw)" }}
        >
          <ellipse cx="100" cy="140" rx="70" ry="8" fill={C.gold} opacity="0.3" />
          <rect x="45" y="95" width="110" height="40" rx="6" fill={C.wax} />
          <rect x="45" y="95" width="110" height="10" rx="4" fill={C.waxLight} />
          <rect x="55" y="65" width="90" height="35" rx="6" fill={C.goldLight} />
          <rect x="55" y="65" width="90" height="9" rx="4" fill="#ecc985" />
          <rect x="96" y="40" width="8" height="26" rx="2" fill={C.parchment} />
          <path
            className={`flame ${wishMade ? "out" : ""}`}
            d="M100 20 C104 26 108 31 100 40 C92 31 96 26 100 20 Z"
            fill={C.gold}
          />
        </svg>
      </div>

      {/* Wish Status Message */}
      <p className="mt-6 font-serif italic text-lg transition-all" style={{ color: C.wax, minHeight: "1.6em" }}>
        {wishMade ? "✨ Wish Made! May all your dreams come true! Happy Birthday! ✨" : ""}
      </p>
    </section>
  );
}
