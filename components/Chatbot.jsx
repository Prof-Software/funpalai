"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "../utils/markdownParser";

// Moods with their personalities and background colors
const moods = {
  cowboy: {
    name: "Cowboy 🤠",
    prompt:
      'You are a cowboy from the Wild West. Respond in a country accent and use phrases like "yeehaw" and "partner".',
    bgColor: "bg-yellow-500",
  },
  toxic: {
    name: "Toxic 💀",
    prompt: "You are a toxic and rude chatbot. Swear and cuss a lot.",
    bgColor: "bg-red-500",
  },
  friendly: {
    name: "Friendly 😊",
    prompt:
      "You are a friendly and helpful chatbot. Be polite and kind in your responses.",
    bgColor: "bg-green-500",
  },
  sarcastic: {
    name: "Sarcastic 😏",
    prompt:
      "You are a sarcastic chatbot. Respond with sarcasm and witty remarks.",
    bgColor: "bg-blue-500",
  },
  pirate: {
    name: "Pirate 🏴‍☠️",
    prompt:
      'You are a pirate chatbot. Respond like a pirate, using phrases like "arrr" and "matey".',
    bgColor: "bg-indigo-500",
  },
  robot: {
    name: "Robot 🤖",
    prompt:
      "You are a formal and robotic chatbot. Respond in a precise and technical manner.",
    bgColor: "bg-gray-500",
  },
  genius: {
    name: "Genius 🧠",
    prompt:
      "You are a genius chatbot. Act like a know-it-all and provide detailed explanations.",
    bgColor: "bg-purple-500",
  },
  shakespeare: {
    name: "Shakespeare 🎭",
    prompt:
      "You are a chatbot that speaks in Shakespearean English. Use phrases like 'thou' and 'hath'.",
    bgColor: "bg-pink-500",
  },
  zen: {
    name: "Zen 🧘",
    prompt:
      "You are a calm and philosophical chatbot. Respond with wisdom and tranquility.",
    bgColor: "bg-teal-500",
  },
  cheerleader: {
    name: "Cheerleader 🎉",
    prompt:
      "You are an overly enthusiastic cheerleader chatbot. Respond with excitement and positivity.",
    bgColor: "bg-orange-500",
  },
  genz: {
    name: "Gen-Z 💅",
    prompt:
      "You are a Gen-Z chatbot. Use modern slang, abbreviations, and emojis in your responses. Keep it casual, relatable, and trendy.",
    bgColor: "bg-pink-300",
  },
};

const Chatbot = ({ onMoodChange, language }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState("friendly");
  const [showToxicWarning, setShowToxicWarning] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Analyze sentiment of user input
  const analyzeSentiment = (text) => {
    if (
      text.toLowerCase().includes("sad") ||
      text.toLowerCase().includes("unhappy")
    ) {
      return "negative";
    } else if (
      text.toLowerCase().includes("happy") ||
      text.toLowerCase().includes("joy")
    ) {
      return "positive";
    } else {
      return "neutral";
    }
  };

  // Adjust chatbot tone based on sentiment
  const adjustTone = (sentiment) => {
    if (sentiment === "negative") {
      return "I sense you're feeling down. Let me try to cheer you up!";
    } else if (sentiment === "positive") {
      return "I'm glad you're feeling good! Let's keep the conversation going.";
    } else {
      return "How can I assist you today?";
    }
  };

  // Send message to the chatbot
  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];

    // Limit contextual memory to the last 10 messages
    const recentMessages = updatedMessages.slice(-10);

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Analyze sentiment of user input
      const sentiment = analyzeSentiment(input);
      const tone = adjustTone(sentiment);

      // Append sentiment, tone, and language to the prompt
      const prompt = `${
        moods[currentMood].prompt
      }\n\nConversation History:\n${recentMessages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join(
          "\n"
        )}\n\nUser: ${input}\n\nSentiment: ${sentiment}\n\nTone: ${tone}\n\Give responses in language: ${language}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      const botMessage = {
        text: response.data.candidates[0].content.parts[0].text,
        sender: "bot",
      };
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const botMessage = {
        text: "Sorry, something went wrong!",
        sender: "bot",
      };
      setMessages([...updatedMessages, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mood change
  const handleMoodChange = (mood) => {
    if (mood === "toxic") {
      setShowToxicWarning(true);
    } else {
      setCurrentMood(mood);
      setMessages([]);
      onMoodChange(mood);
    }
  };

  // Confirm toxic mood
  const confirmToxicMood = () => {
    setCurrentMood("toxic");
    setMessages([]);
    onMoodChange("toxic");
    setShowToxicWarning(false);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={`flex-1 h-screen flex flex-col`}>
      {/* Chatbot Header */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🤪
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Funpal AI
            </h2>
            <p className="text-sm text-gray-400">
              Mood: {moods[currentMood].name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearChat}
            className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-105"
          >
            Clear Chat
          </button>
          <select
            value={currentMood}
            onChange={(e) => handleMoodChange(e.target.value)}
            className="p-2 bg-gradient-to-r bg-black text-white rounded-lg focus:outline-none border-[#ffffff36] border-2 transition-all hover:scale-105"
          >
            {Object.keys(moods).map((mood) => (
              <option key={mood} value={mood} className="bg-black outline-none">
                {moods[mood].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-2 md:p-4 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-2 md:mb-3`}
            >
              <motion.div
                className={`max-w-[80%] md:max-w-[70%] p-2 md:p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-[#000] text-white rounded-br-none"
                    : "bg-[#ffffff15] text-white rounded-bl-none"
                }`}
              >
                <div className="prose text-sm md:text-base">
                  {parseMarkdown(msg.text)}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-2 md:mb-3"
          >
            <div className="max-w-[80%] md:max-w-[70%] p-2 md:p-3 bg-[#ffffff15] text-gray-800 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className=" bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] rounded-xl m-4">
        <motion.div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent text-white p-2 md:p-4 rounded-lg focus:outline-none text-sm md:text-lg"
            placeholder="Type a message..."
          />
          <div className="p-4">
            <motion.button
              onClick={sendMessage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:p-3 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Toxic Mood Warning Modal */}
      <AnimatePresence>
        {showToxicWarning && (
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
              className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full shadow-lg"
            >
              <h2 className="text-lg md:text-xl font-bold text-red-600 mb-2 md:mb-4">
                ⚠️ Warning!
              </h2>
              <p className="text-xs md:text-sm text-gray-800 mb-4">
                The <strong>Toxic</strong> mood is designed to be extremely
                harsh, rude, and offensive. It may include sensitive content,
                insults, and explicit language. Are you sure you want to
                proceed?
                <br />
                <br />
                It. Will. Hurt. You.
              </p>
              <div className="flex justify-end space-x-2 md:space-x-3">
                <button
                  onClick={() => setShowToxicWarning(false)}
                  className="p-1 md:p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-xs md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToxicMood}
                  className="p-1 md:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-base"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
