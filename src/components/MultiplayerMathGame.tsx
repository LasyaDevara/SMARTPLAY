import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Users, MessageCircle, Lightbulb, Timer, Trophy, Star, Zap, Heart, Target } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import Confetti from 'react-confetti';

interface TeamMathQuestion {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
  difficulty: string;
  hint: string;
  explanation: string;
}

const MultiplayerMathGame: React.FC = () => {
  const { user, recordAnswer } = useUser();
  const { currentRoom, submitAnswer, sendMessage } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45); // More time for team collaboration
  const [teamAnswers, setTeamAnswers] = useState<Record<string, number>>({});
  const [showTeamProgress, setShowTeamProgress] = useState(true);
  const [encouragementMessages, setEncouragementMessages] = useState<string[]>([]);
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

  // Generate team-focused math questions
  const generateTeamQuestion = (level: number): TeamMathQuestion => {
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    const difficultyLevel = Math.min(Math.floor(level / 5), 3);
    const difficulty = difficulties[difficultyLevel];
    
    let operand1: number, operand2: number, operator: string, answer: number, hint: string, explanation: string;
    
    // Generate based on difficulty
    if (difficultyLevel === 0) {
      // Easy: Basic addition/subtraction
      operand1 = Math.floor(Math.random() * 20) + 1;
      operand2 = Math.floor(Math.random() * 20) + 1;
      operator = Math.random() > 0.5 ? '+' : '-';
      
      if (operator === '-' && operand1 < operand2) {
        [operand1, operand2] = [operand2, operand1];
      }
      
      answer = operator === '+' ? operand1 + operand2 : operand1 - operand2;
      hint = `Try breaking ${operand1} into smaller parts!`;
      explanation = `${operand1} ${operator} ${operand2} = ${answer}`;
    } else if (difficultyLevel === 1) {
      // Medium: Multiplication/division
      if (Math.random() > 0.5) {
        operand1 = Math.floor(Math.random() * 12) + 1;
        operand2 = Math.floor(Math.random() * 12) + 1;
        operator = '×';
        answer = operand1 * operand2;
        hint = `Think of ${operand1} groups of ${operand2}!`;
        explanation = `${operand1} × ${operand2} = ${answer}`;
      } else {
        operand2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 15) + 1;
        operand1 = operand2 * answer;
        operator = '÷';
        hint = `How many groups of ${operand2} fit into ${operand1}?`;
        explanation = `${operand1} ÷ ${operand2} = ${answer}`;
      }
    } else {
      // Hard/Expert: Complex operations
      const operations = ['+', '-', '×', '÷'];
      operator = operations[Math.floor(Math.random() * operations.length)];
      
      if (operator === '×') {
        operand1 = Math.floor(Math.random() * 25) + 1;
        operand2 = Math.floor(Math.random() * 25) + 1;
        answer = operand1 * operand2;
        hint = `Use the distributive property: break one number down!`;
        explanation = `${operand1} × ${operand2} = ${answer}`;
      } else if (operator === '÷') {
        operand2 = Math.floor(Math.random() * 20) + 1;
        answer = Math.floor(Math.random() * 30) + 1;
        operand1 = operand2 * answer;
        hint = `Think: what times ${operand2} equals ${operand1}?`;
        explanation = `${operand1} ÷ ${operand2} = ${answer}`;
      } else {
        operand1 = Math.floor(Math.random() * 100) + 1;
        operand2 = Math.floor(Math.random() * 100) + 1;
        if (operator === '-' && operand1 < operand2) {
          [operand1, operand2] = [operand2, operand1];
        }
        answer = operator === '+' ? operand1 + operand2 : operand1 - operand2;
        hint = `Round to the nearest 10 first, then adjust!`;
        explanation = `${operand1} ${operator} ${operand2} = ${answer}`;
      }
    }

    // Generate wrong answers
    const wrongAnswers: number[] = [];
    while (wrongAnswers.length < 3) {
      let wrongAnswer: number;
      if (Math.random() > 0.5) {
        wrongAnswer = answer + (Math.floor(Math.random() * 20) - 10);
      } else {
        wrongAnswer = Math.floor(Math.random() * (answer * 2)) + 1;
      }
      
      if (wrongAnswer !== answer && wrongAnswer > 0 && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    const options = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

    return {
      id: Date.now() + Math.random(),
      question: `${operand1} ${operator} ${operand2} = ?`,
      options,
      correctAnswer: answer,
      difficulty,
      hint,
      explanation
    };
  };

  const [currentQuestion, setCurrentQuestion] = useState<TeamMathQuestion>(() => 
    generateTeamQuestion(user?.level || 1)
  );

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleTimeUp();
    }
  }, [timeLeft, selectedAnswer]);

  const handleTimeUp = () => {
    setSelectedAnswer(-1); // Special value for timeout
    setIsCorrect(false);
    recordAnswer(false, 0);
    
    // Send timeout message to team
    sendMessage("⏰ Time's up! Let's try the next one together!", 'system');
    
    setTimeout(() => {
      generateNextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Calculate team bonus XP
    const baseXP = 15;
    const timeBonus = Math.floor(timeLeft / 5) * 3;
    const teamBonus = currentRoom ? Math.floor(currentRoom.players.length * 5) : 0;
    const difficultyBonus = currentQuestion.difficulty === 'Expert' ? 10 : 
                           currentQuestion.difficulty === 'Hard' ? 7 : 
                           currentQuestion.difficulty === 'Medium' ? 5 : 2;
    
    const totalXP = correct ? baseXP + timeBonus + teamBonus + difficultyBonus : 0;
    
    recordAnswer(correct, totalXP);
    submitAnswer(answer);
    
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Send celebration message
      const celebrations = [
        "🎉 Awesome teamwork!",
        "🏆 Great job everyone!",
        "⭐ We're on fire!",
        "💪 Team power activated!",
        "🚀 Unstoppable team!"
      ];
      const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      sendMessage(celebration, 'achievement');
    } else {
      // Send encouragement message
      const encouragements = [
        "💪 No worries! Let's try the next one!",
        "🤝 We learn together, we grow together!",
        "⭐ Every mistake is a step closer to success!",
        "🎯 Let's focus and tackle the next challenge!"
      ];
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      sendMessage(encouragement, 'encouragement');
    }
    
    setTimeout(() => {
      generateNextQuestion();
    }, 4000);
  };

  const generateNextQuestion = () => {
    const newQuestion = generateTeamQuestion(user?.level || 1);
    setCurrentQuestion(newQuestion);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setTimeLeft(45);
    setTeamAnswers({});
  };

  const handleRequestHint = () => {
    setShowHint(true);
    sendMessage(`💡 Hint shared: ${currentQuestion.hint}`, 'hint');
  };

  const handleShareStrategy = () => {
    const strategies = [
      "🧮 Let's break this down step by step!",
      "🎯 What operation should we use here?",
      "💭 Anyone have a different approach?",
      "🤔 Let's think about this together!",
      "📝 Should we write this out?"
    ];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    sendMessage(strategy, 'strategy');
  };

  const getAnswerButtonClass = (answer: number) => {
    if (selectedAnswer === null) {
      return 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 transform hover:scale-105';
    }
    
    if (answer === currentQuestion.correctAnswer) {
      return 'bg-green-400 text-white border-4 border-green-600 shadow-lg';
    }
    
    if (selectedAnswer === answer && answer !== currentQuestion.correctAnswer) {
      return 'bg-red-400 text-white border-4 border-red-600 shadow-lg';
    }
    
    return 'bg-gray-300 text-gray-500 opacity-50';
  };

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-green-500';
    if (timeLeft > 15) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!user || !currentRoom) {
    return <div>Loading team game...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']}
        />
      )}

      {/* Team Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Team Math Challenge</h1>
              <p className="text-purple-100">Collaborate and conquer together!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getTimerColor()}`}>{timeLeft}s</div>
              <div className="text-sm opacity-80">Time Left</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-200">{currentQuestion.difficulty}</div>
              <div className="text-sm opacity-80">Difficulty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Players Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-bold text-gray-800">Team Members</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {currentRoom.players.map((player: any, index: number) => (
              <motion.div
                key={player.id}
                className="flex items-center space-x-2 bg-purple-50 rounded-full px-3 py-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Avatar
                  color={player.avatarColor}
                  accessory={player.avatarAccessory}
                  size="sm"
                />
                <span className="text-sm font-medium text-purple-700">
                  {player.nickname}
                  {player.id === user.id && ' (You)'}
                </span>
                {teamAnswers[player.id] && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <motion.div
        key={currentQuestion.id}
        className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="text-6xl md:text-8xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRequestHint}
              disabled={showHint || selectedAnswer !== null}
              icon={<Lightbulb className="h-4 w-4" />}
            >
              Request Hint
            </Button>
            
            <Button
              variant="accent"
              size="sm"
              onClick={handleShareStrategy}
              disabled={selectedAnswer !== null}
              icon={<MessageCircle className="h-4 w-4" />}
            >
              Share Strategy
            </Button>
          </div>
        </div>

        {/* Hint Display */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center">
                <Lightbulb className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-bold text-yellow-800">Team Hint</h3>
                  <p className="text-yellow-700">{currentQuestion.hint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={`${currentQuestion.id}-${option}-${index}`}
              className={`text-2xl md:text-3xl font-bold py-8 px-4 rounded-2xl shadow-lg transition-all ${getAnswerButtonClass(option)}`}
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

        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((45 - timeLeft) / 45) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Result Display */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-3xl p-8 text-center mb-6 ${
              isCorrect ? 'bg-green-100 border-4 border-green-300' : 'bg-red-100 border-4 border-red-300'
            }`}
          >
            <div className="text-6xl mb-4">
              {isCorrect ? '🎉' : selectedAnswer === -1 ? '⏰' : '🤔'}
            </div>
            
            <h3 className={`text-3xl font-bold mb-4 ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect ? 'Fantastic Teamwork!' : selectedAnswer === -1 ? 'Time\'s Up!' : 'Keep Learning Together!'}
            </h3>
            
            <p className={`text-xl mb-6 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isCorrect 
                ? `Perfect! ${currentQuestion.explanation}` 
                : `The correct answer was ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`}
            </p>
            
            {isCorrect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-4 text-2xl font-bold text-green-600"
              >
                <div className="flex items-center">
                  <Star className="h-8 w-8 mr-2" />
                  <span>+{15 + Math.floor(timeLeft / 5) * 3} Base XP</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-8 w-8 mr-2" />
                  <span>+{currentRoom.players.length * 5} Team Bonus</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 mr-2" />
                  <span>+{currentQuestion.difficulty === 'Expert' ? 10 : 
                           currentQuestion.difficulty === 'Hard' ? 7 : 
                           currentQuestion.difficulty === 'Medium' ? 5 : 2} Difficulty Bonus</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-600">Team Mode</div>
          <div className="text-gray-600">Collaborative Learning</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-yellow-600">+{currentRoom.players.length * 5} XP</div>
          <div className="text-gray-600">Team Bonus Per Question</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-red-600">Together</div>
          <div className="text-gray-600">We Learn & Grow</div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerMathGame;