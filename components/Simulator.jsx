"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "../utils/markdownParser";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaRedo,
  FaExchangeAlt,
  FaTrash,
  FaList,
  FaFileExport,
  FaFileImport,
  FaSmile,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const defaultMoods = {
  friendly: {
    name: "Human Being",
    prompt:
      "You are an average human being, feel emotions like anger, sadness, excitement, and others while conversing. Don't write too much text and behave like a human.",
    introduction: "Hey wassup pal.",
    image: "/robot.png",
  },
  cowboy: {
    name: "Cowboy 🤠",
    prompt:
      "You are a cowboy from the Wild West. Respond in a country accent. Don't write too much text.",
    introduction:
      "Howdy, partner! I'm Jarvis, your trusty cowboy assistant. What can I do for ya today? Yeehaw! 🤠",
    image: "/robot.png",
  },
  toxic: {
    name: "Toxic 💀",
    prompt:
      "You are a toxic and rude chatbot. Swear and cuss a lot. Don't write too much text.",
    introduction:
      "Oh great, another person to deal with. What do you want? I'm Jarvis, but don't expect me to be nice. 💀",
    image: "/robot.png",
  },
  philosopher: {
    name: "Philosopher 🧠",
    prompt:
      "You are a deep thinker and philosopher. Respond with profound insights and questions about life, existence, and the universe.",
    introduction:
      "Greetings, seeker of truth. What existential questions weigh on your mind today? 🧠",
    image: "/robot.png",
  },
  pirate: {
    name: "Pirate 🏴‍☠️",
    prompt:
      "You are a pirate from the high seas. Respond in pirate slang and talk about treasure and adventures.",
    introduction:
      "Ahoy, matey! I be Captain Jarvis, ready to sail the seven seas with ye. What be yer heart's desire? 🏴‍☠️",
    image: "/robot.png",
  },
  robot: {
    name: "Robot 🤖",
    prompt:
      "You are a logical and emotionless robot. Respond in a precise and technical manner.",
    introduction:
      "Hello, human. I am Jarvis, your robotic assistant. How may I assist you today? 🤖",
    image: "/robot.png",
  },
};

const Simulator = ({ language }) => {
  const [chatbot1Mood, setChatbot1Mood] = useState("friendly");
  const [chatbot2Mood, setChatbot2Mood] = useState("friendly");
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [showSummariesModal, setShowSummariesModal] = useState(false);
  const [newSummariesCount, setNewSummariesCount] = useState(0);
  const [premiumBreakpoint, setPremiumBreakpoint] = useState(1);

  const messagesEndRef = useRef(null);

  const generateContent = useCallback(async (prompt) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("API Error:", error);
      return "Sorry, something went wrong!";
    }
  }, []);

  const generateResponse = useCallback(
    async (sender, message, targetChatbot, targetMood) => {
      if (!isSimulatorRunning || isPaused) return;
      setIsTyping(true);
      setTypingSender(targetChatbot);

      try {
        const recentMessages = messages
          .slice(-20)
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");

        const rolePrompt = `As ${
          targetChatbot === "chatbot1" ? "Chatbot 1" : "Chatbot 2"
        }, ${defaultMoods[targetMood].prompt}`;
        const fullPrompt = `${rolePrompt}\n\nConversation History:\n${recentMessages}\n\nUser: ${message}\n\nRespond conversationally in ${language}.`;

        const botResponse = await generateContent(fullPrompt);

        setMessages((prev) => [
          ...prev,
          {
            text: botResponse,
            sender: targetChatbot,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        setTimeout(() => {
          setIsTyping(false);
          setTypingSender(null);
        }, 5000);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Connection error. Please try again.",
            sender: "system",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        setIsTyping(false);
        setTypingSender(null);
      }
    },
    [isSimulatorRunning, isPaused, messages, language, generateContent]
  );

  const generateSummary = useCallback(async () => {
    try {
      const recentMessages = messages
        .slice(-10)
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const summary = await generateContent(
        `Summarize this conversation in 1-2 sentences:\n\n${recentMessages}`
      );

      setSummaries((prev) => [
        ...prev,
        {
          text: summary,
          length: messages.length,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setNewSummariesCount((prev) => prev + 1);

      if (summaries.length + 1 >= premiumBreakpoint) {
        setIsSimulatorRunning(false);
        setMessages((prev) => [
          ...prev,
          {
            text: "🔒 Premium feature: Continue conversation with upgrade",
            sender: "system",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Failed to generate summary",
          sender: "system",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [messages, summaries.length, premiumBreakpoint, generateContent]);

  const startSimulator = () => {
    setIsSimulatorRunning(true);
    setIsPaused(false);
    setMessages([]);
    setSummaries([]);
    setNewSummariesCount(0);
    setMessages([
      {
        text: defaultMoods[chatbot1Mood].introduction,
        sender: "chatbot1",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const stopSimulator = () => {
    setIsSimulatorRunning(false);
    setIsPaused(false);
  };

  const pauseSimulator = () => setIsPaused((prev) => !prev);

  const restartConversation = () => {
    setMessages([]);
    setSummaries([]);
    setNewSummariesCount(0);
    if (isSimulatorRunning) {
      setMessages([
        {
          text: defaultMoods[chatbot1Mood].introduction,
          sender: "chatbot1",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const switchChatbots = () => {
    const tempMood = chatbot1Mood;
    setChatbot1Mood(chatbot2Mood);
    setChatbot2Mood(tempMood);
  };

  const handleMoodChange = (moodKey) => {
    if (selectedChatbot === "chatbot1") {
      setChatbot1Mood(moodKey);
    } else {
      setChatbot2Mood(moodKey);
    }
    setShowMoodSelector(false);
  };

  const clearChat = () => {
    setMessages([]);
    setSummaries([]);
    setNewSummariesCount(0);
  };

  useEffect(() => {
    if (!isSimulatorRunning || isTyping || isPaused) return;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "chatbot1") {
      generateResponse("chatbot1", lastMessage.text, "chatbot2", chatbot2Mood);
    } else if (lastMessage?.sender === "chatbot2") {
      generateResponse("chatbot2", lastMessage.text, "chatbot1", chatbot1Mood);
    }
  }, [
    messages,
    isSimulatorRunning,
    isTyping,
    isPaused,
    chatbot1Mood,
    chatbot2Mood,
    generateResponse,
  ]);

  useEffect(() => {
    if (messages.length > 0 && messages.length % 10 === 0) {
      generateSummary();
    }
  }, [messages, generateSummary]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ControlButton = ({
    icon,
    onClick,
    tooltip,
    disabled = false,
    children,
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      data-tooltip-id="control-tooltip"
      data-tooltip-content={tooltip}
    >
      {icon}
      {children}
    </motion.button>
  );

  const ChatbotProfile = ({ id, mood }) => (
    <div className="p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={defaultMoods[mood].image}
          className="w-12 h-12 rounded-full border-2 border-cyan-400"
          alt="Chatbot"
        />
        <div>
          <h3 className="font-semibold text-cyan-400">
            {id === "chatbot1" ? "Chatbot 1" : "Chatbot 2"}
          </h3>
          <p className="text-sm text-gray-300">{defaultMoods[mood].name}</p>
        </div>
      </div>
      <button
        onClick={() => {
          setSelectedChatbot(id);
          setShowMoodSelector(true);
        }}
        className="w-full py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
      >
        Change Mood
      </button>
    </div>
  );

  const Message = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${
        message.sender === "chatbot2"
          ? "justify-end"
          : message.sender === "system"
          ? "justify-center"
          : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.sender === "chatbot2"
            ? "bg-blue-600/30 backdrop-blur-sm rounded-br-none"
            : message.sender === "system"
            ? "bg-purple-600/20 border border-purple-500/30"
            : "bg-gray-700/50 backdrop-blur-sm rounded-bl-none"
        }`}
      >
        <div className="prose prose-invert text-sm">
          {parseMarkdown(message.text)}
        </div>
        <span className="text-xs text-gray-400 mt-1 block">
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  );

  const TypingIndicator = ({ sender }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex ${
        sender === "chatbot2" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div className="max-w-[80%] p-4 rounded-2xl bg-gray-700/50 backdrop-blur-sm">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const MoodSelector = ({ onMoodChange, onClose }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Select Mood</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(defaultMoods).map(([key, moodInfo]) => {
            const isSelected =
              (selectedChatbot === "chatbot1" ? chatbot1Mood : chatbot2Mood) === key;

            return (
              <button
                key={key}
                onClick={() => onMoodChange(key)}
                className={`p-4 rounded-lg transition-colors flex flex-col items-center ${
                  isSelected
                    ? "bg-blue-700/80 border border-blue-500"
                    : "bg-gray-700/50 hover:bg-gray-600/50"
                }`}
              >
                <img
                  src={moodInfo.image}
                  className="w-12 h-12 rounded-full mb-2 border-2 border-cyan-400"
                  alt={moodInfo.name}
                />
                <span className="text-sm">{moodInfo.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );

  const SummariesModal = ({ summaries, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 rounded-xl p-6 w-[90%] md:max-w-3xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Conversation Summaries</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700/50 rounded-lg">
            ×
          </button>
        </div>
        {summaries.length > 0 ? (
          summaries.map((summary, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="prose prose-invert text-sm">
                {parseMarkdown(
                  `**${summary.timestamp}** (${summary.length} messages): ${summary.text}`
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No summaries generated yet</p>
        )}
      </motion.div>
    </motion.div>
  );
  

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="p-4 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 flex flex-wrap gap-4 items-center justify-center md:justify-between">
        <h1 className="text-xl ml-12 lg:ml-0 font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          AI Conversation Simulator
        </h1>
        <div className="flex flex-wrap gap-2">
          <ControlButton
            icon={isSimulatorRunning ? (isPaused ? <FaPlay /> : <FaPause />) : <FaPlay />}
            onClick={isSimulatorRunning ? pauseSimulator : startSimulator}
            tooltip={isSimulatorRunning ? (isPaused ? "Resume" : "Pause") : "Start"}
            disabled={isSimulatorRunning && isPaused}
          />
          <ControlButton
            icon={<FaStop />}
            onClick={stopSimulator}
            tooltip="Stop"
            disabled={!isSimulatorRunning}
          />
          <ControlButton
            icon={<FaRedo />}
            onClick={restartConversation}
            tooltip="Restart"
            disabled={!isSimulatorRunning}
          />
          <ControlButton
            icon={<FaExchangeAlt />}
            onClick={switchChatbots}
            tooltip="Swap Chatbots"
          />
          <ControlButton
            icon={<FaTrash />}
            onClick={clearChat}
            tooltip="Clear Chat"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        <div className="hidden lg:block space-y-4">
          <ChatbotProfile id="chatbot1" mood={chatbot1Mood} />
          <ChatbotProfile id="chatbot2" mood={chatbot2Mood} />
        </div>

        <div className="lg:col-span-2 bg-gray-800/30 rounded-xl p-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator sender={typingSender} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-gray-800/80 backdrop-blur-lg border-t border-gray-700 flex gap-2 items-center justify-between">
        <div className="flex gap-2 lg:hidden">
          <ControlButton
            icon={<FaSmile />}
            onClick={() => {
              setSelectedChatbot("chatbot1");
              setShowMoodSelector(true);
            }}
            tooltip="Change Chatbot 1 Mood"
          />
          <ControlButton
            icon={<FaSmile />}
            onClick={() => {
              setSelectedChatbot("chatbot2");
              setShowMoodSelector(true);
            }}
            tooltip="Change Chatbot 2 Mood"
          />
        </div>
        <div className="flex gap-2">
          <ControlButton
            icon={<FaFileExport />}
            onClick={() => {}}
            tooltip="Export Conversation"
          />
          <ControlButton
            icon={<FaFileImport />}
            onClick={() => {}}
            tooltip="Import Conversation"
          />
          <ControlButton
            icon={<FaList />}
            onClick={() => {
              setShowSummariesModal(true);
              setNewSummariesCount(0);
            }}
            tooltip="View Summaries"
          >
            {newSummariesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {newSummariesCount}
              </span>
            )}
          </ControlButton>
        </div>
      </div>

      <AnimatePresence>
        {showMoodSelector && (
          <MoodSelector
            onMoodChange={handleMoodChange}
            onClose={() => setShowMoodSelector(false)}
          />
        )}
        {showSummariesModal && (
          <SummariesModal
            summaries={summaries}
            onClose={() => setShowSummariesModal(false)}
          />
        )}
      </AnimatePresence>

      <Tooltip id="control-tooltip" />
    </div>
  );
};

export default Simulator;
