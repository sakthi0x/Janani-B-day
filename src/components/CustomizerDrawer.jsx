import React, { useState } from "react";
import { C, DEFAULT_CONFIG } from "../constants";

export default function CustomizerDrawer({ config, onSaveConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(config);
  const [copied, setCopied] = useState(false);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onSaveConfig(updated);
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
    onSaveConfig(DEFAULT_CONFIG);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-xl transition-transform hover:scale-110 cursor-pointer border backdrop-blur-md"
        style={{
          background: "rgba(16, 28, 40, 0.85)",
          borderColor: C.gold,
          color: C.goldLight,
        }}
        title="Personalize Letter"
      >
        <span className="text-xl">⚙️</span>
      </button>

      {/* Slide-out Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between font-sans"
            style={{ background: C.parchment, color: C.ink2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <h3 className="font-serif text-xl font-bold" style={{ color: C.ink2 }}>
                  Personalize Letter ✍️
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-black/10"
                  style={{ color: C.wax }}
                >
                  ✕
                </button>
              </div>

              <p className="text-xs mt-2 mb-6" style={{ color: C.muted }}>
                Customize your birthday letter in real-time. Changes are saved automatically!
              </p>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                    Birthday Person's Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full p-2.5 rounded border focus:outline-none focus:ring-1"
                    style={{ background: C.parchmentDark, borderColor: C.gold }}
                  />
                </div>

                {/* Sender Name */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                    Sender's Name
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleChange("senderName", e.target.value)}
                    className="w-full p-2.5 rounded border focus:outline-none focus:ring-1"
                    style={{ background: C.parchmentDark, borderColor: C.gold }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                    Birthday Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full p-2.5 rounded border focus:outline-none focus:ring-1 font-serif italic text-sm"
                    style={{ background: C.parchmentDark, borderColor: C.gold }}
                  />
                </div>

                {/* Mode Selector */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                    Display Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => handleChange("mode", e.target.value)}
                    className="w-full p-2.5 rounded border focus:outline-none focus:ring-1"
                    style={{ background: C.parchmentDark, borderColor: C.gold }}
                  >
                    <option value="age">Age Mode (Celebrates turning age X)</option>
                    <option value="countdown">Countdown Mode (Counts down to target date)</option>
                  </select>
                </div>

                {/* Date of Birth or Target Date */}
                {formData.mode === "age" ? (
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      className="w-full p-2.5 rounded border focus:outline-none focus:ring-1"
                      style={{ background: C.parchmentDark, borderColor: C.gold }}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: C.wax }}>
                      Target Date (ISO Format)
                    </label>
                    <input
                      type="text"
                      value={formData.targetDate}
                      onChange={(e) => handleChange("targetDate", e.target.value)}
                      className="w-full p-2.5 rounded border focus:outline-none focus:ring-1"
                      style={{ background: C.parchmentDark, borderColor: C.gold }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 mt-6 border-t border-black/10 space-y-2">
              <button
                onClick={handleCopyJSON}
                className="w-full py-2.5 px-4 rounded font-sans text-xs font-semibold tracking-wide cursor-pointer transition-colors shadow-sm"
                style={{ background: C.gold, color: C.ink }}
              >
                {copied ? "✓ Config JSON Copied!" : "📋 Copy Config JSON"}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 px-4 rounded font-sans text-xs cursor-pointer text-center underline"
                style={{ color: C.wax }}
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

