import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Heart, Users, Timer, Target, Zap, Award, Volume2, Eye, HelpCircle, Lightbulb } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

interface SpellingWord {
  id: number;
  word: string;
  definition: string;
  difficulty: string;
  audioUrl?: string;
  hints: string[];
  category: string;
}

type GameMode = 'listen' | 'fill' | 'describe';

const SpellingBeeGame: React.FC = () => {
  const { user, recordAnswer, getTodayStats, getXPRequiredForNextLevel } = useUser();
  
  const [currentWord, setCurrentWord] = useState<SpellingWord | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('listen');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gamePhase, setGamePhase] = useState<'playing' | 'result' | 'waiting'>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [maskedWord, setMaskedWord] = useState('');
  const [sessionWordPool, setSessionWordPool] = useState<SpellingWord[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Expanded word database with unique words for each difficulty
  const wordDatabase: Record<string, SpellingWord[]> = {
    easy: [
      { id: 1, word: 'cat', definition: 'A small furry pet that meows', difficulty: 'Easy', hints: ['It has whiskers', 'It purrs when happy', 'It catches mice'], category: 'Animals' },
      { id: 2, word: 'dog', definition: 'A loyal pet that barks and wags its tail', difficulty: 'Easy', hints: ['Man\'s best friend', 'It barks', 'It wags its tail'], category: 'Animals' },
      { id: 3, word: 'sun', definition: 'The bright star that gives us light and warmth', difficulty: 'Easy', hints: ['It shines in the sky', 'It\'s very hot', 'It gives us light'], category: 'Nature' },
      { id: 4, word: 'book', definition: 'Something you read with pages and words', difficulty: 'Easy', hints: ['You read it', 'It has pages', 'Libraries have many'], category: 'Objects' },
      { id: 5, word: 'tree', definition: 'A tall plant with branches and leaves', difficulty: 'Easy', hints: ['It has leaves', 'Birds nest in it', 'It grows tall'], category: 'Nature' },
      { id: 6, word: 'house', definition: 'A building where people live', difficulty: 'Easy', hints: ['People live in it', 'It has rooms', 'It has a roof'], category: 'Places' },
      { id: 7, word: 'water', definition: 'A clear liquid that we drink', difficulty: 'Easy', hints: ['We drink it', 'Fish swim in it', 'It\'s wet'], category: 'Nature' },
      { id: 8, word: 'happy', definition: 'Feeling joyful and pleased', difficulty: 'Easy', hints: ['A good feeling', 'Opposite of sad', 'Makes you smile'], category: 'Emotions' },
      { id: 9, word: 'bird', definition: 'An animal that flies and has feathers', difficulty: 'Easy', hints: ['It has wings', 'It can fly', 'It lays eggs'], category: 'Animals' },
      { id: 10, word: 'fish', definition: 'An animal that lives in water', difficulty: 'Easy', hints: ['Lives in water', 'Has fins', 'Can swim'], category: 'Animals' },
      { id: 11, word: 'moon', definition: 'The bright object in the night sky', difficulty: 'Easy', hints: ['Shines at night', 'Changes shape', 'In the sky'], category: 'Nature' },
      { id: 12, word: 'car', definition: 'A vehicle with four wheels', difficulty: 'Easy', hints: ['Has four wheels', 'You drive it', 'Uses gas'], category: 'Transportation' },
      { id: 13, word: 'ball', definition: 'A round object used in games', difficulty: 'Easy', hints: ['It\'s round', 'Used in sports', 'You can throw it'], category: 'Toys' },
      { id: 14, word: 'cake', definition: 'A sweet dessert for celebrations', difficulty: 'Easy', hints: ['Sweet dessert', 'Has candles on birthdays', 'Made with flour'], category: 'Food' },
      { id: 15, word: 'shoe', definition: 'Something you wear on your feet', difficulty: 'Easy', hints: ['Worn on feet', 'Protects your feet', 'Has laces'], category: 'Clothing' },
      { id: 16, word: 'hat', definition: 'Something you wear on your head', difficulty: 'Easy', hints: ['Worn on head', 'Protects from sun', 'Can have a brim'], category: 'Clothing' },
      { id: 17, word: 'pen', definition: 'A tool used for writing', difficulty: 'Easy', hints: ['Used for writing', 'Has ink', 'Held in hand'], category: 'Tools' },
      { id: 18, word: 'cup', definition: 'A container for drinking', difficulty: 'Easy', hints: ['Used for drinking', 'Has a handle', 'Holds liquids'], category: 'Objects' },
      { id: 19, word: 'bed', definition: 'Furniture where you sleep', difficulty: 'Easy', hints: ['You sleep on it', 'Has a mattress', 'In the bedroom'], category: 'Furniture' },
      { id: 20, word: 'toy', definition: 'Something children play with', difficulty: 'Easy', hints: ['Children play with it', 'For fun', 'Can be colorful'], category: 'Toys' },
    ],
    medium: [
      { id: 21, word: 'elephant', definition: 'A large gray animal with a long trunk', difficulty: 'Medium', hints: ['It has a trunk', 'It\'s very big', 'It has big ears'], category: 'Animals' },
      { id: 22, word: 'butterfly', definition: 'A colorful insect with beautiful wings', difficulty: 'Medium', hints: ['It has colorful wings', 'It flies from flower to flower', 'It was once a caterpillar'], category: 'Animals' },
      { id: 23, word: 'rainbow', definition: 'Colorful arc in the sky after rain', difficulty: 'Medium', hints: ['Appears after rain', 'Has many colors', 'Arcs across the sky'], category: 'Nature' },
      { id: 24, word: 'bicycle', definition: 'A vehicle with two wheels that you pedal', difficulty: 'Medium', hints: ['Has two wheels', 'You pedal it', 'Good for exercise'], category: 'Transportation' },
      { id: 25, word: 'computer', definition: 'An electronic device for processing information', difficulty: 'Medium', hints: ['Has a screen', 'You type on it', 'Runs programs'], category: 'Technology' },
      { id: 26, word: 'birthday', definition: 'The day you were born, celebrated yearly', difficulty: 'Medium', hints: ['Celebrated once a year', 'You blow out candles', 'You get presents'], category: 'Events' },
      { id: 27, word: 'sandwich', definition: 'Food made with bread and fillings', difficulty: 'Medium', hints: ['Made with bread', 'Has fillings inside', 'Good for lunch'], category: 'Food' },
      { id: 28, word: 'adventure', definition: 'An exciting and unusual experience', difficulty: 'Medium', hints: ['Exciting experience', 'Often involves travel', 'Can be dangerous'], category: 'Concepts' },
      { id: 29, word: 'mountain', definition: 'A very tall hill or peak', difficulty: 'Medium', hints: ['Very tall', 'Has a peak', 'Snow on top'], category: 'Geography' },
      { id: 30, word: 'ocean', definition: 'A large body of salt water', difficulty: 'Medium', hints: ['Very large water', 'Has waves', 'Fish live in it'], category: 'Geography' },
      { id: 31, word: 'library', definition: 'A place where books are kept', difficulty: 'Medium', hints: ['Has many books', 'You can borrow books', 'Quiet place'], category: 'Places' },
      { id: 32, word: 'garden', definition: 'A place where plants and flowers grow', difficulty: 'Medium', hints: ['Plants grow here', 'Has flowers', 'You water it'], category: 'Places' },
      { id: 33, word: 'kitchen', definition: 'A room where food is prepared', difficulty: 'Medium', hints: ['Where you cook', 'Has a stove', 'Food is made here'], category: 'Rooms' },
      { id: 34, word: 'picture', definition: 'An image or drawing', difficulty: 'Medium', hints: ['Shows an image', 'Can be drawn', 'Hangs on wall'], category: 'Art' },
      { id: 35, word: 'music', definition: 'Sounds arranged in a pleasing way', difficulty: 'Medium', hints: ['You listen to it', 'Has rhythm', 'Can be sung'], category: 'Art' },
      { id: 36, word: 'friend', definition: 'Someone you like and enjoy being with', difficulty: 'Medium', hints: ['Someone you like', 'You play together', 'Cares about you'], category: 'People' },
      { id: 37, word: 'teacher', definition: 'A person who helps you learn', difficulty: 'Medium', hints: ['Helps you learn', 'Works at school', 'Gives lessons'], category: 'People' },
      { id: 38, word: 'doctor', definition: 'A person who helps sick people', difficulty: 'Medium', hints: ['Helps sick people', 'Works in hospital', 'Uses medicine'], category: 'People' },
      { id: 39, word: 'airplane', definition: 'A flying vehicle with wings', difficulty: 'Medium', hints: ['It flies', 'Has wings', 'Carries passengers'], category: 'Transportation' },
      { id: 40, word: 'telephone', definition: 'A device used to talk to people far away', difficulty: 'Medium', hints: ['Used to talk', 'Has numbers', 'Makes calls'], category: 'Technology' },
    ],
    intermediate: [
      { id: 41, word: 'magnificent', definition: 'Extremely beautiful or impressive', difficulty: 'Intermediate', hints: ['Means very beautiful', 'Impressive to see', 'Grand and splendid'], category: 'Adjectives' },
      { id: 42, word: 'mysterious', definition: 'Difficult to understand or explain', difficulty: 'Intermediate', hints: ['Hard to understand', 'Full of secrets', 'Puzzling'], category: 'Adjectives' },
      { id: 43, word: 'telescope', definition: 'An instrument for viewing distant objects', difficulty: 'Intermediate', hints: ['Used to see far away', 'Astronomers use it', 'Makes things look bigger'], category: 'Science' },
      { id: 44, word: 'democracy', definition: 'A system where people vote for their leaders', difficulty: 'Intermediate', hints: ['People vote', 'Government system', 'Power to the people'], category: 'Politics' },
      { id: 45, word: 'photosynthesis', definition: 'How plants make food using sunlight', difficulty: 'Intermediate', hints: ['Plants do this', 'Uses sunlight', 'Makes oxygen'], category: 'Science' },
      { id: 46, word: 'archaeology', definition: 'The study of ancient civilizations', difficulty: 'Intermediate', hints: ['Studies old things', 'Digs up artifacts', 'About ancient people'], category: 'Science' },
      { id: 47, word: 'encyclopedia', definition: 'A book with information on many subjects', difficulty: 'Intermediate', hints: ['Has lots of information', 'Organized alphabetically', 'Reference book'], category: 'Education' },
      { id: 48, word: 'refrigerator', definition: 'An appliance that keeps food cold', difficulty: 'Intermediate', hints: ['Keeps food cold', 'In the kitchen', 'Prevents spoiling'], category: 'Appliances' },
      { id: 49, word: 'geography', definition: 'The study of Earth and its features', difficulty: 'Intermediate', hints: ['Studies Earth', 'About maps', 'Countries and continents'], category: 'Science' },
      { id: 50, word: 'mathematics', definition: 'The study of numbers and calculations', difficulty: 'Intermediate', hints: ['About numbers', 'Addition and subtraction', 'Solving problems'], category: 'Education' },
      { id: 51, word: 'temperature', definition: 'How hot or cold something is', difficulty: 'Intermediate', hints: ['Hot or cold', 'Measured in degrees', 'Weather has this'], category: 'Science' },
      { id: 52, word: 'celebration', definition: 'A special event or party', difficulty: 'Intermediate', hints: ['Special event', 'People gather', 'Happy occasion'], category: 'Events' },
      { id: 53, word: 'imagination', definition: 'The ability to create ideas in your mind', difficulty: 'Intermediate', hints: ['Creating ideas', 'In your mind', 'Being creative'], category: 'Mind' },
      { id: 54, word: 'responsibility', definition: 'A duty or task you must do', difficulty: 'Intermediate', hints: ['Something you must do', 'A duty', 'Being reliable'], category: 'Character' },
      { id: 55, word: 'environment', definition: 'The natural world around us', difficulty: 'Intermediate', hints: ['Natural world', 'Plants and animals', 'We must protect it'], category: 'Nature' },
      { id: 56, word: 'communication', definition: 'Sharing information with others', difficulty: 'Intermediate', hints: ['Sharing information', 'Talking or writing', 'Between people'], category: 'Social' },
      { id: 57, word: 'transportation', definition: 'Ways of moving from place to place', difficulty: 'Intermediate', hints: ['Moving around', 'Cars and buses', 'Getting places'], category: 'Travel' },
      { id: 58, word: 'organization', definition: 'Arranging things in an orderly way', difficulty: 'Intermediate', hints: ['Keeping things neat', 'In order', 'Well arranged'], category: 'Skills' },
      { id: 59, word: 'opportunity', definition: 'A chance to do something good', difficulty: 'Intermediate', hints: ['A chance', 'Good timing', 'Don\'t miss it'], category: 'Life' },
      { id: 60, word: 'personality', definition: 'The qualities that make you unique', difficulty: 'Intermediate', hints: ['What makes you special', 'Your character', 'How you act'], category: 'Psychology' },
    ],
    difficult: [
      { id: 61, word: 'pharmaceutical', definition: 'Related to the preparation of medicines', difficulty: 'Difficult', hints: ['About medicines', 'Drug companies', 'Medical field'], category: 'Medicine' },
      { id: 62, word: 'entrepreneurship', definition: 'The activity of starting and running businesses', difficulty: 'Difficult', hints: ['Starting businesses', 'Taking risks', 'Innovation'], category: 'Business' },
      { id: 63, word: 'metamorphosis', definition: 'A complete change in form or nature', difficulty: 'Difficult', hints: ['Complete change', 'Caterpillar to butterfly', 'Transformation'], category: 'Science' },
      { id: 64, word: 'conscientious', definition: 'Careful and thorough in work or duties', difficulty: 'Difficult', hints: ['Very careful', 'Thorough worker', 'Takes responsibility'], category: 'Character' },
      { id: 65, word: 'serendipity', definition: 'A pleasant surprise or fortunate accident', difficulty: 'Difficult', hints: ['Happy accident', 'Unexpected good luck', 'Pleasant surprise'], category: 'Concepts' },
      { id: 66, word: 'onomatopoeia', definition: 'Words that imitate sounds they represent', difficulty: 'Difficult', hints: ['Sound words', 'Like buzz or crash', 'Imitates sounds'], category: 'Language' },
      { id: 67, word: 'procrastination', definition: 'The habit of delaying or postponing tasks', difficulty: 'Difficult', hints: ['Putting things off', 'Delaying work', 'Bad habit'], category: 'Behavior' },
      { id: 68, word: 'perspicacious', definition: 'Having keen insight and understanding', difficulty: 'Difficult', hints: ['Very insightful', 'Sharp mind', 'Good judgment'], category: 'Intelligence' },
      { id: 69, word: 'quintessential', definition: 'Representing the most perfect example', difficulty: 'Difficult', hints: ['Perfect example', 'Most typical', 'Best representation'], category: 'Quality' },
      { id: 70, word: 'juxtaposition', definition: 'Placing things side by side for comparison', difficulty: 'Difficult', hints: ['Side by side', 'For comparison', 'Contrasting placement'], category: 'Art' },
      { id: 71, word: 'sophisticated', definition: 'Complex and refined in design', difficulty: 'Difficult', hints: ['Very refined', 'Complex design', 'Elegant and advanced'], category: 'Quality' },
      { id: 72, word: 'extraordinary', definition: 'Very unusual or remarkable', difficulty: 'Difficult', hints: ['Very unusual', 'Remarkable', 'Beyond ordinary'], category: 'Quality' },
      { id: 73, word: 'philosophical', definition: 'Related to the study of fundamental questions', difficulty: 'Difficult', hints: ['Deep thinking', 'About life questions', 'Wisdom seeking'], category: 'Thinking' },
      { id: 74, word: 'psychological', definition: 'Related to the mind and behavior', difficulty: 'Difficult', hints: ['About the mind', 'Mental processes', 'How we think'], category: 'Psychology' },
      { id: 75, word: 'technological', definition: 'Related to technology and innovation', difficulty: 'Difficult', hints: ['About technology', 'Modern devices', 'Innovation'], category: 'Technology' },
      { id: 76, word: 'international', definition: 'Between or among different countries', difficulty: 'Difficult', hints: ['Between countries', 'Global', 'Worldwide'], category: 'Geography' },
      { id: 77, word: 'environmental', definition: 'Related to the natural surroundings', difficulty: 'Difficult', hints: ['About nature', 'Surroundings', 'Ecology'], category: 'Nature' },
      { id: 78, word: 'constitutional', definition: 'Related to a constitution or basic laws', difficulty: 'Difficult', hints: ['About basic laws', 'Government rules', 'Legal foundation'], category: 'Law' },
      { id: 79, word: 'revolutionary', definition: 'Involving a complete change', difficulty: 'Difficult', hints: ['Complete change', 'Major transformation', 'Groundbreaking'], category: 'Change' },
      { id: 80, word: 'incomprehensible', definition: 'Impossible to understand', difficulty: 'Difficult', hints: ['Can\'t understand', 'Too complex', 'Beyond comprehension'], category: 'Understanding' },
    ],
    extreme: [
      { id: 81, word: 'antidisestablishmentarianism', definition: 'Opposition to the withdrawal of state support from an established church', difficulty: 'Extreme', hints: ['Very long word', 'About church and state', 'Political opposition'], category: 'Politics' },
      { id: 82, word: 'pneumonoultramicroscopicsilicovolcanoconosis', definition: 'A lung disease caused by inhaling very fine silicate or quartz dust', difficulty: 'Extreme', hints: ['Lung disease', 'From dust', 'Very long medical term'], category: 'Medicine' },
      { id: 83, word: 'floccinaucinihilipilification', definition: 'The action of estimating something as worthless', difficulty: 'Extreme', hints: ['Considering worthless', 'Very long word', 'About value'], category: 'Concepts' },
      { id: 84, word: 'hippopotomonstrosesquippedaliophobia', definition: 'Fear of long words', difficulty: 'Extreme', hints: ['Fear of long words', 'Ironic name', 'Phobia'], category: 'Psychology' },
      { id: 85, word: 'supercalifragilisticexpialidocious', definition: 'Extraordinarily good or wonderful', difficulty: 'Extreme', hints: ['From Mary Poppins', 'Means wonderful', 'Made-up word'], category: 'Entertainment' },
      { id: 86, word: 'pseudopseudohypoparathyroidism', definition: 'A rare genetic disorder', difficulty: 'Extreme', hints: ['Genetic disorder', 'Medical condition', 'Very rare'], category: 'Medicine' },
      { id: 87, word: 'thyroparathyroidectomized', definition: 'Having had thyroid and parathyroid glands removed', difficulty: 'Extreme', hints: ['Medical procedure', 'Gland removal', 'Surgery term'], category: 'Medicine' },
      { id: 88, word: 'spectrophotofluorometrically', definition: 'In a manner relating to spectrophotofluorometry', difficulty: 'Extreme', hints: ['Scientific method', 'Laboratory technique', 'Measurement'], category: 'Science' },
      { id: 89, word: 'electroencephalographically', definition: 'In a manner relating to brain wave recording', difficulty: 'Extreme', hints: ['Brain waves', 'Medical recording', 'Neurological'], category: 'Medicine' },
      { id: 90, word: 'immunoelectrophoretically', definition: 'Using a technique to separate proteins', difficulty: 'Extreme', hints: ['Laboratory technique', 'Protein separation', 'Scientific method'], category: 'Science' },
      { id: 91, word: 'psychopharmacologically', definition: 'Relating to drugs that affect the mind', difficulty: 'Extreme', hints: ['Mind-affecting drugs', 'Psychiatric medicine', 'Brain chemistry'], category: 'Medicine' },
      { id: 92, word: 'radioimmunoelectrophoresis', definition: 'A laboratory technique using radioactive markers', difficulty: 'Extreme', hints: ['Lab technique', 'Uses radiation', 'Scientific analysis'], category: 'Science' },
      { id: 93, word: 'pneumoencephalographically', definition: 'Relating to X-ray imaging of the brain', difficulty: 'Extreme', hints: ['Brain imaging', 'X-ray technique', 'Medical procedure'], category: 'Medicine' },
      { id: 94, word: 'tetraiodophenolphthalein', definition: 'A chemical compound used in medicine', difficulty: 'Extreme', hints: ['Chemical compound', 'Medical use', 'Complex molecule'], category: 'Chemistry' },
      { id: 95, word: 'hepaticocholangiogastrostomy', definition: 'A surgical procedure connecting liver ducts', difficulty: 'Extreme', hints: ['Surgery procedure', 'Liver operation', 'Medical term'], category: 'Medicine' },
      { id: 96, word: 'pneumonoultramicroscopicsilicovolcanoconiosis', definition: 'Alternative spelling of the lung disease', difficulty: 'Extreme', hints: ['Lung disease', 'From silica dust', 'Longest word'], category: 'Medicine' },
      { id: 97, word: 'otorhinolaryngological', definition: 'Relating to ear, nose, and throat medicine', difficulty: 'Extreme', hints: ['ENT medicine', 'Ear, nose, throat', 'Medical specialty'], category: 'Medicine' },
      { id: 98, word: 'esophagogastroduodenoscopy', definition: 'A procedure to examine the upper digestive tract', difficulty: 'Extreme', hints: ['Digestive examination', 'Medical procedure', 'Upper GI tract'], category: 'Medicine' },
      { id: 99, word: 'electrocardiographically', definition: 'Relating to heart rhythm recording', difficulty: 'Extreme', hints: ['Heart rhythm', 'Medical recording', 'EKG related'], category: 'Medicine' },
      { id: 100, word: 'magnetohydrodynamically', definition: 'Relating to electrically conducting fluids in magnetic fields', difficulty: 'Extreme', hints: ['Physics concept', 'Magnetic fields', 'Conducting fluids'], category: 'Physics' },
    ]
  };

  // Get difficulty level based on user level
  const getDifficultyLevel = (level: number): string => {
    if (level <= 5) return 'easy';
    if (level <= 10) return 'medium';
    if (level <= 15) return 'intermediate';
    if (level <= 20) return 'difficult';
    return 'extreme';
  };

  // Initialize session word pool
  useEffect(() => {
    if (user && sessionWordPool.length === 0) {
      const difficultyLevel = getDifficultyLevel(user.level);
      const wordsForLevel = [...wordDatabase[difficultyLevel]];
      
      // Shuffle the words to create a random order
      for (let i = wordsForLevel.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsForLevel[i], wordsForLevel[j]] = [wordsForLevel[j], wordsForLevel[i]];
      }
      
      setSessionWordPool(wordsForLevel);
    }
  }, [user]);

  // Generate word from session pool (no repeats)
  const generateWord = (): SpellingWord | null => {
    if (!user) return null;
    
    const difficultyLevel = getDifficultyLevel(user.level);
    const currentDifficultyWords = wordDatabase[difficultyLevel];
    
    // If we've used all words from current session pool, create a new shuffled pool
    if (usedWords.size >= sessionWordPool.length) {
      const newPool = [...currentDifficultyWords];
      
      // Shuffle the new pool
      for (let i = newPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPool[i], newPool[j]] = [newPool[j], newPool[i]];
      }
      
      setSessionWordPool(newPool);
      setUsedWords(new Set()); // Reset used words
    }
    
    // Find the first unused word from the session pool
    const availableWord = sessionWordPool.find(word => !usedWords.has(word.word));
    
    return availableWord || sessionWordPool[0]; // Fallback to first word if none available
  };

  // Create masked word for fill-in-the-blanks mode
  const createMaskedWord = (word: string): string => {
    const wordLength = word.length;
    const numBlanks = Math.max(2, Math.floor(wordLength * 0.4)); // 40% of letters hidden
    const positions = new Set<number>();
    
    // Randomly select positions to hide, but always keep first letter visible
    while (positions.size < numBlanks) {
      const pos = Math.floor(Math.random() * wordLength);
      if (pos !== 0) { // Don't hide first letter
        positions.add(pos);
      }
    }
    
    return word
      .split('')
      .map((letter, index) => positions.has(index) ? '_' : letter)
      .join(' ');
  };

  const todayStats = getTodayStats();
  const xpRequiredForNext = getXPRequiredForNextLevel();
  
  // Calculate current level progress
  const getCurrentLevelProgress = () => {
    if (!user) return 0;
    return user.xp % 150;
  };

  const currentLevelXP = getCurrentLevelProgress();

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

  // Generate first word when session pool is ready
  useEffect(() => {
    if (!currentWord && sessionWordPool.length > 0) {
      const newWord = generateWord();
      if (newWord) {
        setCurrentWord(newWord);
        if (gameMode === 'fill') {
          setMaskedWord(createMaskedWord(newWord.word));
        }
      }
    }
  }, [sessionWordPool, gameMode]);

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
    recordAnswer(false, 0);
    
    setTimeout(() => {
      setIsProcessingAnswer(false);
    }, 3000);
  };

  const handleSubmitAnswer = () => {
    if (gamePhase !== 'playing' || !userInput.trim() || isProcessingAnswer || !currentWord) return;
    
    setIsProcessingAnswer(true);
    
    setTimeout(() => {
      const correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();
      setIsCorrect(correct);
      setGamePhase('result');
      
      if (correct) {
        setShowConfetti(true);
        
        // Calculate XP based on difficulty and time remaining
        const baseXP = 20;
        const timeBonus = Math.floor(timeLeft / 5) * 3;
        const difficultyBonus = user ? Math.floor(user.level / 3) * 5 : 0;
        const modeBonus = gameMode === 'describe' ? 10 : gameMode === 'fill' ? 5 : 0;
        const totalXP = baseXP + timeBonus + difficultyBonus + modeBonus;
        
        recordAnswer(true, totalXP);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        recordAnswer(false, 0);
      }
      
      setTimeout(() => {
        handleNextQuestion();
      }, 3000);
      
    }, 500);
  };

  const handleNextQuestion = () => {
    if (!currentWord) return;
    
    // Mark current word as used
    setUsedWords(prev => new Set([...prev, currentWord.word]));
    
    // Generate next word
    const newWord = generateWord();
    if (newWord) {
      setCurrentWord(newWord);
      setUserInput('');
      setIsCorrect(null);
      setGamePhase('playing');
      setTimeLeft(45);
      setCurrentQuestionIndex(prev => prev + 1);
      setIsProcessingAnswer(false);
      setRevealedHints([]);
      
      if (gameMode === 'fill') {
        setMaskedWord(createMaskedWord(newWord.word));
      }
    }
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setRevealedHints([]);
    if (currentWord) {
      if (mode === 'fill') {
        setMaskedWord(createMaskedWord(currentWord.word));
      }
    }
  };

  const revealHint = () => {
    if (!currentWord || revealedHints.length >= currentWord.hints.length) return;
    
    const nextHintIndex = revealedHints.length;
    setRevealedHints(prev => [...prev, nextHintIndex]);
  };

  const playAudio = () => {
    if (!currentWord) return;
    
    // Use Web Speech API to speak the word
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getAccuracyPercentage = () => {
    if (todayStats.totalSolved === 0) return 0;
    return Math.round((todayStats.correctAnswers / todayStats.totalSolved) * 100);
  };

  const getModeDescription = () => {
    switch (gameMode) {
      case 'listen':
        return 'Listen to the word and type its spelling';
      case 'fill':
        return 'Fill in the missing letters of the word';
      case 'describe':
        return 'Read the description and type the word';
      default:
        return '';
    }
  };

  if (!currentWord || !user) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']}
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
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-600 mb-2">
            🐝 Spelling Bee
          </h1>
          <p className="text-xl md:text-2xl text-indigo-500 font-semibold">
            Level {user.level} - {currentWord.difficulty} Mode
          </p>
        </motion.div>

        {/* Game Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-2 shadow-lg flex gap-2">
            {[
              { mode: 'listen' as GameMode, icon: Volume2, label: 'Listen & Type' },
              { mode: 'fill' as GameMode, icon: Eye, label: 'Fill Blanks' },
              { mode: 'describe' as GameMode, icon: HelpCircle, label: 'From Description' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-all ${
                  gameMode === mode
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Timer className={`h-6 w-6 mr-2 ${timeLeft <= 15 ? 'text-red-500' : 'text-orange-500'}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-orange-500'}`}>
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
              Streak: {user.currentStreak}
            </span>
          </div>

          <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <Award className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-lg font-bold text-purple-500">
              Level {user.level}
            </span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600">Level Progress</span>
            <span className="text-sm font-bold text-indigo-600">
              {currentLevelXP}/{xpRequiredForNext} XP
            </span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((currentLevelXP / xpRequiredForNext) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            >
              {currentLevelXP > 20 && <Star className="h-3 w-3 text-white" />}
            </motion.div>
          </div>
        </div>

        {/* Game Content */}
        <motion.div
          key={`${currentWord.id}-${gameMode}`}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center flex-1 flex flex-col justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <p className="text-lg text-gray-600 mb-4">{getModeDescription()}</p>
            <div className="bg-indigo-50 rounded-2xl p-4 mb-6">
              <span className="text-sm font-semibold text-indigo-600">
                Category: {currentWord.category} | Difficulty: {currentWord.difficulty}
              </span>
            </div>
          </div>

          {/* Game Mode Specific Content */}
          {gameMode === 'listen' && (
            <div className="mb-8">
              <Button
                variant="primary"
                size="lg"
                onClick={playAudio}
                icon={<Volume2 className="h-6 w-6" />}
                className="mb-4"
              >
                🔊 Play Word
              </Button>
              <p className="text-gray-600">Click to hear the word, then type its spelling below</p>
            </div>
          )}

          {gameMode === 'fill' && (
            <div className="mb-8">
              <div className="text-4xl md:text-6xl font-mono font-bold text-indigo-600 mb-4 tracking-wider">
                {maskedWord}
              </div>
              <p className="text-gray-600">Fill in the missing letters</p>
              {revealedHints.length < currentWord.hints.length && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={revealHint}
                  icon={<Lightbulb className="h-4 w-4" />}
                  className="mt-4"
                >
                  Reveal Hint ({revealedHints.length + 1}/{currentWord.hints.length})
                </Button>
              )}
            </div>
          )}

          {gameMode === 'describe' && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Definition:</h3>
                <p className="text-xl text-gray-700 leading-relaxed">{currentWord.definition}</p>
              </div>
              {revealedHints.length < currentWord.hints.length && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={revealHint}
                  icon={<Lightbulb className="h-4 w-4" />}
                  className="mb-4"
                >
                  Get Hint ({revealedHints.length + 1}/{currentWord.hints.length})
                </Button>
              )}
            </div>
          )}

          {/* Hints Display */}
          {revealedHints.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-4 mb-6">
              <h4 className="font-bold text-yellow-700 mb-2">💡 Hints:</h4>
              {revealedHints.map(hintIndex => (
                <p key={hintIndex} className="text-yellow-600 mb-1">
                  • {currentWord.hints[hintIndex]}
                </p>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              placeholder="Type your answer here..."
              className="w-full text-2xl text-center p-4 border-4 border-indigo-200 rounded-2xl focus:border-indigo-500 focus:outline-none mb-4"
              disabled={gamePhase !== 'playing' || isProcessingAnswer}
            />
            
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!userInput.trim() || gamePhase !== 'playing' || isProcessingAnswer}
              fullWidth
            >
              Submit Answer
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            Question #{currentQuestionIndex + 1} | Words Used: {usedWords.size}/{sessionWordPool.length}
          </div>
        </motion.div>

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
                {isCorrect ? '🎉' : timeLeft === 0 ? '⏰' : '📝'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? 'Excellent Spelling!' : timeLeft === 0 ? 'Time\'s Up!' : 'Not Quite Right!'}
              </h3>
              <p className={`text-lg mb-4 ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? `Perfect! You spelled "${currentWord.word}" correctly!` 
                  : `The correct spelling was "${currentWord.word}"`}
              </p>
              
              {!isCorrect && (
                <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                  <p className="text-blue-700 font-semibold">Definition:</p>
                  <p className="text-blue-600">{currentWord.definition}</p>
                </div>
              )}
              
              {isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 text-xl font-bold text-green-600 mb-4"
                >
                  <Star className="h-6 w-6" />
                  <span>+{20 + Math.floor(timeLeft / 5) * 3 + (user ? Math.floor(user.level / 3) * 5 : 0) + (gameMode === 'describe' ? 10 : gameMode === 'fill' ? 5 : 0)} XP</span>
                  <Trophy className="h-6 w-6" />
                </motion.div>
              )}
              
              <div className="text-sm text-gray-600">
                Next word in {Math.max(0, Math.ceil((3000 - (Date.now() % 3000)) / 1000))} seconds...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel - Enhanced Stats */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-indigo-600">Your Progress</h2>
        </div>

        {/* Player Profile */}
        <motion.div
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-200 mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
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
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-indigo-600">{user.xp}</div>
              <div className="text-gray-500">Total XP</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-blue-600">{user.currentStreak}</div>
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
              <span className="text-sm text-gray-600">Words Attempted</span>
              <span className="font-bold text-blue-600">{todayStats.totalSolved}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Correct Spellings</span>
              <span className="font-bold text-green-600">{todayStats.correctAnswers}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className="font-bold text-purple-600">{getAccuracyPercentage()}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">XP Earned Today</span>
              <span className="font-bold text-yellow-600">{todayStats.xpEarned}</span>
            </div>
          </div>
        </div>

        {/* Session Progress */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 mb-6">
          <h3 className="font-bold text-green-600 mb-3">Session Progress</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Words Completed</span>
              <span className="font-bold text-green-600">{usedWords.size}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Words Remaining</span>
              <span className="font-bold text-blue-600">{sessionWordPool.length - usedWords.size}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${sessionWordPool.length > 0 ? (usedWords.size / sessionWordPool.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Mode Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mb-6">
          <h3 className="font-bold text-purple-600 mb-3">Game Modes</h3>
          
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between p-2 rounded ${gameMode === 'listen' ? 'bg-purple-200' : 'bg-white'}`}>
              <span className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Listen & Type
              </span>
              <span className="text-xs">Base XP</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${gameMode === 'fill' ? 'bg-purple-200' : 'bg-white'}`}>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Fill Blanks
              </span>
              <span className="text-xs">+5 XP Bonus</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${gameMode === 'describe' ? 'bg-purple-200' : 'bg-white'}`}>
              <span className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                From Description
              </span>
              <span className="text-xs">+10 XP Bonus</span>
            </div>
          </div>
        </div>

        {/* Difficulty Progression */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 mb-6">
          <h3 className="font-bold text-orange-600 mb-3">Difficulty Progression</h3>
          
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between p-2 rounded ${user.level <= 5 ? 'bg-green-200' : 'bg-gray-100'}`}>
              <span>Easy (Levels 1-5)</span>
              <span>{user.level <= 5 ? '✓ Current' : user.level > 5 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${user.level > 5 && user.level <= 10 ? 'bg-yellow-200' : user.level > 10 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Medium (Levels 6-10)</span>
              <span>{user.level > 5 && user.level <= 10 ? '✓ Current' : user.level > 10 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${user.level > 10 && user.level <= 15 ? 'bg-orange-200' : user.level > 15 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Intermediate (Levels 11-15)</span>
              <span>{user.level > 10 && user.level <= 15 ? '✓ Current' : user.level > 15 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${user.level > 15 && user.level <= 20 ? 'bg-red-200' : user.level > 20 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <span>Difficult (Levels 16-20)</span>
              <span>{user.level > 15 && user.level <= 20 ? '✓ Current' : user.level > 20 ? '✓ Completed' : ''}</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${user.level > 20 ? 'bg-purple-200' : 'bg-gray-50'}`}>
              <span>Extreme (Levels 21+)</span>
              <span>{user.level > 20 ? '✓ Current' : ''}</span>
            </div>
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200">
          <h3 className="font-bold text-amber-600 mb-3 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Achievements
          </h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { emoji: '🏆', unlocked: user.level >= 5, name: 'Level 5' },
              { emoji: '⭐', unlocked: user.currentStreak >= 5, name: '5 Streak' },
              { emoji: '🎯', unlocked: getAccuracyPercentage() >= 80, name: '80% Accuracy' },
              { emoji: '🧠', unlocked: user.level >= 10, name: 'Level 10' },
              { emoji: '🎉', unlocked: todayStats.totalSolved >= 10, name: '10 Today' },
              { emoji: '💎', unlocked: user.currentStreak >= 10, name: '10 Streak' },
              { emoji: '🌟', unlocked: user.level >= 15, name: 'Level 15' },
              { emoji: '🏅', unlocked: user.bestStreak >= 20, name: 'Best Streak' }
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
            <p className="text-sm font-medium text-amber-600">
              Keep spelling to unlock more achievements!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellingBeeGame;