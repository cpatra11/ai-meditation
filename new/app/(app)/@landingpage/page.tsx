"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "animate.css";
import Image from "next/image";
import Link from "next/link";

const LandingPage: React.FC = () => {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const keywords = ["peace", "relaxation", "focus", "mindfulness", "clarity"];

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex((prevIndex) => (prevIndex + 1) % keywords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [keywords.length]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center pt-[80px] px-4 sm:px-5 md:px-6 relative overflow-hidden">
      {/* Floating particles or background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-300 opacity-40 z-0 animate-pulse"></div>

      <motion.div
        className="border-8 p-8 sm:p-12 rounded-lg flex flex-col items-center justify-center text-center space-y-6 w-full max-w-full mx-0 sm:mx-6 relative z-10"
        initial={{ borderColor: "transparent" }}
        animate={{
          borderColor: ["#4F46E5", "#6366F1", "#8B5CF6", "#9333EA", "#3B82F6"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          height: "calc(100vh - 100px)", // Adjusting height to avoid scrolling and fit within remaining space
          maxHeight: "calc(100vh - 100px)", // Same for max-height to prevent scrolling
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.6)",
        }}
      >
        {/* Positioned and glowing image */}
        <Image
          src="/images/lp.png"
          alt="Meditation"
          width={800} // Larger size
          height={800} // Larger size
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40 z-0"
          style={{
            filter: "hue-rotate(180deg) brightness(1.5) blur(5px)", // Glowing and color-changing effect
            transition: "filter 3s ease-in-out",
          }}
        />

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-indigo-700 z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            textShadow: "0 0 20px rgba(79, 70, 229, 0.8)", // Glow effect for text
          }}
        >
          Your Journey to {keywords[keywordIndex]}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-[#6B1E8D] z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            textShadow: "none",
          }}
        >
          Experience deep {keywords[keywordIndex]} and tranquility. <br />
          Embrace the moment with our personalized meditation sessions.
        </motion.p>

        <motion.button
          className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-110 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          // onClick={() => alert("Let's Meditate!")}
          style={{
            boxShadow: "0 0 10px rgba(79, 70, 229, 0.8)",
          }}
          aschild="true"
        >
          <Link href="/new">Meditate Now</Link>
        </motion.button>

        {/* Decorative "wave" or "cloud" pattern in the background */}
        {/* <div className="absolute bottom-0 w-full h-32 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-300 opacity-50 z-0 rounded-t-3xl animate-wave"></div> */}
      </motion.div>
    </div>
  );
};

export default LandingPage;
