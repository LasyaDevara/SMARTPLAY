import React from 'react';
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import { AvatarColor, AvatarAccessory } from './Avatar';

interface MessageBubbleProps {
  message: string;
  senderName: string;
  senderAvatarColor: AvatarColor;
  senderAvatarAccessory: AvatarAccessory;
  isCurrentUser: boolean;
  timestamp: number;
  messageType?: 'text' | 'emoji' | 'sticker' | 'achievement' | 'system';
  showTimestamp?: boolean;
  showAvatar?: boolean;
  compactMode?: boolean;
  messageSize?: 'small' | 'medium' | 'large';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  senderName,
  senderAvatarColor,
  senderAvatarAccessory,
  isCurrentUser,
  timestamp,
  messageType = 'text',
  showTimestamp = true,
  showAvatar = true,
  compactMode = false,
  messageSize = 'medium'
}) => {
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is only emojis
  const isEmojiOnly = (text: string) => {
    if (typeof text !== 'string') return false;
    const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
    return emojiRegex.test(text.replace(/\s/g, ''));
  };

  const isEmoji = (typeof message === 'string' && isEmojiOnly(message)) || messageType === 'emoji' || messageType === 'sticker';

  const getMessageSizeClass = () => {
    if (isEmoji) {
      switch (messageSize) {
        case 'small': return 'text-3xl';
        case 'large': return 'text-6xl';
        default: return 'text-4xl';
      }
    }
    
    switch (messageSize) {
      case 'small': return 'text-xs';
      case 'large': return 'text-lg';
      default: return 'text-sm md:text-base';
    }
  };

  const getSpacing = () => {
    return compactMode ? 'mb-1' : 'mb-4';
  };

  const getBubbleStyle = () => {
    if (messageType === 'achievement') {
      return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-2 border-yellow-500';
    }
    
    if (messageType === 'system') {
      return 'bg-gradient-to-r from-blue-400 to-purple-400 text-white border-2 border-blue-500';
    }
    
    if (isEmoji) {
      return 'bg-transparent shadow-none border-none';
    }
    
    return isCurrentUser 
      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-tr-none shadow-lg' 
      : 'bg-white text-gray-800 rounded-tl-none border-2 border-gray-100 shadow-md';
  };
  
  return (
    <motion.div
      className={`flex items-start ${getSpacing()} ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      {showAvatar && !isEmoji && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Avatar 
            color={senderAvatarColor} 
            accessory={senderAvatarAccessory} 
            size="sm" 
            animated
          />
        </motion.div>
      )}
      
      <div className={`${showAvatar && !isEmoji ? 'mx-3' : ''} max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex flex-col">
          {!compactMode && !isEmoji && (
            <motion.span 
              className={`text-xs font-bold mb-1 ${
                isCurrentUser ? 'text-purple-600' : 'text-secondary-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isCurrentUser ? 'You' : senderName}
            </motion.span>
          )}
          
          <motion.div 
            className={`rounded-3xl py-3 px-4 break-words ${getBubbleStyle()} ${
              isEmoji ? 'text-center p-2' : ''
            } ${compactMode ? 'py-2 px-3' : ''}`}
            whileHover={{ scale: isEmoji ? 1.1 : 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {messageType === 'achievement' && (
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">🏆</span>
              </div>
            )}
            
            {messageType === 'system' && (
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">🔔</span>
              </div>
            )}
            
            <p className={`${getMessageSizeClass()} ${
              messageType === 'sticker' ? 'text-center' : ''
            }`}>
              {message}
            </p>
            
            {messageType === 'achievement' && (
              <div className="text-xs mt-1 opacity-90">
                Achievement Unlocked!
              </div>
            )}
          </motion.div>
          
          {showTimestamp && !compactMode && !isEmoji && (
            <motion.span 
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatTime(timestamp)}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;