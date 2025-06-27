import React, { createContext, useContext, ReactNode } from 'react';

// Simple mock backend context for compatibility
interface BackendContextType {
  isConnected: boolean;
  connectionString: string;
  setConnectionString: (connectionString: string) => void;
  testConnection: () => Promise<boolean>;
  currentUser: any;
  createUser: (userData: any) => Promise<any>;
  updateUser: (updates: any) => Promise<void>;
  friends: any[];
  onlineFriends: any[];
  friendRequests: any[];
  onlinePlayers: any[];
  suggestedFriends: any[];
  notifications: any[];
  sendFriendRequest: (userId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  refreshOnlinePlayers: () => Promise<void>;
  inviteToGame: (friendId: string, gameType: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  searchUsers: (query: string) => Promise<any[]>;
  getUserById: (userId: string) => Promise<any>;
  updateGameProgress: (gameType: string, progress: any) => Promise<void>;
  getLeaderboard: (gameType: string, timeframe: string) => Promise<any[]>;
  recordGameSession: (sessionData: any) => Promise<void>;
  joinFriendGame: (friendId: string) => Promise<void>;
  getUserStats: (timeframe?: string) => Promise<any>;
  exportUserData: () => Promise<any>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const BackendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock implementation - all functions return empty data or success
  const mockBackend: BackendContextType = {
    isConnected: true,
    connectionString: 'localStorage://mock',
    setConnectionString: () => {},
    testConnection: async () => true,
    currentUser: null,
    createUser: async () => ({}),
    updateUser: async () => {},
    friends: [],
    onlineFriends: [],
    friendRequests: [],
    onlinePlayers: [],
    suggestedFriends: [],
    notifications: [],
    sendFriendRequest: async () => {},
    acceptFriendRequest: async () => {},
    declineFriendRequest: async () => {},
    removeFriend: async () => {},
    blockUser: async () => {},
    unblockUser: async () => {},
    refreshOnlinePlayers: async () => {},
    inviteToGame: async () => {},
    markNotificationRead: async () => {},
    clearAllNotifications: async () => {},
    searchUsers: async () => [],
    getUserById: async () => null,
    updateGameProgress: async () => {},
    getLeaderboard: async () => [],
    recordGameSession: async () => {},
    joinFriendGame: async () => {},
    getUserStats: async () => ({}),
    exportUserData: async () => ({}),
    isLoading: false,
    error: null,
    clearError: () => {}
  };

  return (
    <BackendContext.Provider value={mockBackend}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
};