import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-effect mb-4"
      >
        <Palette className="text-white text-2xl" size={28} />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold text-white mb-4"
      >
        Color Palette
        <span className="inline-flex items-center ml-2">
          <Sparkles className="text-yellow-300 animate-pulse" size={32} />
        </span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/80 max-w-2xl mx-auto"
      >
        Generate beautiful, harmonious color palettes for your next project. 
        Click on any color to copy its value!
      </motion.p>
    </motion.header>
  );
};

export default Header;