import React, { useState, useRef } from "react";
import { C } from "../constants";

export default function PolaroidGallery({ photos }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const scrollRef = useRef(null);

  if (!photos || photos.length === 0) return null;

  const rotations = [-2, 1.5, -1.5, 2, -1, 1.8];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const newIdx = Math.round(scrollPosition / itemWidth);
    if (newIdx !== activePhoto && newIdx >= 0 && newIdx < photos.length) {
      setActivePhoto(newIdx);
    }
  };

  const scrollToIdx = (idx) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = container.clientWidth;
    container.scrollTo({
      left: idx * itemWidth,
      behavior: "smooth",
    });
    setActivePhoto(idx);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % photos.length);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="text-sm mb-2 uppercase tracking-widest" style={{ color: C.wax }}>
        captured moments
      </p>
      <h2
        className="font-serif text-2xl md:text-3xl mb-8 italic"
        style={{ color: C.ink2 }}
      >
        A Few Memories of Treasure
      </h2>

      {/* Hidden Scrollbar Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* PHOTO HORIZONTAL SCROLL TRACK (1 photo at a time, scrollbar completely hidden) */}
      <div className="relative my-4">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar py-4 px-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {photos.map((item, i) => {
            const photoUrl = typeof item === "string" ? item : item?.url;
            const isVideo = photoUrl?.toLowerCase().endsWith(".mp4");
            const rot = rotations[i % rotations.length];

            return (
              <div
                key={i}
                className="snap-center shrink-0 w-full flex justify-center"
              >
                <div
                  onClick={() => setSelectedIdx(i)}
                  className="relative cursor-pointer p-4 pb-4 transition-transform duration-300 hover:scale-105 shadow-xl rounded-sm w-full max-w-xs md:max-w-sm"
                  style={{
                    background: C.parchmentDark,
                    transform: `rotate(${rot}deg)`,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Washi Tape Effect */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 opacity-75 pointer-events-none"
                    style={{
                      background: "rgba(227, 211, 173, 0.85)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      transform: "rotate(-1deg)",
                    }}
                  />

                  {/* Image / Placeholder */}
                  <div
                    className="aspect-square w-full overflow-hidden flex flex-col items-center justify-center rounded-xs"
                    style={{
                      background: photoUrl ? "#e0d3b6" : "rgba(163, 144, 108, 0.15)",
                      border: photoUrl ? "none" : "1.5px dashed rgba(107, 92, 68, 0.3)",
                    }}
                  >
                    {photoUrl ? isVideo ? (
                      <video
                        src={photoUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        aria-label={`Memory ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={photoUrl}
                        alt={`Memory ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-4xl mb-1 block">📷</span>
                        <span className="text-xs font-sans italic block" style={{ color: C.muted }}>
                          photo {i + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Subtle Navigation Arrows */}
        {activePhoto > 0 && (
          <button
            onClick={() => scrollToIdx(activePhoto - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full shadow-md flex items-center justify-center text-lg z-20 cursor-pointer transition-transform hover:scale-110"
            style={{ background: C.wax, color: "#fff" }}
            aria-label="Previous Photo"
          >
            ‹
          </button>
        )}

        {activePhoto < photos.length - 1 && (
          <button
            onClick={() => scrollToIdx(activePhoto + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full shadow-md flex items-center justify-center text-lg z-20 cursor-pointer transition-transform hover:scale-110"
            style={{ background: C.wax, color: "#fff" }}
            aria-label="Next Photo"
          >
            ›
          </button>
        )}
      </div>

      {/* Subtle Dot Indicators Only (No text, no scrollbars) */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer border-none"
            style={{
              background: activePhoto === i ? C.wax : "rgba(107, 92, 68, 0.3)",
              transform: activePhoto === i ? "scale(1.2)" : "scale(1)",
            }}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedIdx(null)}
        >
          <div
            className="relative max-w-lg w-full p-5 rounded-md shadow-2xl transition-all scale-100"
            style={{ background: C.parchment }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute -top-4 -right-4 w-9 h-9 rounded-full shadow-lg flex items-center justify-center font-bold text-lg cursor-pointer"
              style={{ background: C.wax, color: "#fff" }}
            >
              ✕
            </button>

            {/* Photo View */}
            <div className="aspect-square w-full rounded-sm overflow-hidden flex items-center justify-center bg-black/5">
              {(typeof photos[selectedIdx] === "string" ? photos[selectedIdx] : photos[selectedIdx]?.url) ? (
                (typeof photos[selectedIdx] === "string" ? photos[selectedIdx] : photos[selectedIdx]?.url).toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={typeof photos[selectedIdx] === "string" ? photos[selectedIdx] : photos[selectedIdx]?.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                <img
                  src={typeof photos[selectedIdx] === "string" ? photos[selectedIdx] : photos[selectedIdx]?.url}
                  alt={`Memory ${selectedIdx + 1}`}
                  className="w-full h-full object-contain"
                />
                )
              ) : (
                <div className="text-center">
                  <span className="text-5xl block mb-2">📸</span>
                  <p className="font-serif text-sm italic" style={{ color: C.muted }}>
                    Placeholder Photo {selectedIdx + 1}
                  </p>
                </div>
              )}
            </div>

            {/* Photo counter & navigation */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-black/10">
              <button
                onClick={handlePrev}
                className="px-4 py-1.5 rounded-full text-xs font-sans cursor-pointer hover:bg-black/5 transition-colors"
                style={{ color: C.wax }}
              >
                ← Previous
              </button>
              <span className="text-xs font-sans" style={{ color: C.muted }}>
                {selectedIdx + 1} of {photos.length}
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-full text-xs font-sans cursor-pointer hover:bg-black/5 transition-colors"
                style={{ color: C.wax }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
