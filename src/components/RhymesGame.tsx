import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Star, Heart, Volume2, RotateCcw, Award, Sparkles, X, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

interface RhymeWord {
  word: string;
  options: string[];
  correct: number;
  explanation?: string; // Why this word is correct
}

interface Rhyme {
  id: number;
  title: string;
  lines: string[];
  blanks: RhymeWord[];
  animation: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const RhymesGame: React.FC = () => {
  const { user, recordAnswer, addSticker } = useUser();
  const [currentRhymeIndex, setCurrentRhymeIndex] = useState(0);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // Track what user actually selected
  const [showResult, setShowResult] = useState(false);
  const [completedRhymes, setCompletedRhymes] = useState<Set<number>>(new Set());
  const [showMoral, setShowMoral] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [placedStickers, setPlacedStickers] = useState<Array<{x: number, y: number, emoji: string}>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    explanation: string;
  } | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const rhymes: Rhyme[] = [
    {
      id: 1,
      title: "Twinkle, Twinkle, Little Star",
      lines: [
        "Twinkle, twinkle, little ____,",
        "How I wonder what you ____.",
        "Up above the world so ____,",
        "Like a diamond in the ____."
      ],
      blanks: [
        { 
          word: "star", 
          options: ["star", "car", "jar", "bar"], 
          correct: 0,
          explanation: "'Star' rhymes with 'are' and fits the theme of the song about a twinkling star in the sky."
        },
        { 
          word: "are", 
          options: ["see", "are", "bee", "tree"], 
          correct: 1,
          explanation: "'Are' rhymes with 'star' and makes sense in the question 'what you are'."
        },
        { 
          word: "high", 
          options: ["low", "high", "slow", "grow"], 
          correct: 1,
          explanation: "'High' rhymes with 'sky' and describes where stars are located - up high in the sky."
        },
        { 
          word: "sky", 
          options: ["fly", "sky", "try", "cry"], 
          correct: 1,
          explanation: "'Sky' rhymes with 'high' and is where diamonds (stars) appear to be - in the night sky."
        }
      ],
      animation: ["⭐", "✨", "🌟", "💫"],
      difficulty: 'Easy'
    },
    {
      id: 2,
      title: "Mary, Mary, Quite Contrary",
      lines: [
        "Mary, Mary, quite ____,",
        "How does your garden ____?",
        "With silver bells and cockleshells,",
        "And pretty maids all in a ____."
      ],
      blanks: [
        { 
          word: "contrary", 
          options: ["contrary", "ordinary", "necessary", "temporary"], 
          correct: 0,
          explanation: "'Contrary' means opposite or different, and it rhymes with 'Mary' in this traditional nursery rhyme."
        },
        { 
          word: "grow", 
          options: ["show", "grow", "flow", "glow"], 
          correct: 1,
          explanation: "'Grow' rhymes with 'row' and makes sense when asking about a garden - gardens grow!"
        },
        { 
          word: "row", 
          options: ["bow", "row", "cow", "how"], 
          correct: 1,
          explanation: "'Row' rhymes with 'grow' and refers to how flowers are arranged in lines or rows in a garden."
        }
      ],
      animation: ["🌸", "🌺", "🌻", "🌷"],
      difficulty: 'Medium'
    },
    {
      id: 3,
      title: "Humpty Dumpty",
      lines: [
        "Humpty Dumpty sat on a ____,",
        "Humpty Dumpty had a great ____.",
        "All the king's horses and all the king's ____,",
        "Couldn't put Humpty together ____."
      ],
      blanks: [
        { 
          word: "wall", 
          options: ["wall", "ball", "hall", "call"], 
          correct: 0,
          explanation: "'Wall' rhymes with 'fall' and tells us where Humpty Dumpty was sitting before he fell."
        },
        { 
          word: "fall", 
          options: ["tall", "fall", "small", "all"], 
          correct: 1,
          explanation: "'Fall' rhymes with 'wall' and describes what happened to Humpty Dumpty - he fell down!"
        },
        { 
          word: "men", 
          options: ["ten", "men", "pen", "hen"], 
          correct: 1,
          explanation: "'Men' rhymes with 'again' and refers to the king's soldiers who tried to help Humpty."
        },
        { 
          word: "again", 
          options: ["again", "remain", "explain", "obtain"], 
          correct: 0,
          explanation: "'Again' rhymes with 'men' and means they couldn't fix Humpty Dumpty back to how he was before."
        }
      ],
      animation: ["🥚", "🧱", "👑", "🐎"],
      difficulty: 'Medium'
    },
    {
      id: 4,
      title: "Baa, Baa, Black Sheep",
      lines: [
        "Baa, baa, black ____,",
        "Have you any ____?",
        "Yes sir, yes sir, three bags ____,",
        "One for my master, one for my ____."
      ],
      blanks: [
        { 
          word: "sheep", 
          options: ["sheep", "deep", "sleep", "keep"], 
          correct: 0,
          explanation: "'Sheep' rhymes with 'wool' and is the animal that says 'baa' and gives us wool."
        },
        { 
          word: "wool", 
          options: ["cool", "wool", "pool", "tool"], 
          correct: 1,
          explanation: "'Wool' rhymes with 'full' and is what we get from sheep to make warm clothes."
        },
        { 
          word: "full", 
          options: ["pull", "full", "bull", "dull"], 
          correct: 1,
          explanation: "'Full' rhymes with 'wool' and means the bags are completely filled with wool."
        },
        { 
          word: "dame", 
          options: ["game", "dame", "name", "same"], 
          correct: 1,
          explanation: "'Dame' rhymes with 'name' and is an old word for a lady or woman."
        }
      ],
      animation: ["🐑", "🧶", "👨‍🌾", "👩"],
      difficulty: 'Easy'
    },
    {
      id: 5,
      title: "Jack and Jill",
      lines: [
        "Jack and Jill went up the ____,",
        "To fetch a pail of ____.",
        "Jack fell down and broke his ____,",
        "And Jill came tumbling ____."
      ],
      blanks: [
        { 
          word: "hill", 
          options: ["hill", "mill", "will", "still"], 
          correct: 0,
          explanation: "'Hill' rhymes with 'water' and is a high place where Jack and Jill went to get water."
        },
        { 
          word: "water", 
          options: ["water", "matter", "better", "letter"], 
          correct: 0,
          explanation: "'Water' rhymes with 'after' and is what they went to fetch in their pail (bucket)."
        },
        { 
          word: "crown", 
          options: ["brown", "crown", "down", "town"], 
          correct: 1,
          explanation: "'Crown' rhymes with 'down' and refers to the top of Jack's head that got hurt when he fell."
        },
        { 
          word: "after", 
          options: ["after", "laughter", "chapter", "master"], 
          correct: 0,
          explanation: "'After' rhymes with 'water' and means Jill fell down following Jack's fall."
        }
      ],
      animation: ["👦", "👧", "🏔️", "💧"],
      difficulty: 'Easy'
    },
    {
      id: 6,
      title: "Row, Row, Row Your Boat",
      lines: [
        "Row, row, row your ____,",
        "Gently down the ____.",
        "Merrily, merrily, merrily, merrily,",
        "Life is but a ____."
      ],
      blanks: [
        { 
          word: "boat", 
          options: ["boat", "coat", "goat", "note"], 
          correct: 0,
          explanation: "'Boat' rhymes with 'stream' and is what you use to travel on water by rowing."
        },
        { 
          word: "stream", 
          options: ["dream", "stream", "cream", "team"], 
          correct: 1,
          explanation: "'Stream' rhymes with 'dream' and is a small river where you can row a boat."
        },
        { 
          word: "dream", 
          options: ["dream", "stream", "cream", "beam"], 
          correct: 0,
          explanation: "'Dream' rhymes with 'stream' and suggests that life is like a wonderful dream."
        }
      ],
      animation: ["🚣", "🌊", "😊", "💭"],
      difficulty: 'Easy'
    }
  ];

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

