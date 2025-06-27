import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Bell, Settings, Crown, Star, 
  MessageCircle, Gamepad2, Trophy, Heart, X, Check, 
  UserMinus, Shield, Eye, EyeOff, Filter, RefreshCw,
  Clock, Zap, Target, Award
} from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { useBackend } from '../contexts/BackendContext';

interface SocialHubProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteToGame?: (friendId: string) => void;
}

const SocialHub: React.FC<SocialHubProps> = ({ isOpen, onClose, onInviteToGame }) => {
  const {
    currentUser,
    friends,
    onlineFriends,
    friendRequests,
    onlinePlayers,
    suggestedFriends,
    notifications,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    searchUsers,
    refreshOnlinePlayers,
    markNotificationRead,
    clearAllNotifications
  } = useBackend();

  const [activeTab, setActiveTab] = useState<'friends' | 'discover' | 'requests' | 'notifications'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Search users
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results.filter(user => user.id !== currentUser?.id));
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchUsers, currentUser]);

  // Refresh online players periodically
  useEffect(() => {
    if (isOpen) {
      refreshOnlinePlayers();
      const interval = setInterval(refreshOnlinePlayers, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, refreshOnlinePlayers]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      try {
        await removeFriend(userId);
      } catch (error) {
        console.error('Failed to remove friend:', error);
      }
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (confirm('Are you sure you want to block this user?')) {
      try {
        await blockUser(userId);
      } catch (error) {
        console.error('Failed to block user:', error);
      }
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'friends': return <Users className="h-5 w-5" />;
      case 'discover': return <Search className="h-5 w-5" />;
      case 'requests': return <UserPlus className="h-5 w-5" />;
      case 'notifications': return <Bell className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'friends': return friends.length;
      case 'discover': return onlinePlayers.length;
      case 'requests': return friendRequests.length;
      case 'notifications': return notifications.filter(n => !n.read).length;
      default: return 0;
    }
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Social Hub</h2>
              <p className="text-purple-100">Connect with friends and discover new players</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshOnlinePlayers}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-1">
            {[
              { id: 'friends', label: 'Friends' },
              { id: 'discover', label: 'Discover' },
              { id: 'requests', label: 'Requests' },
              { id: 'notifications', label: 'Notifications' }
            ].map((tab) => {
              const count = getTabCount(tab.id);
              return (
                <motion.button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {getTabIcon(tab.id)}
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <motion.div
                      className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${
                        activeTab === tab.id ? 'bg-white text-purple-500' : 'bg-purple-500 text-white'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {count > 99 ? '99+' : count}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto p-6"
            >
              {/* Friends Tab */}
              {activeTab === 'friends' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Your Friends</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          showOnlineOnly ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {showOnlineOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span>Online Only</span>
                      </button>
                    </div>
                  </div>

                  {friends.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">No friends yet</h3>
                      <p className="text-gray-500 mb-6">Discover new players and send friend requests!</p>
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab('discover')}
                        icon={<Search className="h-5 w-5" />}
                      >
                        Discover Players
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(showOnlineOnly ? onlineFriends : friends).map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          className="bg-white rounded-2xl shadow-md p-4 border-2 border-gray-100 hover:border-purple-300 transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar
                                color={friend.avatarColor as any}
                                accessory={friend.avatarAccessory as any}
                                size="md"
                              />
                              {friend.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-gray-800">{friend.nickname}</h4>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-600">Level {friend.level}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className={`flex items-center ${friend.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                  <div className={`w-2 h-2 rounded-full mr-2 ${friend.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                  {friend.isOnline ? 'Online' : formatLastActive(friend.lastActive)}
                                </span>
                                <span className="flex items-center">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  {friend.xp} XP
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              {onInviteToGame && friend.isOnline && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => onInviteToGame(friend.id)}
                                  icon={<Gamepad2 className="h-4 w-4" />}
                                >
                                  Invite
                                </Button>
                              )}
                              
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {/* Open chat */}}
                                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                  title="Message"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => handleRemoveFriend(friend.id)}
                                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                  title="Remove Friend"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Discover Tab */}
              {activeTab === 'discover' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Discover Players</h3>
                    
                    {/* Search Bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search players by nickname..."
                        className="w-full px-4 py-3 pl-12 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      {isSearching && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-700 mb-4">Search Results</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((user, index) => (
                          <PlayerCard
                            key={user.id}
                            user={user}
                            index={index}
                            onSendRequest={() => handleSendFriendRequest(user.id)}
                            onBlock={() => handleBlockUser(user.id)}
                            currentUser={currentUser}
                            friends={friends}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Friends */}
                  {suggestedFriends.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-700 mb-4">Suggested Friends</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedFriends.map((user, index) => (
                          <PlayerCard
                            key={user.id}
                            user={user}
                            index={index}
                            onSendRequest={() => handleSendFriendRequest(user.id)}
                            onBlock={() => handleBlockUser(user.id)}
                            currentUser={currentUser}
                            friends={friends}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Online Players */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-700 mb-4">Online Players</h4>
                    {onlinePlayers.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🌐</div>
                        <p className="text-gray-500">No other players online right now</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {onlinePlayers.slice(0, 8).map((player, index) => (
                          <motion.div
                            key={player.id}
                            className="bg-white rounded-2xl shadow-md p-4 border-2 border-gray-100 hover:border-purple-300 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Avatar
                                  color={player.avatarColor as any}
                                  accessory={player.avatarAccessory as any}
                                  size="md"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{player.nickname}</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span className="flex items-center text-green-600">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    Online
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1" />
                                    Level {player.level}
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSendFriendRequest(player.id)}
                                icon={<UserPlus className="h-4 w-4" />}
                              >
                                Add
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Friend Requests Tab */}
              {activeTab === 'requests' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Friend Requests</h3>
                  
                  {friendRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📬</div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">No pending requests</h3>
                      <p className="text-gray-500">Friend requests will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {friendRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar
                                color={request.fromUser.avatarColor as any}
                                accessory={request.fromUser.avatarAccessory as any}
                                size="md"
                              />
                              
                              <div>
                                <h4 className="font-bold text-gray-800">{request.fromUser.nickname}</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1" />
                                    Level {request.fromUser.level}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatLastActive(request.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                                icon={<Check className="h-4 w-4" />}
                              >
                                Accept
                              </Button>
                              
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDeclineRequest(request.id)}
                                icon={<X className="h-4 w-4" />}
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Notifications</h3>
                    {notifications.some(n => !n.read) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={clearAllNotifications}
                        icon={<Check className="h-4 w-4" />}
                      >
                        Mark All Read
                      </Button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔔</div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">No notifications</h3>
                      <p className="text-gray-500">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          className={`rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                            notification.read 
                              ? 'bg-gray-50 border-gray-200' 
                              : 'bg-blue-50 border-blue-200 shadow-md'
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'friend_request' ? 'bg-purple-100 text-purple-600' :
                              notification.type === 'game_invite' ? 'bg-green-100 text-green-600' :
                              notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                              notification.type === 'level_up' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.type === 'friend_request' && <UserPlus className="h-4 w-4" />}
                              {notification.type === 'game_invite' && <Gamepad2 className="h-4 w-4" />}
                              {notification.type === 'achievement' && <Trophy className="h-4 w-4" />}
                              {notification.type === 'level_up' && <Star className="h-4 w-4" />}
                              {notification.type === 'friend_online' && <Users className="h-4 w-4" />}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{notification.title}</h4>
                              <p className="text-gray-600 text-sm">{notification.message}</p>
                              <span className="text-xs text-gray-500">{formatLastActive(notification.timestamp)}</span>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Player Card Component
const PlayerCard: React.FC<{
  user: any;
  index: number;
  onSendRequest: () => void;
  onBlock: () => void;
  currentUser: any;
  friends: any[];
}> = ({ user, index, onSendRequest, onBlock, currentUser, friends }) => {
  const isFriend = friends.some(f => f.id === user.id);
  const hasRequestSent = currentUser?.friendRequests?.sent?.includes(user.id);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-4 border-2 border-gray-100 hover:border-purple-300 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar
            color={user.avatarColor as any}
            accessory={user.avatarAccessory as any}
            size="md"
          />
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">{user.nickname}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Level {user.level}
            </span>
            <span className="flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {user.xp} XP
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isFriend && !hasRequestSent && (
            <Button
              variant="primary"
              size="sm"
              onClick={onSendRequest}
              icon={<UserPlus className="h-4 w-4" />}
            >
              Add
            </Button>
          )}
          
          {hasRequestSent && (
            <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Sent
            </div>
          )}
          
          {isFriend && (
            <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Friends
            </div>
          )}
          
          <button
            onClick={onBlock}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Block User"
          >
            <Shield className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialHub;