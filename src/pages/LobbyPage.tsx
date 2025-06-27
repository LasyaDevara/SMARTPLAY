import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plus, LogOut, Calculator, PencilRuler, Users, User, Music, Book, Hash, Bell, UserPlus, Database, Wifi, WifiOff, Palette, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import GameCard from '../components/GameCard';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { useSupabase } from '../contexts/SupabaseContext';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isProfileComplete, getXPRequiredForNextLevel } = useUser();
  const { createRoom, joinRoom, currentRoom } = useGame();
  const { 
    friends, 
    onlineFriends, 
    friendRequests, 
    notifications,
    refreshOnlinePlayers,
    isConnected
  } = useSupabase();
  
  const [roomCode, setRoomCode] = useState('');
  const [joinError, setJoinError] = useState('');
  
  // If user doesn't have a profile, redirect to auth
  useEffect(() => {
    if (!isProfileComplete) {
      navigate('/auth');
    }
  }, [isProfileComplete, navigate]);
  
  // If room is active, redirect to chat room
  useEffect(() => {
    if (currentRoom) {
      navigate(`/chat-room/${currentRoom.id}`);
    }
  }, [currentRoom, navigate]);

  // Refresh online players when lobby loads
  useEffect(() => {
    refreshOnlinePlayers();
  }, [refreshOnlinePlayers]);
  
  const handleCreateRoom = () => {
    createRoom();
  };
  
  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      setJoinError('Please enter a room code');
      return;
    }
    
    joinRoom(roomCode.toUpperCase());
    setRoomCode('');
  };
  
  const handleGameSelect = (gameType: string) => {
    if (gameType === 'math-mania') {
      navigate('/math-mania');
    } else if (gameType === 'spelling-bee') {
      navigate('/spelling-bee');
    } else if (gameType === 'tales') {
      navigate('/tales');
    } else if (gameType === 'rhymes') {
      navigate('/rhymes');
    } else if (gameType === 'tables') {
      navigate('/tables');
    } else if (gameType === 'team-drawing') {
      navigate('/team-drawing');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return null;
  }

  // Calculate current level progress (XP within current level)
  const getCurrentLevelProgress = () => {
    if (!user) return 0;
    return user.xp % 150; // Since each level requires 150 XP
  };

  const currentLevelXP = getCurrentLevelProgress();
  const xpRequiredForNext = getXPRequiredForNextLevel();
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-600">SmartPlay</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <div className="flex items-center text-green-600">
                    <Wifi className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600">
                    <WifiOff className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Local Mode</span>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {/* TODO: Open notifications panel */}}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </motion.div>
                  )}
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center">
                <div className="mr-3 text-right hidden md:block">
                  <p className="font-bold text-gray-800">{user.nickname}</p>
                  <p className="text-xs text-gray-500">Level {user.level}</p>
                </div>
                <Avatar 
                  color={user.avatarColor as any}
                  accessory={user.avatarAccessory as any}
                  size="md"
                />
              </div>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
              >
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Connection Status Banner */}
              {!isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-6 w-6 text-orange-600 mr-3" />
                      <div>
                        <h3 className="font-bold text-orange-800">Local Mode</h3>
                        <p className="text-orange-700 text-sm">
                          Your progress is saved locally. Connect to Supabase to sync with friends and enable social features.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Stats */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Social Network</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{friends.length}</div>
                    <div className="text-purple-100">Total Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-300">{onlineFriends.length}</div>
                    <div className="text-purple-100">Online Now</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">{friendRequests.length}</div>
                    <div className="text-purple-100">Pending Requests</div>
                  </div>
                </div>
                
                {friendRequests.length > 0 && (
                  <div className="mt-4 p-3 bg-white/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">You have pending friend requests!</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<UserPlus className="h-4 w-4" />}
                        className="bg-white/20 hover:bg-white/30"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Study Rooms with Friends
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
                      <h3 className="text-xl font-bold text-gray-800">Create Study Room</h3>
                    </div>
                    <p className="mb-6 text-gray-600">
                      Start a study room where you and your friends can chat, discuss homework, and help each other learn.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="text-sm text-blue-700">
                        <div className="font-semibold mb-1">Perfect for:</div>
                        <div className="space-y-1">
                          <div>• Homework help and discussions</div>
                          <div>• Sharing study tips and strategies</div>
                          <div>• Group problem solving</div>
                          <div>• Encouraging each other</div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="primary" 
                      fullWidth
                      icon={<Plus className="h-5 w-5" />}
                      onClick={handleCreateRoom}
                    >
                      Create Study Room
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-green-500 mr-3" />
                      <h3 className="text-xl font-bold text-gray-800">Join Friends</h3>
                    </div>
                    <p className="mb-4 text-gray-600">
                      Enter a room code to join your friends' study session.
                    </p>
                    
                    <div className="mb-4">
                      <input
                        type="text"
                        className="input w-full uppercase"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => {
                          setRoomCode(e.target.value);
                          setJoinError('');
                        }}
                        maxLength={6}
                      />
                      {joinError && (
                        <p className="text-error-600 text-sm mt-1">{joinError}</p>
                      )}
                    </div>
                    
                    <Button 
                      variant="accent" 
                      fullWidth
                      onClick={handleJoinRoom}
                    >
                      Join Study Room
                    </Button>
                  </div>
                </div>
              </section>
              
              <section>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Learning Games
                    </h2>
                    <p className="text-sm text-gray-600">
                      Practice and improve your skills with solo games
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GameCard
                    title="Math Mania"
                    description="Solve math puzzles and build your calculation skills"
                    icon={<Calculator className="h-10 w-10" />}
                    onClick={() => handleGameSelect('math-mania')}
                  />
                  
                  <GameCard
                    title="Spelling Bee"
                    description="Master spelling with word challenges and hints"
                    icon={<PencilRuler className="h-10 w-10" />}
                    onClick={() => handleGameSelect('spelling-bee')}
                  />
                  
                  <GameCard
                    title="Tales"
                    description="Learn moral lessons through interactive stories"
                    icon={<Book className="h-10 w-10" />}
                    onClick={() => handleGameSelect('tales')}
                  />

                  <GameCard
                    title="Rhymes"
                    description="Fill in the blanks in classic nursery rhymes"
                    icon={<Music className="h-10 w-10" />}
                    onClick={() => handleGameSelect('rhymes')}
                  />

                  <GameCard
                    title="Tables"
                    description="Master multiplication tables with fun quizzes"
                    icon={<Hash className="h-10 w-10" />}
                    onClick={() => handleGameSelect('tables')}
                  />
                  
                  <GameCard
                    title="Team Drawing"
                    description="Draw freely or color beautiful diagrams"
                    icon={<Palette className="h-10 w-10" />}
                    onClick={() => handleGameSelect('team-drawing')}
                  />
                </div>
              </section>
            </div>
            
            <div className="lg:col-span-1">
              <section>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                    <div className="flex items-center">
                      <User className="h-6 w-6 mr-2" />
                      <h2 className="text-xl font-bold">Your Profile</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <Avatar
                        color={user.avatarColor as any}
                        accessory={user.avatarAccessory as any}
                        size="lg"
                        animated
                      />
                      <h3 className="text-2xl font-bold mt-4 text-gray-800">{user.nickname}</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Level {user.level}</span>
                        <span className="text-gray-600">
                          {currentLevelXP}/{xpRequiredForNext} XP
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((currentLevelXP / xpRequiredForNext) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-700 mb-3">Sticker Collection</h4>
                      
                      {user.stickers.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {user.stickers.map((sticker, index) => (
                            <div key={index} className="bg-primary-50 rounded-lg p-2 flex items-center justify-center">
                              <span role="img" aria-label={sticker} className="text-2xl">
                                {getStickerEmoji(sticker)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                          <p>Play games to earn stickers!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-primary-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} SmartPlay - Learning is better together
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper function to get sticker emoji
const getStickerEmoji = (stickerId: string): string => {
  const stickerMap: Record<string, string> = {
    'math-wizard': '🧙‍♂️',
    'spelling-champ': '🏆',
    'art-master': '🎨',
    'team-player': '🤝',
    'super-brain': '🧠',
    'first-win': '🥇',
    // Story stickers
    'story-1': '🐢',
    'story-2': '🐺',
    'story-3': '🐜',
    'story-4': '🪿',
    'story-5': '🦁',
    // Rhyme stickers
    'rhyme-1': '⭐',
    'rhyme-2': '🌸',
    'rhyme-3': '🥚',
    'rhyme-4': '🐑',
    'rhyme-5': '👦',
    'rhyme-6': '🚣',
  };
  
  return stickerMap[stickerId] || '⭐';
};

export default LobbyPage;