  const currentRhyme = rhymes[currentRhymeIndex];
  const currentBlank = currentRhyme.blanks[currentBlankIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const selectedOption = currentBlank.options[answerIndex];
    const isCorrect = answerIndex === currentBlank.correct;
    const correctOption = currentBlank.options[currentBlank.correct];
    
    setSelectedAnswer(selectedOption);
    
    // Set feedback information
    setAnswerFeedback({
      isCorrect,
      selectedOption,
      correctOption,
      explanation: currentBlank.explanation || "This is the correct answer for this rhyme."
    });

    const newAnswers = [...selectedAnswers];
    newAnswers[currentBlankIndex] = selectedOption;
    setSelectedAnswers(newAnswers);

    // Track what user actually selected (for summary)
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentBlankIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    recordAnswer(isCorrect, isCorrect ? 8 : 0);

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    // Show feedback for 3 seconds, then move to next blank or show result
    setTimeout(() => {
      if (currentBlankIndex < currentRhyme.blanks.length - 1) {
        setCurrentBlankIndex(currentBlankIndex + 1);
        setSelectedAnswer(null);
        setAnswerFeedback(null);
      } else {
        setShowResult(true);
        if (!completedRhymes.has(currentRhyme.id)) {
          setCompletedRhymes(prev => new Set([...prev, currentRhyme.id]));
          addSticker(`rhyme-${currentRhyme.id}`);
          recordAnswer(true, 15); // Bonus for completing rhyme
        }
      }
    }, 3000);
  };

