import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TypingIndicator = () => {
  const loadingCircleVariants = {
    animate: {
      y: ["0%", "-50%", "0%"],
      backgroundColor: ["#C0C0C0", "#bbbbbb", "#888888"] 
    },
  };
  return (
    <motion.div className="flex h-5 w-fit items-center gap-[2px]">
      {[...Array(3)].map((_, index) => (
        <motion.span
          key={index}
          className="block h-1.5 w-1.5 rounded-full bg-gray-500"
          variants={loadingCircleVariants}
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: index * 0.2,
            repeatDelay: 0.5
          }}
        />
      ))}
    </motion.div>
  );
};