import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Target, Trophy, Star, Zap, Award, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

interface QuizQuestion {
  multiplicand: number;
  multiplier: number;
  answer: number;
  options: number[];
}

const TablesGame: React.FC = () => {
  const { user, recordAnswer } = useUser();
  const [selectedTable, setSelectedTable] = useState(2);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const generateQuestion = (tableNumber: number): QuizQuestion => {
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = tableNumber * multiplier;
    
    // Generate wrong answers
    const wrongAnswers: number[] = [];
    while (wrongAnswers.length < 3) {
      let wrongAnswer: number;
      if (Math.random() > 0.5) {
        // Close wrong answers (±1 to ±5)
        wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
      } else {
        // Random wrong answers
        wrongAnswer = Math.floor(Math.random() * 200) + 1;
      }
      
      if (wrongAnswer !== answer && wrongAnswer > 0 && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }
    
    const options = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);
    
    return {
      multiplicand: tableNumber,
      multiplier,
      answer,
      options
    };
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(generateQuestion(selectedTable));
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.answer;
    setIsCorrect(correct);
    
    recordAnswer(correct, correct ? 12 : 0);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setStreak(0);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    
    // Auto-advance to next question
    setTimeout(() => {
      setCurrentQuestion(generateQuestion(selectedTable));
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
  };

  const getAccuracy = () => {
    if (questionsAnswered === 0) return 0;
    return Math.round((score / questionsAnswered) * 100);
  };

  const getAnswerButtonClass = (answer: number) => {
    if (selectedAnswer === null) {
      return 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600';
    }
    
    if (answer === currentQuestion?.answer) {
      return 'bg-green-400 text-white border-4 border-green-600';
    }
    
    if (selectedAnswer === answer && answer !== currentQuestion?.answer) {
      return 'bg-red-400 text-white border-4 border-red-600';
    }
    
    return 'bg-gray-300 text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2">
            🔢 Numbers & Times — Learn Your Multiplication!
          </h1>
          <p className="text-xl md:text-2xl text-purple-500 font-semibold">
            Master multiplication tables with interactive learning
          </p>
        </motion.div>

        {!showQuiz ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
                  <Calculator className="h-6 w-6 mr-2" />
                  Select Table
                </h2>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <motion.button
                      key={num}
                      className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                        selectedTable === num
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                      onClick={() => setSelectedTable(num)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={startQuiz}
                  icon={<Target className="h-5 w-5" />}
                >
                  Start Quiz
                </Button>

                {/* Stats */}
                {user && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <h3 className="font-bold text-purple-600 mb-2">Your Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Best Streak</span>
                        <span className="font-bold">{bestStreak}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level</span>
                        <span className="font-bold">{user.level}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Multiplication Table Display */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    Multiplication Table of {selectedTable}
                  </h2>
                  <p className="text-blue-100">
                    Study the table below, then test your knowledge!
                  </p>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((multiplier) => (
                      <motion.div
                        key={multiplier}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: multiplier * 0.1 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            <span className="text-blue-500">{selectedTable}</span>
                            <span className="text-purple-500 mx-2">×</span>
                            <span className="text-green-500">{multiplier}</span>
                            <span className="text-orange-500 mx-2">=</span>
                            <span className="text-red-500">{selectedTable * multiplier}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedTable} times {multiplier} equals {selectedTable * multiplier}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Visual Pattern */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                    <h3 className="text-xl font-bold text-orange-600 mb-4">Pattern Recognition</h3>
                    <div className="text-center">
                      <div className="text-lg text-gray-700 mb-4">
                        Notice the pattern in the {selectedTable} times table:
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: 10 }, (_, i) => selectedTable * (i + 1)).map((result, index) => (
                          <motion.div
                            key={index}
                            className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {result}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Mode */
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Quiz: {selectedTable} Times Table
                    </h2>
                    <div className="flex items-center space-x-6 text-green-100">
                      <span>Question #{questionsAnswered + 1}</span>
                      <span>Score: {score}/{questionsAnswered}</span>
                      <span>Accuracy: {getAccuracy()}%</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 mr-2" />
                      <span>Streak: {streak}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetQuiz}
                      icon={<RotateCcw className="h-4 w-4" />}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 bg-green-50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">Current Streak</span>
                  <span className="font-bold">{streak} correct in a row</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((streak / 10) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    {streak >= 5 && <Star className="h-3 w-3 text-white" />}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <motion.div
                key={`${currentQuestion.multiplicand}-${currentQuestion.multiplier}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-8 mb-8"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4 flex-wrap">
                    <span className="text-blue-500">{currentQuestion.multiplicand}</span>
                    <span className="text-purple-500">×</span>
                    <span className="text-green-500">{currentQuestion.multiplier}</span>
                    <span className="text-orange-500">=</span>
                    <div className="w-32 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl border-4 border-dashed border-orange-400 flex items-center justify-center">
                      {selectedAnswer !== null ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`font-bold text-3xl ${
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
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={`${currentQuestion.multiplicand}-${currentQuestion.multiplier}-${option}`}
                      className={`text-2xl font-bold py-8 px-4 rounded-2xl shadow-lg transition-all ${getAnswerButtonClass(option)}`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={selectedAnswer === null ? { scale: 1.05, y: -5 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                {/* Result Display */}
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mt-8 rounded-2xl p-6 text-center ${
                        isCorrect ? 'bg-green-100 border-4 border-green-300' : 'bg-red-100 border-4 border-red-300'
                      }`}
                    >
                      <div className="text-4xl mb-4">
                        {isCorrect ? '🎉' : '🤔'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {isCorrect ? 'Excellent!' : 'Not quite right!'}
                      </h3>
                      <p className={`text-lg ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isCorrect 
                          ? `Perfect! ${currentQuestion.multiplicand} × ${currentQuestion.multiplier} = ${currentQuestion.answer}` 
                          : `The correct answer is ${currentQuestion.answer}. Keep practicing!`}
                      </p>
                      
                      {isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center gap-2 text-xl font-bold text-green-600 mt-4"
                        >
                          <Star className="h-6 w-6" />
                          <span>+12 XP</span>
                          <Trophy className="h-6 w-6" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Achievement Showcase */}
            {streak >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white text-center"
              >
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-2xl font-bold mb-2">Amazing Streak!</h3>
                <p className="text-yellow-100">
                  You've got {streak} correct answers in a row! Keep it up!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesGame;