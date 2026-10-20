import React, { useState } from "react";
import { C } from "../constants";
import { playGiftOpenSound } from "../audio";

export default function GiftBox({ vouchers }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [redeemed, setRedeemed] = useState({});

  const selectedVoucher = vouchers[selectedIndex];

  const revealLetter = () => {
    if (!revealed) {
      playGiftOpenSound();
      setRevealed(true);
    }
  };

  const handleRedeem = (id) => {
    setRedeemed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const chooseAnotherLetter = () => {
    setSelectedIndex((current) => (current + 1) % vouchers.length);
    setRevealed(false);
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="text-sm mb-2 uppercase tracking-widest" style={{ color: C.wax }}>
        a special surprise
      </p>
      <h2
        className="font-serif text-2xl md:text-3xl mb-8 italic"
        style={{ color: C.ink2 }}
      >
        A Little Birthday Post
      </h2>

      <div className="relative mx-auto max-w-sm">
        <div
          className="absolute left-4 right-4 top-4 h-48 rotate-[-4deg] rounded-sm border opacity-70"
          style={{ background: C.parchmentDark, borderColor: C.gold }}
        />
        <div
          className="absolute left-4 right-4 top-2 h-48 rotate-[3deg] rounded-sm border opacity-80"
          style={{ background: C.parchment, borderColor: C.gold }}
        />

        <div
          className={`relative min-h-52 rounded-sm border p-8 shadow-lg transition-transform duration-500 ${
            revealed ? "-translate-y-2" : "hover:-translate-y-1"
          }`}
          style={{ background: C.parchment, borderColor: C.gold }}
        >
          <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(135deg, transparent 49%, rgba(122,46,46,0.08) 50%, transparent 51%), linear-gradient(45deg, transparent 49%, rgba(122,46,46,0.08) 50%, transparent 51%)" }} />
          {!revealed ? (
            <button
              type="button"
              onClick={revealLetter}
              className="relative flex min-h-36 w-full flex-col items-center justify-center cursor-pointer"
              aria-label={`Open birthday letter ${selectedIndex + 1}`}
            >
              <span className="mb-4 text-xs font-sans uppercase tracking-[0.25em]" style={{ color: C.muted }}>
                for your eyes only
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed font-serif text-xl" style={{ color: C.wax, borderColor: C.wax }}>
                {selectedIndex + 1}
              </span>
              <span className="mt-4 font-serif italic text-lg" style={{ color: C.ink2 }}>
                Open this little letter
              </span>
            </button>
          ) : (
            <div className="relative animate-fadeIn text-left">
              <p className="mb-3 text-xs font-sans uppercase tracking-widest" style={{ color: C.wax }}>
                A promise from me to you
              </p>
              <h3 className="mb-3 font-serif text-xl font-semibold" style={{ color: C.ink2 }}>
                {selectedVoucher.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: C.muted }}>
                {selectedVoucher.desc}
              </p>
              <button
                type="button"
                onClick={() => handleRedeem(selectedVoucher.id)}
                className="mt-6 border-b border-dashed pb-1 font-sans text-xs uppercase tracking-widest"
                style={{ color: C.wax, borderColor: C.wax }}
              >
                {redeemed[selectedVoucher.id] ? "Marked as redeemed" : "Mark this promise redeemed"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <span className="font-sans text-xs" style={{ color: C.muted }}>
          letter {selectedIndex + 1} of {vouchers.length}
        </span>
        <button
          type="button"
          onClick={chooseAnotherLetter}
          className="font-serif text-sm italic underline decoration-dashed underline-offset-4"
          style={{ color: C.ink2 }}
        >
          {revealed ? "Choose another letter" : "Shuffle the post"}
        </button>
      </div>
    </section>
  );
}

