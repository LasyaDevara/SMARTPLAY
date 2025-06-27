import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-600">SmartPlay</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-9xl font-bold text-primary-300 mb-6">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              Oops! It looks like you're lost in learning space.
            </p>
            
            <Button 
              variant="primary" 
              size="lg"
              icon={<Home className="h-5 w-5" />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
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

export default NotFoundPage;