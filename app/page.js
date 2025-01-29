"use client";
import { useState, useEffect } from "react";
import Chatbot from "../components/Chatbot";
import Sidebar from "@/components/Navbar";
import Custom from "@/components/Custom";
import Community from "@/components/Community";
import Simulator from "@/components/Simulator";
import Settings from "@/components/Settings";

export default function Home() {
  const [currentMood, setCurrentMood] = useState("friendly"); // Default mood
  const [language, setLanguage] = useState("en"); // Default language
  const [activeTab, setActiveTab] = useState("chatbot"); // Default tab
  const [font, setFont] = useState("MyFont"); // Default font

  // Retrieve font from local storage on component mount
  useEffect(() => {
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
      setFont(savedFont); // Set the font from local storage
    }
  }, []);

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

  // Determine the background color based on the active tab
  const backgroundColor = activeTab === "settings" ? "bg-black" : activeTab === "simulator" ? "bg-blue-600": getBackgroundColor(currentMood);

  return (
    <div
      className={`h-screen w-screen flex items-center font-[MyFont] justify-center transition-colors duration-300 ${backgroundColor}`}
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
            <Custom />
          )}
          {activeTab === "community" && (
            <Community />
          )}
          {activeTab === "settings" && (
            <Settings font={font} setFont={setFont} />
          )}
        </div>
      </div>
    </div>
  );
}