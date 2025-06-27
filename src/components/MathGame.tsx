import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import Confetti from 'react-confetti';

interface MathQuestion {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
}

const MathGame: React.FC = () => {
  const { user, addXP, addSticker } = useUser();
  const { currentRoom, submitAnswer } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
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

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentRoom?.game?.currentQuestion]);

  if (!currentRoom || !currentRoom.game) {
    return <div>Game not initialized</div>;
  }

  const { questions, currentQuestion, score } = currentRoom.game;
  const question: MathQuestion = questions[currentQuestion];

  const handleSelectAnswer = (answer: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    
    setSelectedAnswer(answer);
    submitAnswer(answer);
    
    // Show result after a short delay (simulating answer check)
    setTimeout(() => {
      const correct = answer === question.correctAnswer;
      setIsCorrect(correct);
      
      if (correct) {
        setShowConfetti(true);
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Award XP
        if (user) {
          addXP(10);
        }
        
        // Award sticker if last question and all correct
        if (currentQuestion === questions.length - 1 && score + 10 === (currentQuestion + 1) * 10) {
          addSticker('math-wizard');
        }
      }
    }, 1000);
  };

  const getAnswerButtonClass = (answer: number) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-primary-50';
    }
    
    if (answer === question.correctAnswer) {
      return 'bg-success-100 border-success-500 text-success-700';
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return 'bg-error-100 border-error-500 text-error-700';
    }
    
    return 'bg-white opacity-50';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-primary-600">
            Score: {score}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-primary-600 h-2.5 rounded-full"
            initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-3xl shadow-lg p-8 mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary-900">
          {question.question}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((answer) => (
            <motion.button
              key={answer}
              className={`text-xl font-semibold py-6 px-4 rounded-2xl border-2 transition-colors ${getAnswerButtonClass(answer)}`}
              onClick={() => handleSelectAnswer(answer)}
              disabled={selectedAnswer !== null}
              whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
              whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
            >
              {answer}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-2xl p-6 text-center ${
              isCorrect ? 'bg-success-100' : 'bg-error-100'
            }`}
          >
            <h3 className={`text-xl font-bold mb-2 ${
              isCorrect ? 'text-success-700' : 'text-error-700'
            }`}>
              {isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
            </h3>
            <p className={isCorrect ? 'text-success-600' : 'text-error-600'}>
              {isCorrect 
                ? 'Great job! You got it right.' 
                : `The correct answer was ${question.correctAnswer}.`}
            </p>
            {isCorrect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4 text-xl"
              >
                +10 XP
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MathGame;