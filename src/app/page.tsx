"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import VoiceRecorder from "@/components/features/VoiceRecorder";
import DisguiseMode from "@/components/features/DisguiseMode";

export default function Home() {
  const { language, isDisguiseMode } = useAppStore();

  const getWelcomeMessage = () => {
    switch (language) {
      case "en":
        return "Hello, I am Saheli. How can I help you today?";
      case "hi":
        return "नमस्ते, मैं सहेली हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?";
      case "mr":
        return "नमस्कार, मी सहेली आहे. आज मी तुमची कशी मदत करू शकते?";
    }
  };

  if (isDisguiseMode) {
    return <DisguiseMode />;
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center pt-10 pb-20">
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {getWelcomeMessage()}
        </h1>
        <p className="text-lg text-secondary">
          {language === "en" && "Tap the microphone and tell me your problem in your own words."}
          {language === "hi" && "माइक पर टैप करें और मुझे अपनी समस्या अपने शब्दों में बताएं।"}
          {language === "mr" && "माइक वर टॅप करा आणि तुमची समस्या मला तुमच्या शब्दांत सांगा."}
        </p>
      </div>

      <VoiceRecorder />

      <div className="mt-16 w-full px-4">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {language === "en" && "Recent Cases"}
          {language === "hi" && "हाल के मामले"}
          {language === "mr" && "अलीकडील प्रकरणे"}
        </h2>
        {/* Mock empty state for now */}
        <div className="p-6 rounded-2xl border border-border bg-card text-center text-secondary">
          {language === "en" && "No recent cases found."}
          {language === "hi" && "कोई हालिया मामला नहीं मिला।"}
          {language === "mr" && "कोणतीही अलीकडील प्रकरणे आढळली नाहीत."}
        </div>
      </div>
    </div>
  );
}
