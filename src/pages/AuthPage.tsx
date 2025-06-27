import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, AlertCircle, Wifi, WifiOff, LogIn, UserPlus, MapPin } from 'lucide-react';
import Button from '../components/Button';
import Avatar, { AvatarColor, AvatarAccessory } from '../components/Avatar';
import { useSupabase } from '../contexts/SupabaseContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    createUserProfile, 
    checkUsernameAvailable, 
    signInWithFavoritePlace,
    isLoading, 
    error, 
    clearError,
    isConnected
  } = useSupabase();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [favoritePlace, setFavoritePlace] = useState('');
  const [selectedColor, setSelectedColor] = useState<AvatarColor>('blue');
  const [selectedAccessory, setSelectedAccessory] = useState<AvatarAccessory>('none');
  const [step, setStep] = useState(1); // 1: username/place, 2: avatar customization (signup only)
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  const colors: AvatarColor[] = ['blue', 'green', 'yellow', 'purple', 'red', 'orange'];
  const accessories: AvatarAccessory[] = ['none', 'glasses', 'bowtie', 'hat', 'flower', 'crown'];

  const validateUsername = (value: string): boolean => {
    // Only allow letters, numbers, and underscores, 3-15 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    return usernameRegex.test(value);
  };

  const validateFavoritePlace = (value: string): boolean => {
    // Allow letters, numbers, spaces, and common punctuation, 2-30 characters
    const placeRegex = /^[a-zA-Z0-9\s\-',\.]{2,30}$/;
    return placeRegex.test(value.trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setUsernameError('');

    if (!validateUsername(username)) {
      setUsernameError('Username must be 3-15 characters and contain only letters, numbers, and underscores');
      return;
    }

    if (!validateFavoritePlace(favoritePlace)) {
      setUsernameError('Favorite place must be 2-30 characters');
      return;
    }

    try {
      await signInWithFavoritePlace(username, favoritePlace);
      navigate('/lobby');
    } catch (error: any) {
      setUsernameError(error.message || 'Login failed');
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setUsernameError('');

    if (!validateUsername(username)) {
      setUsernameError('Username must be 3-15 characters and contain only letters, numbers, and underscores');
      return;
    }

    if (!validateFavoritePlace(favoritePlace)) {
      setUsernameError('Favorite place must be 2-30 characters');
      return;
    }

    setIsCheckingUsername(true);

    try {
      const isAvailable = await checkUsernameAvailable(username);
      if (!isAvailable) {
        setUsernameError('This username is already taken. Please choose another one.');
        return;
      }
      
      // Username is available, move to avatar customization
      setStep(2);
    } catch (error: any) {
      console.error('Username check error:', error);
      
      // If there's a connection issue, show a warning but allow to continue
      if (!isConnected) {
        setUsernameError('Unable to verify username availability (offline mode). You can continue, but the username might be taken.');
        // Still allow to proceed after 2 seconds
        setTimeout(() => {
          setStep(2);
        }, 2000);
      } else {
        setUsernameError('Error checking username availability. Please try again.');
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      await createUserProfile(username, favoritePlace, selectedColor, selectedAccessory);
      navigate('/lobby');
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    clearError();
    setUsernameError('');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getColorHex = (color: AvatarColor): string => {
    const colorMap = {
      blue: '#38bdf8',
      green: '#4ade80',
      yellow: '#facc15',
      purple: '#a78bfa',
      red: '#f87171',
      orange: '#fb923c',
    };
    return colorMap[color];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-600">SmartPlay</span>
            </button>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Offline Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {mode === 'login' ? 'Welcome Back!' : 
                   step === 1 ? 'Create Your Account' : 'Create Your Avatar'}
                </h1>
                
                {/* Mode Toggle */}
                <div className="flex bg-white/20 rounded-full p-1">
                  <button
                    onClick={() => {
                      setMode('login');
                      setStep(1);
                      clearError();
                      setUsernameError('');
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      mode === 'login' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <LogIn className="h-4 w-4 inline mr-1" />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMode('signup');
                      setStep(1);
                      clearError();
                      setUsernameError('');
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      mode === 'signup' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <UserPlus className="h-4 w-4 inline mr-1" />
                    Sign Up
                  </button>
                </div>
              </div>
              
              <p className="text-primary-100">
                {mode === 'login' ? 'Enter your username and favorite place to continue' :
                 step === 1 ? 'Choose a username and tell us your favorite place!' : 
                 'Make your avatar look awesome!'}
              </p>
            </div>
            
            <div className="p-8">
              {/* Connection Status Banner */}
              {!isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6"
                >
                  <div className="flex items-center">
                    <WifiOff className="h-6 w-6 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-bold text-orange-800">Offline Mode</h3>
                      <p className="text-orange-700 text-sm">
                        Your data will be saved locally. Connect to Supabase later to sync with friends.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {(mode === 'login' || (mode === 'signup' && step === 1)) ? (
                  <motion.form
                    key="auth-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={mode === 'login' ? handleLogin : handleSignupStep1}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Your Username
                      </label>
                      <div className="relative">
                        <input
                          id="username"
                          type="text"
                          className={`input w-full pl-12 ${usernameError ? 'border-red-400' : ''}`}
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value.toLowerCase());
                            setUsernameError('');
                            clearError();
                          }}
                          required
                          maxLength={15}
                          minLength={3}
                          disabled={isCheckingUsername}
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        
                        {isCheckingUsername && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        3-15 characters, letters, numbers, and underscores only
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="favoritePlace">
                        Your Favorite Place
                      </label>
                      <div className="relative">
                        <input
                          id="favoritePlace"
                          type="text"
                          className={`input w-full pl-12 ${usernameError ? 'border-red-400' : ''}`}
                          placeholder="e.g., Home, Beach, Library..."
                          value={favoritePlace}
                          onChange={(e) => {
                            setFavoritePlace(e.target.value.trim());
                            setUsernameError('');
                            clearError();
                          }}
                          required
                          maxLength={30}
                          minLength={2}
                          disabled={isCheckingUsername}
                        />
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {mode === 'login' 
                          ? 'This is your password - enter the same place you used when signing up'
                          : 'This will be your password - remember it to log in later!'}
                      </p>
                    </div>

                    {(usernameError || error) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-xl p-4 flex items-start ${
                          usernameError.includes('offline mode') 
                            ? 'bg-orange-50 border-orange-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${
                          usernameError.includes('offline mode') ? 'text-orange-500' : 'text-red-500'
                        }`} />
                        <p className={`text-sm ${
                          usernameError.includes('offline mode') ? 'text-orange-700' : 'text-red-700'
                        }`}>
                          {usernameError || error}
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isLoading || isCheckingUsername || !username.trim() || !favoritePlace.trim()}
                    >
                      {isCheckingUsername ? 'Checking...' : 
                       isLoading ? 'Loading...' : 
                       mode === 'login' ? 'Login' : 'Continue'}
                    </Button>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-bold text-blue-800 mb-2">
                        {mode === 'login' ? 'Forgot your favorite place?' : 'Why do we ask for your favorite place?'}
                      </h3>
                      <ul className="text-blue-700 text-sm space-y-1">
                        {mode === 'login' ? (
                          <>
                            <li>• Try common places like "Home", "School", or "Park"</li>
                            <li>• It's not case-sensitive, so "home" and "Home" work the same</li>
                            <li>• Make sure there are no extra spaces</li>
                            <li>• Contact support if you're still stuck</li>
                          </>
                        ) : (
                          <>
                            <li>• It's your password - simple and memorable!</li>
                            <li>• No personal information needed</li>
                            <li>• You can change it later in your profile</li>
                            <li>• Keep it secret so only you can log in!</li>
                            <li>• Case doesn't matter - "Home" and "home" are the same</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="avatar-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-green-700 font-medium">
                          Username "{username}" is {isConnected ? 'available' : 'ready'}!
                        </p>
                      </div>
                    </div>

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
                    
                    <div className="mb-8">
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

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start"
                      >
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={handleBackToStep1}
                        fullWidth
                      >
                        Back
                      </Button>
                      
                      <Button
                        variant="primary"
                        onClick={handleCreateProfile}
                        disabled={isLoading}
                        fullWidth
                      >
                        {isLoading ? 'Creating Account...' : 'Join SmartPlay!'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthPage;