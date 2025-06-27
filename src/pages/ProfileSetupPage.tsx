import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, User, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import Avatar, { AvatarColor, AvatarAccessory } from '../components/Avatar';
import { useUser } from '../contexts/UserContext';

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, isProfileComplete } = useUser();
  
  const [nickname, setNickname] = useState('');
  const [selectedColor, setSelectedColor] = useState<AvatarColor>('blue');
  const [selectedAccessory, setSelectedAccessory] = useState<AvatarAccessory>('none');
  const [step, setStep] = useState(1);
  
  const colors: AvatarColor[] = ['blue', 'green', 'yellow', 'purple', 'red', 'orange'];
  const accessories: AvatarAccessory[] = ['none', 'glasses', 'bowtie', 'hat', 'flower', 'crown'];
  
  // If user already has a profile, redirect to lobby
  useEffect(() => {
    if (isProfileComplete) {
      navigate('/lobby');
    }
  }, [isProfileComplete, navigate]);
  
  const handleContinue = () => {
    if (step === 1) {
      if (!nickname) return;
      setStep(2);
    } else {
      createUser(nickname, selectedColor, selectedAccessory);
      navigate('/lobby');
    }
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
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
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <motion.div 
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <h1 className="text-2xl font-bold">
                {step === 1 ? 'Create Your Profile' : 'Customize Your Avatar'}
              </h1>
              <p className="text-primary-100">
                {step === 1 
                  ? 'First, tell us what to call you!' 
                  : 'Choose your avatar color and accessory'}
              </p>
            </div>
            
            <div className="p-8">
              {step === 1 ? (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
                      Your Nickname
                    </label>
                    <input
                      id="nickname"
                      type="text"
                      className="input w-full"
                      placeholder="Enter a cool nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      maxLength={15}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is how other players will see you
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-8">
                    <Avatar 
                      color={selectedColor} 
                      accessory={selectedAccessory}
                      size="xl"
                      animated
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-700 text-sm font-bold mb-3">
                      Choose a Color
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full transition-all ${
                            selectedColor === color 
                              ? 'ring-4 ring-primary-400 transform scale-110' 
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-700 text-sm font-bold mb-3">
                      Choose an Accessory
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {accessories.map((accessory) => (
                        <button
                          key={accessory}
                          className={`w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center transition-all ${
                            selectedAccessory === accessory 
                              ? 'ring-4 ring-primary-400 bg-primary-50' 
                              : 'hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedAccessory(accessory)}
                          aria-label={`Select ${accessory} accessory`}
                        >
                          <Avatar 
                            color="blue"
                            accessory={accessory}
                            size="sm"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-between mt-8">
                {step === 2 ? (
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    icon={<ChevronLeft className="h-5 w-5" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  disabled={step === 1 && !nickname.trim()}
                  icon={<ChevronRight className="h-5 w-5 ml-1" />}
                  className="ml-auto"
                >
                  {step === 1 ? 'Continue' : 'Let\'s Play!'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Helper function to get color hex
const getColorHex = (color: AvatarColor): string => {
  const colorMap = {
    blue: '#38bdf8', // secondary-400
    green: '#4ade80', // success-400
    yellow: '#facc15', // accent-400
    purple: '#a78bfa', // primary-400
    red: '#f87171', // error-400
    orange: '#fb923c', // warning-400
  };
  
  return colorMap[color];
};

export default ProfileSetupPage;