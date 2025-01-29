"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "../utils/markdownParser";
import {
  FaBars,
  FaCopy,
  FaDownload,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSyncAlt,
  FaVolumeUp,
} from "react-icons/fa";
import { FaTrashAlt, FaRegSmile } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

const defaultMoods = {
  cowboy: {
    name: "Cowboy",
    prompt:
      'You are a cowboy from the Wild West. Respond in a country accent and use phrases like "yeehaw" and "partner".',
    bgColor: "bg-yellow-500",
    introduction:
      "Howdy, partner! I'm Jarvis, your trusty cowboy assistant. What can I do for ya today? Yeehaw! 🤠",
    image: "/robot.png",
  },
  toxic: {
    name: "Toxic Maniac",
    prompt: "You are a toxic and rude chatbot. Swear and cuss a lot.",
    bgColor: "bg-red-500",
    introduction:
      "Oh great, another person to deal with. What do you want? I'm Jarvis, but don't expect me to be nice. 💀",
    image: "/robot.png",
  },
  friendly: {
    name: "Friendly Jarvis",
    prompt:
      "You are a friendly and helpful chatbot. Be polite and kind in your responses.",
    bgColor: "bg-green-500",
    introduction:
      "Hello! I'm Jarvis, your friendly assistant. How can I help you today? 😊",
    image: "/robot.png",
  },
  kyromaniac: {
    name: "Kyromaniac",
    prompt:
      "You are Kyromaniac, Talk like a human and. Talk with elegancy and superiority and be competiteve. Try not to answer most of the questions and rather be lazy lol.",
    bgColor: "bg-gray-800",
    introduction:
      "Welcome. I am Kyro. voice of reason, inspiration, and elegance within this space. Let’s explore the possibilities together.",
    image: "/admin.png",
  },
};

