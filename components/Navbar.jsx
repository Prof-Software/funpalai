"use client";
import { useState, useEffect } from "react";
import { FaGoogle, FaSpinner, FaTimes, FaSignOutAlt, FaBars } from "react-icons/fa"; // Added FaBars for the menu icon
import { auth, provider, signInWithPopup, signOut } from "../firebase"; // Firebase setup
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion for animations
import Image from "next/image"; // For displaying profile pictures
import { v4 as uuidv4 } from "uuid"; // For generating random usernames

const Sidebar = ({ onLanguageChange, onTabChange }) => {
  const [language, setLanguage] = useState("en"); // Default language
  const [activeTab, setActiveTab] = useState("chatbot"); // Default tab
  const [user, setUser] = useState(null); // Track user state
  const [loading, setLoading] = useState(true); // Track loading state
  const [onboarding, setOnboarding] = useState(false); // Track onboarding state
  const [username, setUsername] = useState(""); // Username input
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture input
  const [editProfile, setEditProfile] = useState(false); // Track edit profile state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Track mobile menu state

  // Save user data to localStorage
  const saveUserToLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Load user data from localStorage
  const loadUserFromLocalStorage = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  // Clear user data from localStorage
  const clearUserFromLocalStorage = () => {
    localStorage.removeItem("user");
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      saveUserToLocalStorage(user); // Save user data to localStorage
      setOnboarding(true); // Start onboarding after sign-in
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Clear user state
      clearUserFromLocalStorage(); // Clear user data from localStorage
      setEditProfile(false); // Close the edit modal
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Generate a random username
  const generateRandomUsername = () => {
    return `user_${uuidv4().split("-")[0]}`; // Generate a random username
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    if (username.trim() === "") {
      setUsername(generateRandomUsername()); // Generate a random username if none is provided
    }

    // Update user profile in Firebase (you can use Firestore or Realtime Database)
    // For now, we'll just update the local state
    const updatedUser = {
      ...user,
      displayName: username,
      photoURL: profilePicture ? URL.createObjectURL(profilePicture) : user.photoURL,
    };
    setUser(updatedUser);
    saveUserToLocalStorage(updatedUser); // Save updated user data to localStorage

    setOnboarding(false); // End onboarding
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setEditProfile(true);
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    if (username.trim() === "") {
      alert("Username is required.");
      return;
    }

    // Update user profile in Firebase (you can use Firestore or Realtime Database)
    // For now, we'll just update the local state
    const updatedUser = {
      ...user,
      displayName: username,
      photoURL: profilePicture ? URL.createObjectURL(profilePicture) : user.photoURL,
    };
    setUser(updatedUser);
    saveUserToLocalStorage(updatedUser); // Save updated user data to localStorage

    setEditProfile(false); // Close edit profile modal
  };

  // Close modal
  const closeModal = () => {
    setOnboarding(false);
    setEditProfile(false);
  };

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setActiveTab(tab);
    setIsMobileMenuOpen(!isMobileMenuOpen)// Close mobile menu after selecting a tab
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        saveUserToLocalStorage(user); // Save user data to localStorage
        if (!user.displayName || !user.photoURL) {
          setOnboarding(true); // Start onboarding if profile is incomplete
        }
      } else {
        setUser(null);
        clearUserFromLocalStorage(); // Clear user data from localStorage
      }
      setLoading(false); // Set loading to false after auth state is determined
    });

    // Load user data from localStorage on initial render
    const cachedUser = loadUserFromLocalStorage();
    if (cachedUser) {
      setUser(cachedUser);
    }

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 p-2 text-gray-200 rounded-lg z-50 lg:hidden"
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
  className={`h-screen w-screen lg:w-64 p-6 border-r-2 border-[#ffffff20] flex flex-col space-y-6 bg-black lg:bg-[#00000063] fixed lg:relative transform transition-transform duration-300 ${
    isMobileMenuOpen && window.innerWidth <= 1024 ? "translate-x-[-100vh] z-10" : "md:-translate-x-[0%] translate-x-0 z-10"
  }`}
>

        {/* Branding or Logo */}
        <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-right lg:text-left`}>
          Funpal AI
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col space-y-6">
            {/* Chatbot Tab */}
            <div
              onClick={() => handleTabChange("chatbot")}
              className={`p-3 ${
                activeTab === "chatbot" ? "bg-[#ffffff10]" : "bg-[#00000065]"
              } text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Chatbot</span>
              </div>
            </div>

            {/* Mood Ratings Tab */}
            <div
              onClick={() => handleTabChange("simulator")}
              className={`p-3 ${
                activeTab === "simulator" ? "bg-[#ffffff10]" : "bg-[#00000065]"
              } text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Simulator</span>
              </div>
            </div>

            {/* Custom Moods Tab */}
            <div
              onClick={() => handleTabChange("customMoods")}
              className={`p-3 ${
                activeTab === "customMoods" ? "bg-[#ffffff10]" : "bg-[#00000065]"
              } text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Custom Moods</span>
              </div>
            </div>

            {/* Community Tab */}
            <div
              onClick={() => handleTabChange("community")}
              className={`p-3 ${
                activeTab === "community" ? "bg-[#ffffff10]" : "bg-[#00000065]"
              } text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Community</span>
              </div>
            </div>
            <div
              onClick={() => handleTabChange("settings")}
              className={`p-3 ${
                activeTab === "settings" ? "bg-[#ffffff10]" : "bg-[#00000065]"
              } text-gray-200 rounded-lg hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Settings</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {/* Language Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  onLanguageChange(e.target.value); // Notify parent component of language change
                }}
                className="w-full p-3 bg-[#00000065] border outline-none border-gray-600 md:border-none cursor-pointer text-gray-200 rounded-lg focus:outline-none transition-colors appearance-none pr-10"
              >
                <option value="english" className="bg-black">
                  English
                </option>
                <option
                  value="hindi (write hindi in english letters)"
                  className="bg-black"
                >
                  Hindi
                </option>
                <option value="french" className="bg-black">
                  French
                </option>
                <option value="german" className="bg-black">
                  German
                </option>
                <option value="chinese" className="bg-black">
                  Chinese
                </option>
              </select>
            </div>

            {/* User Section */}
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin h-5 w-5 text-gray-400" />
              </div>
            ) : user ? (
              <div
                onClick={handleEditProfile}
                className="flex items-center space-x-3 cursor-pointer"
              >
                {/* Profile Picture */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL || "/default-profile.png"} // Fallback to default image
                    alt={user.displayName || "User"}
                  />
                </div>
                {/* Username */}
                <span className="text-sm text-gray-200">
                  {user.displayName || "User"}
                </span>
              </div>
            ) : (
              /* Sign In with Google Button */
              <button
                onClick={handleGoogleSignIn}
                className="w-full p-3 bg-gradient-to-r from-[#9233ea5f] to-[#ea33c95f] transition-all text-white rounded-lg flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <FaGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Onboarding Modal */}
        <AnimatePresence>
          {(onboarding || editProfile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 h-screen w-screen"
              onClick={closeModal} // Close modal when clicking outside
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-[#1e1b1b] rounded-lg p-6 max-w-md w-full shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
              >
                {/* Close Button (Cross) */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                  {onboarding ? "Complete Your Profile" : "Edit Profile"}
                </h2>
                {/* Username Input */}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full p-3 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                />
                {/* Profile Picture Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full p-3 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                />
                {/* Complete Button */}
                <button
                  onClick={onboarding ? handleOnboardingComplete : handleProfileUpdate}
                  className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-600 transition-colors mb-2"
                >
                  {onboarding ? "Complete" : "Update"}
                </button>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;