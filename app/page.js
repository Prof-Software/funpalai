"use client";
import { useState } from "react";
import Chatbot from "../components/Chatbot";
import Sidebar from "@/components/Navbar";
import Custom from "@/components/Custom";
import Community from "@/components/Community";
import Simulator from "@/components/Simulator";

export default function Home() {
  const [currentMood, setCurrentMood] = useState("friendly"); // Default mood
  const [language, setLanguage] = useState("en"); // Default language
  const [activeTab, setActiveTab] = useState("chatbot"); // Default tab

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
      kyromaniac: "bg-black",
    };
    return moods[mood] || "bg-purple-500"; // Fallback color
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center transition-colors duration-300 ${getBackgroundColor(
        currentMood
      )}`}
    >
      {/* Sidebar and Content Container */}
      <div className="w-full flex items-center justify-center bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df]">
        <Sidebar onLanguageChange={handleLanguageChange} onTabChange={handleTabChange} />
        <div className="flex-1 h-screen flex flex-col">
          {activeTab === "chatbot" && (
            <Chatbot onMoodChange={(mood) => setCurrentMood(mood)} language={language} />
          )}
          {activeTab === "simulator" && (
            <Simulator language={language} />
          )}
          {activeTab === "customMoods" && (
            <Custom/>
          )}
          {activeTab === "community" && (
            <Community/>
          )}
        </div>
      </div>
    </div>
  );
}