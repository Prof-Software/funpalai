"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const Community = () => {
  // Mock community moods (top 4)
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

  

  // Mock AI-generated news
  const aiNews = [
    {
      id: 1,
      title: "Launch Version v1",
      description:
        "Funpal v1 is now live today at 17/1/2025. Lets have fun talking to Cool Chatbots",
      image: "/image1.jpg", // Replace with AI-generated image URL
    },
    {
      id: 2,
      title: "Funpal AI Coming Soon...",
      description:
        "We are working on delievering the first version at the quickest. Early versions will have limited features.",
      image: "/image3.jpg", // Replace with AI-generated image URL
    },
  ];

  // State for liked moods
  const [likedMoods, setLikedMoods] = useState([]);

  // Handle like/unlike a mood
  const handleLike = (id) => {
    if (likedMoods.includes(id)) {
      setLikedMoods(likedMoods.filter((moodId) => moodId !== id));
    } else {
      setLikedMoods([...likedMoods, id]);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col">
      {/* Community Header */}
      <div className="p-4 bg-gradient-to-r from-[#1e1b1bdf] to-[#000000df] backdrop-blur-sm shadow-lg flex items-center">
      <div className=" w-[50px] block lg:hidden" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            🌍
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Community
            </h2>
            <p className="text-sm text-gray-400 md:block hidden">
              Explore and share moods created by the community
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-[90vh] overflow-auto">
        {/* Top 4 Moods Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Top 4 Moods
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topMoods.map((mood) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#00000095] rounded-lg shadow-lg hover:shadow-xl transition-shadow text-white"
              >
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {mood.name}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{mood.prompt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span>By {mood.creator}</span>
                  </div>
                 <FaPlus/>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            News & Updates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiNews.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#00000095] rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {news.title}
                </h3>
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