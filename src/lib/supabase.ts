import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  nickname: string;
  email?: string;
  favorite_place: string;
  avatar_color: string;
  avatar_accessory: string;
  xp: number;
  level: number;
  stickers: string[];
  created_at: string;
  updated_at: string;
  last_active: string;
  is_online: boolean;
  current_streak: number;
  best_streak: number;
  friends: string[];
  achievements: string[];
  daily_stats: DailyStats[];
  game_progress: GameProgress;
  privacy_settings: PrivacySettings;
}

export interface DailyStats {
  date: string;
  total_solved: number;
  correct_answers: number;
  xp_earned: number;
}

export interface GameProgress {
  math_mania: {
    level: number;
    high_score: number;
    accuracy: number;
    total_problems: number;
    correct_answers: number;
    best_time: number;
    streak_record: number;
  };
  spelling_bee: {
    level: number;
    completed_words: string[];
    streak: number;
    accuracy: number;
    words_learned: number;
    average_time: number;
  };
  tales: {
    completed_stories: number[];
    favorite_stories: number[];
    moral_lessons_learned: string[];
    reading_time: number;
    comprehension_score: number;
  };
  rhymes: {
    completed_rhymes: number[];
    accuracy: number;
    favorite_rhymes: number[];
    creativity_score: number;
    memorization_level: number;
  };
  tables: {
    mastered_tables: number[];
    accuracy: number;
    best_time: number;
    speed_improvement: number;
    difficulty_level: number;
  };
}

export interface PrivacySettings {
  show_online_status: boolean;
  allow_friend_requests: boolean;
  show_game_progress: boolean;
  profile_visibility: 'public' | 'friends' | 'private';
}

export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  message?: string;
  from_user?: UserProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'friend_request' | 'game_invite' | 'achievement' | 'friend_online' | 'level_up' | 'system';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  data?: any;
  priority: 'low' | 'medium' | 'high';
}

export interface GameSession {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  duration: number;
  accuracy: number;
  xp_earned: number;
  created_at: string;
  session_data: any;
}