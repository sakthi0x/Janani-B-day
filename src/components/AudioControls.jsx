import React, { useEffect, useRef, useState } from "react";
import { C } from "../constants";

const AUDIO_PREFERENCE_KEY = "birthday_letter_audio_enabled";

export default function AudioControls() {
  const [isPlaying, setIsPlaying] = useState(() => {
    const savedPreference = localStorage.getItem(AUDIO_PREFERENCE_KEY);
    return savedPreference === null || savedPreference === "true";
  });
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    document.querySelectorAll("audio").forEach((otherAudio) => {
      if (otherAudio !== audio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
    });

    const startAudio = async () => {
      if (!audio || localStorage.getItem(AUDIO_PREFERENCE_KEY) === "false") return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);
      }
    };

    const handleUserInteraction = () => {
      startAudio();
    };

    window.addEventListener("birthday-letter-user-interaction", handleUserInteraction);
    startAudio();

    return () => {
      window.removeEventListener("birthday-letter-user-interaction", handleUserInteraction);
      audio?.pause();
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem(AUDIO_PREFERENCE_KEY, "false");
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      localStorage.setItem(AUDIO_PREFERENCE_KEY, "true");
    } catch (error) {
      setIsPlaying(false);
      console.warn("Unable to start background music", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <audio ref={audioRef} src="/audio/bgm.mpeg" loop preload="auto" />
      <button
        onClick={handleToggle}
        className="px-3.5 py-2 rounded-full font-sans text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-md border cursor-pointer"
        style={{
          background: isPlaying ? "rgba(255, 224, 112, 0.9)" : "rgba(244, 197, 66, 0.9)",
          color: C.ink,
          borderColor: isPlaying ? C.gold : "rgba(95, 70, 21, 0.35)",
        }}
        title="Toggle Ambient Music"
      >
        <span>{isPlaying ? "🎵 Music: ON" : "🔇 Music: OFF"}</span>
      </button>
    </div>
  );
}
