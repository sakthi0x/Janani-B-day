import React, { useState } from "react";
import { C } from "../constants";

export default function MemoryTimeline({ memories }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!memories || memories.length === 0) return null;

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <p className="text-sm mb-2 text-center uppercase tracking-widest" style={{ color: C.wax }}>
        reasons you are loved
      </p>
      <h2
        className="font-serif text-center text-2xl md:text-3xl mb-8 italic"
        style={{ color: C.ink2 }}
      >
        Things That Make You Extra Special
      </h2>

      <div className="space-y-4">
        {memories.map((m, i) => {
          const isOpen = activeIdx === i;
          return (
            <div
              key={i}
              onClick={() => setActiveIdx(isOpen ? null : i)}
              className="p-5 rounded-md border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              style={{
                background: isOpen ? C.parchmentDark : "rgba(239, 224, 184, 0.4)",
                borderColor: isOpen ? C.gold : "rgba(58, 46, 34, 0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold" style={{ color: C.ink2 }}>
                  <span className="mr-2" style={{ color: C.wax }}>
                    0{i + 1}.
                  </span>
                  {m.title}
                </h3>
                <span className="text-sm font-sans" style={{ color: C.muted }}>
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {isOpen && (
                <p
                  className="font-serif italic text-sm mt-3 pt-3 border-t border-black/10 leading-relaxed"
                  style={{ color: C.ink3 }}
                >
                  "{m.text}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

