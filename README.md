# SmartPlay - Educational Study Platform

A modern, cloud-powered educational study platform built with React, TypeScript, and Supabase. SmartPlay enables children to learn together through study rooms and interactive games while building friendships in a safe, supervised environment.

## 🌟 Features

### 📚 Study Rooms & Chat
- **Study Rooms with Friends**: Create or join study rooms with up to 6 friends
- **Topic-Based Discussions**: Quick-start conversations about Math, Reading, Homework Help, Study Tips, Memory Techniques, and Learning Goals
- **Real-time Chat**: Safe text messaging for homework discussions and peer support
- **Study Guidelines**: Built-in guidelines to maintain a positive learning environment
- **Friend Collaboration**: Help each other with assignments and share study strategies

### 🎮 Educational Games
- **Math Mania**: Collaborative problem-solving with real-time hints
- **Spelling Bee**: Master spelling with friend assistance
- **Interactive Tales**: Experience moral stories together
- **Nursery Rhymes**: Fill-in-the-blank rhyme games
- **Multiplication Tables**: Team-based math challenges
- **Team Drawing**: Creative collaboration and coloring activities

### 👥 Social Features
- **Simple Username System**: No emails or passwords needed - just pick a unique username!
- **Real-time Friends System**: Send requests, manage connections
- **Live Online Status**: See who's available to study
- **Instant Notifications**: Friend requests, study invites, achievements
- **Safe Study Environment**: Moderated chat focused on learning

### 🏆 Progress Tracking
- **XP & Leveling System**: Earn experience through gameplay and study participation
- **Achievement Badges**: Unlock rewards for milestones
- **Daily Statistics**: Track learning progress over time
- **Streak Counters**: Maintain learning momentum
- **Study Session History**: Track time spent in study rooms

### 🔒 Security & Privacy
- **Kid-Friendly Authentication**: Username-only system (no personal info required)
- **Row-Level Security**: Database-level access control
- **Privacy Settings**: Control profile visibility and interactions
- **Safe Environment**: Moderated chat and supervised study sessions
- **Study-Focused Guidelines**: Built-in rules for positive learning interactions

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
- **Real-time Updates** for live chat and study rooms
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

2. Set Up Supabase
Create a new project at supabase.com
Go to Settings > API to get your project URL and anon key
Copy .env.example to .env and fill in your Supabase credentials:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Start Development Server

npm run dev
Visit http://localhost:5173 to see the application.

🎯 Authentication System
Kid-Friendly Design

// Simple username-based authentication
const createUserProfile = async (username: string, favoritePlace: string, avatarColor: string, avatarAccessory: string) => {
  // Check username availability
  const isAvailable = await checkUsernameAvailable(username);
  
  // Create profile with username as ID
  const newProfile = await supabaseService.createUser({
    id: username, // Username is the primary key
    nickname: username,
    favorite_place: favoritePlace, // Used as password
    avatar_color: avatarColor,
    avatar_accessory: avatarAccessory,
  });
};
Benefits
No personal information required
Unique usernames prevent duplicates
Instant access - no email verification
Kid-safe - simple favorite place as password
Persistent identity - username stays forever
📚 Study Room Architecture
Study Rooms
Real-time chat focused on learning and homework help
Topic-based discussion starters for different subjects
Up to 6 friends per study room for optimal group size
Study guidelines to maintain positive learning environment
Room creator management and moderation tools
Chat Features
Topic Buttons: Quick-start discussions about Math, Reading, Homework, Study Tips, Memory Techniques, and Learning Goals
Study Guidelines: Built-in rules for respectful and educational conversations
Friend Collaboration: Tools for helping each other with assignments
Safe Environment: Moderated chat focused on learning
🎮 Game Architecture
Solo Games
Local state management with React hooks
Progress saved to Supabase on completion
XP and achievements updated in real-time
Study Integration
Games complement study room discussions
Educational content aligned with common curriculum topics
Progress tracking to show learning improvement over time
📱 Responsive Design
Mobile-first approach with Tailwind CSS
Adaptive layouts for all screen sizes
Touch-friendly interactions
Progressive Web App capabilities
🚀 Deployment
Build for Production

npm run build
Deploy to Netlify/Vercel
Connect your repository
Set environment variables
Deploy with automatic builds
Supabase Production Setup
Upgrade to Pro plan for production features
Configure custom domain
Set up backup policies
Monitor usage and performance
🎨 Design Philosophy
Kid-Friendly Interface
Bright, colorful design focused on learning
Large, easy-to-click buttons
Clear visual feedback
Intuitive navigation
Study-focused themes and messaging
Educational Focus
Learning through collaboration
Peer-to-peer support and help
Positive reinforcement for study habits
Progress visualization
Achievement systems for learning milestones
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request
🙏 Acknowledgments
Supabase for the amazing backend-as-a-service platform
Tailwind CSS for the utility-first CSS framework
Framer Motion for smooth animations
Lucide for beautiful icons
Pexels for stock photography
Built with ❤️ for educational excellence and collaborative learning.


