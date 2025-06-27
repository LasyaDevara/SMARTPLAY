# SmartPlay - Educational Gaming Platform

A modern, cloud-powered educational gaming platform built with React, TypeScript, and Supabase. SmartPlay enables children to learn together through interactive games while building friendships in a safe, supervised environment.

## 🌟 Features

### 🎮 Educational Games
- **Math Mania**: Collaborative problem-solving with real-time hints
- **Spelling Bee**: Master spelling with friend assistance
- **Interactive Tales**: Experience moral stories together
- **Nursery Rhymes**: Fill-in-the-blank rhyme games
- **Multiplication Tables**: Team-based math challenges
- **Mixed Challenges**: Combined game modes for variety

### 👥 Social Features
- **Simple Username System**: No emails or passwords needed - just pick a unique username!
- **Real-time Friends System**: Send requests, manage connections
- **Live Online Status**: See who's available to play
- **Instant Notifications**: Friend requests, game invites, achievements
- **Team Chat**: In-game communication with moderation
- **Multiplayer Rooms**: Create and join game sessions

### 🏆 Progress Tracking
- **XP & Leveling System**: Earn experience through gameplay
- **Achievement Badges**: Unlock rewards for milestones
- **Daily Statistics**: Track learning progress over time
- **Streak Counters**: Maintain learning momentum
- **Leaderboards**: Friendly competition with peers

### 🔒 Security & Privacy
- **Kid-Friendly Authentication**: Username-only system (no personal info required)
- **Row-Level Security**: Database-level access control
- **Privacy Settings**: Control profile visibility and interactions
- **Safe Environment**: Moderated chat and supervised gameplay

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** for development and building

### Backend (Supabase)
- **PostgreSQL Database** with real-time subscriptions
- **Username-based Authentication** (no email/password needed)
- **Row Level Security (RLS)** for data protection
- **Real-time Updates** for live features
- **Edge Functions** for serverless logic

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `react-router-dom` - Navigation
- `framer-motion` - Animations
- `react-confetti` - Celebration effects
- `uuid` - Unique identifiers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartplay
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database Schema

**IMPORTANT**: Run the latest migration file in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor** tab
3. Copy and paste the **entire contents** of `supabase/migrations/20250620102610_navy_torch.sql`
4. Click **Run** to execute the migration

This creates all necessary tables, indexes, RLS policies, and triggers with the correct schema for string-based user IDs.

**Note**: Make sure to use the latest migration file (`20250620102610_navy_torch.sql`) as it contains the correct schema with TEXT-based user IDs that match the application design.

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📊 Database Schema

### Core Tables
- `user_profiles` - User accounts with username as primary key (TEXT type)
- `friend_requests` - Friend system management
- `notifications` - User notifications and alerts
- `game_sessions` - Individual gameplay records
- `game_rooms` - Multiplayer room management
- `room_participants` - Players in game rooms
- `chat_messages` - In-game chat history

### Key Features
- **Username as Primary Key**: No email/password required
- **Row Level Security (RLS)** enabled on all tables
- **Real-time subscriptions** for live updates
- **Automatic timestamp management** with triggers

## 🎯 Authentication System

### Kid-Friendly Design
```typescript
// Simple username-based authentication
const createUserProfile = async (username: string, avatarColor: string, avatarAccessory: string) => {
  // Check username availability
  const isAvailable = await checkUsernameAvailable(username);
  
  // Create profile with username as ID
  const newProfile = await supabaseService.createUser({
    id: username, // Username is the primary key
    nickname: username,
    avatar_color: avatarColor,
    avatar_accessory: avatarAccessory,
  });
};
```

### Benefits
- **No personal information** required
- **Unique usernames** prevent duplicates
- **Instant access** - no email verification
- **Kid-safe** - no password management needed
- **Persistent identity** - username stays forever

## 🎮 Game Architecture

### Solo Games
- Local state management with React hooks
- Progress saved to Supabase on completion
- XP and achievements updated in real-time

### Multiplayer Games
- Real-time synchronization via Supabase subscriptions
- Shared game state in `game_rooms` table
- Live chat with message history
- Team-based scoring and bonuses

## 🔐 Security Implementation

### Row Level Security Policies
```sql
-- Users can only read their own profile and public profiles
CREATE POLICY "Users can read profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    privacy_settings->>'profile_visibility' = 'public' OR
    id = auth.uid()
  );
```

### Username Validation
- 3-15 characters only
- Letters, numbers, and underscores allowed
- Real-time availability checking
- Case-insensitive uniqueness

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Progressive Web App capabilities

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set environment variables
3. Deploy with automatic builds

### Supabase Production Setup
1. Upgrade to Pro plan for production features
2. Configure custom domain
3. Set up backup policies
4. Monitor usage and performance

## 🎨 Design Philosophy

### Kid-Friendly Interface
- Bright, colorful design
- Large, easy-to-click buttons
- Clear visual feedback
- Intuitive navigation
- Celebration animations

### Educational Focus
- Learning through play
- Collaborative problem-solving
- Positive reinforcement
- Progress visualization
- Achievement systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Pexels** for stock photography

---

Built with ❤️ for educational excellence and childhood development.
