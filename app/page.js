"use client";
import { useState } from "react";
import Chatbot from "../components/Chatbot";

export default function Home() {
  const [currentMood, setCurrentMood] = useState("friendly"); // Default mood

  // Get the background color for the current mood
  const getBackgroundColor = (mood) => {
    const moods = {
      cowboy: "bg-yellow-500",
      toxic: "bg-red-500",
      friendly: "bg-green-500",
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

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center transition-colors duration-300 ${getBackgroundColor(
        currentMood
      )}`}
    >
      {/* Chatbot Container */}
      <div className="w-full flex items-center justify-center">
        <Chatbot onMoodChange={(mood) => setCurrentMood(mood)} />
      </div>
    </div>
  );
}