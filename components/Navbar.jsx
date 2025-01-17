"use client";
import { useState } from "react";

const Sidebar = ({ onLanguageChange }) => {
  const [language, setLanguage] = useState("en"); // Default language

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    onLanguageChange(lang); // Notify parent component of language change
  };

  return (
    <div className="h-screen w-64 p-6 border-r-2 border-[#ffffff20] flex flex-col space-y-6 bg-[#00000063]">
      {/* Branding or Logo */}
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Funpal AI
      </div>
      <div className="flex flex-col justify-between h-full">

      <div className="flex flex-col space-y-6">
        {/* Placeholder for Mood Ratings */}
        <div className="p-3 bg-[#00000065] text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Mood Ratings</span>
          </div>
        </div>

        {/* Placeholder for Custom Moods */}
        <div className="p-3 bg-[#00000065] text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Custom Moods</span>
          </div>
        </div>

        {/* Placeholder for Community Features */}
        <div className="p-3 bg-[#00000065] text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Community</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-400">
          Select Language
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full p-3 bg-[#00000065] cursor-pointer text-gray-200 rounded-lg focus:outline-none transition-colors appearance-none pr-10" // Add pr-10 for padding on the right
        >
          <option value="english" className="bg-gray-800">
            English
          </option>
          <option
            value="hindi (write hindi in english letters)"
            className="bg-gray-800"
          >
            Hindi
          </option>
          <option value="french" className="bg-gray-800">
            French
          </option>
          <option value="german" className="bg-gray-800">
            German
          </option>
          <option value="chinese" className="bg-gray-800">
            Chinese
          </option>
        </select>
      </div>
      </div>

    </div>
  );
};

export default Sidebar;
