import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, MessageCircle, Users, Send, Smile, Calculator, BookOpenCheck, HelpCircle, Lightbulb, Brain, Target } from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import MessageBubble from '../components/MessageBubble';
import QuickMessageBar from '../components/QuickMessageBar';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';

const ChatRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const { 
    currentRoom, 
    messages, 
    isHost, 
    leaveRoom, 
    sendMessage,
    joinRoom
  } = useGame();
  
  const [newMessage, setNewMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Join room if not already in it
  useEffect(() => {
    if (roomId && !currentRoom) {
      joinRoom(roomId);
    }
  }, [roomId, currentRoom, joinRoom]);
  
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/lobby');
  };
  
  const handleSendMessage = (message: string, type: string = 'text') => {
    if (message.trim()) {
      sendMessage(message, type);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(newMessage);
    }
  };

  const studyTopics = [
    { id: 'math', name: 'Math Help', icon: <Calculator className="h-5 w-5" />, color: 'bg-blue-500' },
    { id: 'reading', name: 'Reading & Stories', icon: <BookOpenCheck className="h-5 w-5" />, color: 'bg-green-500' },
    { id: 'homework', name: 'Homework Help', icon: <HelpCircle className="h-5 w-5" />, color: 'bg-purple-500' },
    { id: 'ideas', name: 'Study Ideas', icon: <Lightbulb className="h-5 w-5" />, color: 'bg-yellow-500' },
    { id: 'memory', name: 'Memory Tips', icon: <Brain className="h-5 w-5" />, color: 'bg-pink-500' },
    { id: 'goals', name: 'Learning Goals', icon: <Target className="h-5 w-5" />, color: 'bg-indigo-500' }
  ];

  const handleTopicSelect = (topicId: string) => {
    const topic = studyTopics.find(t => t.id === topicId);
    if (topic) {
      setSelectedTopic(topicId);
      sendMessage(`📚 Let's discuss: ${topic.name}! Who wants to share or ask questions?`, 'topic');
    }
  };

  // If no current room yet, show loading
  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600 font-medium">Joining study room {roomId}...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="py-4 px-4 md:px-8 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLeaveRoom}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Leave Room
              </Button>
              
              <div className="ml-4 flex items-center">
                <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-xl font-bold text-primary-600">SmartPlay</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <span className="text-sm font-medium text-gray-500">
                  Study Room: <span className="font-bold text-primary-600">{currentRoom.id}</span>
                </span>
                <div className="text-xs text-gray-400">
                  {currentRoom.players.length} friends studying together
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Room Info Bar */}
          <div className="bg-white shadow-sm p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium text-gray-700">Friends Study Chat</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {currentRoom.players.map((player: any) => (
                    <div key={player.id} className="relative" title={player.nickname}>
                      <Avatar 
                        color={player.avatarColor}
                        accessory={player.avatarAccessory}
                        size="sm"
                        className="border-2 border-white"
                      />
                      {player.id === currentRoom.host?.id && (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full border border-white" title="Room Creator" />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {currentRoom.players.length} online
                </span>
              </div>
            </div>
          </div>

          {/* Study Topics Bar */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Study Topics - Click to start a discussion:</h3>
            <div className="flex flex-wrap gap-2">
              {studyTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-white text-sm font-medium transition-all ${topic.color} hover:opacity-80 ${
                    selectedTopic === topic.id ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => handleTopicSelect(topic.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {topic.icon}
                  <span>{topic.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-gray-500 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">Welcome to your Study Room!</h3>
                <p className="text-sm mb-4">This is a safe space for friends to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm max-w-md">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <span className="font-semibold text-blue-700">📚 Discuss homework</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <span className="font-semibold text-green-700">🤝 Help each other</span>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-semibold text-purple-700">💡 Share study tips</span>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3">
                    <span className="font-semibold text-pink-700">🎯 Set learning goals</span>
                  </div>
                </div>
                <p className="text-xs mt-4 text-gray-400">Click a study topic above or start typing below!</p>
              </motion.div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <MessageBubble
                    key={`${msg.timestamp}-${index}`}
                    message={msg.message}
                    senderName={msg.sender.nickname}
                    senderAvatarColor={msg.sender.avatarColor}
                    senderAvatarAccessory={msg.sender.avatarAccessory}
                    isCurrentUser={msg.sender.id === user?.id}
                    timestamp={msg.timestamp}
                    messageType={msg.type || 'text'}
                  />
                ))}
              </>
            )}
          </div>

          {/* Quick Messages */}
          <AnimatePresence>
            {showQuickMessages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <QuickMessageBar onSendMessage={handleSendMessage} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-sm bg-white shadow-sm"
                  placeholder="Ask a question, share an idea, or help a friend..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={500}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {newMessage.length}/500
                </div>
              </div>
              
              <Button
                variant={showQuickMessages ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowQuickMessages(!showQuickMessages)}
                icon={<Smile className="h-4 w-4" />}
                className="px-4"
              >
                Quick
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendMessage(newMessage)}
                disabled={!newMessage.trim()}
                icon={<Send className="h-4 w-4" />}
                className="px-6"
              >
                Send
              </Button>
            </div>
            
            <div className="text-center text-xs text-purple-600 mt-2">
              💡 <strong>Study Tip:</strong> Be kind, help others, and ask questions when you need help!
            </div>
          </div>
        </div>

        {/* Friends Sidebar */}
        <div className="w-80 bg-white shadow-lg border-l">
          <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <h3 className="font-bold text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Study Buddies
            </h3>
            <p className="text-sm text-purple-100">Friends in this room</p>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {currentRoom.players.map((player: any, index: number) => (
                <motion.div
                  key={player.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <Avatar
                      color={player.avatarColor}
                      accessory={player.avatarAccessory}
                      size="md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{player.nickname}</span>
                      {player.id === currentRoom.host?.id && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Creator</span>
                      )}
                      {player.id === user?.id && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Online & Ready to Study</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Study Guidelines */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Study Room Guidelines
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Be kind and respectful to all friends</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Help others when they ask questions</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Share study tips and learning strategies</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ask for help when you need it</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Stay focused on learning together</span>
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Room ID: <span className="font-mono font-bold">{currentRoom.id}</span></div>
                <div>Created by: <span className="font-medium">{currentRoom.host?.nickname}</span></div>
                <div>Purpose: Study & Discussion</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatRoomPage;