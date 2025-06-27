import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, PencilRuler, Book, Music, Hash, Users, X, Play, Star, Trophy, Zap, Palette } from 'lucide-react';
import Button from './Button';

interface GameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameType: string) => void;
  isHost: boolean;
  roomPlayers: any[];
}

const games = [
  {
    id: 'math-mania',
    title: 'Math Mania',
    description: 'Solve math problems together and earn bonus XP for teamwork',
    icon: <Calculator className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Progressive',
    teamBonus: '+50% XP',
    features: ['Real-time collaboration', 'Shared questions', 'Team XP bonuses', 'Text chat support']
  },
  {
    id: 'spelling-bee',
    title: 'Spelling Bee',
    description: 'Master spelling with friends helping through chat hints',
    icon: <PencilRuler className="h-8 w-8" />,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Adaptive',
    teamBonus: '+40% XP',
    features: ['Letter hints', 'Team discussions', 'Pronunciation help', 'Text chat']
  },
  {
    id: 'tales',
    title: 'Interactive Tales',
    description: 'Experience moral stories together and discuss lessons',
    icon: <Book className="h-8 w-8" />,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Story-based',
    teamBonus: '+60% XP',
    features: ['Story discussions', 'Moral debates', 'Character analysis', 'Group reading']
  },
  {
    id: 'rhymes',
    title: 'Nursery Rhymes',
    description: 'Fill in rhyme blanks together and sing along',
    icon: <Music className="h-8 w-8" />,
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Easy',
    teamBonus: '+35% XP',
    features: ['Rhyme completion', 'Melody sharing', 'Creative verses', 'Sing together']
  },
  {
    id: 'tables',
    title: 'Multiplication Tables',
    description: 'Master times tables with team challenges',
    icon: <Hash className="h-8 w-8" />,
    color: 'from-red-500 to-pink-500',
    difficulty: 'Progressive',
    teamBonus: '+45% XP',
    features: ['Speed challenges', 'Pattern recognition', 'Mental math tricks', 'Team competitions']
  },
  {
    id: 'team-drawing',
    title: 'Team Drawing',
    description: 'Draw and color together in a collaborative art space',
    icon: <Palette className="h-8 w-8" />,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'Creative',
    teamBonus: '+40% XP',
    features: ['Collaborative canvas', 'Drawing tools', 'Coloring templates', 'Creative freedom']
  },
  {
    id: 'team-challenge',
    title: 'Mixed Challenge',
    description: 'Random mix of all games for ultimate team test',
    icon: <Trophy className="h-8 w-8" />,
    color: 'from-amber-500 to-orange-500',
    difficulty: 'Mixed',
    teamBonus: '+75% XP',
    features: ['All game types', 'Surprise rounds', 'Maximum teamwork', 'Varied challenges']
  }
];

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  isHost,
  roomPlayers
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setShowDetails(gameId);
  };

  const handleStartGame = () => {
    if (selectedGame) {
      onSelectGame(selectedGame);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Adventure!</h2>
              <p className="text-purple-100">
                {isHost ? 'Select a game for your team to play together with text chat' : 'Waiting for host to choose a game...'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm opacity-80">Team Size</div>
                <div className="text-2xl font-bold">{roomPlayers.length} Players</div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Game Selection Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedGame === game.id
                      ? 'ring-4 ring-purple-400 shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  } ${!isHost ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isHost && handleGameSelect(game.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={isHost ? { y: -5 } : {}}
                >
                  {/* Game Card */}
                  <div className={`bg-gradient-to-br ${game.color} p-6 text-white h-full`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-xl p-3">
                        {game.icon}
                      </div>
                      {selectedGame === game.id && (
                        <motion.div
                          className="bg-white text-purple-600 rounded-full p-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Star className="h-5 w-5" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{game.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-80">Difficulty:</span>
                        <span className="font-semibold">{game.difficulty}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-80">Team Bonus:</span>
                        <span className="font-semibold text-yellow-200">{game.teamBonus}</span>
                      </div>
                    </div>

                    {/* Text Chat Badge */}
                    <div className="mt-4 flex items-center justify-center bg-white/20 rounded-lg p-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Text Chat Enabled</span>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  {isHost && (
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold">
                        Select Game
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Details Panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {(() => {
                  const game = games.find(g => g.id === showDetails);
                  if (!game) return null;

                  return (
                    <div>
                      <div className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 text-white mb-6`}>
                        <div className="flex items-center mb-4">
                          <div className="bg-white/20 rounded-xl p-3 mr-4">
                            {game.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{game.title}</h3>
                            <p className="opacity-80">Multiplayer Mode</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span>Team XP Bonus</span>
                            <span className="text-2xl font-bold text-yellow-200">{game.teamBonus}</span>
                          </div>
                          <div className="text-sm opacity-80">
                            Earn extra XP when playing with friends!
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                            Multiplayer Features
                          </h4>
                          <div className="space-y-2">
                            {game.features.map((feature, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center p-3 bg-white rounded-xl shadow-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-blue-500" />
                            Team Chat Features
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                  💬
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">Text Messaging</div>
                                  <div className="text-gray-600">Send messages to your teammates during the game</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                  😊
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">Quick Messages & Emojis</div>
                                  <div className="text-gray-600">Use preset messages and emojis for fast communication</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                  🔄
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">Shared Questions</div>
                                  <div className="text-gray-600">Everyone sees the same question and can collaborate</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                            XP Distribution
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Base XP per question:</span>
                                <span className="font-bold text-blue-600">15 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time bonus:</span>
                                <span className="font-bold text-green-600">+2-10 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Team bonus:</span>
                                <span className="font-bold text-purple-600">+{roomPlayers.length * 3} XP</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-bold">
                                <span>Total possible:</span>
                                <span className="text-yellow-600">Up to {15 + 10 + (roomPlayers.length * 3)} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isHost ? (
                selectedGame ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    ✓ Game selected! Text chat will be available during gameplay.
                  </span>
                ) : (
                  <span>Select a game to continue</span>
                )
              ) : (
                <span>Waiting for host to choose a game...</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              {isHost && (
                <Button
                  variant="primary"
                  onClick={handleStartGame}
                  disabled={!selectedGame}
                  icon={<Play className="h-5 w-5" />}
                  className={selectedGame ? 'animate-pulse' : ''}
                >
                  Start Multiplayer Game!
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameSelectionModal;