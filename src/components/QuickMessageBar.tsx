import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Gift, Star, Heart, Zap, ThumbsUp, PartyPopper, Target, Trophy, Lightbulb, Coffee } from 'lucide-react';

interface QuickMessageBarProps {
  onSendMessage: (message: string, type?: 'text' | 'emoji' | 'sticker') => void;
}

const presetMessages = [
  { text: "Great job! 👏", icon: "👏", category: "praise" },
  { text: "You're awesome! ⭐", icon: "⭐", category: "praise" },
  { text: "Let's do this! 💪", icon: "💪", category: "motivation" },
  { text: "I need help! 🙋", icon: "🙋", category: "help" },
  { text: "That was fun! 😄", icon: "😄", category: "fun" },
  { text: "Good luck! 🍀", icon: "🍀", category: "support" },
  { text: "Amazing work! 🎉", icon: "🎉", category: "praise" },
  { text: "Keep going! 🚀", icon: "🚀", category: "motivation" },
  { text: "Well done! 👍", icon: "👍", category: "praise" },
  { text: "You got this! 💯", icon: "💯", category: "motivation" },
  { text: "Thanks! 🙏", icon: "🙏", category: "gratitude" },
  { text: "Sorry! 😅", icon: "😅", category: "apology" },
  { text: "Wait for me! ⏰", icon: "⏰", category: "help" },
  { text: "Let's team up! 🤝", icon: "🤝", category: "teamwork" },
  { text: "I'm ready! ✅", icon: "✅", category: "status" },
  { text: "Almost there! 🎯", icon: "🎯", category: "progress" }
];

const emojis = [
  // Happy emotions
  "😊", "😄", "🤗", "😍", "🤩", "😎", "🥳", "😇",
  // Gestures
  "👍", "👏", "🙌", "💪", "✨", "⭐", "🎉", "🎊",
  // Hearts and love
  "❤️", "💖", "💝", "🌟", "🔥", "💯", "🚀", "🎯",
  // Achievement
  "🏆", "🥇", "🎖️", "🏅", "👑", "💎", "🌈", "☀️",
  // Fun and games
  "🎮", "🎲", "🎪", "🎭", "🎨", "🎵", "🎶", "🎸"
];

const stickers = [
  // Animals
  { emoji: "🐱", name: "Cat" },
  { emoji: "🐶", name: "Dog" },
  { emoji: "🐻", name: "Bear" },
  { emoji: "🦄", name: "Unicorn" },
  { emoji: "🐸", name: "Frog" },
  { emoji: "🐧", name: "Penguin" },
  { emoji: "🦋", name: "Butterfly" },
  { emoji: "🐝", name: "Bee" },
  // Objects
  { emoji: "🎈", name: "Balloon" },
  { emoji: "🎁", name: "Gift" },
  { emoji: "🍭", name: "Lollipop" },
  { emoji: "🧁", name: "Cupcake" },
  { emoji: "🍪", name: "Cookie" },
  { emoji: "🎂", name: "Cake" },
  { emoji: "🌺", name: "Flower" },
  { emoji: "🌸", name: "Blossom" },
  // Activities
  { emoji: "⚽", name: "Soccer" },
  { emoji: "🏀", name: "Basketball" },
  { emoji: "🎯", name: "Target" },
  { emoji: "🎪", name: "Circus" },
  { emoji: "🎨", name: "Art" },
  { emoji: "📚", name: "Books" },
  { emoji: "🎵", name: "Music" },
  { emoji: "🌟", name: "Star" }
];

const QuickMessageBar: React.FC<QuickMessageBarProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'emojis' | 'stickers'>('messages');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📝' },
    { id: 'praise', name: 'Praise', icon: '👏' },
    { id: 'motivation', name: 'Motivation', icon: '💪' },
    { id: 'help', name: 'Help', icon: '🙋' },
    { id: 'fun', name: 'Fun', icon: '😄' },
    { id: 'teamwork', name: 'Team', icon: '🤝' }
  ];

  const getFilteredMessages = () => {
    if (selectedCategory === 'all') return presetMessages;
    return presetMessages.filter(msg => msg.category === selectedCategory);
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl border-t-4 border-purple-200">
      {/* Tab Navigation */}
      <div className="flex justify-center p-4 pb-2">
        <div className="bg-white rounded-full p-1 shadow-md">
          <div className="flex space-x-1">
            {[
              { id: 'messages', icon: <Zap className="h-4 w-4" />, label: 'Quick', color: 'purple' },
              { id: 'emojis', icon: <Smile className="h-4 w-4" />, label: 'Emojis', color: 'blue' },
              { id: 'stickers', icon: <Gift className="h-4 w-4" />, label: 'Stickers', color: 'pink' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-500 text-white shadow-md`
                    : `text-${tab.color}-600 hover:bg-${tab.color}-100`
                }`}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4"
        >
          {activeTab === 'messages' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-purple-700 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Messages
                </h3>
                
                {/* Category Filter */}
                <div className="flex space-x-1 bg-white rounded-full p-1 shadow-sm">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-purple-500 text-white'
                          : 'text-purple-600 hover:bg-purple-100'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="mr-1">{category.icon}</span>
                      <span className="hidden sm:inline">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {getFilteredMessages().map((message, index) => (
                  <motion.button
                    key={index}
                    className="bg-white rounded-2xl py-3 px-4 text-sm font-medium shadow-sm hover:shadow-md transition-all text-purple-700 border-2 border-purple-100 hover:border-purple-300 flex items-center justify-center space-x-2"
                    onClick={() => onSendMessage(message.text)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-lg">{message.icon}</span>
                    <span>{message.text.replace(/[^\w\s!?]/g, '').trim()}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emojis' && (
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center">
                <Smile className="h-5 w-5 mr-2" />
                Express Yourself
              </h3>
              <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                {emojis.map((emoji, index) => (
                  <motion.button
                    key={index}
                    className="bg-white rounded-xl w-12 h-12 flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-all border-2 border-blue-100 hover:border-blue-300"
                    onClick={() => onSendMessage(emoji, 'emoji')}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stickers' && (
            <div>
              <h3 className="text-lg font-bold mb-3 text-pink-700 flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Fun Stickers
              </h3>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {stickers.map((sticker, index) => (
                  <motion.button
                    key={index}
                    className="bg-white rounded-xl w-14 h-14 flex flex-col items-center justify-center text-2xl shadow-sm hover:shadow-md transition-all border-2 border-pink-100 hover:border-pink-300 group"
                    onClick={() => onSendMessage(sticker.emoji, 'sticker')}
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.03, type: "spring" }}
                    title={sticker.name}
                  >
                    <span className="text-xl">{sticker.emoji}</span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {sticker.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick Send Tip */}
      <div className="px-4 pb-2">
        <div className="text-center text-xs text-purple-600 bg-white rounded-lg py-2 px-3 shadow-sm">
          💡 <strong>Tip:</strong> Click any message above to send instantly, or type your own message below!
        </div>
      </div>
    </div>
  );
};

export default QuickMessageBar;