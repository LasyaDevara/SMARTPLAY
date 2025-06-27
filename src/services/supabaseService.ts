import { supabase, UserProfile, FriendRequest, Notification, GameSession } from '../lib/supabase';

class SupabaseService {
  // Test connection to Supabase
  async testConnection(): Promise<boolean> {
    try {
      // Check if environment variables are properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your-project') || 
          supabaseKey.includes('your-anon-key')) {
        console.warn('⚠️ Supabase credentials not configured. Please update your .env file with actual Supabase credentials.');
        return false;
      }

      const { error } = await supabase.from('user_profiles').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }
      
      console.log('✅ Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }

  // User Management
  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const defaultGameProgress = {
      math_mania: {
        level: 1,
        high_score: 0,
        accuracy: 0,
        total_problems: 0,
        correct_answers: 0,
        best_time: 0,
        streak_record: 0
      },
      spelling_bee: {
        level: 1,
        completed_words: [],
        streak: 0,
        accuracy: 0,
        words_learned: 0,
        average_time: 0
      },
      tales: {
        completed_stories: [],
        favorite_stories: [],
        moral_lessons_learned: [],
        reading_time: 0,
        comprehension_score: 0
      },
      rhymes: {
        completed_rhymes: [],
        accuracy: 0,
        favorite_rhymes: [],
        creativity_score: 0,
        memorization_level: 0
      },
      tables: {
        mastered_tables: [],
        accuracy: 0,
        best_time: 0,
        speed_improvement: 0,
        difficulty_level: 1
      }
    };

    const defaultPrivacySettings = {
      show_online_status: true,
      allow_friend_requests: true,
      show_game_progress: true,
      profile_visibility: 'public' as const
    };

    const newUser = {
      id: userData.id || userData.nickname,
      nickname: userData.nickname,
      favorite_place: userData.favorite_place,
      avatar_color: userData.avatar_color,
      avatar_accessory: userData.avatar_accessory,
      xp: 0,
      level: 1,
      stickers: [],
      current_streak: 0,
      best_streak: 0,
      friends: [],
      achievements: [],
      daily_stats: [],
      game_progress: defaultGameProgress,
      privacy_settings: defaultPrivacySettings,
      is_online: true,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.error('Supabase create user error:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ User created successfully in Supabase:', data.nickname);
      return data;
    } catch (error: any) {
      console.error('Create user error:', error);
      throw new Error(error.message || 'Failed to create user account');
    }
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Supabase getUserById error:', error);
        return null;
      }

      if (data) {
        // Update last active
        await this.updateOnlineStatus(userId, true);
      }
      