  const handleNextRhyme = () => {
    setCurrentRhymeIndex((prev) => (prev + 1) % rhymes.length);
    resetRhyme();
  };

  const handlePrevRhyme = () => {
    setCurrentRhymeIndex((prev) => (prev - 1 + rhymes.length) % rhymes.length);
    resetRhyme();
  };

  const resetRhyme = () => {
    setCurrentBlankIndex(0);
    setSelectedAnswers([]);
    setUserAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  const playRhyme = () => {
    setIsPlaying(true);
    // Simulate playing audio
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const getCompletedBlanks = () => {
    return selectedAnswers.filter(answer => answer).length;
  };

  const getAccuracy = () => {
    if (selectedAnswers.length === 0) return 0;
    const correct = selectedAnswers.filter((answer, index) => 
      answer === currentRhyme.blanks[index]?.word
    ).length;
    return Math.round((correct / selectedAnswers.length) * 100);
  };

  const getAnswerButtonClass = (option: string, index: number) => {
    if (selectedAnswer === null) {
      return 'bg-gradient-to-br from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600';
    }
    
    const isCorrectOption = index === currentBlank.correct;
    const isSelectedOption = selectedAnswer === option;
    
    if (isCorrectOption) {
      return 'bg-green-400 text-white border-4 border-green-600';
    }
    
    if (isSelectedOption && !isCorrectOption) {
      return 'bg-red-400 text-white border-4 border-red-600';
    }
    
    return 'bg-gray-300 text-gray-500';
  };

  const getCorrectAnswersCount = () => {
    return userAnswers.filter((answer, index) => 
      answer === currentRhyme.blanks[index]?.word
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 p-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={150}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2">
            🎵 Fill in the Blanks — Rhymes Time!
          </h1>
          <p className="text-xl md:text-2xl text-purple-500 font-semibold">
            Complete the nursery rhymes and learn through music
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rhyme Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
                <Music className="h-6 w-6 mr-2" />
                Nursery Rhymes
              </h2>
              
              <div className="space-y-3">
                {rhymes.map((rhyme, index) => (
                  <motion.button
                    key={rhyme.id}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      currentRhymeIndex === index
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      setCurrentRhymeIndex(index);
                      resetRhyme();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex space-x-1 mb-1">
                          {rhyme.animation.slice(0, 2).map((emoji, i) => (
                            <span key={i} className="text-lg">{emoji}</span>
                          ))}
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{rhyme.title}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                          rhyme.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                          rhyme.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {rhyme.difficulty}
                        </div>
                      </div>
                      {completedRhymes.has(rhyme.id) && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <h3 className="font-bold text-purple-600 mb-2">Your Progress</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Rhymes Completed</span>
                  <span className="font-bold">{completedRhymes.size}/{rhymes.length}</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedRhymes.size / rhymes.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Rhyme Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Rhyme Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-pink-400 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{currentRhyme.title}</h2>
                    <div className="flex items-center text-yellow-100">
                      <div className="flex space-x-2 mr-4">
                        {currentRhyme.animation.map((emoji, index) => (
                          <motion.span
                            key={index}
                            className="text-3xl"
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2 + index * 0.3,
                              ease: "easeInOut"
                            }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                      <span>Difficulty: {currentRhyme.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={playRhyme}
                      disabled={isPlaying}
                      icon={<Volume2 className="h-4 w-4" />}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      {isPlaying ? 'Playing...' : 'Play'}
                    </Button>
                    
                    {completedRhymes.has(currentRhyme.id) && (
                      <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                        <Award className="h-5 w-5 mr-2" />
                        <span>Completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 bg-yellow-50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="font-bold">
                    {showResult ? 'Complete!' : `${getCompletedBlanks()}/${currentRhyme.blanks.length} blanks filled`}
                  </span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: showResult 
                        ? '100%' 
                        : `${((currentBlankIndex + (selectedAnswers[currentBlankIndex] ? 1 : 0)) / currentRhyme.blanks.length) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {getCompletedBlanks() > 0 && <Sparkles className="h-3 w-3 text-white" />}
                  </motion.div>
                </div>
              </div>

              {/* Rhyme Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {!showResult ? (
                    <motion.div
                      key={currentBlankIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      {/* Story Characters */}
                      <div className="flex justify-center mb-8">
                        <div className="flex space-x-4">
                          {currentRhyme.animation.map((character, index) => (
                            <motion.div
                              key={index}
                              className="text-6xl"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 2 + index * 0.5,
                                ease: "easeInOut"
                              }}
                            >
                              {character}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Rhyme Lines */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
                        {currentRhyme.lines.map((line, index) => (
                          <motion.div
                            key={index}
                            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-relaxed"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                          >
                            {line.includes('____') ? (
                              <span>
                                {line.split('____')[0]}
                                <span className="inline-block min-w-[120px] mx-2 px-4 py-2 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded-lg">
                                  {selectedAnswers[currentRhyme.lines.findIndex(l => l === line)] || '____'}
                                </span>
                                {line.split('____')[1]}
                              </span>
                            ) : (
                              line
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Current Question */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-purple-600 mb-4">
                          Fill in the blank #{currentBlankIndex + 1}:
                        </h3>
                        <div className="text-3xl font-bold text-gray-800 mb-6">
                          What rhymes and fits? Choose the word that completes the line!
                        </div>
                      </div>

                      {/* Answer Options */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                        {currentBlank.options.map((option, index) => (
                          <motion.button
                            key={index}
                            className={`font-bold text-xl py-6 px-4 rounded-2xl shadow-lg transition-all ${getAnswerButtonClass(option, index)}`}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            whileHover={selectedAnswer === null ? { scale: 1.05, y: -5 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>

                      {/* Answer Feedback */}
                      <AnimatePresence>
                        {answerFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`rounded-3xl p-6 ${
                              answerFeedback.isCorrect 
                                ? 'bg-green-100 border-4 border-green-300' 
                                : 'bg-red-100 border-4 border-red-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-4">
                              {answerFeedback.isCorrect ? (
                                <CheckCircle className="h-12 w-12 text-green-600" />
                              ) : (
                                <AlertCircle className="h-12 w-12 text-red-600" />
                              )}
                            </div>
                            
                            <h3 className={`text-2xl font-bold mb-4 ${
                              answerFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {answerFeedback.isCorrect ? 'Excellent! 🎉' : 'Not quite right! 🤔'}
                            </h3>
                            
                            {!answerFeedback.isCorrect && (
                              <div className="mb-4 p-4 bg-white rounded-2xl">
                                <p className="text-lg font-semibold text-gray-800 mb-2">
                                  You chose: <span className="text-red-600">"{answerFeedback.selectedOption}"</span>
                                </p>
                                <p className="text-lg font-semibold text-gray-800 mb-3">
                                  Correct answer: <span className="text-green-600">"{answerFeedback.correctOption}"</span>
                                </p>
                              </div>
                            )}
                            
                            <div className="bg-white rounded-2xl p-4">
                              <h4 className="font-bold text-gray-800 mb-2">Why this answer?</h4>
                              <p className="text-gray-700 leading-relaxed">
                                {answerFeedback.explanation}
                              </p>
                            </div>
                            
                            {answerFeedback.isCorrect && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center gap-2 text-xl font-bold text-green-600 mt-4"
                              >
                                <Star className="h-6 w-6" />
                                <span>+8 XP</span>
                                <Sparkles className="h-6 w-6" />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      {/* Completion Header */}
                      <div className="text-6xl mb-6">🎉</div>
                      <h3 className="text-3xl font-bold text-purple-600 mb-6">
                        Rhyme Completed!
                      </h3>
                      
                      {/* Performance Summary */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
                        <h4 className="text-2xl font-bold text-purple-600 mb-6 flex items-center justify-center">
                          <Trophy className="h-8 w-8 mr-3" />
                          Your Performance Summary
                        </h4>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <div className="text-3xl font-bold text-green-600">{getCorrectAnswersCount()}</div>
                            <div className="text-gray-600">Correct Answers</div>
                          </div>
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <div className="text-3xl font-bold text-red-600">{currentRhyme.blanks.length - getCorrectAnswersCount()}</div>
                            <div className="text-gray-600">Wrong Answers</div>
                          </div>
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <div className="text-3xl font-bold text-purple-600">{getAccuracy()}%</div>
                            <div className="text-gray-600">Accuracy</div>
                          </div>
                        </div>

                        {/* Answer Review */}
                        <div className="bg-white rounded-2xl p-6 mb-6">
                          <h5 className="text-xl font-bold text-gray-800 mb-4">Answer Review:</h5>
                          <div className="space-y-4">
                            {currentRhyme.blanks.map((blank, index) => {
                              const userAnswer = userAnswers[index];
                              const correctAnswer = blank.word;
                              const isCorrect = userAnswer === correctAnswer;
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                                  <div className="flex items-center">
                                    <span className="text-lg font-medium text-gray-700 mr-4">
                                      Blank #{index + 1}:
                                    </span>
                                    <div className="flex items-center space-x-3">
                                      <span className={`px-3 py-1 rounded-full font-bold ${
                                        isCorrect 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        Your answer: {userAnswer}
                                      </span>
                                      {!isCorrect && (
                                        <span className="px-3 py-1 rounded-full font-bold bg-green-100 text-green-700">
                                          Correct: {correctAnswer}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-2xl">
                                    {isCorrect ? '✅' : '❌'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Complete Rhyme Display */}
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                          <h5 className="text-xl font-bold text-gray-800 mb-4">Complete Rhyme:</h5>
                          {currentRhyme.lines.map((line, index) => (
                            <div key={index} className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
                              {line.replace('____', currentRhyme.blanks[currentRhyme.lines.findIndex(l => l === line)]?.word || '____')}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* XP Earned */}
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-8 text-white">
                        <h4 className="text-2xl font-bold mb-2">XP Earned!</h4>
                        <div className="text-4xl font-bold">
                          +{15 + (getCorrectAnswersCount() * 8)} XP
                        </div>
                        <p className="text-yellow-100 mt-2">
                          {getCorrectAnswersCount() * 8} XP for correct answers + 15 XP completion bonus
                        </p>
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="secondary"
                          onClick={resetRhyme}
                          icon={<RotateCcw className="h-5 w-5" />}
                        >
                          Play Again
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleNextRhyme}
                          icon={<Music className="h-5 w-5" />}
                        >
                          Next Rhyme
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhymesGame;