import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MessageCircle, Gamepad2, Crown, Star, Bell } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import SocialHub from './SocialHub';
import { useBackend } from '../contexts/BackendContext';

interface FriendsPanelProps {
  onInviteToGame?: (friendId: string) => void;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ onInviteToGame }) => {
  const { 
    currentUser, 
    onlineFriends, 
    friendRequests, 
    notifications,
    inviteToGame 
  } = useBackend();
  
  const [showSocialHub, setShowSocialHub] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingRequests = friendRequests.length;

  const handleInviteToGame = async (friendId: string) => {
    try {
      await inviteToGame(friendId, 'math-mania'); // Default game type
      if (onInviteToGame) {
        onInviteToGame(friendId);
      }
    } catch (error) {
      console.error('Failed to invite friend:', error);
    }
  };

  return (
    <>
      {/* Floating Friends Panel */}
      <motion.div
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className={`bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-80' : 'w-16'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          {/* Header */}
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                {isExpanded && <span className="font-bold">Friends</span>}
              </div>
              
              {(unreadNotifications > 0 || pendingRequests > 0) && (
                <motion.div
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {unreadNotifications + pendingRequests > 9 ? '9+' : unreadNotifications + pendingRequests}
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                {/* Quick Actions */}
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSocialHub(true)}
                    icon={<UserPlus className="h-4 w-4" />}
                    fullWidth
                  >
                    Social Hub
                  </Button>
                </div>

                {/* Notifications Summary */}
                {(unreadNotifications > 0 || pendingRequests > 0) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center space-x-2 text-yellow-700">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {pendingRequests > 0 && `${pendingRequests} friend request${pendingRequests > 1 ? 's' : ''}`}
                        {pendingRequests > 0 && unreadNotifications > 0 && ', '}
                        {unreadNotifications > 0 && `${unreadNotifications} notification${unreadNotifications > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Online Friends */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                    Online Friends ({onlineFriends.length})
                  </h4>
                  
                  {onlineFriends.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No friends online
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {onlineFriends.slice(0, 5).map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-purple-50 transition-colors"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="relative">
                            <Avatar
                              color={friend.avatarColor as any}
                              accessory={friend.avatarAccessory as any}
                              size="sm"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 text-sm truncate">
                              {friend.nickname}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="h-3 w-3 mr-1" />
                              Level {friend.level}
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleInviteToGame(friend.id)}
                              className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                              title="Invite to Game"
                            >
                              <Gamepad2 className="h-3 w-3" />
                            </button>
                            
                            <button
                              onClick={() => {/* Open chat */}}
                              className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                              title="Message"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      
                      {onlineFriends.length > 5 && (
                        <button
                          onClick={() => setShowSocialHub(true)}
                          className="w-full text-center py-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View all {onlineFriends.length} friends
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {currentUser?.friends?.length || 0}
                    </div>
                    <div className="text-xs text-purple-500">Total Friends</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Social Hub Modal */}
      <SocialHub
        isOpen={showSocialHub}
        onClose={() => setShowSocialHub(false)}
        onInviteToGame={handleInviteToGame}
      />
    </>
  );
};

export default FriendsPanel;