      return data;
    } catch (error) {
      console.error('getUserById error:', error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<UserProfile | null> {
    try {
      // First try exact match on id (since username is used as id)
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', username)
        .maybeSingle();

      // If not found by id, try nickname
      if (!data && !error) {
        const { data: nicknameData, error: nicknameError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('nickname', username)
          .maybeSingle();

        data = nicknameData;
        error = nicknameError;
      }

      if (error) {
        console.error('Supabase getUserByUsername error:', error);
        return null;
      }

      if (data) {
        // Update last active
        await this.updateOnlineStatus(data.id, true);
      }
      
      return data;
    } catch (error) {
      console.error('getUserByUsername error:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Supabase updateUser error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('updateUser error:', error);
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async searchUsers(query: string, excludeUserId?: string): Promise<UserProfile[]> {
    try {
      let queryBuilder = supabase
        .from('user_profiles')
        .select('*')
        .ilike('nickname', `%${query}%`)
        .limit(20);

      if (excludeUserId) {
        queryBuilder = queryBuilder.neq('id', excludeUserId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Supabase searchUsers error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('searchUsers error:', error);
      return [];
    }
  }

  // Friends System
  async sendFriendRequest(fromUserId: string, toUserId: string, message?: string): Promise<void> {
    try {
      // Check if request already exists
      const { data: existing } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`and(from_user_id.eq.${fromUserId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${fromUserId})`)
        .eq('status', 'pending');

      if (existing && existing.length > 0) {
        throw new Error('Friend request already exists');
      }

      const { error } = await supabase
        .from('friend_requests')
        .insert([{
          from_user_id: fromUserId,
          to_user_id: toUserId,
          status: 'pending',
          message
        }]);

      if (error) {
        console.error('Supabase sendFriendRequest error:', error);
        throw new Error(error.message);
      }

      // Create notification
      const fromUser = await this.getUserById(fromUserId);
      if (fromUser) {
        await this.createNotification(toUserId, {
          type: 'friend_request',
          title: 'New Friend Request',
          message: `${fromUser.nickname} wants to be your friend!`,
          priority: 'medium',
          data: { from_user_id: fromUserId }
        });
      }
    } catch (error: any) {
      console.error('sendFriendRequest error:', error);
      throw error;
    }
  }

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          from_user:user_profiles!friend_requests_from_user_id_fkey(*)
        `)
        .eq('to_user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getFriendRequests error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('getFriendRequests error:', error);
      return [];
    }
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    try {
      // Get the request
      const { data: request, error: requestError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      if (requestError || !request) {
        console.error('Supabase acceptFriendRequest error:', requestError);
        throw new Error('Friend request not found');
      }

      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Supabase acceptFriendRequest update error:', updateError);
        throw new Error(updateError.message);
      }

      // Add to both users' friends lists
      const [fromUser, toUser] = await Promise.all([
        this.getUserById(request.from_user_id),
        this.getUserById(request.to_user_id)
      ]);

      if (fromUser && toUser) {
        await Promise.all([
          this.updateUser(request.from_user_id, {
            friends: [...(fromUser.friends || []), request.to_user_id]
          }),
          this.updateUser(request.to_user_id, {
            friends: [...(toUser.friends || []), request.from_user_id]
          })
        ]);

        // Notify the requester
        await this.createNotification(request.from_user_id, {
          type: 'friend_request',
          title: 'Friend Request Accepted',
          message: `${toUser.nickname} accepted your friend request!`,
          priority: 'medium'
        });
      }
    } catch (error: any) {
      console.error('acceptFriendRequest error:', error);
      throw error;
    }
  }

  async declineFriendRequest(requestId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) {
        console.error('Supabase declineFriendRequest error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('declineFriendRequest error:', error);
      throw error;
    }
  }

  async getFriends(userId: string): Promise<UserProfile[]> {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.friends || user.friends.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', user.friends);

      if (error) {
        console.error('Supabase getFriends error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('getFriends error:', error);
      return [];
    }
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId)
      ]);

      if (user && friend) {
        await Promise.all([
          this.updateUser(userId, {
            friends: (user.friends || []).filter(id => id !== friendId)
          }),
          this.updateUser(friendId, {
            friends: (friend.friends || []).filter(id => id !== userId)
          })
        ]);
      }
    } catch (error: any) {
      console.error('removeFriend error:', error);
      throw error;
    }
  }

  // Online Status
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_online: isOnline,
          last_active: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Supabase updateOnlineStatus error:', error);
      }
    } catch (error) {
      console.error('updateOnlineStatus error:', error);
    }
  }

  async getOnlineUsers(): Promise<UserProfile[]> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your-project') || 
          supabaseKey.includes('your-anon-key')) {
        console.warn('⚠️ Supabase not configured, returning empty online users list');
        return [];
      }

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .gte('last_active', fiveMinutesAgo)
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Supabase getOnlineUsers error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('getOnlineUsers error:', error);
      return [];
    }
  }

  // Notifications
  async createNotification(userId: string, notification: Partial<Notification>): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          ...notification,
          read: false
        }]);

      if (error) {
        console.error('Supabase createNotification error:', error);
      }
    } catch (error) {
      console.error('createNotification error:', error);
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase getNotifications error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('getNotifications error:', error);
      return [];
    }
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Supabase markNotificationRead error:', error);
      }
    } catch (error) {
      console.error('markNotificationRead error:', error);
    }
  }

  // Game Progress
  async updateGameProgress(userId: string, gameType: string, progress: any): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return;

      const updatedGameProgress = {
        ...user.game_progress,
        [gameType]: {
          ...user.game_progress[gameType as keyof typeof user.game_progress],
          ...progress
        }
      };

      await this.updateUser(userId, { game_progress: updatedGameProgress });
    } catch (error) {
      console.error('updateGameProgress error:', error);
    }
  }

  async recordGameSession(userId: string, sessionData: Partial<GameSession>): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .insert([{
          user_id: userId,
          ...sessionData
        }]);

      if (error) {
        console.error('Supabase recordGameSession error:', error);
      }
    } catch (error) {
      console.error('recordGameSession error:', error);
    }
  }

  async getLeaderboard(gameType: string, timeframe: 'daily' | 'weekly' | 'monthly' | 'allTime', limit: number = 10): Promise<UserProfile[]> {
    try {
      let query = supabase
        .from('user_profiles')
        .select('id, nickname, avatar_color, avatar_accessory, level, xp')
        .order('xp', { ascending: false })
        .limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase getLeaderboard error:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('getLeaderboard error:', error);
      return [];
    }
  }

  // Analytics
  async getUserStats(userId: string, timeframe?: string): Promise<any> {
    try {
      let query = supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId);

      if (timeframe === 'daily') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (timeframe === 'weekly') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query = query.gte('created_at', weekAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase getUserStats error:', error);
        return {};
      }

      const sessions = data || [];
      return {
        total_sessions: sessions.length,
        total_play_time: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
        average_score: sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length || 0,
        games_played: [...new Set(sessions.map(session => session.game_type))]
      };
    } catch (error) {
      console.error('getUserStats error:', error);
      return {};
    }
  }

  async exportUserData(userId: string): Promise<any> {
    try {
      const [user, sessions, notifications] = await Promise.all([
        this.getUserById(userId),
        supabase.from('game_sessions').select('*').eq('user_id', userId),
        supabase.from('notifications').select('*').eq('user_id', userId)
      ]);

      return {
        user,
        game_sessions: sessions.data || [],
        notifications: notifications.data || [],
        exported_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('exportUserData error:', error);
      return {};
    }
  }

  async blockUser(userId: string): Promise<void> {
    console.log(`Blocking user ${userId}`);
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;