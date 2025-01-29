"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaPlus, FaSpinner } from "react-icons/fa";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { FaWandMagicSparkles } from "react-icons/fa6";
export default function Custom() {
  const [customMoods, setCustomMoods] = useState([]);
  const [otherUsersMoods, setOtherUsersMoods] = useState([]);
  const [newMoodName, setNewMoodName] = useState("");
  const [newMoodPersona, setNewMoodPersona] = useState("");
  const [newMoodImage, setNewMoodImage] = useState("");
  const [newMoodDescription, setNewMoodDescription] = useState("");
  const [newMoodIntroduction, setNewMoodIntroduction] = useState("");
  const [newMoodBehavior, setNewMoodBehavior] = useState("");
  const [isAddingMood, setIsAddingMood] = useState(false);
  const [creatorName, setCreatorName] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGen, setImageGen] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (userData && userData.displayName) {
      setCreatorName(userData.displayName);
    }
  }, []);

  useEffect(() => {
    const moodsCollection = collection(db, "moods");
    const unsubscribe = onSnapshot(moodsCollection, (snapshot) => {
      const moods = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const filteredMoods = moods.filter((m) => m.name !== "Kyromaniac");
      const userMoods = filteredMoods.filter((m) => m.username === creatorName);
      const otherMoods = filteredMoods.filter((m) => m.username !== creatorName);
      setCustomMoods(userMoods);
      setOtherUsersMoods(otherMoods);
    });
    return () => unsubscribe();
  }, [creatorName]);

  async function addCustomMood() {
    if (
      !newMoodName.trim() ||
      !newMoodPersona.trim() ||
      !newMoodImage.trim() ||
      !newMoodDescription.trim() ||
      !newMoodIntroduction.trim() ||
      !newMoodBehavior.trim()
    ) {
      alert("Please fill out all fields before adding a mood.");
      return;
    }
    try {
      const newMood = {
        name: newMoodName,
        persona: newMoodPersona,
        image: newMoodImage,
        username: creatorName,
        description: newMoodDescription,
        introduction: newMoodIntroduction,
        behavior: newMoodBehavior,
        likes: 0,
        isLiked: false,
        bgColor: "bg-purple-500",
      };
      const docRef = await addDoc(collection(db, "moods"), newMood);
      console.log("Mood added with ID:", docRef.id);

      setNewMoodName("");
      setNewMoodPersona("");
      setNewMoodImage("");
      setNewMoodDescription("");
      setNewMoodIntroduction("");
      setNewMoodBehavior("");
      setIsAddingMood(false);
    } catch (error) {
      console.error("Error adding mood:", error);
      alert("Failed to add mood. Please try again.");
    }
  }

  async function deleteCustomMood(id) {
    try {
      await deleteDoc(doc(db, "moods", id));
      console.log("Mood deleted with ID:", id);
    } catch (error) {
      console.error("Error deleting mood:", error);
    }
  }

  async function toggleLike(id, isLiked, likes) {
    try {
      const moodRef = doc(db, "moods", id);
      await updateDoc(moodRef, {
        isLiked: !isLiked,
        likes: isLiked ? likes - 1 : likes + 1,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  function toggleMoodInLocalStorage(mood) {
    const storedMoods = JSON.parse(localStorage.getItem("moods") || "[]");
    const moodExists = storedMoods.some((mItem) => mItem.id === mood.id);

    if (moodExists) {
      const updatedMoods = storedMoods.filter((mItem) => mItem.id !== mood.id);
      localStorage.setItem("moods", JSON.stringify(updatedMoods));
      setSnackbarMessage("Mood Removed");
    } else {
      storedMoods.push(mood);
      localStorage.setItem("moods", JSON.stringify(storedMoods));
      setSnackbarMessage("Mood Added");
    }
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  }

  function isMoodAdded(mood) {
    const storedMoods = JSON.parse(localStorage.getItem("moods") || "[]");
    return storedMoods.some((stored) => stored.id === mood.id);
  }

  async function generateImage() {
    setIsGeneratingImage(true);
    try {
      const prompt = encodeURIComponent(imageGen);
      const imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      setNewMoodImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewMoodImage(String(reader.result));
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f10] text-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] shadow-lg flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🎨
          </div>
          <div>
            <h2 className="md:text-xl text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Custom Moods
            </h2>
            <p className="text-xs text-gray-400 md:block hidden">
              Create and manage your custom moods
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingMood(true)}
          className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-xl rounded-lg hover:scale-105 hover:bg-purple-600 transition-all"
        >
          <FaPlus />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-8">
        {/* Your Moods */}
        <div>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Your Moods
          </h3>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 mb-4 bg-[#ffffff15] rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#ffffff25] transition-colors"
            >
              <img
                src="/admin.png"
                alt="Kyromaniac"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col items-center w-full gap-1 mt-2">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Kyromaniac
                </h3>
                <p className="text-sm text-gray-300">The Majestic Presence</p>
                <p className="text-sm text-gray-400 text-center line-clamp-3">
                  Step into the presence of The Majestic Kars, a being of unmatched intellect,
                  elegance, and refinement.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {customMoods.map((mood) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleMoodInLocalStorage(mood)}
                className="p-4 mb-4 bg-[#ffffff15] rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#ffffff25] transition-colors"
              >
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex flex-col items-center w-full gap-1 mt-2">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-300">by @{mood.username}</p>
                  <p className="text-sm text-gray-400 text-center line-clamp-3">
                    {mood.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomMood(mood.id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-2 w-full"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Other Users' Moods */}
        <div>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Moods by Other Users
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherUsersMoods.map((mood) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  isMoodAdded(mood) ? "bg-[#000]" : "bg-[#ffffff15]"
                } p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#00000070] transition-colors`}
                onClick={() => toggleMoodInLocalStorage(mood)}
              >
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-400">by @{mood.username}</p>
                  <p className="text-sm text-gray-400 line-clamp-3 mt-1">
                    {mood.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Mood Modal */}
      <AnimatePresence>
        {isAddingMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1e1b1b] rounded-xl p-6 w-full max-w-4xl h-full md:h-auto md:max-h-[95vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 text-center">
                Create a Custom Mood
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Text Fields */}
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={newMoodName}
                    onChange={(e) => setNewMoodName(e.target.value)}
                    placeholder="Mood Name"
                    className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                  />
                  <textarea
                    value={newMoodDescription}
                    onChange={(e) => setNewMoodDescription(e.target.value)}
                    placeholder="Describe the mood (e.g., 'A calm, peaceful vibe...')"
                    className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                    rows={2}
                  />
                  <textarea
                    value={newMoodPersona}
                    onChange={(e) => setNewMoodPersona(e.target.value)}
                    placeholder="Persona (e.g., 'A wise old sage who wonders around spreading knowledge')"
                    className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                    rows={4}
                  />
                  <textarea
                    value={newMoodIntroduction}
                    onChange={(e) => setNewMoodIntroduction(e.target.value)}
                    placeholder="Introduction (e.g., 'Welcome to a world of tranquility')"
                    className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                    rows={2}
                  />
                  <textarea
                    value={newMoodBehavior}
                    onChange={(e) => setNewMoodBehavior(e.target.value)}
                    placeholder="Behavior (e.g., 'Calm and collected')"
                    className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                    rows={2}
                  />
                </div>

                {/* Right Column: Image Generation/Preview */}
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={imageGen}
                        onChange={(e) => setImageGen(e.target.value)}
                        placeholder="Generate an image"
                        className="w-full p-3 bg-[#00000065] text-white rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={generateImage}
                        className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                        disabled={isGeneratingImage}
                      >
                        {isGeneratingImage ? (
                          <FaSpinner className="animate-spin h-5 w-5" />
                        ) : (
                          <FaWandMagicSparkles/>
                        )}
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center text-sm text-gray-400 mt-2 mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-12 h-px bg-gray-400" />
                        <span>OR</span>
                        <div className="w-12 h-px bg-gray-400" />
                      </div>
                      <label
                        htmlFor="upload-image"
                        className="cursor-pointer w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Upload Image
                      </label>
                      <input
                        type="file"
                        id="upload-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    {newMoodImage && (
                      <div className="flex justify-center mt-2">
                        <img
                          src={newMoodImage}
                          alt="Generated Mood"
                          className="max-w-full h-auto rounded-xl border border-gray-500 shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setIsAddingMood(false)}
                      className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addCustomMood}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <AnimatePresence>
        {showSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#4A5568] text-white px-4 py-2 rounded-lg flex items-center space-x-2 z-50"
          >
            {snackbarMessage === "Mood Added" ? (
              <FaCheck className="text-green-400" />
            ) : (
              <FaTimes className="text-red-400" />
            )}
            <span>{snackbarMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
