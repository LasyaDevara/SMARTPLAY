import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex justify-center">
        <div className="text-white text-4xl">
          {icon}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default GameCard;