import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, FriendRequest, Notification } from '../lib/supabase';
import supabaseService from '../services/supabaseService';

interface SupabaseContextType {
  // Auth
  userProfile: UserProfile | null;
  createUserProfile: (username: string, favoritePlace: string, avatarColor: string, avatarAccessory: string) => Promise<void>;
  signInWithFavoritePlace: (username: string, favoritePlace: string) => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // User Management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  searchUsers: (query: string) => Promise<UserProfile[]>;
  
  // Friends System
  friends: UserProfile[];
  onlineFriends: UserProfile[];
  friendRequests: FriendRequest[];
  sendFriendRequest: (userId: string, message?: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  
  // Discovery
  onlinePlayers: UserProfile[];
  suggestedFriends: UserProfile[];
  refreshOnlinePlayers: () => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Game Progress
  updateGameProgress: (gameType: string, progress: any) => Promise<void>;
  recordGameSession: (sessionData: any) => Promise<void>;
  getLeaderboard: (gameType: string, timeframe: string) => Promise<UserProfile[]>;
  
  // Analytics
  getUserStats: (timeframe?: string) => Promise<any>;
  exportUserData: () => Promise<any>;
  
  // System
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  
  // Connection status
  isConnected: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<UserProfile[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Test Supabase connection on startup
  useEffect(() => {
    const testConnection = async () => {
      try {
        const connected = await supabaseService.testConnection();
        setIsConnected(connected);
        
        if (connected) {
          console.log('✅ Supabase connected successfully');
        } else {
          console.warn('⚠️ Supabase not available, using localStorage fallback');
        }
      } catch (error) {
        console.warn('⚠️ Supabase connection test failed, using localStorage fallback');
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  // Initialize user state from localStorage
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUserId = localStorage.getItem('smartplay_current_user');
        if (storedUserId) {
          const profile = await supabaseService.getUserById(storedUserId);
          if (profile) {
            setUserProfile(profile);
            await loadUserData(profile.id);
          } else {
            // User not found, clear storage
            localStorage.removeItem('smartplay_current_user');
          }
        }
      } catch (error) {
        console.error('Failed to load stored user:', error);
        localStorage.removeItem('smartplay_current_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // Load user-related data
  const loadUserData = async (userId: string) => {
    try {
      const [userFriends, requests, userNotifications, onlineUsers] = await Promise.all([
        supabaseService.getFriends(userId),
        supabaseService.getFriendRequests(userId),
        supabaseService.getNotifications(userId),
        supabaseService.getOnlineUsers()
      ]);

      setFriends(userFriends);
      setOnlineFriends(userFriends.filter(f => isUserOnline(f.last_active)));
      setFriendRequests(requests);
      setNotifications(userNotifications);
      
      // Filter out current user from online players
      const filteredOnlinePlayers = onlineUsers.filter(u => u.id !== userId);
      setOnlinePlayers(filteredOnlinePlayers);
      
      // Generate suggested friends
      const friendIds = new Set(userFriends.map(f => f.id));
      const suggested = filteredOnlinePlayers
        .filter(p => !friendIds.has(p.id))
        .slice(0, 5);
      
      setSuggestedFriends(suggested);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data');
    }
  };

  // Helper function to check if user is online
  const isUserOnline = (lastActive: string): boolean => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastActive) >= fiveMinutesAgo;
  };

  // Check if username is available
  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    try {
      setError(null);
      
      const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
      if (!usernameRegex.test(username)) {
        return false;
      }
      
      const existingUser = await supabaseService.getUserByUsername(username);
      return !existingUser;
    } catch (error: any) {
      console.error('Error checking username availability:', error);
      console.warn('Username availability check failed, assuming available');
      return true;
    }
  };

  // Sign in with username and favorite place
  const signInWithFavoritePlace = async (username: string, favoritePlace: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
      if (!usernameRegex.test(username)) {
        throw new Error('Invalid username format');
      }

      const user = await supabaseService.getUserByUsername(username);
      if (!user) {
        throw new Error('Username not found. Please check your username or sign up.');
      }

      // Check favorite place (password) - case-insensitive and trimmed comparison
      const normalizedInputPlace = favoritePlace.trim().toLowerCase();
      const normalizedStoredPlace = (user.favorite_place || '').trim().toLowerCase();
      
      if (normalizedStoredPlace !== normalizedInputPlace) {
        throw new Error('Incorrect favorite place. Please try again.');
      }

      setUserProfile(user);
      localStorage.setItem('smartplay_current_user', user.id);
      await loadUserData(user.id);
      
      console.log('✅ User signed in successfully:', username);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create user profile
  const createUserProfile = async (username: string, favoritePlace: string, avatarColor: string, avatarAccessory: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
      if (!usernameRegex.test(username)) {
        throw new Error('Username must be 3-15 characters and contain only letters, numbers, and underscores');
      }

      const placeRegex = /^[a-zA-Z0-9\s\-',\.]{2,30}$/;
      if (!placeRegex.test(favoritePlace.trim())) {
        throw new Error('Favorite place must be 2-30 characters');
      }

      const isAvailable = await checkUsernameAvailable(username);
      if (!isAvailable) {
        throw new Error('This username is already taken. Please choose another one.');
      }

      const newProfile = await supabaseService.createUser({
        id: username,
        nickname: username,
        favorite_place: favoritePlace.trim().toLowerCase(),
        avatar_color: avatarColor,
        avatar_accessory: avatarAccessory,
      });

      setUserProfile(newProfile);
      localStorage.setItem('smartplay_current_user', username);
      await loadUserData(newProfile.id);
      
      console.log('✅ User profile created successfully:', username);
    } catch (error: any) {
      console.error('Create profile error:', error);
      setError(error.message || 'Failed to create profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (userProfile) {
        await supabaseService.updateOnlineStatus(userProfile.id, false);
      }
      
      localStorage.removeItem('smartplay_current_user');
      setUserProfile(null);
      setFriends([]);
      setOnlineFriends([]);
      setFriendRequests([]);
      setNotifications([]);
      setOnlinePlayers([]);
      setSuggestedFriends([]);
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Failed to sign out');
    }
  };

  // Profile functions
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      await supabaseService.updateUser(userProfile.id, updates);
      setUserProfile({ ...userProfile, ...updates });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
      throw error;
    }
  };

  const searchUsers = async (query: string): Promise<UserProfile[]> => {
    try {
      return await supabaseService.searchUsers(query, userProfile?.id);
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  };

  // Friends functions
  const sendFriendRequest = async (userId: string, message?: string) => {
    if (!userProfile) return;
    
    try {
      await supabaseService.sendFriendRequest(userProfile.id, userId, message);
      await loadUserData(userProfile.id);
    } catch (error: any) {
      console.error('Failed to send friend request:', error);
      setError('Failed to send friend request');
      throw error;
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      await supabaseService.acceptFriendRequest(requestId);
      if (userProfile) {
        await loadUserData(userProfile.id);
      }
    } catch (error: any) {
      console.error('Failed to accept friend request:', error);
      setError('Failed to accept friend request');
      throw error;
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await supabaseService.declineFriendRequest(requestId);
      if (userProfile) {
        await loadUserData(userProfile.id);
      }
    } catch (error: any) {
      console.error('Failed to decline friend request:', error);
      setError('Failed to decline friend request');
      throw error;
    }
  };

  const removeFriend = async (userId: string) => {
    if (!userProfile) return;
    
    try {
      await supabaseService.removeFriend(userProfile.id, userId);
      await loadUserData(userProfile.id);
    } catch (error: any) {
      console.error('Failed to remove friend:', error);
      setError('Failed to remove friend');
      throw error;
    }
  };

  // Discovery functions
  const refreshOnlinePlayers = async () => {
    if (!userProfile) return;
    
    try {
      const onlineUsers = await supabaseService.getOnlineUsers();
      const filteredPlayers = onlineUsers.filter(u => u.id !== userProfile.id);
      setOnlinePlayers(filteredPlayers);
    } catch (error) {
      console.error('Failed to refresh online players:', error);
    }
  };

  // Notifications functions
  const markNotificationRead = async (notificationId: string) => {
    try {
      await supabaseService.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => supabaseService.markNotificationRead(n.id))
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // Game progress functions
  const updateGameProgress = async (gameType: string, progress: any) => {
    if (!userProfile) return;
    
    try {
      await supabaseService.updateGameProgress(userProfile.id, gameType, progress);
    } catch (error: any) {
      console.error('Failed to update game progress:', error);
      setError('Failed to update game progress');
      throw error;
    }
  };

  const recordGameSession = async (sessionData: any) => {
    if (!userProfile) return;
    
    try {
      await supabaseService.recordGameSession(userProfile.id, sessionData);
    } catch (error) {
      console.error('Failed to record game session:', error);
    }
  };

  const getLeaderboard = async (gameType: string, timeframe: string): Promise<UserProfile[]> => {
    try {
      return await supabaseService.getLeaderboard(gameType, timeframe as any);
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  };

  // Analytics functions
  const getUserStats = async (timeframe?: string): Promise<any> => {
    if (!userProfile) return {};
    
    try {
      return await supabaseService.getUserStats(userProfile.id, timeframe);
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return {};
    }
  };

  const exportUserData = async (): Promise<any> => {
    if (!userProfile) return null;
    
    try {
      return await supabaseService.exportUserData(userProfile.id);
    } catch (error: any) {
      console.error('Failed to export user data:', error);
      setError('Failed to export user data');
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Set up real-time subscriptions only if connected
  useEffect(() => {
    if (!userProfile || !isConnected) return;

    try {
      // Subscribe to friend requests
      const friendRequestsSubscription = supabase
        .channel('friend_requests')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'friend_requests',
            filter: `to_user_id=eq.${userProfile.id}`
          }, 
          () => {
            loadUserData(userProfile.id);
          }
        )
        .subscribe();

      // Subscribe to notifications
      const notificationsSubscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userProfile.id}`
          }, 
          () => {
            loadUserData(userProfile.id);
          }
        )
        .subscribe();

      return () => {
        friendRequestsSubscription.unsubscribe();
        notificationsSubscription.unsubscribe();
      };
    } catch (error) {
      console.warn('Failed to set up real-time subscriptions:', error);
    }
  }, [userProfile, isConnected]);

  // Update online status periodically
  useEffect(() => {
    if (!userProfile) return;

    const updateOnlineStatus = () => {
      supabaseService.updateOnlineStatus(userProfile.id, true);
    };

    // Update immediately
    updateOnlineStatus();

    // Update every 2 minutes
    const interval = setInterval(updateOnlineStatus, 2 * 60 * 1000);

    // Update on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateOnlineStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Set offline when component unmounts
      supabaseService.updateOnlineStatus(userProfile.id, false);
    };
  }, [userProfile]);

  return (
    <SupabaseContext.Provider
      value={{
        // Auth
        userProfile,
        createUserProfile,
        signInWithFavoritePlace,
        checkUsernameAvailable,
        signOut,
        
        // User Management
        updateProfile,
        searchUsers,
        
        // Friends System
        friends,
        onlineFriends,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        
        // Discovery
        onlinePlayers,
        suggestedFriends,
        refreshOnlinePlayers,
        
        // Notifications
        notifications,
        markNotificationRead,
        clearAllNotifications,
        
        // Game Progress
        updateGameProgress,
        recordGameSession,
        getLeaderboard,
        
        // Analytics
        getUserStats,
        exportUserData,
        
        // System
        isLoading,
        error,
        clearError,
        
        // Connection status
        isConnected
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};