import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { link } from "fs";

const categories = [
  {
    name: "Popular",
    bg: "bg-gradient-to-br from-blue-300 to-blue-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240221154444kutg.png",
    link: "/popular",
  },
  {
    name: "Lottery",
    bg: "bg-gradient-to-br from-pink-200 to-pink-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240221154540veqj.png",
    link: "/wheel-spin",
  },
  {
    name: "Casino",
    bg: "bg-gradient-to-br from-rose-300 to-pink-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240529195514q4uq.png",
    link: "/casino",
  },
  {
    name: "Slots",
    bg: "bg-gradient-to-br from-purple-300 to-purple-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240221154558lshk.png",
    link: "/coming-soon",
  },
  {
    name: "Sports",
    bg: "bg-gradient-to-br from-orange-200 to-orange-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240221154454akso.png",
    link: "/coming-soon",
  },
  {
    name: "Rummy",
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-500 text-black",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_202404151616441889.png",
    link: "/card-game",
  },
  {
    name: "Fishing",
    bg: "bg-gradient-to-br from-red-200 to-red-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240221164829vcfa.png",
    link: "/coming-soon",
  },
  {
    name: "Original",
    bg: "bg-gradient-to-br from-pink-200 to-pink-500",
    img: "https://ossimg.tirangaagent.com/Tiranga/gamecategory/gamecategory_20240415161436vabi.png",
    link: "/coming-soon",
  },
];

const messages = [
  "Welcome to the Tiranga Games! Greetings, Gamers and Enthusiasts!",
  "Play Safe, Win Big! The Tiranga Team Wishes You the Best!",
];

const GameNavigation: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const firstRow = categories.slice(0, 2);
  const secondRow = categories.slice(2, 5);
  const thirdRow = categories.slice(5, 8);

  return (
    <div className="p-3 w-full max-w-sm mx-auto">
      {/* Permanent top welcome bar with animated message */}
      <div className=" text-white rounded-2xl px-3 py-2 mb-4 shadow-md flex items-center justify-between" style={{ backgroundColor: "rgb(75 85 155)" }}>
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs font-semibold leading-tight"
        >
          {messages[messageIndex]}
        </motion.div>
        <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2">
          Detail
        </button>
      </div>

      {/* Category rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          {firstRow.map((item) => (
            <a href={item.link} key={item.name} className="block">
              <motion.div
                className={`rounded-xl py-4 flex flex-col items-center justify-center text-white shadow-md ${item.bg}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={item.img} alt={item.name} className="h-16 mb-1 object-contain" />
                <span className="text-sm font-bold">{item.name}</span>
              </motion.div>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {secondRow.map((item) => (
            <a href={item.link} key={item.name} className="block">
              <motion.div
                className={`rounded-xl py-4 flex flex-col items-center justify-center text-white shadow-md ${item.bg}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={item.img} alt={item.name} className="h-17 mb-1 object-contain" />
                <span className={`text-sm font-bold ${item.name === "Rummy" ? "text-black" : ""}`}>
                  {item.name}
                </span>
              </motion.div>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {thirdRow.map((item) => (
            <a href={item.link} key={item.name} className="block">
              <motion.div
                className={`rounded-xl py-4 flex flex-col items-center justify-center text-white shadow-md ${item.bg}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={item.img} alt={item.name} className=" h-17 mb-1 object-contain" />
                <span className="text-sm font-bold">{item.name}</span>
              </motion.div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameNavigation;
