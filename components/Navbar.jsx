"use client";
import { useState, useEffect } from "react";
import {
  FaGoogle,
  FaSpinner,
  FaTimes,
  FaSignOutAlt,
  FaBars,
  FaUserShield,
} from "react-icons/fa";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const Sidebar = ({ onLanguageChange, onTabChange }) => {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("chatbot");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show or hide pricing modal
  const [showPricingModal, setShowPricingModal] = useState(false);

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

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userInfo = result.user;
      setUser(userInfo);
      saveUserToLocalStorage(userInfo);
      setOnboarding(true);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearUserFromLocalStorage();
      setEditProfile(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const generateRandomUsername = () => {
    return `user_${uuidv4().split("-")[0]}`;
  };

  const handleOnboardingComplete = () => {
    if (username.trim() === "") {
      setUsername(generateRandomUsername());
    }
    const updatedUser = {
      ...user,
      displayName: username,
      photoURL: profilePicture
        ? URL.createObjectURL(profilePicture)
        : user.photoURL,
    };
    setUser(updatedUser);
    saveUserToLocalStorage(updatedUser);
    setOnboarding(false);
  };

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleProfileUpdate = () => {
    if (username.trim() === "") {
      alert("Username is required.");
      return;
    }
    const updatedUser = {
      ...user,
      displayName: username,
      photoURL: profilePicture
        ? URL.createObjectURL(profilePicture)
        : user.photoURL,
    };
    setUser(updatedUser);
    saveUserToLocalStorage(updatedUser);
    setEditProfile(false);
  };

  const closeModal = () => {
    setOnboarding(false);
    setEditProfile(false);
  };

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        saveUserToLocalStorage(currentUser);
        if (!currentUser.displayName || !currentUser.photoURL) {
          setOnboarding(true);
        }
      } else {
        setUser(null);
        clearUserFromLocalStorage();
      }
      setLoading(false);
    });

    const cachedUser = loadUserFromLocalStorage();
    if (cachedUser) {
      setUser(cachedUser);
    }

    return () => unsubscribe();
  }, []);

  // Sidebar button for toggling mobile view
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 p-2 text-gray-200 rounded-lg z-50 lg:hidden"
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen w-screen lg:w-64 border-r-2 border-[#ffffff20] flex flex-col space-y-6 bg-black lg:bg-[#00000063] fixed lg:relative transform transition-transform duration-300 ${
          isMobileMenuOpen && window.innerWidth <= 1024
            ? "translate-x-[-100vh] z-10"
            : "md:-translate-x-[0%] translate-x-0 z-10"
        }`}
      >
        {/* Sidebar Header */}
        <div className="text-xl p-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-right lg:text-left">
          Funpal AI
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            {/* Tab: Chatbot */}
            <div
              onClick={() => handleTabChange("chatbot")}
              className={`p-3 ${
                activeTab === "chatbot" ? "bg-[#ffffff20]" : ""
              } text-gray-200 hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <span className="text-xs">Chatbot</span>
            </div>

            {/* Tab: Simulator */}
            <div
              onClick={() => handleTabChange("simulator")}
              className={`p-3 ${
                activeTab === "simulator" ? "bg-[#ffffff20]" : ""
              } text-gray-200 hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <span className="text-xs">Simulator</span>
            </div>

            {/* Tab: Custom Moods */}
            <div
              onClick={() => handleTabChange("customMoods")}
              className={`p-3 ${
                activeTab === "customMoods" ? "bg-[#ffffff20]" : ""
              } text-gray-200 hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <span className="text-xs">Custom Moods</span>
            </div>

            {/* Tab: Community */}
            <div
              onClick={() => handleTabChange("community")}
              className={`p-3 ${
                activeTab === "community" ? "bg-[#ffffff20]" : ""
              } text-gray-200 hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <span className="text-xs">Community</span>
            </div>

            {/* Tab: Settings */}
            <div
              onClick={() => handleTabChange("settings")}
              className={`p-3 ${
                activeTab === "settings" ? "bg-[#ffffff20]" : ""
              } text-gray-200 hover:bg-[#ffffff10] transition-colors cursor-pointer`}
            >
              <span className="text-xs">Settings</span>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="flex flex-col space-y-4 p-6">
            {/* Make a small QR or placeholder */}
            {/* <div className="text-white bg-[#00000010] flex items-center justify-center w-[120px] text-center text-xs p-3 rounded-md shadow-sm shadow-pink-500 flex-col gap-4">
              <img
                src="/qr-code.png"
                className="rounded-md w-[100px]"
                alt="Qr Code for app"
                draggable={false}
              />
            </div> */}

            {/* Language Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-gray-400">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  onLanguageChange(e.target.value);
                }}
                className="w-full p-3 px-4 font-[gambarino] bg-[#00000065] border outline-none border-gray-600 md:border-none cursor-pointer text-gray-200 rounded-lg focus:outline-none transition-colors appearance-none pr-10"
              >
                <option value="english" className="bg-black">
                  English
                </option>
                <option value="hindi (write hindi in english letters)" className="bg-black">
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
              <>
                <div
                  onClick={handleEditProfile}
                  className="flex items-center space-x-3 rounded-lg cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img
                      draggable={false}
                      referrerPolicy="no-referrer"
                      src={user.photoURL || "/default-profile.png"}
                      alt={user.displayName || "User"}
                    />
                  </div>
                  <span className="text-sm text-gray-200">
                    {user.displayName || "User"}
                  </span>
                </div>

                {/* Button to show Pricing Comparison Modal */}
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full p-[2px] bg-gradient-to-r text-sm from-pink-600 to-purple-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:to-purple-700 transition-all"
                >
                  <div className="bg-black w-full h-full rounded-md p-3 gap-3 flex items-center ">

                  <FaUserShield className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="w-full p-3 bg-gradient-to-r from-[#9233ea5f] to-[#ea33c95f] text-white rounded-lg flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <FaGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Onboarding/Edit Profile Modal */}
        <AnimatePresence>
          {(onboarding || editProfile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 h-screen w-screen"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-[#1e1b1b] rounded-lg p-6 max-w-md w-full shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                  {onboarding ? "Complete Your Profile" : "Edit Profile"}
                </h2>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full p-3 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full p-3 mb-4 bg-[#00000065] text-white rounded-lg focus:outline-none"
                />
                <button
                  onClick={onboarding ? handleOnboardingComplete : handleProfileUpdate}
                  className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-2"
                >
                  {onboarding ? "Complete" : "Update"}
                </button>
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

      {/* Pricing Comparison Modal */}
      <AnimatePresence>
        {showPricingModal && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPricingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1e1b1b] rounded-xl p-6 w-full max-w-3xl md:max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPricingModal(false)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4 text-center">
                Upgrade to Premium
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Plan */}
                <div className="bg-[#ffffff15] rounded-lg p-6 hover:bg-[#ffffff25] transition-colors flex flex-col items-center">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
                    Basic
                  </h3>
                  <p className="text-4xl font-extrabold text-gray-200 mb-4">
                    $0<span className="text-base text-gray-400">/mo</span>
                  </p>
                  <ul className="flex-1 text-sm text-gray-400 space-y-2">
                    <li>Limited Chatbot Access</li>
                    <li>Limited Image Generation</li>
                    <li>Community Forum</li>
                    <li>Standard Speeds</li>
                  </ul>
                  <button
                    disabled
                    className="mt-4 w-full p-2 rounded-lg text-gray-300 bg-black border border-gray-500 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-[#ffffff15] rounded-lg p-6 hover:bg-[#ffffff25] transition-colors flex flex-col items-center border border-pink-500">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">Pro</h3>
                  <p className="text-4xl font-extrabold text-gray-200 mb-4">
                    $9<span className="text-base text-gray-400">/mo</span>
                  </p>
                  <ul className="flex-1 text-sm text-gray-400 space-y-2">
                    <li>Unlimited Chatbot Usage</li>
                    <li>Image Upload & Analyze</li>
                    <li>Faster Speeds</li>
                    <li>Advanced Simulator</li>
                  </ul>
                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      alert("You've chosen the Pro plan!");
                    }}
                    className="mt-4 w-full p-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors text-white"
                  >
                    Upgrade Now
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-[#ffffff15] rounded-lg p-6 hover:bg-[#ffffff25] transition-colors flex flex-col items-center">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
                    Enterprise
                  </h3>
                  <p className="text-4xl font-extrabold text-gray-200 mb-4">
                    $200<span className="text-base text-gray-400">/mo</span>
                  </p>
                  <ul className="flex-1 text-sm text-gray-400 space-y-2">
                    <li>All Pro Features</li>
                    <li>Premium Support</li>
                    <li>Early Access to New Tools</li>
                    <li>API and Collaboration</li>
                  </ul>
                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      alert("You've chosen the Enterprise plan!");
                    }}
                    className="mt-4 w-full p-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors text-white"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
