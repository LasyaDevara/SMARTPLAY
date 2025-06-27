import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Heart, Users, Timer, Target, Zap, Award, User } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

interface MathEquation {
  id: number;
  operand1: number;
  operator: '+' | '-' | '×' | '÷';
  operand2: number;
  answer: number;
  availableNumbers: number[];
  difficulty: string;
}

const MathManiaGame: React.FC = () => {
  const { user, recordAnswer, getTodayStats, getXPRequiredForNextLevel } = useUser();
  const navigate = useNavigate();
  
  const [currentEquation, setCurrentEquation] = useState<MathEquation | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'playing' | 'result' | 'waiting'>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [usedEquations, setUsedEquations] = useState<Set<string>>(new Set());
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [guestStats, setGuestStats] = useState({
    totalSolved: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Get difficulty level based on user level or default for guests
  const getDifficultyLevel = (level: number): string => {
    if (level <= 5) return 'Easy';
    if (level <= 10) return 'Medium';
    if (level <= 15) return 'Intermediate';
    if (level <= 20) return 'Difficult';
    return 'Extreme';
  };

  // Generate equations based on user level with progressive difficulty
  const generateEquation = (level: number): MathEquation => {
    const difficultyLevel = getDifficultyLevel(level);
    let operand1: number, operand2: number, operator: '+' | '-' | '×' | '÷', answer: number;
    
    if (level <= 5) {
      // Easy: Basic addition and subtraction (1-10)
      operand1 = Math.floor(Math.random() * 10) + 1;
      operand2 = Math.floor(Math.random() * 10) + 1;
      operator = Math.random() > 0.5 ? '+' : '-';
      
      if (operator === '-' && operand1 < operand2) {
        [operand1, operand2] = [operand2, operand1]; // Ensure positive result
      }
    } else if (level <= 10) {
      // Medium: Addition, subtraction, simple multiplication (1-20)
      const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '×') {
        operand1 = Math.floor(Math.random() * 10) + 1;
        operand2 = Math.floor(Math.random() * 10) + 1;
      } else {
        operand1 = Math.floor(Math.random() * 20) + 1;
        operand2 = Math.floor(Math.random() * 20) + 1;
        if (operator === '-' && operand1 < operand2) {
          [operand1, operand2] = [operand2, operand1];
        }
      }
    } else if (level <= 15) {
      // Intermediate: All operations, larger numbers (1-50)
      const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '÷') {
        // Ensure clean division
        operand2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 15) + 1;
        operand1 = operand2 * answer;
      } else if (operator === '×') {
        operand1 = Math.floor(Math.random() * 12) + 1;
        operand2 = Math.floor(Math.random() * 12) + 1;
      } else {
        operand1 = Math.floor(Math.random() * 50) + 1;
        operand2 = Math.floor(Math.random() * 50) + 1;
        if (operator === '-' && operand1 < operand2) {
          [operand1, operand2] = [operand2, operand1];
        }
      }
    } else if (level <= 20) {
      // Difficult: Complex operations, larger numbers (1-100)
      const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '÷') {
        operand2 = Math.floor(Math.random() * 15) + 1;
        answer = Math.floor(Math.random() * 20) + 1;
        operand1 = operand2 * answer;
      } else if (operator === '×') {
        operand1 = Math.floor(Math.random() * 15) + 1;
        operand2 = Math.floor(Math.random() * 15) + 1;
      } else {
        operand1 = Math.floor(Math.random() * 100) + 1;
        operand2 = Math.floor(Math.random() * 100) + 1;
        if (operator === '-' && operand1 < operand2) {
          [operand1, operand2] = [operand2, operand1];
        }
      }
    } else {
      // Extreme: Very complex operations, large numbers (1-200)
      const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '÷') {
        operand2 = Math.floor(Math.random() * 20) + 1;
        answer = Math.floor(Math.random() * 25) + 1;
        operand1 = operand2 * answer;
      } else if (operator === '×') {
        operand1 = Math.floor(Math.random() * 20) + 1;
        operand2 = Math.floor(Math.random() * 20) + 1;
      } else {
        operand1 = Math.floor(Math.random() * 200) + 1;
        operand2 = Math.floor(Math.random() * 200) + 1;
        if (operator === '-' && operand1 < operand2) {
          [operand1, operand2] = [operand2, operand1];
        }
      }
    }

    // Calculate answer
    switch (operator) {
      case '+':
        answer = operand1 + operand2;
        break;
      case '-':
        answer = operand1 - operand2;
        break;
      case '×':
        answer = operand1 * operand2;
        break;
      case '÷':
        answer = operand1 / operand2;
        break;
    }

    // Generate wrong answers based on difficulty
    const wrongAnswers: number[] = [];
    const variance = level <= 5 ? 5 : level <= 10 ? 10 : level <= 15 ? 20 : level <= 20 ? 50 : 100;
    
    while (wrongAnswers.length < 4) {
      let wrongAnswer: number;
      wrongAnswer = Math.max(1, answer + (Math.floor(Math.random() * variance * 2) - variance));
      
      if (wrongAnswer !== answer && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    const availableNumbers = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

    return {
      id: Date.now() + Math.random(),
      operand1,
      operator,
      operand2,
      answer,
      availableNumbers,
      difficulty: difficultyLevel
    };
  };

  const todayStats = user ? getTodayStats() : { totalSolved: guestStats.totalSolved, correctAnswers: guestStats.correctAnswers, xpEarned: 0 };
  const xpRequiredForNext = user ? getXPRequiredForNextLevel() : 150;
  
  // Calculate current level progress (XP within current level)
  const getCurrentLevelProgress = () => {
    if (!user) return 0;
    return user.xp % 150; // Since each level requires 150 XP
  };

  const currentLevelXP = user ? getCurrentLevelProgress() : 0;
  const currentLevel = user ? user.level : 1;
  const currentStreak = user ? user.currentStreak : guestStats.currentStreak;
  const bestStreak = user ? user.bestStreak : guestStats.bestStreak;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate first equation based on user level or default level 1
  useEffect(() => {
    if (!currentEquation) {
      const newEquation = generateEquation(currentLevel);
      setCurrentEquation(newEquation);
    }
  }, [currentLevel]);

  // Timer countdown
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0 && !isProcessingAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing' && !isProcessingAnswer) {
      handleTimeUp();
    }
  }, [timeLeft, gamePhase, isProcessingAnswer]);

  const handleTimeUp = () => {
    if (isProcessingAnswer) return;
    
    setIsProcessingAnswer(true);
    setGamePhase('result');
    setIsCorrect(false);
    
    if (user) {
      recordAnswer(false, 0);
    } else {
      setGuestStats(prev => ({
        ...prev,
        totalSolved: prev.totalSolved + 1,
        currentStreak: 0
      }));
    }
    
    setTimeout(() => {
      setIsProcessingAnswer(false);
    }, 2000);
  };

  const handleNumberSelect = (number: number) => {
    if (gamePhase !== 'playing' || selectedAnswer !== null || isProcessingAnswer) return;
    
    setIsProcessingAnswer(true);
    setSelectedAnswer(number);
    
    // Immediate feedback - show selection
    setTimeout(() => {
      const correct = currentEquation && number === currentEquation.answer;
      setIsCorrect(correct);
      setGamePhase('result');
      
      if (correct) {
        setShowConfetti(true);
        
        // Calculate XP based on difficulty and time remaining
        const baseXP = 15;
        const timeBonus = Math.floor(timeLeft / 5) * 2; // Bonus for quick answers
        const difficultyBonus = Math.floor(currentLevel / 5) * 5; // More XP for higher levels
        const totalXP = baseXP + timeBonus + difficultyBonus;
        
        // Record the correct answer
        if (user) {
          recordAnswer(true, totalXP);
        } else {
          setGuestStats(prev => ({
            ...prev,
            totalSolved: prev.totalSolved + 1,
            correctAnswers: prev.correctAnswers + 1,
            currentStreak: prev.currentStreak + 1,
            bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1)
          }));
        }
        
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        // Record the incorrect answer
        if (user) {
          recordAnswer(false, 0);
        } else {
          setGuestStats(prev => ({
            ...prev,
            totalSolved: prev.totalSolved + 1,
            currentStreak: 0
          }));
        }
      }
      
      // Auto-advance to next question after showing result
      setTimeout(() => {
        handleNextQuestion();
      }, 2500);
      
    }, 300); // Shorter delay for better responsiveness
  };

  const handleNextQuestion = () => {
    // Generate new equation ensuring no repeats
    let newEquation: MathEquation;
    let attempts = 0;
    
    do {
      newEquation = generateEquation(currentLevel);
      attempts++;
    } while (usedEquations.has(`${newEquation.operand1}${newEquation.operator}${newEquation.operand2}`) && attempts < 10);
    
    // Add to used equations
    setUsedEquations(prev => new Set([...prev, `${newEquation.operand1}${newEquation.operator}${newEquation.operand2}`]));
    
    // Clear used equations if we've used too many (prevent infinite loops)
    if (usedEquations.size > 50) {
      setUsedEquations(new Set());
    }
    
    setCurrentEquation(newEquation);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGamePhase('playing');
    setTimeLeft(30);
    setCurrentQuestionIndex(prev => prev + 1);
    setIsProcessingAnswer(false);
  };

  const getOperatorSymbol = (operator: string) => {
    switch (operator) {
      case '×': return '×';
      case '÷': return '÷';
      default: return operator;
    }
  };

  const getAccuracyPercentage = () => {
    if (todayStats.totalSolved === 0) return 0;
    return Math.round((todayStats.correctAnswers / todayStats.totalSolved) * 100);
  };

  const handleCreateProfile = () => {
    navigate('/auth');
  };

  if (!currentEquation) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']}
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2">
            🧮 Math Mania
          </h1>
          <p className="text-xl md:text-2xl text-purple-500 font-semibold">
            Level {currentLevel} - {currentEquation.difficulty} Mode
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Timer className={`h-6 w-6 mr-2 ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-500'}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-500'}`}>
              {timeLeft}s
            </span>
          </div>
          
          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Target className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-lg font-bold text-blue-500">
              {todayStats.correctAnswers}/{todayStats.totalSolved}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({getAccuracyPercentage()}%)
            </span>
          </div>

          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="text-lg font-bold text-yellow-500">
              Streak: {currentStreak}
            </span>
          </div>

          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Award className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-lg font-bold text-purple-500">
              Level {currentLevel}
            </span>
          </div>
        </div>

        {/* Level Progress Bar */}
        {user && (
          <div className="bg-white rounded-2xl p-4 mb-8 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-purple-600">Level Progress</span>
              <span className="text-sm font-bold text-purple-600">
                {currentLevelXP}/{xpRequiredForNext} XP
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-4">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((currentLevelXP / xpRequiredForNext) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              >
                {currentLevelXP > 20 && <Star className="h-3 w-3 text-white" />}
              </motion.div>
            </div>
          </div>
        )}

        {/* Math Equation Display */}
        <motion.div
          key={currentEquation.id}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4 flex-wrap">
            <span className="text-blue-500">{currentEquation.operand1}</span>
            <span className="text-purple-500">{getOperatorSymbol(currentEquation.operator)}</span>
            <span className="text-green-500">{currentEquation.operand2}</span>
            <span className="text-orange-500">=</span>
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl border-4 border-dashed border-orange-400 flex items-center justify-center">
              {selectedAnswer !== null ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`font-bold text-2xl ${
                    isCorrect === null ? 'text-orange-600' :
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedAnswer}
                </motion.span>
              ) : (
                <span className="text-orange-400 text-4xl">?</span>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            Difficulty: {currentEquation.difficulty} | Question #{currentQuestionIndex + 1}
          </div>
        </motion.div>

        {/* Number Tiles */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="grid grid-cols-5 gap-4 max-w-2xl">
            {currentEquation.availableNumbers.map((number, index) => (
              <motion.button
                key={`${currentEquation.id}-${number}-${index}`}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl font-bold text-2xl md:text-3xl shadow-lg transition-all ${
                  selectedAnswer === number
                    ? isCorrect === null
                      ? 'bg-yellow-400 text-white transform scale-105'
                      : isCorrect
                      ? 'bg-green-400 text-white'
                      : 'bg-red-400 text-white'
                    : selectedAnswer !== null
                    ? number === currentEquation.answer
                      ? 'bg-green-400 text-white'
                      : 'bg-gray-300 text-gray-500'
                    : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600'
                }`}
                onClick={() => handleNumberSelect(number)}
                disabled={gamePhase !== 'playing' || isProcessingAnswer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={gamePhase === 'playing' && !isProcessingAnswer ? { scale: 1.1 } : {}}
                whileTap={gamePhase === 'playing' && !isProcessingAnswer ? { scale: 0.95 } : {}}
              >
                {number}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {gamePhase === 'result' && isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-3xl p-6 text-center mb-6 ${
                isCorrect ? 'bg-green-100 border-4 border-green-300' : 'bg-red-100 border-4 border-red-300'
              }`}
            >
              <div className="text-4xl mb-4">
                {isCorrect ? '🎉' : timeLeft === 0 ? '⏰' : '🤔'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? 'Fantastic Work!' : timeLeft === 0 ? 'Time\'s Up!' : 'Not Quite Right!'}
              </h3>
              <p className={`text-lg mb-4 ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? `Perfect! You solved it with ${timeLeft} seconds left!` 
                  : `The correct answer was ${currentEquation.answer}. Keep trying!`}
              </p>
              
              {isCorrect && user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 text-xl font-bold text-green-600 mb-4"
                >
                  <Star className="h-6 w-6" />
                  <span>+{15 + Math.floor(timeLeft / 5) * 2 + Math.floor(currentLevel / 5) * 5} XP</span>
                  <Trophy className="h-6 w-6" />
                </motion.div>
              )}
              
              <div className="text-sm text-gray-600">
                Next question in {Math.max(0, Math.ceil((2500 - (Date.now() % 2500)) / 1000))} seconds...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel - Enhanced Stats */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-purple-600">Your Progress</h2>
        </div>

        {/* Player Profile */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {user ? (
            <div className="flex items-center mb-3">
              <Avatar
                color={user.avatarColor}
                accessory={user.avatarAccessory}
                size="md"
                animated
              />
              <div className="ml-3">
                <h3 className="font-bold text-gray-800">{user.nickname}</h3>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-sm text-gray-600">Level {user.level}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Guest Player</h3>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateProfile}
                icon={<User className="h-4 w-4" />}
                fullWidth
              >
                Create Profile to Save Progress
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-purple-600">{user ? user.xp : 0}</div>
              <div className="text-gray-500">Total XP</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-blue-600">{currentStreak}</div>
              <div className="text-gray-500">Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Today's Performance */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 mb-6">
          <h3 className="font-bold text-blue-600 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Today's Performance
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Problems Solved</span>
              <span className="font-bold text-blue-600">{todayStats.totalSolved}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Correct Answers</span>
              <span className="font-bold text-green-600">{todayStats.correctAnswers}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className="font-bold text-purple-600">{getAccuracyPercentage()}%</span>
            </div>
            
            {user && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">XP Earned Today</span>
                <span className="font-bold text-yellow-600">{todayStats.xpEarned}</span>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty Progression */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 mb-6">
          <h3 className="font-bold text-green-600 mb-3">Difficulty Progression</h3>
          
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between p-2 rounded ${currentLevel <= 5 ? 'bg-green-200' : 'bg-gray-100'}`}>
              <span>Easy (Levels 1-5)</span>
              <span>{currentLevel <= 5 ? '✓ Current' : currentLevel > 5 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${currentLevel > 5 && currentLevel <= 10 ? 'bg-yellow-200' : currentLevel > 10 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Medium (Levels 6-10)</span>
              <span>{currentLevel > 5 && currentLevel <= 10 ? '✓ Current' : currentLevel > 10 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${currentLevel > 10 && currentLevel <= 15 ? 'bg-orange-200' : currentLevel > 15 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Intermediate (Levels 11-15)</span>
              <span>{currentLevel > 10 && currentLevel <= 15 ? '✓ Current' : currentLevel > 15 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${currentLevel > 15 && currentLevel <= 20 ? 'bg-red-200' : currentLevel > 20 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Difficult (Levels 16-20)</span>
              <span>{currentLevel > 15 && currentLevel <= 20 ? '✓ Current' : currentLevel > 20 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${currentLevel > 20 ? 'bg-purple-200' : 'bg-gray-50'}`}>
              <span>Extreme (Levels 21+)</span>
              <span>{currentLevel > 20 ? '✓ Current' : ''}</span>
            </div>
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200">
          <h3 className="font-bold text-orange-600 mb-3 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Achievements
          </h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { emoji: '🏆', unlocked: currentLevel >= 5, name: 'Level 5' },
              { emoji: '⭐', unlocked: currentStreak >= 5, name: '5 Streak' },
              { emoji: '🎯', unlocked: getAccuracyPercentage() >= 80, name: '80% Accuracy' },
              { emoji: '🧠', unlocked: currentLevel >= 10, name: 'Level 10' },
              { emoji: '🎉', unlocked: todayStats.totalSolved >= 10, name: '10 Today' },
              { emoji: '💎', unlocked: currentStreak >= 10, name: '10 Streak' },
              { emoji: '🌟', unlocked: currentLevel >= 15, name: 'Level 15' },
              { emoji: '🏅', unlocked: bestStreak >= 20, name: 'Best Streak' }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                  achievement.unlocked
                    ? 'bg-yellow-200 border-2 border-yellow-400' 
                    : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: achievement.unlocked ? 1 : 0.8 }}
                transition={{ delay: index * 0.1 }}
                title={achievement.name}
              >
                {achievement.emoji}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-orange-600">
              Keep playing to unlock more achievements!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathManiaGame;