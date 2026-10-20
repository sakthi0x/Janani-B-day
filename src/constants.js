export const DEFAULT_CONFIG = {
  name: "Alex",
  senderName: "Sakthimurugan",
  message:
    "Another year of you being exactly the kind of person people are lucky to know. I hope today is easy, joyful, and full of the things that make you smile — and that this year ahead treats you even better than the last one did.",
  mode: "age", // "age" | "countdown"
  dob: "2002-01-01",
  targetDate: "2026-12-31T00:00:00",
  photos: [
    { url: "", caption: "That unforgettable afternoon" },
    { url: "", caption: "Laughter in the city" },
    { url: "", caption: "Cozy coffee dates" },
    { url: "", caption: "Sunset views together" },
    { url: "", caption: "Road trips & playlists" },
    { url: "", caption: "A quiet moment of magic" }
  ],
  vouchers: [
    { id: 1, title: "☕ One Free Coffee & Pastry", desc: "Redeemable anytime for your favorite brew & treat on me." },
    { id: 2, title: "🎬 Movie Night Pick", desc: "You get full control over the film, snacks, and seating." },
    { id: 3, title: "🚗 Weekend Escape", desc: "A mini road trip to anywhere you want to explore." },
    { id: 4, title: "✨ Wish Granted", desc: "Valid for one favor of your choosing, no questions asked!" }
  ],
  memories: [
    { title: "Your Endless Kindness", text: "You always make everyone around you feel valued, heard, and deeply cared for." },
    { title: "Best Laugh Ever", text: "Your smile is contagious and can brighten up even the most ordinary days." },
    { title: "Always Up For Adventure", text: "Whether it's a spontaneous drive or a quiet evening, time with you is always special." }
  ]
};

export const C = {
  ink: "#3b2608",
  background: "#f4c542",
  parchment: "#f7ecd8",
  parchmentDark: "#efe0b8",
  envelope: "#e3d3ad",
  wax: "#7a2e2e",
  waxLight: "#a34d4d",
  gold: "#c9a24b",
  goldLight: "#e3b96b",
  ink2: "#3d2708",
  ink3: "#4e350f",
  muted: "#6b4b16",
  faint: "#81601e",
  hint: "#5f4615",
  placeholder: "#8f6b22",
};

export const STORAGE_KEY = "birthday_letter_config_v1";

export function loadSavedConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Failed to load saved config from localStorage", e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfigToStorage(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn("Failed to save config to localStorage", e);
  }
}

