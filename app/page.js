"use client";
import { useState } from "react";
import Chatbot from "../components/Chatbot";
import Sidebar from "@/components/Navbar";

export default function Home() {
  const [currentMood, setCurrentMood] = useState("friendly"); // Default mood
  const [language, setLanguage] = useState("en"); // Default language

  // Get the background color for the current mood
  const getBackgroundColor = (mood) => {
    const moods = {
      cowboy: "bg-yellow-500",
      toxic: "bg-red-500",
      friendly: "bg-pink-500",
      sarcastic: "bg-blue-500",
      pirate: "bg-indigo-500",
      robot: "bg-gray-500",
      genius: "bg-purple-500",
      shakespeare: "bg-pink-500",
      zen: "bg-teal-500",
      cheerleader: "bg-orange-500",
    };
    return moods[mood] || "bg-purple-500"; // Fallback color
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center transition-colors duration-300 ${getBackgroundColor(
        currentMood
      )}`}
    >
      {/* Chatbot Container */}
      <div className="w-full flex items-center justify-center bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df]">
        <Sidebar onLanguageChange={handleLanguageChange} />
        <Chatbot onMoodChange={(mood) => setCurrentMood(mood)} language={language} />
      </div>
    </div>
  );
}