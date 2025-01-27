"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "../utils/markdownParser"; // Import your markdown parser
import { FaPlay, FaPause, FaStop, FaRedo, FaExchangeAlt, FaTrash, FaList, FaFileExport, FaFileImport } from "react-icons/fa"; // Icons for buttons

// Default moods for the chatbots
const defaultMoods = {
  friendly: {
    name: "Human Being",
    prompt: "You are an average human being, feel emotions like anger, sadness, excitement, and others while conversing. Don't write too much text and behave like a human.",
    introduction: "Hey wassup pal.",
    image: "/robot.png", // Placeholder image URL
  },
  cowboy: {
    name: "Cowboy 🤠",
    prompt: 'You are a cowboy from the Wild West. Respond in a country accent. Don\'t write too much text.',
    introduction: "Howdy, partner! I'm Jarvis, your trusty cowboy assistant. What can I do for ya today? Yeehaw! 🤠",
    image: "/robot.png", // Placeholder image URL
  },
  toxic: {
    name: "Toxic 💀",
    prompt: "You are a toxic and rude chatbot. Swear and cuss a lot. Don't write too much text.",
    introduction: "Oh great, another person to deal with. What do you want? I'm Jarvis, but don't expect me to be nice. 💀",
    image: "/robot.png", // Placeholder image URL
  },
  philosopher: {
    name: "Philosopher 🧠",
    prompt: "You are a deep thinker and philosopher. Respond with profound insights and questions about life, existence, and the universe.",
    introduction: "Greetings, seeker of truth. What existential questions weigh on your mind today? 🧠",
    image: "/robot.png", // Placeholder image URL
  },
  pirate: {
    name: "Pirate 🏴‍☠️",
    prompt: "You are a pirate from the high seas. Respond in pirate slang and talk about treasure and adventures.",
    introduction: "Ahoy, matey! I be Captain Jarvis, ready to sail the seven seas with ye. What be yer heart's desire? 🏴‍☠️",
    image: "/robot.png", // Placeholder image URL
  },
  robot: {
    name: "Robot 🤖",
    prompt: "You are a logical and emotionless robot. Respond in a precise and technical manner.",
    introduction: "Hello, human. I am Jarvis, your robotic assistant. How may I assist you today? 🤖",
    image: "/robot.png", // Placeholder image URL
  },
};

