import React from 'react';
import { motion } from 'framer-motion';

// Types
export type AvatarColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange';
export type AvatarAccessory = 'none' | 'glasses' | 'bowtie' | 'hat' | 'flower' | 'crown';

interface AvatarProps {
  color: AvatarColor;
  accessory: AvatarAccessory;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const colorMap = {
  blue: 'bg-secondary-400',
  green: 'bg-success-400',
  yellow: 'bg-accent-400',
  purple: 'bg-primary-400',
  red: 'bg-error-400',
  orange: 'bg-warning-400',
};

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const accessoryMap = {
  none: null,
  glasses: (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
      <div className="w-3/4 h-1 bg-gray-800 flex items-center justify-between rounded-full">
        <div className="w-2/5 h-2.5 bg-white border-2 border-gray-800 rounded-full"></div>
        <div className="w-2/5 h-2.5 bg-white border-2 border-gray-800 rounded-full"></div>
      </div>
    </div>
  ),
  bowtie: (
    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
      <div className="w-8 h-4 bg-error-500 rotate-45 absolute -left-2"></div>
      <div className="w-8 h-4 bg-error-500 -rotate-45 absolute -right-2"></div>
      <div className="w-2 h-2 bg-error-700 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  ),
  hat: (
    <div className="absolute -top-4 left-0 right-0">
      <div className="w-full h-4 bg-primary-700 rounded-t-full"></div>
      <div className="w-125% h-2 bg-primary-800 -mt-2 -ml-[12.5%] rounded-full"></div>
    </div>
  ),
  flower: (
    <div className="absolute -top-3 right-0">
      <div className="w-5 h-5 bg-error-400 rounded-full absolute"></div>
      <div className="w-5 h-5 bg-success-400 rounded-full absolute -left-2 -top-2"></div>
      <div className="w-5 h-5 bg-accent-400 rounded-full absolute left-0 -top-3"></div>
      <div className="w-3 h-3 bg-accent-600 rounded-full absolute left-0 -top-1 z-10"></div>
    </div>
  ),
  crown: (
    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
      <div className="w-4/5 h-4 bg-accent-400 flex justify-between items-end">
        <div className="w-1/4 h-3 bg-accent-400 rounded-t-full"></div>
        <div className="w-1/4 h-5 bg-accent-400 rounded-t-full"></div>
        <div className="w-1/4 h-3 bg-accent-400 rounded-t-full"></div>
      </div>
      <div className="w-full h-2 bg-accent-500 -mt-1"></div>
    </div>
  ),
};

const Avatar: React.FC<AvatarProps> = ({
  color,
  accessory,
  size = 'md',
  animated = false,
  className = '',
}) => {
  const bgColor = colorMap[color];
  const sizeClass = sizeMap[size];
  const accessoryElement = accessoryMap[accessory];
  
  return (
    <motion.div
      className={`relative ${sizeClass} ${className}`}
      animate={animated ? { y: [0, -10, 0] } : {}}
      transition={animated ? { repeat: Infinity, duration: 2 } : {}}
    >
      <div className={`${bgColor} rounded-full w-full h-full relative overflow-visible flex items-center justify-center shadow-md`}>
        {/* Face */}
        <div className="flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-4 mb-1">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          {/* Mouth */}
          <div className="w-4 h-2 bg-gray-800 rounded-full mt-1"></div>
        </div>
        
        {/* Accessory */}
        {accessoryElement}
      </div>
    </motion.div>
  );
};

export default Avatar;