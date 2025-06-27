import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, X, Smile } from 'lucide-react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  user: {
    id: string;
    nickname: string;
    avatar_color: string;
    avatar_accessory: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'system';
}

interface EnhancedChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  messages: any[];
  currentUser: any;
  roomPlayers: any[];
  onSendMessage: (message: string, type?: string) => void;
  roomHost?: any;
}

const EnhancedChatRoom: React.FC<EnhancedChatRoomProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  currentUser, 
  roomPlayers, 
  onSendMessage,
  roomHost
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string, type: string = 'text') => {
    if (message.trim()) {
      onSendMessage(message, type);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleSendCustomMessage = () => {
    if (newMessage.trim()) {
      handleSendMessage(newMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCustomMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🎮', '🏆', '🔥', '💯'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md h-[80vh] flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Team Chat</h3>
                <p className="text-sm text-blue-100">
                  {roomPlayers.length} player{roomPlayers.length !== 1 ? 's' : ''} online
                </p>
              </div>
            </div>
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Connected Users Bar */}
        <div className="bg-gray-50 p-3 border-b">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Online:</span>
            {roomPlayers.map((user) => (
              <div key={user.id} className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm whitespace-nowrap">
                <Avatar
                  color={user.avatarColor}
                  accessory={user.avatarAccessory}
                  size="sm"
                />
                <span className="text-xs font-medium text-gray-700">{user.nickname}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-bold mb-2">Start the Conversation!</h3>
              <p className="text-sm">Send a message to your teammates and start collaborating!</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={`${message.timestamp}-${index}`}
                  message={message.message}
                  senderName={message.sender.nickname}
                  senderAvatarColor={message.sender.avatarColor}
                  senderAvatarAccessory={message.sender.avatarAccessory}
                  isCurrentUser={message.sender.id === currentUser?.id}
                  timestamp={message.timestamp}
                  messageType={message.type || 'text'}
                />
              ))}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="border-t bg-gray-50 p-3">
            <div className="grid grid-cols-6 gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 text-xl hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={500}
              />
            </div>
            
            <button
              onClick={handleSendCustomMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{newMessage.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatRoom;