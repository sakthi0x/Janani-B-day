// Web Audio API Procedural Audio Synthesizer
// Completely self-contained - zero external audio asset dependencies!

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Wax Seal Crack SFX
export function playSealCrack() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Noise burst for crack
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

// 2. Paper Opening Rustle SFX
export function playPaperRustle() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(2500, now + 0.2);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.4);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

// 3. Candle Blow Out & Chime SFX
export function playBlowOutSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Wind blow sound
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const wind = ctx.createBufferSource();
  wind.buffer = buffer;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.setValueAtTime(300, now);

  const windGain = ctx.createGain();
  windGain.gain.setValueAtTime(0.4, now);
  windGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(ctx.destination);
  wind.start(now);

  // Sparkling magical chime cascade
  const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const start = now + 0.1 + idx * 0.08;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.15, start + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.0);
  });
}

// 4. Gift Box Unbox SFX
export function playGiftOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + i * 0.07;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.7);
  });
}