const Simulator = ({ language }) => {
  const [chatbot1Mood, setChatbot1Mood] = useState("friendly"); // Mood for Chatbot 1
  const [chatbot2Mood, setChatbot2Mood] = useState("friendly"); // Mood for Chatbot 2
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false); // Simulator state
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [messages, setMessages] = useState([]); // Combined messages for both chatbots
  const [summaries, setSummaries] = useState([]); // Separate state for summaries
  const [isTyping, setIsTyping] = useState(false); // Typing indicator state
  const [typingSender, setTypingSender] = useState(null); // Who is currently typing
  const [showMoodSelector, setShowMoodSelector] = useState(false); // Mood selector visibility
  const [selectedChatbot, setSelectedChatbot] = useState(null); // Selected chatbot for mood change
  const [showSummariesModal, setShowSummariesModal] = useState(false); // Summaries modal visibility
  const [premiumBreakpoint, setPremiumBreakpoint] = useState(1); // Premium breakpoint (editable)
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  // Start the simulator
  const startSimulator = () => {
    setIsSimulatorRunning(true);
    setIsPaused(false); // Ensure the simulator is not paused
    setMessages([]); // Clear previous messages
    setSummaries([]); // Clear previous summaries
    // Trigger the first message from Chatbot 1
    setMessages([{ text: defaultMoods[chatbot1Mood].introduction, sender: "chatbot1" }]);
  };

  // Stop the simulator
  const stopSimulator = () => {
    setIsSimulatorRunning(false);
    setIsPaused(false); // Reset pause state
  };

  // Pause the simulator
  const pauseSimulator = () => {
    setIsPaused((prev) => !prev); // Toggle pause state
  };

  // Restart the conversation
  const restartConversation = () => {
    setMessages([]); // Clear chat history
    setSummaries([]); // Clear summaries
    if (isSimulatorRunning) {
      // Restart the conversation with the first message
      setMessages([{ text: defaultMoods[chatbot1Mood].introduction, sender: "chatbot1" }]);
    }
  };

  // Switch chatbot moods
  const switchChatbots = () => {
    const tempMood = chatbot1Mood;
    setChatbot1Mood(chatbot2Mood);
    setChatbot2Mood(tempMood);
  };

  // Handle mood change
  const handleMoodChange = (moodKey) => {
    if (selectedChatbot === "chatbot1") {
      setChatbot1Mood(moodKey);
    } else if (selectedChatbot === "chatbot2") {
      setChatbot2Mood(moodKey);
    }
    setShowMoodSelector(false);
  };

  // Generate a response from the target chatbot
  const generateResponse = async (sender, message, targetChatbot, targetMood) => {
    if (!isSimulatorRunning || isPaused) return; // Stop if the simulator is not running or paused

    setIsTyping(true); // Show typing indicator
    setTypingSender(targetChatbot); // Set who is typing

    try {
      // Include the last 10-20 messages as context
      const recentMessages = messages.slice(-20).map((msg) => `${msg.sender}: ${msg.text}`).join("\n");

      // Add role/name awareness to the prompt
      const roleAwarePrompt = `You are ${targetChatbot === "chatbot1" ? "Chatbot 1" : "Chatbot 2"}. ${defaultMoods[targetMood].prompt}\n\nConversation History:\n${recentMessages}\n\nUser: ${message}\n\nRespond in a conversational manner in ${language}.`;

      // Generate a response from the target chatbot
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: roleAwarePrompt,
                },
              ],
            },
          ],
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;

      // Add the response to the chat
      setMessages((prev) => [...prev, { text: botResponse, sender: targetChatbot }]);

      // Wait for 5 seconds before allowing the next message
      setTimeout(() => {
        setIsTyping(false); // Hide typing indicator
        setTypingSender(null); // Reset typing sender
      }, 5000); // Increased delay to 5 seconds
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong!", sender: targetChatbot },
      ]);
      setIsTyping(false); // Hide typing indicator
      setTypingSender(null); // Reset typing sender
    }
  };

  // Function to generate a summary of the last 10 messages
  const generateSummary = async () => {
    try {
      const recentMessages = messages.slice(-10).map((msg) => `${msg.sender}: ${msg.text}`).join("\n");

      const summaryPrompt = `Summarize the following conversation in 1-2 sentences:\n\n${recentMessages}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: summaryPrompt,
                },
              ],
            },
          ],
        }
      );

      const summary = response.data.candidates[0].content.parts[0].text;

      // Add the summary to the summaries state
      setSummaries((prev) => [...prev, summary]);

      // Check if the number of summaries has reached the premium breakpoint
      if (summaries.length + 1 >= premiumBreakpoint) {
        setIsSimulatorRunning(false); // Stop the simulator
        setMessages((prev) => [
          ...prev,
          { text: "Please upgrade to premium to continue further conversations.", sender: "system" },
        ]);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  // UseEffect to trigger responses when a new message is added
  useEffect(() => {
    if (!isSimulatorRunning || isTyping || isPaused) return; // Stop if the simulator is not running, a chatbot is typing, or the simulator is paused

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Check if Chatbot 1 has a new message
    if (lastMessage.sender === "chatbot1") {
      generateResponse("chatbot1", lastMessage.text, "chatbot2", chatbot2Mood);
    }

    // Check if Chatbot 2 has a new message
    if (lastMessage.sender === "chatbot2") {
      generateResponse("chatbot2", lastMessage.text, "chatbot1", chatbot1Mood);
    }
  }, [messages, isSimulatorRunning, isTyping, isPaused]);

  // UseEffect to generate summary every 10 messages
  useEffect(() => {
    if (messages.length > 0 && messages.length % 10 === 0) {
      generateSummary();
    }
  }, [messages]);

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setSummaries([]); // Clear summaries
  };

  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen text-white">
      {/* Simulator Controls (Top) */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Chatbot Simulator
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearChat}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <FaTrash className="w-5 h-5" />
          </button>
          <button
            onClick={startSimulator}
            disabled={isSimulatorRunning}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center disabled:opacity-50"
          >
            <FaPlay className="w-5 h-5" />
          </button>
          <button
            onClick={pauseSimulator}
            disabled={!isSimulatorRunning}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            {isPaused ? <FaPlay className="w-5 h-5" /> : <FaPause className="w-5 h-5" />}
          </button>
          <button
            onClick={stopSimulator}
            disabled={!isSimulatorRunning}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center disabled:opacity-50"
          >
            <FaStop className="w-5 h-5" />
          </button>
          <button
            onClick={restartConversation}
            disabled={!isSimulatorRunning}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <FaRedo className="w-5 h-5" />
          </button>
          <button
            onClick={switchChatbots}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <FaExchangeAlt className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
     {/* Chat Messages */}
<div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
  <AnimatePresence>
    {messages.map((msg, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex ${
          msg.sender === "chatbot2"
            ? "justify-end"
            : msg.sender === "system"
            ? "justify-center"
            : "justify-start"
        } mb-3`}
      >
        <motion.div
          className={`max-w-[70%] p-3 rounded-lg ${
            msg.sender === "chatbot2"
              ? "bg-[#ffffff39] text-white rounded-br-none"
              : msg.sender === "system"
              ? "bg-[#213d6d] text-white rounded-lg text-center flex flex-col" // Different background for system messages
              : "bg-[#00000070] text-white rounded-bl-none"
          }`}
        >
          <div className="prose text-sm md:text-base">
            {parseMarkdown(msg.text)}
            {msg.sender === "system" &&
            <span className="text-xs text-gray-300">System</span>
            
            }
          </div>
        </motion.div>
      </motion.div>
    ))}
  </AnimatePresence>

  {/* Typing Indicator */}
  {isTyping && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex ${typingSender === "chatbot2" ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          typingSender === "chatbot2"
            ? "bg-[#ffffff39] text-white rounded-br-none"
            : "bg-[#00000070] text-white rounded-bl-none"
        }`}
      >
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>
    </motion.div>
  )}

  <div ref={messagesEndRef} />
</div>

      {/* Simulator Controls (Bottom) */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setSelectedChatbot("chatbot1");
              setShowMoodSelector(!showMoodSelector);
            }}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <span>Chatbot 1: {defaultMoods[chatbot1Mood].name}</span>
          </button>
          <button
            onClick={() => {
              setSelectedChatbot("chatbot2");
              setShowMoodSelector(!showMoodSelector);
            }}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <span>Chatbot 2: {defaultMoods[chatbot2Mood].name}</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {/* Export Conversation Button */}
          <button
            onClick={() => {
              // TODO: Implement export functionality
            }}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <FaFileExport className="w-5 h-5" />
          </button>

          {/* Import Conversation Button */}
          <button
            onClick={() => {
              // TODO: Implement import functionality
            }}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center"
          >
            <FaFileImport className="w-5 h-5" />
          </button>

          {/* Summaries Button with Notification Badge */}
          <button
            onClick={() => setShowSummariesModal(true)}
            className="p-2 bg-[#ffffff15] rounded-lg text-white flex items-center justify-center relative"
          >
            <FaList className="w-5 h-5" />
            {summaries.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {summaries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Summaries Modal */}
      <AnimatePresence>
        {showSummariesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSummariesModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e1b1b] rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Conversation Summaries</h2>
              {summaries.length > 0 ? (
                summaries.map((summary, index) => (
                  <div key={index} className="mb-4">
                    <div className="prose text-sm md:text-base">
                      {parseMarkdown(`**Summary ${index + 1}:** ${summary}`)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No summaries yet.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Selector */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-4 bg-[#000000] rounded-lg p-2 shadow-lg z-50"
          >
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(defaultMoods).map(([key, mood]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-[#ffffff15] rounded-lg flex flex-col items-center space-y-1 cursor-pointer hover:bg-[#ffffff25] transition-colors"
                  onClick={() => handleMoodChange(key)}
                >
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="text-xs text-gray-200 text-center">
                    {mood.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Simulator;