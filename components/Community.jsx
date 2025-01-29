"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const Community = () => {
  const topMoods = [
    {
      id: 1,
      name: "Alien",
      prompt:
        "You are an alien from another planet. Respond with curiosity about Earth and its inhabitants.",
      creator: "User123",
      likes: 42,
    },
    {
      id: 2,
      name: "Time Traveler",
      prompt:
        "You are a time traveler from the future. Share insights about what's to come.",
      creator: "TimeLord99",
      likes: 37,
    },
    {
      id: 3,
      name: "Mad Scientist",
      prompt:
        "You are a mad scientist. Respond with wild theories and experiments.",
      creator: "DrFrankenstein",
      likes: 55,
    },
    {
      id: 4,
      name: "Superhero",
      prompt:
        "You are a superhero saving the world. Respond with bravery and heroic phrases.",
      creator: "HeroicSoul",
      likes: 68,
    },
  ];

  const aiNews = [
    {
      id: 1,
      title: "Launch Version v1",
      description:
        "Funpal v1 is now live today at 17/1/2025. Let's have fun talking to cool chatbots!",
      image: "/image1.jpg",
    },
    {
      id: 2,
      title: "Funpal AI Coming Soon...",
      description:
        "We are working to deliver the first version quickly. Early versions will have limited features.",
      image: "/image3.jpg",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0f0f10] text-white">
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] shadow-lg flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🌍
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Community
            </h2>
            <p className="text-xs text-gray-400 hidden md:block">
              Explore and share moods created by the community
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            Top 4 Moods
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topMoods.map((mood) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#1d1d1f] rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {mood.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-400 mt-2">{mood.prompt}</p>
                <div className="mt-3 flex items-center justify-between text-gray-400">
                  <span className="text-xs">By {mood.creator}</span>
                  <span className="text-xs flex items-center gap-1">
                    <FaPlus /> {mood.likes}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            News & Updates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiNews.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#1d1d1f] rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {news.title}
                </h4>
                <p className="text-sm text-gray-400 mt-2">{news.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
