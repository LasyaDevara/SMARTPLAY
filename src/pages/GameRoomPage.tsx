import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, MessageCircle, Play, Users } from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import MultiplayerGameRoom from '../components/MultiplayerGameRoom';
import ChatRoom from '../components/ChatRoom';
import GameSelectionModal from '../components/GameSelectionModal';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import Confetti from 'react-confetti';

const GameRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const { 
    currentRoom, 
    messages, 
    isHost, 
    leaveRoom, 
    startGame,
    sendMessage,
    joinRoom
  } = useGame();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showGameSelection, setShowGameSelection] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // For responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Join room if not already in it
  useEffect(() => {
    if (roomId && !currentRoom) {
      joinRoom(roomId);
    }
  }, [roomId, currentRoom, joinRoom]);
  
  // Show confetti when game completes
  useEffect(() => {
    if (currentRoom?.status === 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentRoom?.status]);
  
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate(user ? '/lobby' : '/');
  };
  
  const handleStartGame = () => {
    if (isHost) {
      setShowGameSelection(true);
    }
  };

  const handleGameSelect = (gameType: string) => {
    setSelectedGameType(gameType);
    setShowGameSelection(false);
    
    // Send game start message to team
    sendMessage(`🎮 Starting ${getGameDisplayName(gameType)}! Let's work together and earn bonus XP! 🚀`, 'system');
    
    // Start the actual game
    startGame(gameType);
  };

  const getGameDisplayName = (gameType: string) => {
    const gameNames: Record<string, string> = {
      'math-mania': 'Math Mania',
      'spelling-bee': 'Spelling Bee',
      'tales': 'Interactive Tales',
      'rhymes': 'Nursery Rhymes',
      'tables': 'Multiplication Tables',
      'team-drawing': 'Team Drawing',
      'team-challenge': 'Mixed Challenge'
    };
    return gameNames[gameType] || 'Team Game';
  };
  
  const handleSendMessage = (message: string, type: string = 'text') => {
    sendMessage(message, type);
  };

  // Handle opening chat from both header button and floating button
  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  // Count unread messages for notification badge
  const unreadMessages = messages.filter(msg => 
    msg.sender.id !== (user?.id || 'guest') && 
    msg.timestamp > (Date.now() - 60000) // Messages from last minute
  ).length;
  
  // If no current room yet, show loading
  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600 font-medium">Joining room {roomId}...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
        />
      )}
      
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
                  Room: <span className="font-bold text-primary-600">{currentRoom.id}</span>
                </span>
                <div className="text-xs text-gray-400">
                  {currentRoom.players.length}/3 players
                </div>
                {selectedGameType && (
                  <div className="text-xs text-purple-600 font-medium">
                    Playing: {getGameDisplayName(selectedGameType)}
                  </div>
                )}
              </div>
              
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleOpenChat}
                icon={<MessageCircle className="h-4 w-4" />}
              >
                <span className="hidden md:inline">Team Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col">
        <div className="w-full p-4 md:p-8 flex flex-col">
          {/* Game status bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 mr-2">Team Players:</span>
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
                      <span className="absolute -top-1 -right-1 bg-accent-500 w-3 h-3 rounded-full border border-white" title="Host" />
                    )}
                  </div>
                ))}
                
                {/* Show empty slots */}
                {Array.from({ length: 3 - currentRoom.players.length }).map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
                    title="Waiting for player"
                  >
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
              <div className="ml-3 text-sm text-gray-600">
                {currentRoom.players.length}/3 players
                {currentRoom.players.length < 3 && (
                  <span className="text-blue-600 ml-1">(room open)</span>
                )}
              </div>
            </div>
            
            <div>
              {currentRoom.status === 'waiting' ? (
                isHost ? (
                  <Button 
                    variant="accent" 
                    size="sm" 
                    onClick={handleStartGame}
                    disabled={currentRoom.players.length < 1}
                    icon={<Play className="h-4 w-4" />}
                  >
                    Choose Game
                  </Button>
                ) : (
                  <span className="text-sm font-medium text-accent-600">
                    Waiting for host to choose game...
                  </span>
                )
              ) : currentRoom.status === 'playing' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-600">
                    Multiplayer Game Active
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-success-600">
                  Game completed!
                </span>
              )}
            </div>
          </div>
          
          {/* Game content */}
          <div className="flex-grow bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl shadow-md p-6 flex items-center justify-center">
            {currentRoom.status === 'waiting' ? (
              <div className="text-center max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="text-8xl mb-6">🎮</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Ready for Multiplayer Adventure?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    {isHost 
                      ? 'Choose a game for your team to play together with shared questions and team chat!' 
                      : 'The host will select an exciting multiplayer game for the team.'}
                  </p>
                </motion.div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">Multiplayer Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center p-3 bg-purple-50 rounded-xl">
                      <span className="text-2xl mr-2">🤝</span>
                      <div>
                        <div className="font-bold text-purple-700">Shared Questions</div>
                        <div className="text-purple-600">Same questions for all</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-yellow-50 rounded-xl">
                      <span className="text-2xl mr-2">⚡</span>
                      <div>
                        <div className="font-bold text-yellow-700">Team XP Bonus</div>
                        <div className="text-yellow-600">+{currentRoom.players.length * 3} XP per question</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-green-50 rounded-xl">
                      <span className="text-2xl mr-2">💬</span>
                      <div>
                        <div className="font-bold text-green-700">Team Chat</div>
                        <div className="text-green-600">Text messaging during game</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room capacity warning */}
                {currentRoom.players.length >= 3 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600 mr-2" />
                      <span className="font-bold text-orange-800">Room Full!</span>
                      <span className="text-orange-700 ml-2">Maximum 3 players reached</span>
                    </div>
                  </div>
                )}
                
                {isHost && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleStartGame}
                    icon={<Play className="h-5 w-5" />}
                    className="animate-pulse"
                  >
                    Choose Multiplayer Game
                  </Button>
                )}
              </div>
            ) : currentRoom.status === 'playing' ? (
              <MultiplayerGameRoom
                gameType={selectedGameType || 'math-mania'}
                roomPlayers={currentRoom.players}
                onSendMessage={handleSendMessage}
                messages={messages}
                currentUser={user || { id: 'guest', nickname: 'Guest Player', avatarColor: 'blue', avatarAccessory: 'none' }}
              />
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-success-600 mb-6">
                  Multiplayer Mission Complete! 🎉
                </h2>
                <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
                  <p className="text-xl mb-4">Final Team Score:</p>
                  <p className="text-4xl font-bold text-primary-600 mb-6">
                    {currentRoom.game?.score || 0} points
                  </p>
                  
                  <div className="flex justify-center">
                    {currentRoom.game && currentRoom.game.score >= 50 && (
                      <div className="bg-accent-100 rounded-lg p-4 text-accent-800 flex items-center">
                        <span className="text-2xl mr-2">🏆</span>
                        <span>Outstanding Teamwork! You've earned the Multiplayer Champion sticker!</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="primary" 
                    onClick={handleLeaveRoom}
                  >
                    Back to Lobby
                  </Button>
                  
                  {isHost && (
                    <Button 
                      variant="accent" 
                      onClick={handleStartGame}
                      icon={<Play className="h-4 w-4" />}
                    >
                      Play Another Game
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <motion.button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-4 shadow-lg z-50"
          onClick={handleOpenChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            scale: unreadMessages > 0 ? [1, 1.1, 1] : 1,
          }}
          transition={{ 
            repeat: unreadMessages > 0 ? Infinity : 0,
            duration: 1 
          }}
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <Users className="h-4 w-4" />
          </div>
          {unreadMessages > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </motion.div>
          )}
        </motion.button>
      )}
      
      {/* Game Selection Modal */}
      <GameSelectionModal
        isOpen={showGameSelection}
        onClose={() => setShowGameSelection(false)}
        onSelectGame={handleGameSelect}
        isHost={isHost}
        roomPlayers={currentRoom.players}
      />
      
      {/* Chat Room */}
      <ChatRoom
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        currentUser={user || { id: 'guest', nickname: 'Guest Player', avatarColor: 'blue', avatarAccessory: 'none' }}
        roomPlayers={currentRoom.players}
        onSendMessage={handleSendMessage}
        roomHost={currentRoom.host}
      />
    </div>
  );
};

export default GameRoomPage;