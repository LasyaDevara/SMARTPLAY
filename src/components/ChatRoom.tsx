import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Crown, Star, X, Send, ArrowLeft, Smile, Settings } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickMessageBar from './QuickMessageBar';
import Avatar from './Avatar';
import Button from './Button';

interface ChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  messages: any[];
  currentUser: any;
  roomPlayers: any[];
  onSendMessage: (message: string, type?: string) => void;
  roomHost?: any;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  isOpen,
  onClose,
  messages,
  currentUser,
  roomPlayers,
  onSendMessage,
  roomHost
}) => {
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    } else {
      setUnreadCount(0);
    }
  }, [messages.length, isOpen]);

  const handleSendMessage = (message: string, type: string = 'text') => {
    if (message.trim()) {
      onSendMessage(message, type);
      setCustomMessage('');
      setShowQuickActions(false);
    }
  };

  const handleSendCustomMessage = () => {
    if (customMessage.trim()) {
      handleSendMessage(customMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCustomMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg z-50"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          scale: unreadCount > 0 ? [1, 1.1, 1] : 1,
        }}
        transition={{ 
          repeat: unreadCount > 0 ? Infinity : 0,
          duration: 1 
        }}
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Team Chat</h2>
              <p className="text-purple-100">
                {roomPlayers.length} player{roomPlayers.length !== 1 ? 's' : ''} online
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!showQuickActions && (
                <motion.button
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  onClick={() => setShowPlayerList(!showPlayerList)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Show Players"
                >
                  <Users className="h-5 w-5" />
                </motion.button>
              )}
              
              <motion.button
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Close Chat"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Player List */}
        <AnimatePresence>
          {showPlayerList && !showQuickActions && (
            <motion.div
              className="bg-purple-50 border-b border-purple-200 p-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-bold text-purple-700 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Players in Room
              </h3>
              <div className="space-y-2">
                {roomPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Avatar
                      color={player.avatarColor}
                      accessory={player.avatarAccessory}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{player.nickname}</span>
                        {roomHost && player.id === roomHost.id && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {player.id === currentUser?.id && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area or Quick Actions */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-purple-25 to-pink-25">
          <AnimatePresence mode="wait">
            {showQuickActions ? (
              <motion.div
                key="quick-actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <QuickMessageBar onSendMessage={handleSendMessage} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 h-full"
              >
                {messages.length === 0 ? (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center text-gray-500 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-bold mb-2">Start the Conversation!</h3>
                    <p className="text-sm">Send a message to your teammates and start collaborating!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <MessageBubble
                        key={`${msg.timestamp}-${index}`}
                        message={msg.message}
                        senderName={msg.sender.nickname}
                        senderAvatarColor={msg.sender.avatarColor}
                        senderAvatarAccessory={msg.sender.avatarAccessory}
                        isCurrentUser={msg.sender.id === currentUser?.id}
                        timestamp={msg.timestamp}
                        messageType={msg.type || 'text'}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message Input Area */}
        {!showQuickActions && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-200">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-sm bg-white shadow-sm"
                  placeholder="Type your message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={200}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {customMessage.length}/200
                </div>
              </div>
              
              {/* Quick Actions Button */}
              <motion.button
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-md transition-all hover:from-blue-600 hover:to-purple-600"
                onClick={() => setShowQuickActions(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Quick Messages & Emojis"
              >
                <div className="flex items-center space-x-1">
                  <Smile className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick</span>
                </div>
              </motion.button>
              
              {/* Send Button */}
              <motion.button
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-md transition-all ${
                  customMessage.trim() 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleSendCustomMessage}
                disabled={!customMessage.trim()}
                whileHover={customMessage.trim() ? { scale: 1.05 } : {}}
                whileTap={customMessage.trim() ? { scale: 0.95 } : {}}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Quick tip */}
            <div className="text-center text-xs text-purple-600 mt-2">
              💡 <strong>Tip:</strong> Click "Quick" for emojis and preset messages!
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatRoom;