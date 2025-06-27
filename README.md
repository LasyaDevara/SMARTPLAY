# SmartPlay - Educational Study Platform

A modern, cloud-powered educational study platform built with React, TypeScript, and Supabase. SmartPlay enables children to learn together through study rooms and interactive games while building friendships in a safe, supervised environment.

---

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

---

## 🛠 Technology Stack

### Frontend
- React 18 with TypeScript  
- Tailwind CSS for styling  
- Framer Motion for animations  
- Lucide React for icons  
- Vite for development and building  

### Backend (Supabase)
- PostgreSQL Database with real-time subscriptions  
- Username-based Authentication (no email/password needed)  
- Row Level Security (RLS) for data protection  
- Real-time Updates for live chat and study rooms  
- Edge Functions for serverless logic  

### Key Libraries
- `@supabase/supabase-js` - Supabase client  
- `react-router-dom` - Navigation  
- `framer-motion` - Animations  
- `react-confetti` - Celebration effects  
- `uuid` - Unique identifiers  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm  
- Supabase account and project  

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartplay
npm install'''

### 2. Set Up Supabase
- Create a new project at [supabase.com](https://supabase.com)
- Go to **Settings > API** to get your project URL and anon key
- Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

### 3. Start Development Server
```bash
npm run dev

## Benefits
- No personal information required  
- Unique usernames prevent duplicates  
- Instant access – no email verification  
- Kid-safe – simple favorite place as password  
- Persistent identity – username stays forever  

---

## 📚 Study Room Architecture

### Study Rooms
- Real-time chat focused on learning and homework help  
- Topic-based discussion starters for different subjects  
- Up to 6 friends per room for optimal group size  
- Study guidelines to maintain positive learning environment  
- Room creator tools for moderation  

### Chat Features
- Topic Buttons: Quick-start discussions for various subjects  
- Study Guidelines: Respectful, educational conversation rules  
- Friend Collaboration: Help each other with assignments  
- Safe Environment: Moderated chat space  

---

## 🎮 Game Architecture

### Solo Games
- Local state management with React hooks  
- Game progress saved to Supabase  
- XP and achievements updated in real-time  

### Study Integration
- Games complement study room learning  
- Aligned with curriculum topics  
- Track progress and improvement over time  

---

## 🔐 Security Implementation

### Row Level Security Policies (Example)

```sql
-- Users can only read their own profile and public profiles
CREATE POLICY "Users can read profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    privacy_settings->>'profile_visibility' = 'public' OR
    id = auth.uid()
  );

## Username Validation
- 3–15 characters  
- Only letters, numbers, and underscores  
- Real-time availability check  
- Case-insensitive uniqueness  

---

## 📱 Responsive Design
- Mobile-first using Tailwind CSS  
- Adaptive layouts for different devices  
- Touch-friendly UI elements  
- Progressive Web App features  

---

## 🚀 Deployment

### Build for Production
```bash
npm run build

## Deployment

### Deploy to Netlify or Vercel
- Connect your GitHub repository  
- Set required environment variables  
- Enable automatic builds  

### Supabase Production Setup
- Upgrade to Pro for more features  
- Add a custom domain  
- Set up automated backups  
- Monitor performance and usage  

---

## 🎨 Design Philosophy

### Kid-Friendly Interface
- Bright, colorful visuals  
- Large, easy-to-tap buttons  
- Fun animations and feedback  
- Clear navigation  

### Educational Focus
- Collaboration over competition  
- Peer learning and help  
- Progress tracking and motivation  
- Visual learning and habit-building  

---

## 🤝 Contributing
- Fork the repository  
- Create a new feature branch  
- Make your changes  
- Add tests if needed  
- Open a pull request  

---

## 🙏 Acknowledgments
- Supabase  
- Tailwind CSS  
- Framer Motion  
- Lucide Icons  
- Pexels (stock images)  

Built with ❤️ for educational excellence and collaborative learning.