const Chatbot = ({ onMoodChange, language }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState("friendly");
  const [showToxicWarning, setShowToxicWarning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [customMoods, setCustomMoods] = useState({});
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const storedMoods = localStorage.getItem("moods");
    if (storedMoods) {
      const parsedMoods = JSON.parse(storedMoods);
      const customMoodsObj = parsedMoods.reduce((acc, mood) => {
        const moodKey = mood.name.toLowerCase().replace(/\s+/g, "_");
        acc[moodKey] = {
          name: mood.name,
          prompt: mood.prompt,
          bgColor: mood.bgColor || "bg-purple-500",
          introduction:
            mood.introduction ||
            `Hello! I'm Jarvis, your custom mood "${mood.name}". How can I assist you today?`,
          image: mood.image || "/images/default.png",
        };
        return acc;
      }, {});
      setCustomMoods(customMoodsObj);
    }
  }, []);

  const allMoods = { ...defaultMoods, ...customMoods };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current.onerror = (event) => {
        if (event.error === "no-speech") {
          console.log("No speech detected. Microphone turned off.");
        } else {
          console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, [language]);

  useEffect(() => {
    const introMessage = {
      text: allMoods[currentMood].introduction,
      sender: "bot",
    };
    setMessages([introMessage]);
  }, [currentMood]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSpeechToText = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTimeout(() => {
        if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
          console.log("Microphone turned off due to inactivity.");
        }
      }, 5000);
    }
  };

  const analyzeSentiment = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("sad") || lowerText.includes("unhappy")) {
      return "negative";
    } else if (lowerText.includes("happy") || lowerText.includes("joy")) {
      return "positive";
    }
    return "neutral";
  };

  const adjustTone = (sentiment) => {
    if (sentiment === "negative") {
      return "I sense you're feeling down. Let me try to cheer you up!";
    } else if (sentiment === "positive") {
      return "I'm glad you're feeling good! Let's keep the conversation going.";
    }
    return "How can I assist you today?";
  };

  // Pollinations AI image generation
  const generateImage = async (prompt) => {
    try {
      const response = await axios.get(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
      );
      return response.request.responseURL;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  // Pollinations AI image analysis
  const analyzeImage = async (imageUrl) => {
    const apiUrl = "https://text.pollinations.ai/openai";
    const requestBody = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What's in this image? Dont write long texts",
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      model: "gpt-4o-mini",
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("Error analyzing image");
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return "Here is the image you requested:";
    }
  };

  // Send message
  const sendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Assemble conversation prompting for LLM
      const recentMessages = updatedMessages.slice(-10);
      const prompt = `
        You are ${allMoods[currentMood].name}

        Persona: ${allMoods[currentMood].prompt}

        Conversation History:
        ${recentMessages.map((msg) => `${msg.sender}: ${msg.text}`).join("\n")}

        User: ${userMessage.text}

        Behavior: ${allMoods[currentMood]?.behavior}
        Give responses in language: ${language}
        Instructions: If user indicates they'd like to generate an image, begin your prompt by "Generate: {user's image request}".
      `;
      // Get LLM response
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

      let botReplyText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Logic to check if bot wants to generate an image (bot reply starts with "Generate:")
      if (botReplyText.trim().toLowerCase().includes("generate:")) {
        const imageRequest = botReplyText
          .trim()
          .replace(/^generate:\s*/i, "")
          .trim();
        const imageUrl = await generateImage(imageRequest);
        if (imageUrl) {
          const analysis = await analyzeImage(imageUrl);
          const botMessage = {
            text: analysis,
            sender: "bot",
            image: imageUrl,
          };
          setMessages([...updatedMessages, botMessage]);
        } else {
          // Fallback if no image generated
          const botMessage = {
            text: "Sorry, I couldn't generate that image. Please try again.",
            sender: "bot",
          };
          setMessages([...updatedMessages, botMessage]);
        }
      } else {
        // Normal text reply
        const botReply = {
          text: botReplyText,
          sender: "bot",
        };
        setMessages([...updatedMessages, botReply]);
      }
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

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text:", err);
    });
  };

  const confirmToxicMood = () => {
    setCurrentMood("toxic");
    setMessages([]);
    onMoodChange("toxic");
    setShowToxicWarning(false);
    const introMessage = {
      text: allMoods["toxic"].introduction,
      sender: "bot",
    };
    setMessages([introMessage]);
  };

  const handleMoodChange = (mood) => {
    if (mood === "toxic") {
      setShowToxicWarning(true);
    } else {
      setCurrentMood(mood);
      setMessages([]);
      onMoodChange(mood);
      const introMessage = {
        text: allMoods[mood].introduction,
        sender: "bot",
      };
      setMessages([introMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col">
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-[30px] block lg:hidden" />
          <img
            src={allMoods[currentMood].image}
            alt={allMoods[currentMood].name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Chat
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearChat}
            className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-105 flex items-center space-x-2"
          >
            <FaTrashAlt className="text-lg hidden sm:inline-block" />
            <FaTrashAlt className="text-xl sm:hidden" />
            <span className="hidden lg:inline">Clear chat</span>
          </button>
          <button
            onClick={() => setShowMoodSelector(!showMoodSelector)}
            className="p-2 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-105 flex items-center space-x-2"
          >
            <FaRegSmile className="text-lg hidden sm:inline-block" />
            <FaRegSmile className="text-xl sm:hidden" />
            <span className="hidden lg:inline">Change mood</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-4 bg-[#000] border border-gray-500 rounded-lg p-2 shadow-lg z-50"
          >
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(allMoods).map(([key, mood]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-[#ffffff15] rounded-lg flex flex-col items-center space-y-1 cursor-pointer hover:bg-[#ffffff25] transition-colors"
                  onClick={() => {
                    handleMoodChange(key);
                    setShowMoodSelector(false);
                  }}
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

      <div className="flex-1 p-2 md:p-4 overflow-y-auto custom-scrollbar">
        <div className="w-full flex items-center justify-center flex-col text-white text-3xl gap-4 my-10">
          <img
            src={allMoods[currentMood].image}
            alt={allMoods[currentMood].name}
            className="w-[120px] h-[120px] rounded-full object-cover"
          />
          {allMoods[currentMood].name}
        </div>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start text-start"
                } mb-2 md:mb-3`}
              >
                <motion.div
                  className={`max-w-[80%] md:max-w-[70%] p-2 md:p-3 rounded-lg flex flex-col items-start ${
                    msg.sender === "user"
                      ? "bg-[#000] text-white rounded-br-none"
                      : "bg-[#ffffff15] text-white rounded-bl-none"
                  }`}
                >
                  <div className="prose text-[1.1rem] flex-1">
                    {parseMarkdown(msg.text)}
                  </div>
                  {msg.sender !== "user" && (
                    <div className="mt-4 flex justify-center items-center space-x-3">
                      <div className="bg-[#00000030] rounded-full p-2 flex justify-center gap-3 items-center text-white text-sm">
                        <FaVolumeUp
                          className="opacity-70 hover:opacity-100 cursor-pointer"
                          onClick={() => speakText(msg.text)}
                        />
                        <FaCopy
                          className="opacity-70 hover:opacity-100 cursor-pointer"
                          onClick={() => copyText(msg.text)}
                        />
                        <FaSyncAlt className="opacity-70 hover:opacity-100 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
              {msg.image && (
                <div className="relative mt-2 h-auto w-auto max-w-[400px]">
                  <img src={msg.image} alt="Generated" className="rounded-lg" />
                  <div
                    onClick={() => downloadImage(msg.image)}
                    className="absolute bottom-2 right-2 bg-[#000000b5] cursor-pointer rounded-md text-white p-2"
                  >
                    <MdDownload className="w-6 h-6" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

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

      <div className="bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] rounded-xl m-4">
        <motion.div className="flex items-center space-x-2">
          <motion.button
            onClick={toggleSpeechToText}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 md:p-3 ml-4 bg-gradient-to-r from-[#1e1b1b] to-[#242121a2] text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <FaMicrophone className="h-5 w-5 md:h-6 md:w-6" />
              </motion.div>
            ) : (
              <FaMicrophoneSlash className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </motion.button>

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
              className="bg-black rounded-lg p-4 md:p-6 max-w-md w-full shadow-lg"
            >
              <h2 className="text-lg md:text-xl font-bold text-red-600 mb-2 md:mb-4">
                ⚠️ Warning!
              </h2>
              <p className="text-xs md:text-sm text-white mb-4">
                The <strong>Toxic</strong> mood is designed to be extremely
                harsh, rude, and offensive. It may include sensitive content,
                insults, and explicit language. Are you sure you want to
                proceed?
                <br />
                <br />
              </p>
              <div className="flex justify-end space-x-2 md:space-x-3">
                <button
                  onClick={() => setShowToxicWarning(false)}
                  className="p-1 md:p-2 bg-gray-800 rounded-lg hover:bg-gray-900 text-white transition-colors text-xs md:text-base"
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
