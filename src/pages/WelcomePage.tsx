import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Play, Calculator, PencilRuler, Music, Book, Hash, Gamepad2, Shield, Zap, User, Palette } from 'lucide-react';
import Button from '../components/Button';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleGameClick = (gameRoute: string) => {
    // Go directly to the game without requiring authentication
    navigate(gameRoute);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-600">SmartPlay</span>
            </button>

            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/auth')}
                icon={<User className="h-4 w-4" />}
              >
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Learn Together, <span className="text-primary-600">Play Together</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Join friends in exciting educational games that make learning fun! 
                Choose a unique username, create your avatar, and start your learning adventure.
              </motion.p>

              {/* Kid-Friendly Features */}
              <motion.div
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-bold text-green-800 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Safe & Simple for Kids
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>No email or personal info needed</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Just pick a fun username</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Safe, offline-first experience</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Play instantly without setup</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button 
                  onClick={handleGetStarted} 
                  variant="primary" 
                  size="lg"
                  icon={<Play className="h-5 w-5" />}
                  className="animate-pulse"
                >
                  Start Playing Now!
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white">
                <img 
                  src="https://images.pexels.com/photos/8535236/pexels-photo-8535236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Kids learning together in school" 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Features Section */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <FeatureCard 
              icon={<User className="h-8 w-8 text-primary-600" />}
              title="Simple Username System"
              description="No emails or passwords needed! Just pick a unique username and start playing."
            />
            
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Instant Play"
              description="Click any game and start playing immediately. No setup or configuration required."
            />
            
            <FeatureCard 
              icon={<Award className="h-8 w-8 text-primary-600" />}
              title="Safe Learning Environment"
              description="Offline-first design with local progress tracking, perfect for young learners."
            />
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              How SmartPlay Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard
                step="1"
                icon={<User className="h-8 w-8 text-purple-600" />}
                title="Choose Username"
                description="Pick a unique username and create your avatar"
              />
              <StepCard
                step="2"
                icon={<Gamepad2 className="h-8 w-8 text-green-600" />}
                title="Play Games"
                description="Click any game below to start playing instantly"
              />
              <StepCard
                step="3"
                icon={<Award className="h-8 w-8 text-yellow-600" />}
                title="Earn Rewards"
                description="Collect XP, achievements, and unlock new content"
              />
            </div>
          </motion.div>

          {/* Games Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Educational Games Available
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Click any game to start playing instantly! No setup required.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <GamePreviewCard
                icon={<Calculator className="h-12 w-12 text-purple-600" />}
                title="Math Mania"
                description="Solve math problems and build your calculation skills"
                color="from-purple-500 to-pink-500"
                onClick={() => handleGameClick('/math-mania')}
              />
              
              <GamePreviewCard
                icon={<PencilRuler className="h-12 w-12 text-blue-600" />}
                title="Spelling Bee"
                description="Master spelling with word challenges and hints"
                color="from-blue-500 to-cyan-500"
                onClick={() => handleGameClick('/spelling-bee')}
              />
              
              <GamePreviewCard
                icon={<Book className="h-12 w-12 text-green-600" />}
                title="Interactive Tales"
                description="Experience moral stories and learn valuable lessons"
                color="from-green-500 to-emerald-500"
                onClick={() => handleGameClick('/tales')}
              />

              <GamePreviewCard
                icon={<Music className="h-12 w-12 text-yellow-600" />}
                title="Nursery Rhymes"
                description="Fill in rhyme blanks and create new verses"
                color="from-yellow-500 to-orange-500"
                onClick={() => handleGameClick('/rhymes')}
              />

              <GamePreviewCard
                icon={<Hash className="h-12 w-12 text-red-600" />}
                title="Multiplication Tables"
                description="Master times tables with fun quizzes and challenges"
                color="from-red-500 to-pink-500"
                onClick={() => handleGameClick('/tables')}
              />
              
              <GamePreviewCard
                icon={<Palette className="h-12 w-12 text-indigo-600" />}
                title="Team Drawing"
                description="Draw freely or color beautiful diagrams"
                color="from-indigo-500 to-purple-500"
                onClick={() => handleGameClick('/team-drawing')}
              />
            </div>

            {/* Call to Action */}
            <motion.div
              className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
              <p className="text-lg mb-6 text-primary-100">
                Join thousands of kids already learning and playing on SmartPlay!
              </p>
              <Button
                onClick={() => navigate('/auth')}
                variant="secondary"
                size="lg"
                icon={<User className="h-5 w-5" />}
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Create Your Profile Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-6 bg-primary-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} SmartPlay - Learning is better together
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard: React.FC<{
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ step, icon, title, description }) => {
  return (
    <motion.div 
      className="text-center p-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {step}
        </div>
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

const GamePreviewCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}> = ({ icon, title, description, color, onClick }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={`bg-gradient-to-r ${color} p-6 text-white flex justify-center`}>
        {icon}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-center">
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="h-4 w-4" />}
            className="pointer-events-none"
          >
            Play Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomePage;