import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Trophy, Star, Timer, Target, Zap, Award,
  Calculator, PencilRuler, BookOpen, Music, Hash, Palette
} from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import Confetti from 'react-confetti';

interface MultiplayerGameRoomProps {
  gameType: string;
  roomPlayers: any[];
  onSendMessage: (message: string, type?: string) => void;
  messages: any[];
  currentUser: any;
}

interface GameQuestion {
  id: number;
  question: string;
  options: any[];
  correctAnswer: any;
  difficulty: string;
  hint: string;
  explanation: string;
  timeLimit: number;
  imageUrl?: string;
}

const MultiplayerGameRoom: React.FC<MultiplayerGameRoomProps> = ({
  gameType,
  roomPlayers,
  onSendMessage,
  messages,
  currentUser
}) => {
  const { user, recordAnswer } = useUser();
  const { currentRoom, submitAnswer } = useGame();
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, any>>({});
  const [questionResults, setQuestionResults] = useState<any>(null);
  const [gameScore, setGameScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
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

  // Generate questions based on game type
  const generateQuestion = (gameType: string, difficulty: number): GameQuestion => {
    switch (gameType) {
      case 'math-mania':
        return generateMathQuestion(difficulty);
      case 'spelling-bee':
        return generateSpellingQuestion(difficulty);
      case 'tales':
        return generateTalesQuestion(difficulty);
      case 'rhymes':
        return generateRhymesQuestion(difficulty);
      case 'tables':
        return generateTablesQuestion(difficulty);
      case 'team-drawing':
        return generateDrawingQuestion(difficulty);
      case 'team-challenge':
        // For mixed challenge, randomly select a game type
        const gameTypes = ['math-mania', 'spelling-bee', 'tales', 'rhymes', 'tables'];
        const randomType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
        return generateQuestion(randomType, difficulty);
      default:
        return generateMathQuestion(difficulty);
    }
  };

  const generateMathQuestion = (difficulty: number): GameQuestion => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * (difficulty > 2 ? 4 : 2))];
    
    let operand1, operand2, answer;
    const range = Math.min(10 + difficulty * 5, 50);
    
    if (operation === '÷') {
      operand2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * range) + 1;
      operand1 = operand2 * answer;
    } else {
      operand1 = Math.floor(Math.random() * range) + 1;
      operand2 = Math.floor(Math.random() * range) + 1;
      
      switch (operation) {
        case '+': answer = operand1 + operand2; break;
        case '-': 
          if (operand1 < operand2) [operand1, operand2] = [operand2, operand1];
          answer = operand1 - operand2; 
          break;
        case '×': answer = operand1 * operand2; break;
        default: answer = 0;
      }
    }

    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrong = answer + (Math.floor(Math.random() * 20) - 10);
      if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }

    return {
      id: Date.now(),
      question: `${operand1} ${operation} ${operand2} = ?`,
      options: [...wrongAnswers, answer].sort(() => Math.random() - 0.5),
      correctAnswer: answer,
      difficulty: difficulty <= 2 ? 'Easy' : difficulty <= 4 ? 'Medium' : 'Hard',
      hint: `Try breaking down ${operand1} ${operation} ${operand2} step by step`,
      explanation: `${operand1} ${operation} ${operand2} = ${answer}`,
      timeLimit: 30
    };
  };

  const generateSpellingQuestion = (difficulty: number): GameQuestion => {
    const words = [
      { word: 'BEAUTIFUL', definition: 'pleasing to the senses or mind', options: ['BEAUTIFUL', 'BEATIFUL', 'BEUTIFUL', 'BEAUTIFULL'] },
      { word: 'ELEPHANT', definition: 'a very large animal with a long trunk', options: ['ELEPHANT', 'ELEFANT', 'ELEPHENT', 'ELIPHANT'] },
      { word: 'RAINBOW', definition: 'an arch of colors in the sky', options: ['RAINBOW', 'RAINBOE', 'RAYNBOW', 'RAINBO'] },
      { word: 'DINOSAUR', definition: 'a large extinct reptile', options: ['DINOSAUR', 'DINASAUR', 'DINASOUR', 'DYNOSAUR'] },
    ];
    
    const selected = words[Math.floor(Math.random() * words.length)];
    
    return {
      id: Date.now(),
      question: `How do you spell the word that means "${selected.definition}"?`,
      options: selected.options,
      correctAnswer: selected.word,
      difficulty: difficulty <= 2 ? 'Easy' : difficulty <= 4 ? 'Medium' : 'Hard',
      hint: `The first letter is "${selected.word[0]}" and it has ${selected.word.length} letters`,
      explanation: `The correct spelling is ${selected.word}`,
      timeLimit: 25
    };
  };

  const generateTalesQuestion = (difficulty: number): GameQuestion => {
    const tales = [
      {
        question: "In 'The Tortoise and the Hare', what lesson do we learn?",
        options: ["Speed always wins", "Slow and steady wins the race", "Sleep is important", "Racing is fun"],
        correct: "Slow and steady wins the race",
        explanation: "The tortoise won by being consistent and not giving up"
      }
    ];
    
    const selected = tales[Math.floor(Math.random() * tales.length)];
    
    return {
      id: Date.now(),
      question: selected.question,
      options: selected.options,
      correctAnswer: selected.correct,
      difficulty: difficulty <= 2 ? 'Easy' : difficulty <= 4 ? 'Medium' : 'Hard',
      hint: "Think about the moral of the story",
      explanation: selected.explanation,
      timeLimit: 35
    };
  };

  const generateRhymesQuestion = (difficulty: number): GameQuestion => {
    const rhymes = [
      {
        question: "Twinkle, twinkle, little ____",
        options: ["car", "star", "bar", "far"],
        correct: "star",
        explanation: "Star rhymes with 'are' in the next line"
      }
    ];
    
    const selected = rhymes[Math.floor(Math.random() * rhymes.length)];
    
    return {
      id: Date.now(),
      question: selected.question,
      options: selected.options,
      correctAnswer: selected.correct,
      difficulty: difficulty <= 2 ? 'Easy' : difficulty <= 4 ? 'Medium' : 'Hard',
      hint: "Think about what word would rhyme in the song",
      explanation: selected.explanation,
      timeLimit: 20
    };
  };

  const generateTablesQuestion = (difficulty: number): GameQuestion => {
    const table = Math.floor(Math.random() * 12) + 1;
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = table * multiplier;
    
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrong = answer + (Math.floor(Math.random() * 20) - 10);
      if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }

    return {
      id: Date.now(),
      question: `${table} × ${multiplier} = ?`,
      options: [...wrongAnswers, answer].sort(() => Math.random() - 0.5),
      correctAnswer: answer,
      difficulty: difficulty <= 2 ? 'Easy' : difficulty <= 4 ? 'Medium' : 'Hard',
      hint: `Think of ${table} groups of ${multiplier}`,
      explanation: `${table} × ${multiplier} = ${answer}`,
      timeLimit: 25
    };
  };

  const generateDrawingQuestion = (difficulty: number): GameQuestion => {
    const prompts = [
      "Draw a house with a garden",
      "Draw your favorite animal",
      "Draw a rainbow with clouds",
      "Draw a tree with flowers"
    ];
    
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    return {
      id: Date.now(),
      question: `Drawing Challenge: ${prompt}`,
      options: ["Start Drawing", "Need Help", "Show Example", "Skip"],
      correctAnswer: "Start Drawing",
      difficulty: 'Creative',
      hint: "Use your imagination and have fun!",
      explanation: "Great job on your creative drawing!",
      timeLimit: 60
    };
  };

  // Initialize first question
  useEffect(() => {
    if (!currentQuestion) {
      const question = generateQuestion(gameType, 1);
      setCurrentQuestion(question);
      setTimeLeft(question.timeLimit);
    }
  }, [gameType]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleTimeUp();
    }
  }, [timeLeft, selectedAnswer]);

  const handleTimeUp = () => {
    setSelectedAnswer('timeout');
    recordAnswer(false, 0);
    onSendMessage(`⏰ Time's up! The correct answer was: ${currentQuestion?.correctAnswer}`, 'system');
    
    setTimeout(() => {
      generateNextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (answer: any) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setPlayerAnswers(prev => ({ ...prev, [currentUser.id]: answer }));
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    
    // Calculate XP based on team performance
    const baseXP = 15;
    const timeBonus = Math.floor(timeLeft / 5) * 2;
    const teamBonus = roomPlayers.length * 3;
    const totalXP = isCorrect ? baseXP + timeBonus + teamBonus : 0;
    
    recordAnswer(isCorrect, totalXP);
    submitAnswer(answer);
    
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      onSendMessage(`🎉 ${currentUser.nickname} got it right! +${totalXP} XP`, 'achievement');
    } else {
      onSendMessage(`${currentUser.nickname} answered but didn't get it right. Keep trying!`, 'system');
    }
    
    // Simulate other players answering
    setTimeout(() => {
      const otherPlayers = roomPlayers.filter(p => p.id !== currentUser.id);
      const newAnswers = { ...playerAnswers };
      
      otherPlayers.forEach(player => {
        const isCorrect = Math.random() < 0.7;
        newAnswers[player.id] = isCorrect ? currentQuestion?.correctAnswer : 
          currentQuestion?.options.find(o => o !== currentQuestion.correctAnswer);
        
        if (isCorrect) {
          onSendMessage(`🎉 ${player.nickname} got it right!`, 'achievement');
        }
      });
      
      setPlayerAnswers(newAnswers);
      showQuestionResults();
    }, 2000);
  };

  const showQuestionResults = () => {
    const correctCount = Object.values(playerAnswers).filter(
      answer => answer === currentQuestion?.correctAnswer
    ).length + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
    
    const teamAccuracy = Math.round((correctCount / roomPlayers.length) * 100);
    const teamScore = correctCount * 10;
    
    setQuestionResults({
      correctCount,
      teamAccuracy,
      teamScore,
      explanation: currentQuestion?.explanation
    });
    
    setGameScore(prev => prev + teamScore);
    
    setTimeout(() => {
      generateNextQuestion();
    }, 4000);
  };

  const generateNextQuestion = () => {
    const nextQuestion = generateQuestion(gameType, Math.floor(questionIndex / 3) + 1);
    setCurrentQuestion(nextQuestion);
    setSelectedAnswer(null);
    setPlayerAnswers({});
    setQuestionResults(null);
    setTimeLeft(nextQuestion.timeLimit);
    setQuestionIndex(prev => prev + 1);
    setShowHint(false);
  };

  const getGameDisplayName = () => {
    const names: Record<string, string> = {
      'math-mania': 'Math Mania',
      'spelling-bee': 'Spelling Bee',
      'tales': 'Interactive Tales',
      'rhymes': 'Nursery Rhymes',
      'tables': 'Multiplication Tables',
      'team-drawing': 'Team Drawing',
      'team-challenge': 'Mixed Challenge'
    };
    return names[gameType] || 'Team Game';
  };

  const getGameIcon = () => {
    switch (gameType) {
      case 'math-mania': return <Calculator className="h-8 w-8" />;
      case 'spelling-bee': return <PencilRuler className="h-8 w-8" />;
      case 'tales': return <BookOpen className="h-8 w-8" />;
      case 'rhymes': return <Music className="h-8 w-8" />;
      case 'tables': return <Hash className="h-8 w-8" />;
      case 'team-drawing': return <Palette className="h-8 w-8" />;
      case 'team-challenge': return <Trophy className="h-8 w-8" />;
      default: return <Calculator className="h-8 w-8" />;
    }
  };

  const getAnswerButtonClass = (option: any) => {
    if (selectedAnswer === null) {
      return 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600';
    }
    
    if (option === currentQuestion?.correctAnswer) {
      return 'bg-green-400 text-white border-4 border-green-600';
    }
    
    if (selectedAnswer === option && option !== currentQuestion?.correctAnswer) {
      return 'bg-red-400 text-white border-4 border-red-600';
    }
    
    return 'bg-gray-300 text-gray-500';
  };

  const handleShowHint = () => {
    setShowHint(true);
    onSendMessage(`💡 ${currentUser.nickname} shared a hint: ${currentQuestion?.hint}`, 'system');
  };

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 relative">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Game Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getGameIcon()}
            <div className="ml-4">
              <h1 className="text-3xl font-bold mb-2">{getGameDisplayName()}</h1>
              <p className="text-purple-100">Team Mode - Question {questionIndex + 1}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-300' : 'text-white'}`}>
                {timeLeft}s
              </div>
              <div className="text-sm opacity-80">Time Left</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-200">{gameScore}</div>
              <div className="text-sm opacity-80">Team Score</div>
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
            {roomPlayers.map((player: any, index: number) => (
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
                  {player.id === currentUser.id && ' (You)'}
                </span>
                {playerAnswers[player.id] && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Display */}
      <motion.div
        key={currentQuestion.id}
        className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty}
            </div>
            
            <div className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
              Team Question
            </div>
            
            {!showHint && (
              <button
                onClick={handleShowHint}
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Show Hint
              </button>
            )}
          </div>
          
          {/* Hint Display */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 mx-auto max-w-2xl"
              >
                <p className="text-blue-700">
                  <span className="font-bold">Hint:</span> {currentQuestion.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={`${currentQuestion.id}-${option}-${index}`}
              className={`text-xl font-bold py-6 px-4 rounded-2xl shadow-lg transition-all ${getAnswerButtonClass(option)}`}
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

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion.timeLimit - timeLeft) / currentQuestion.timeLimit) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Question Results */}
      <AnimatePresence>
        {questionResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-8 mb-6"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-700 mb-4">
                Team Results! 🎉
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-green-600">{questionResults.correctCount}</div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-blue-600">{questionResults.teamAccuracy}%</div>
                  <div className="text-gray-600">Team Accuracy</div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-purple-600">+{questionResults.teamScore}</div>
                  <div className="text-gray-600">Points Earned</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-2">Explanation:</h4>
                <p className="text-gray-700">{questionResults.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-600">{roomPlayers.length}</div>
          <div className="text-gray-600">Team Players</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-yellow-600">{gameScore}</div>
          <div className="text-gray-600">Team Score</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-600">{questionIndex + 1}</div>
          <div className="text-gray-600">Questions Answered</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Zap className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-600">+{roomPlayers.length * 3}</div>
          <div className="text-gray-600">Team XP Bonus</div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameRoom;