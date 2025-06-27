import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import TablesGame from '../components/TablesGame';
import { useUser } from '../contexts/UserContext';

const TablesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isProfileComplete } = useUser();

  // If user doesn't have a profile, redirect to setup
  useEffect(() => {
    if (!isProfileComplete) {
      navigate('/profile-setup');
    }
  }, [isProfileComplete, navigate]);

  const handleBackToLobby = () => {
    navigate('/lobby');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-4 md:px-8 bg-white shadow-sm relative z-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleBackToLobby}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Back to Lobby
              </Button>
              
              <div className="ml-4 flex items-center">
                <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-xl font-bold text-primary-600">SmartPlay</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-2 md:mr-4">
                <span className="text-sm font-medium text-gray-500">
                  Multiplication Tables Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <TablesGame />
      </main>
    </div>
  );
};

export default TablesPage;