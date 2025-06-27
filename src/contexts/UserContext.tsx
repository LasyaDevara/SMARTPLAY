import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from './SupabaseContext';

// Types
type AvatarColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange';
type AvatarAccessory = 'none' | 'glasses' | 'bowtie' | 'hat' | 'flower' | 'crown';

interface DailyStats {
  date: string;
  totalSolved: number;
  correctAnswers: number;
  xpEarned: number;
}

interface UserProfile {
  id: string;
  nickname: string;
  avatarColor: AvatarColor;
  avatarAccessory: AvatarAccessory;
  xp: number;
  level: number;
  stickers: string[];
  createdAt: number;
  dailyStats: DailyStats[];
  currentStreak: number;
  bestStreak: number;
  friends: string[];
  achievements: string[];
}

interface UserContextType {
  user: UserProfile | null;
  updateUser: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
  addSticker: (stickerId: string) => void;
  recordAnswer: (isCorrect: boolean, xpEarned: number) => void;
  getTodayStats: () => DailyStats;
  getXPRequiredForNextLevel: () => number;
  isProfileComplete: boolean;
  logout: () => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile, updateProfile, signOut } = useSupabase();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Sync with Supabase user profile
  useEffect(() => {
    if (userProfile) {
      const mappedUser: UserProfile = {
        id: userProfile.id,
        nickname: userProfile.nickname,
        avatarColor: userProfile.avatar_color as AvatarColor,
        avatarAccessory: userProfile.avatar_accessory as AvatarAccessory,
        xp: userProfile.xp,
        level: userProfile.level,
        stickers: userProfile.stickers,
        createdAt: new Date(userProfile.created_at).getTime(),
        dailyStats: userProfile.daily_stats,
        currentStreak: userProfile.current_streak,
        bestStreak: userProfile.best_streak,
        friends: userProfile.friends,
        achievements: userProfile.achievements,
      };
      
      setUser(mappedUser);
      setIsProfileComplete(true);
    } else {
      setUser(null);
      setIsProfileComplete(false);
    }
  }, [userProfile]);

  // Calculate XP required for next level (consistent 150 XP per level)
  const getXPRequiredForNextLevel = (): number => {
    return 150; // Every level requires exactly 150 XP
  };

  // Calculate level based on XP (150 XP per level)
  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 150) + 1;
  };

  // Get today's date string
  const getTodayDateString = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Get today's stats
  const getTodayStats = (): DailyStats => {
    if (!user) {
      return {
        date: getTodayDateString(),
        totalSolved: 0,
        correctAnswers: 0,
        xpEarned: 0
      };
    }

    const today = getTodayDateString();
    const todayStats = user.dailyStats.find(stat => stat.date === today);
    
    return todayStats || {
      date: today,
      totalSolved: 0,
      correctAnswers: 0,
      xpEarned: 0
    };
  };

  // Update user
  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Map to Supabase format
      const supabaseUpdates: any = {};
      
      if (updates.nickname) supabaseUpdates.nickname = updates.nickname;
      if (updates.avatarColor) supabaseUpdates.avatar_color = updates.avatarColor;
      if (updates.avatarAccessory) supabaseUpdates.avatar_accessory = updates.avatarAccessory;
      if (updates.xp !== undefined) supabaseUpdates.xp = updates.xp;
      if (updates.level !== undefined) supabaseUpdates.level = updates.level;
      if (updates.stickers) supabaseUpdates.stickers = updates.stickers;
      if (updates.dailyStats) supabaseUpdates.daily_stats = updates.dailyStats;
      if (updates.currentStreak !== undefined) supabaseUpdates.current_streak = updates.currentStreak;
      if (updates.bestStreak !== undefined) supabaseUpdates.best_streak = updates.bestStreak;
      if (updates.friends) supabaseUpdates.friends = updates.friends;
      if (updates.achievements) supabaseUpdates.achievements = updates.achievements;

      await updateProfile(supabaseUpdates);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Add XP and update level if needed
  const addXP = async (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const newLevel = calculateLevel(newXP);
    
    await updateUser({
      xp: newXP,
      level: newLevel,
    });
  };

  // Record an answer (correct or incorrect)
  const recordAnswer = async (isCorrect: boolean, xpEarned: number) => {
    if (!user) return;

    const today = getTodayDateString();
    const updatedDailyStats = [...user.dailyStats];
    
    // Find or create today's stats
    let todayStatsIndex = updatedDailyStats.findIndex(stat => stat.date === today);
    
    if (todayStatsIndex === -1) {
      // Create new entry for today
      updatedDailyStats.push({
        date: today,
        totalSolved: 1,
        correctAnswers: isCorrect ? 1 : 0,
        xpEarned: xpEarned
      });
    } else {
      // Update existing entry
      updatedDailyStats[todayStatsIndex] = {
        ...updatedDailyStats[todayStatsIndex],
        totalSolved: updatedDailyStats[todayStatsIndex].totalSolved + 1,
        correctAnswers: updatedDailyStats[todayStatsIndex].correctAnswers + (isCorrect ? 1 : 0),
        xpEarned: updatedDailyStats[todayStatsIndex].xpEarned + xpEarned
      };
    }

    // Update streak
    let newCurrentStreak = user.currentStreak;
    let newBestStreak = user.bestStreak;
    
    if (isCorrect) {
      newCurrentStreak++;
      if (newCurrentStreak > newBestStreak) {
        newBestStreak = newCurrentStreak;
      }
    } else {
      newCurrentStreak = 0;
    }

    // Calculate new level
    const newXP = user.xp + xpEarned;
    const newLevel = calculateLevel(newXP);

    await updateUser({
      xp: newXP,
      level: newLevel,
      dailyStats: updatedDailyStats,
      currentStreak: newCurrentStreak,
      bestStreak: newBestStreak,
    });
  };

  // Add a sticker to collection
  const addSticker = async (stickerId: string) => {
    if (!user) return;
    
    // Only add if user doesn't already have it
    if (!user.stickers.includes(stickerId)) {
      await updateUser({
        stickers: [...user.stickers, stickerId],
      });
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser,
        addXP, 
        addSticker,
        recordAnswer,
        getTodayStats,
        getXPRequiredForNextLevel,
        isProfileComplete,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};