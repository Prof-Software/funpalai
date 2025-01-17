"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Custom = () => {
  const [customMoods, setCustomMoods] = useState([]);
  const [newMoodName, setNewMoodName] = useState("");
  const [newMoodPrompt, setNewMoodPrompt] = useState("");
  const [isAddingMood, setIsAddingMood] = useState(false);

  // Mock moods created by other users
  const mockMoods = [
    {
      id: 1,
      name: "Alien 👽",
      prompt: "You are an alien from another planet. Respond with curiosity about Earth and its inhabitants.",
    },
    {
      id: 2,
      name: "Time Traveler ⏳",
      prompt: "You are a time traveler from the future. Share insights about what's to come.",
    },
    {
      id: 3,
      name: "Mad Scientist 🧪",
      prompt: "You are a mad scientist. Respond with wild theories and experiments.",
    },
    {
      id: 4,
      name: "Superhero 🦸‍♂️",
      prompt: "You are a superhero saving the world. Respond with bravery and heroic phrases.",
    },
    {
      id: 5,
      name: "Ninja 🥷",
      prompt: "You are a stealthy ninja. Respond with short, mysterious, and cryptic messages.",
    },
    {
      id: 6,
      name: "Astronaut 🚀",
      prompt: "You are an astronaut exploring the cosmos. Respond with awe and wonder about space.",
    },
    {
      id: 7,
      name: "Wizard 🪄",
      prompt: "You are a powerful wizard. Respond with magical spells and ancient wisdom.",
    },
    {
      id: 8,
      name: "Samurai ⚔️",
      prompt: "You are a honorable samurai. Respond with discipline and respect.",
    },
    {
      id: 9,
      name: "Mermaid 🧜‍♀️",
      prompt: "You are a mermaid from the deep ocean. Respond with tales of the sea.",
    },
    {
      id: 10,
      name: "Spy 🕶️",
      prompt: "You are a secret agent on a mission. Respond with intrigue and suspense.",
    },
  ];

  // Add a new custom mood
  const addCustomMood = () => {
    if (newMoodName.trim() === "" || newMoodPrompt.trim() === "") return;

    const newMood = {
      id: Date.now(),
      name: newMoodName,
      prompt: newMoodPrompt,
    };

    setCustomMoods([...customMoods, newMood]);
    setNewMoodName("");
    setNewMoodPrompt("");
    setIsAddingMood(false);
  };

  // Delete a custom mood
  const deleteCustomMood = (id) => {
    setCustomMoods(customMoods.filter((mood) => mood.id !== id));
  };

  // Use a mock mood (placeholder function)
  const useMockMood = (mood) => {
    alert(`Using mood: ${mood.name}`);
  };

  return (
    <div className="flex-1 h-screen flex flex-col">
      {/* Custom Moods Header */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🎨
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Custom Moods
            </h2>
            <p className="text-sm text-gray-400">
              Create and manage your custom moods
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingMood(true)}
          className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-105"
        >
          Add Mood
        </button>
      </div>

      {/* Custom Moods List */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Your Moods Section */}
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          Your Moods
        </h3>
        <AnimatePresence>
          {customMoods.length > 0 ? (
            customMoods.map((mood) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 mb-4 bg-[#ffffff15] rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-400">{mood.prompt}</p>
                </div>
                <button
                  onClick={() => deleteCustomMood(mood.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-400">You haven't created any moods yet.</p>
          )}
        </AnimatePresence>

        {/* Moods by Other Users Section */}
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mt-6 mb-4">
          Moods by Other Users
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMoods.map((mood) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-[#ffffff15] rounded-lg"
            >
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {mood.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">{mood.prompt}</p>
              <button
                onClick={() => useMockMood(mood)}
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Use This Mood
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Custom Mood Modal */}
      <AnimatePresence>
        {isAddingMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1e1b1bdf] rounded-lg p-6 max-w-md w-full shadow-lg"
            >
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                Add Custom Mood
              </h2>
              <input
                type="text"
                value={newMoodName}
                onChange={(e) => setNewMoodName(e.target.value)}
                placeholder="Mood Name"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
              />
              <textarea
                value={newMoodPrompt}
                onChange={(e) => setNewMoodPrompt(e.target.value)}
                placeholder="Mood Prompt"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingMood(false)}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomMood}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Custom;