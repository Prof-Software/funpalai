"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { db } from "../firebase"; // Import Firebase configuration
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Custom = () => {
  const [customMoods, setCustomMoods] = useState([]); // Custom moods created by the user
  const [otherUsersMoods, setOtherUsersMoods] = useState([]); // Moods created by other users
  const [newMoodName, setNewMoodName] = useState("");
  const [newMoodPrompt, setNewMoodPrompt] = useState("");
  const [newMoodImage, setNewMoodImage] = useState("");
  const [newMoodDescription, setNewMoodDescription] = useState("");
  const [newMoodIntroduction, setNewMoodIntroduction] = useState(""); // New introduction field
  const [isAddingMood, setIsAddingMood] = useState(false);
  const [creatorName, setCreatorName] = useState(""); // Creator's name (fetched from localStorage)
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar visibility

  // Fetch the user's displayName from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.displayName) {
      setCreatorName(userData.displayName);
    }
  }, []);

  // Fetch real-time data from Firestore
  useEffect(() => {
    const moodsCollection = collection(db, "moods");
  
    // Listen for changes in the moods collection
    const unsubscribe = onSnapshot(moodsCollection, (snapshot) => {
      const moods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Filter out "Kyromaniac" from all moods
      const filteredMoods = moods.filter((mood) => mood.name !== "Kyromaniac");
  
      // Separate moods created by the current user and other users
      const userMoods = filteredMoods.filter((mood) => mood.username === creatorName);
      const otherMoods = filteredMoods.filter((mood) => mood.username !== creatorName);
  
      setCustomMoods(userMoods);
      setOtherUsersMoods(otherMoods);
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [creatorName]);
  

  // Add a new custom mood to Firestore
  const addCustomMood = async () => {
    if (
      newMoodName.trim() === "" ||
      newMoodPrompt.trim() === "" ||
      newMoodImage.trim() === "" ||
      newMoodDescription.trim() === "" ||
      newMoodIntroduction.trim() === "" // Ensure introduction is filled
    ) {
      alert("Please fill out all fields before adding a mood.");
      return;
    }

    const newMood = {
      name: newMoodName,
      prompt: newMoodPrompt,
      image: newMoodImage,
      username: creatorName, // Use the creator's name
      description: newMoodDescription,
      introduction: newMoodIntroduction, // Add introduction
      likes: 0,
      isLiked: false,
      bgColor: "bg-purple-500",
    };

    try {
      const docRef = await addDoc(collection(db, "moods"), newMood);
      console.log("Mood added with ID: ", docRef.id);
      setNewMoodName("");
      setNewMoodPrompt("");
      setNewMoodImage("");
      setNewMoodDescription("");
      setNewMoodIntroduction("");
      setIsAddingMood(false);
    } catch (error) {
      console.error("Error adding mood: ", error);
    }
  };

  // Delete a custom mood from Firestore
  const deleteCustomMood = async (id) => {
    try {
      await deleteDoc(doc(db, "moods", id));
      console.log("Mood deleted with ID: ", id);
    } catch (error) {
      console.error("Error deleting mood: ", error);
    }
  };

  // Toggle like for a mood (update in Firestore)
  const toggleLike = async (id, isLiked, likes) => {
    try {
      const moodRef = doc(db, "moods", id);
      await updateDoc(moodRef, {
        isLiked: !isLiked,
        likes: isLiked ? likes - 1 : likes + 1,
      });
    } catch (error) {
      console.error("Error toggling like: ", error);
    }
  };

  // Add or remove a mood from localStorage
  const toggleMoodInLocalStorage = (mood) => {
    const storedMoods = JSON.parse(localStorage.getItem("moods")) || [];
    const moodExists = storedMoods.some(
      (storedMood) => storedMood.id === mood.id
    );

    if (moodExists) {
      // Remove mood from localStorage
      const updatedMoods = storedMoods.filter(
        (storedMood) => storedMood.id !== mood.id
      );
      localStorage.setItem("moods", JSON.stringify(updatedMoods));
      setSnackbarMessage("Mood Removed");
    } else {
      // Add mood to localStorage
      storedMoods.push(mood);
      localStorage.setItem("moods", JSON.stringify(storedMoods));
      setSnackbarMessage("Mood Added");
    }

    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
  };

  // Check if a mood is already added to localStorage
  const isMoodAdded = (mood) => {
    const storedMoods = JSON.parse(localStorage.getItem("moods")) || [];
    return storedMoods.some((storedMood) => storedMood.id === mood.id);
  };

  return (
    <div className="flex-1 h-screen flex flex-col">
      {/* Custom Moods Header */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
        <div className=" w-[30px] block lg:hidden" />
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🎨
          </div>
          <div>
            <h2 className="md:text-xl text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Custom Moods
            </h2>
            <p className="text-sm text-gray-400 md:block hidden">
              Create and manage your custom moods
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingMood(true)}
          className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-xl text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-105"
        >
          <FaPlus/>
        </button>
      </div>

      {/* Custom Moods List */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Your Moods Section */}
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          Your Moods
        </h3>
        <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 mb-4 bg-[#ffffff15] rounded-lg flex items-center cursor-pointer hover:bg-[#ffffff25] transition-colors flex-col md:flex-col  md:text-justify"
              >
                <img
                  src={"/admin.png"}
                  alt={"admin"}
                  className="w-16 h-16 rounded-full object-cover sm:w-14 sm:h-14"
                />
                <div className="flex items-center w-full justify-center flex-col gap-1">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Kyromaniac
                  </h3>
                  <p className="text-sm text-gray-300">
                    The Majestic Presence
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-3 text-center">
                    Step into the presence of The Majestic Kars, a being of unmatched intellect, elegance, and refinement.
                  </p>
                </div>
                </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {customMoods.map((mood) => {
            const isKyromaniac = mood.name === "Kyromaniac"; // Check if the mood is "Kyromaniac"

            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 mb-4 bg-[#ffffff15] rounded-lg flex items-center cursor-pointer hover:bg-[#ffffff25] transition-colors flex-col md:flex-col  md:text-justify"
              >
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-16 h-16 rounded-full object-cover sm:w-14 sm:h-14"
                />
                <div className="flex items-center w-full justify-center flex-col gap-1">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {/* Display custom text for "Kyromaniac" */}
                    {isKyromaniac
                      ? "The Majestic Presence"
                      : `by @${mood.username}`}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-3 text-center">
                    {mood.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-1 sm:mt-2">
                  {/* Removed Like button */}
                </div>
                {!isKyromaniac && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomMood(mood.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors sm:w-full sm:mt-2"
                  >
                    Delete
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Moods by Other Users Section */}
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mt-6 mb-4">
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
              } p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-[#00000070] transition-colors`}
              onClick={() => toggleMoodInLocalStorage(mood)} // Toggle mood in localStorage on click
            >
              <div className="w-full flex items-center justify-center flex-col text-center">
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-16 h-16 rounded-full object-cover sm:w-14 sm:h-14"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-400">by @{mood.username}</p>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {mood.description}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center space-x-2 sm:space-x-1 sm:mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(mood.id, mood.isLiked, mood.likes);
          }}
          className={`p-2 ${
            mood.isLiked ? "text-pink-500" : "text-gray-400"
          } hover:text-pink-600 transition-colors`}
        >
          <FaHeart className="h-5 w-5 sm:h-4 sm:w-4" />
        </button>
        <span className="text-sm text-gray-400">{mood.likes}</span>
      </div> */}
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
              <input
                type="text"
                value={newMoodImage}
                onChange={(e) => setNewMoodImage(e.target.value)}
                placeholder="Image URL"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
              />
              <textarea
                value={newMoodDescription}
                onChange={(e) => setNewMoodDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                rows={3}
              />
              <textarea
                value={newMoodPrompt}
                onChange={(e) => setNewMoodPrompt(e.target.value)}
                placeholder="Mood Prompt"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                rows={4}
              />
              <textarea
                value={newMoodIntroduction}
                onChange={(e) => setNewMoodIntroduction(e.target.value)}
                placeholder="Introduction"
                className="w-full p-2 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                rows={2}
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

      {/* Snackbar */}
      <AnimatePresence>
        {showSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#4A5568] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
};

export default Custom;
