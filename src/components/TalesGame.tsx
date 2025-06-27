import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, BookOpen, Award, Palette, Sticker, CheckCircle, AlertCircle, Trophy, Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

interface Story {
  id: number;
  title: string;
  content: string[];
  moral: string;
  scenes: StoryScene[];
  characters: Character[];
  interactiveElements: {
    type: 'choice' | 'clickable' | 'animation';
    data: any;
  };
  completed?: boolean;
}

interface StoryScene {
  background: string;
  characters: SceneCharacter[];
  props: SceneProp[];
  atmosphere: 'sunny' | 'cloudy' | 'night' | 'forest' | 'meadow' | 'desert' | 'ocean' | 'mountain' | 'city' | 'farm';
}

interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface SceneCharacter {
  characterId: string;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  animation: 'idle' | 'walking' | 'running' | 'sleeping' | 'talking' | 'working' | 'flying' | 'swimming';
  emotion: 'happy' | 'sad' | 'surprised' | 'angry' | 'neutral' | 'proud' | 'worried';
}

interface SceneProp {
  type: 'tree' | 'rock' | 'flower' | 'house' | 'path' | 'finish-line' | 'mountain' | 'river' | 'bridge' | 'nest' | 'anthill' | 'pond' | 'barn' | 'field' | 'city' | 'desert-cactus' | 'oasis';
  position: { x: number; y: number };
  interactive?: boolean;
  onClick?: () => void;
}

const TalesGame: React.FC = () => {
  const { user, recordAnswer, addSticker } = useUser();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [completedStories, setCompletedStories] = useState<Set<number>>(new Set());
  const [showMoral, setShowMoral] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    explanation: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickedElements, setClickedElements] = useState<Set<string>>(new Set());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stories: Story[] = [
    {
      id: 1,
      title: "The Tortoise and the Hare",
      content: [
        "Once upon a time, in a peaceful meadow, there lived a speedy hare who was very proud of how fast he could run.",
        "One day, the hare met a slow-moving tortoise and began to laugh at him. 'You are so slow!' said the hare mockingly.",
        "The tortoise, feeling hurt but determined, challenged the hare to a race. 'Let's see who can reach the big oak tree first!'",
        "The hare laughed and accepted, thinking it would be the easiest race of his life. All the forest animals gathered to watch.",
        "When the race began, the hare zoomed ahead so quickly that the tortoise was just a tiny speck behind him.",
        "Feeling confident about his huge lead, the hare decided to take a nap under a shady tree. 'I have plenty of time,' he thought.",
        "Meanwhile, the tortoise kept moving forward, step by step, never stopping or giving up, even though he was tired.",
        "When the hare woke up, he was shocked to see the tortoise near the finish line! He ran as fast as he could, but it was too late.",
        "The tortoise had won the race! All the animals cheered for the determined tortoise who never gave up."
      ],
      moral: "Slow and steady wins the race. Consistency and determination are more valuable than natural talent without effort.",
      scenes: [
        {
          background: 'meadow',
          characters: [
            { characterId: 'hare', position: { x: 70, y: 60 }, size: 'medium', animation: 'talking', emotion: 'happy' }
          ],
          props: [
            { type: 'tree', position: { x: 20, y: 40 } },
            { type: 'flower', position: { x: 80, y: 70 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'meadow',
          characters: [
            { characterId: 'hare', position: { x: 60, y: 50 }, size: 'medium', animation: 'talking', emotion: 'angry' },
            { characterId: 'tortoise', position: { x: 40, y: 60 }, size: 'medium', animation: 'idle', emotion: 'sad' }
          ],
          props: [
            { type: 'tree', position: { x: 20, y: 40 } },
            { type: 'flower', position: { x: 80, y: 70 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'meadow',
          characters: [
            { characterId: 'hare', position: { x: 50, y: 50 }, size: 'medium', animation: 'idle', emotion: 'surprised' },
            { characterId: 'tortoise', position: { x: 50, y: 60 }, size: 'medium', animation: 'talking', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 85, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 30, y: 50 }, size: 'medium', animation: 'idle', emotion: 'happy' },
            { characterId: 'tortoise', position: { x: 70, y: 60 }, size: 'medium', animation: 'idle', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 85, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 80, y: 50 }, size: 'medium', animation: 'running', emotion: 'happy' },
            { characterId: 'tortoise', position: { x: 20, y: 60 }, size: 'small', animation: 'walking', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 85, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 60, y: 40 }, size: 'medium', animation: 'sleeping', emotion: 'neutral' },
            { characterId: 'tortoise', position: { x: 40, y: 60 }, size: 'medium', animation: 'walking', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 65, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 60, y: 40 }, size: 'medium', animation: 'sleeping', emotion: 'neutral' },
            { characterId: 'tortoise', position: { x: 60, y: 60 }, size: 'medium', animation: 'walking', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 65, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 70, y: 50 }, size: 'medium', animation: 'running', emotion: 'surprised' },
            { characterId: 'tortoise', position: { x: 80, y: 60 }, size: 'medium', animation: 'walking', emotion: 'happy' }
          ],
          props: [
            { type: 'tree', position: { x: 65, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        },
        {
          background: 'forest',
          characters: [
            { characterId: 'hare', position: { x: 70, y: 50 }, size: 'medium', animation: 'idle', emotion: 'sad' },
            { characterId: 'tortoise', position: { x: 85, y: 50 }, size: 'medium', animation: 'idle', emotion: 'happy' }
          ],
          props: [
            { type: 'tree', position: { x: 65, y: 30 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'finish-line', position: { x: 85, y: 50 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'hare', name: 'Hare', emoji: '🐰', color: '#8B4513' },
        { id: 'tortoise', name: 'Tortoise', emoji: '🐢', color: '#228B22' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "What lesson did the hare learn?",
          options: [
            "Speed is everything",
            "Never give up and stay consistent",
            "Always take naps during races",
            "Tortoises are faster than hares"
          ],
          correct: 1,
          explanation: "The hare learned that being consistent and never giving up (like the tortoise) is more important than just being fast. The tortoise won because he kept going steadily while the hare got overconfident and took a nap."
        }
      }
    },
    {
      id: 2,
      title: "The Boy Who Cried Wolf",
      content: [
        "In a small village, there lived a young shepherd boy whose job was to watch over the sheep in the hills.",
        "The boy often felt lonely and bored while watching the sheep graze all day long in the quiet meadow.",
        "One day, feeling mischievous, he decided to play a trick on the villagers. 'Wolf! Wolf!' he cried loudly.",
        "The kind villagers immediately dropped what they were doing and rushed up the hill to help save the sheep.",
        "When they arrived, they found the boy laughing. 'There's no wolf!' he giggled. 'I was just having fun!'",
        "The villagers were not amused and warned him never to lie again. But the boy didn't listen to their advice.",
        "A few days later, the boy cried 'Wolf!' again. Once more, the villagers came running to help him.",
        "Again, there was no wolf, and the boy laughed at his trick. The villagers were very angry this time.",
        "Then one day, a real wolf appeared and began chasing the sheep! 'Wolf! Wolf!' cried the boy desperately.",
        "But this time, no one came to help. The villagers thought he was lying again, and the wolf scattered the sheep."
      ],
      moral: "Honesty is the best policy. When you lie repeatedly, people stop believing you, even when you tell the truth.",
      scenes: [
        {
          background: 'meadow',
          characters: [
            { characterId: 'boy', position: { x: 50, y: 50 }, size: 'medium', animation: 'idle', emotion: 'neutral' },
            { characterId: 'sheep', position: { x: 30, y: 70 }, size: 'small', animation: 'idle', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 20, y: 40 } },
            { type: 'flower', position: { x: 80, y: 70 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'boy', name: 'Shepherd Boy', emoji: '👦', color: '#4169E1' },
        { id: 'wolf', name: 'Wolf', emoji: '🐺', color: '#696969' },
        { id: 'sheep', name: 'Sheep', emoji: '🐑', color: '#F5F5DC' },
        { id: 'villagers', name: 'Villagers', emoji: '👥', color: '#8B4513' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "Why didn't the villagers come when there was a real wolf?",
          options: [
            "They were too busy with their work",
            "They didn't hear the boy calling",
            "They thought he was lying again",
            "They were afraid of the wolf"
          ],
          correct: 2,
          explanation: "The villagers didn't come because the boy had lied to them twice before. When someone lies repeatedly, people stop trusting them, even when they're finally telling the truth. This is why honesty is so important."
        }
      }
    },
    {
      id: 3,
      title: "The Ant and the Grasshopper",
      content: [
        "In a sunny meadow, there lived a hardworking ant and a carefree grasshopper who were neighbors.",
        "All summer long, the ant worked tirelessly, collecting grains and storing food for the winter ahead.",
        "The grasshopper, however, spent his days singing, dancing, and playing in the warm sunshine.",
        "'Why do you work so hard?' asked the grasshopper. 'Come and play with me! Summer is for fun!'",
        "The wise ant replied, 'I must prepare for winter when food will be scarce. You should do the same.'",
        "But the grasshopper just laughed and continued to play, thinking the ant was being silly and boring.",
        "As the days grew shorter and colder, the ant's storehouse was full of food for the winter.",
        "When winter arrived with snow and ice, the grasshopper had no food and was very hungry and cold.",
        "The grasshopper went to the ant's house and begged for food. 'Please help me, I'm starving!'",
        "The kind ant shared his food and taught the grasshopper the importance of hard work and planning ahead."
      ],
      moral: "Hard work and preparation today will help you succeed tomorrow. It's important to plan for the future.",
      scenes: [
        {
          background: 'meadow',
          characters: [
            { characterId: 'ant', position: { x: 40, y: 60 }, size: 'small', animation: 'working', emotion: 'neutral' },
            { characterId: 'grasshopper', position: { x: 70, y: 50 }, size: 'medium', animation: 'idle', emotion: 'happy' }
          ],
          props: [
            { type: 'anthill', position: { x: 30, y: 70 } },
            { type: 'flower', position: { x: 80, y: 30 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'ant', name: 'Ant', emoji: '🐜', color: '#8B4513' },
        { id: 'grasshopper', name: 'Grasshopper', emoji: '🦗', color: '#228B22' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "What did the ant do that the grasshopper didn't?",
          options: [
            "Played music all day",
            "Prepared for winter by working hard",
            "Slept through the summer",
            "Ignored the grasshopper completely"
          ],
          correct: 1,
          explanation: "The ant worked hard all summer to collect and store food for winter, while the grasshopper only played. This preparation helped the ant survive the cold winter when food was scarce."
        }
      }
    },
    {
      id: 4,
      title: "The Lion and the Mouse",
      content: [
        "Deep in the African savanna, a mighty lion was taking a peaceful nap under the shade of an acacia tree.",
        "A tiny mouse was scurrying around looking for food when he accidentally ran across the lion's paw.",
        "The lion woke up with a roar and caught the little mouse in his powerful claws. 'How dare you wake me!'",
        "'Please don't eat me!' squeaked the mouse. 'I'm sorry! If you let me go, I promise to help you someday.'",
        "The lion laughed loudly. 'You? Help me? You're so tiny! But you amuse me, so I'll let you go.'",
        "The grateful mouse scampered away, promising to remember the lion's kindness forever.",
        "A few weeks later, hunters came and trapped the lion in a strong net while he was hunting.",
        "The lion roared and struggled, but the ropes were too strong. He was trapped and couldn't escape.",
        "The little mouse heard the lion's roars and remembered his promise. He quickly ran to help.",
        "With his sharp teeth, the mouse gnawed through the ropes until the lion was free. 'Thank you, little friend!'"
      ],
      moral: "No act of kindness is ever wasted. Even the smallest person can help the mightiest when they need it most.",
      scenes: [
        {
          background: 'desert',
          characters: [
            { characterId: 'lion', position: { x: 60, y: 50 }, size: 'large', animation: 'sleeping', emotion: 'neutral' },
            { characterId: 'mouse', position: { x: 65, y: 60 }, size: 'small', animation: 'walking', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 70, y: 30 } },
            { type: 'rock', position: { x: 30, y: 70 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'lion', name: 'Lion', emoji: '🦁', color: '#DAA520' },
        { id: 'mouse', name: 'Mouse', emoji: '🐭', color: '#696969' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "How did the mouse help the lion?",
          options: [
            "By bringing him food",
            "By gnawing through the ropes that trapped him",
            "By calling other animals for help",
            "By scaring away the hunters"
          ],
          correct: 1,
          explanation: "The mouse used his sharp teeth to gnaw through the ropes that trapped the lion in the hunters' net. This shows that even small acts of kindness can make a big difference."
        }
      }
    },
    {
      id: 5,
      title: "The Ugly Duckling",
      content: [
        "On a peaceful farm by a pond, a mother duck was sitting on her nest, waiting for her eggs to hatch.",
        "One by one, the eggs cracked open and out came beautiful yellow ducklings, chirping happily.",
        "But the last egg was much larger, and when it finally hatched, out came a gray, awkward-looking duckling.",
        "The other ducklings laughed and called him ugly. 'You don't look like us at all!' they said meanly.",
        "The poor duckling felt very sad and lonely. Even his mother seemed disappointed in how he looked.",
        "Feeling unwanted, the ugly duckling decided to leave the farm and find somewhere he belonged.",
        "He wandered through forests and fields, always being rejected by other animals who thought he was strange.",
        "Through the long, cold winter, the duckling survived alone, growing bigger and stronger each day.",
        "When spring arrived, the duckling saw his reflection in the pond and gasped in amazement.",
        "He had grown into a beautiful, graceful swan! The other swans welcomed him with joy, and he finally found his true family."
      ],
      moral: "Don't judge others by their appearance. Everyone has their own unique beauty and will find where they belong.",
      scenes: [
        {
          background: 'farm',
          characters: [
            { characterId: 'mother-duck', position: { x: 50, y: 50 }, size: 'medium', animation: 'idle', emotion: 'happy' },
            { characterId: 'ugly-duckling', position: { x: 60, y: 60 }, size: 'small', animation: 'idle', emotion: 'sad' },
            { characterId: 'duckling', position: { x: 40, y: 60 }, size: 'small', animation: 'idle', emotion: 'happy' }
          ],
          props: [
            { type: 'pond', position: { x: 30, y: 70 } },
            { type: 'barn', position: { x: 80, y: 40 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'mother-duck', name: 'Mother Duck', emoji: '🦆', color: '#DAA520' },
        { id: 'ugly-duckling', name: 'Ugly Duckling', emoji: '🐣', color: '#696969' },
        { id: 'duckling', name: 'Duckling', emoji: '🐥', color: '#FFD700' },
        { id: 'swan', name: 'Swan', emoji: '🦢', color: '#FFFFFF' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "What did the ugly duckling discover about himself?",
          options: [
            "He was actually a beautiful swan",
            "He could fly faster than other ducks",
            "He was the smartest duckling",
            "He could swim underwater"
          ],
          correct: 0,
          explanation: "The ugly duckling discovered that he was actually a beautiful swan, not a duck at all. This teaches us that everyone has their own unique beauty and will find where they truly belong."
        }
      }
    },
    {
      id: 6,
      title: "The Golden Goose",
      content: [
        "In a small village, there lived a kind woodcutter with three sons. The youngest son was often called 'Simpleton' by others.",
        "One day, the youngest son went into the forest to cut wood and shared his simple meal with a hungry old man.",
        "The grateful old man gave him a magical gift: a goose with feathers of pure gold that sparkled in the sunlight.",
        "As the boy walked through the village with his golden goose, people were amazed by its beauty.",
        "A greedy innkeeper's daughter tried to pluck a golden feather, but her hand got stuck to the goose!",
        "Her sister tried to pull her free, but she got stuck too! Soon, a whole line of people were stuck together.",
        "The silly parade of stuck people made everyone in the village laugh, including the sad princess in the castle.",
        "The king had promised that whoever could make his daughter laugh would marry her and inherit the kingdom.",
        "The kind young man had succeeded where many others had failed, all because of his generous heart.",
        "The princess and the woodcutter's son were married, and they ruled the kingdom with kindness and wisdom."
      ],
      moral: "Kindness and generosity are rewarded. When you help others, good things come back to you.",
      scenes: [
        {
          background: 'forest',
          characters: [
            { characterId: 'woodcutter-son', position: { x: 50, y: 50 }, size: 'medium', animation: 'talking', emotion: 'happy' },
            { characterId: 'old-man', position: { x: 30, y: 60 }, size: 'medium', animation: 'idle', emotion: 'happy' }
          ],
          props: [
            { type: 'tree', position: { x: 70, y: 30 } },
            { type: 'tree', position: { x: 20, y: 40 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'woodcutter-son', name: 'Kind Son', emoji: '👦', color: '#8B4513' },
        { id: 'old-man', name: 'Old Man', emoji: '👴', color: '#696969' },
        { id: 'golden-goose', name: 'Golden Goose', emoji: '🪿', color: '#FFD700' },
        { id: 'princess', name: 'Princess', emoji: '👸', color: '#FF69B4' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "Why did the young man receive the golden goose?",
          options: [
            "He was the strongest woodcutter",
            "He shared his food with a hungry old man",
            "He found it in the forest",
            "He bought it from a merchant"
          ],
          correct: 1,
          explanation: "The young man received the golden goose because he was kind and generous, sharing his simple meal with a hungry old man. His kindness was rewarded with a magical gift."
        }
      }
    },
    {
      id: 7,
      title: "The Little Red Hen",
      content: [
        "On a busy farm, there lived a hardworking little red hen with her friends: a lazy cat, dog, and pig.",
        "One day, the hen found some grains of wheat scattered on the ground near the barn.",
        "'Who will help me plant this wheat?' asked the little red hen, holding up the golden grains.",
        "'Not I,' said the cat, who was busy grooming himself. 'Not I,' said the dog, who was napping.",
        "'Not I,' said the pig, who was rolling in the mud. So the little red hen planted the wheat all by herself.",
        "When the wheat grew tall and golden, the hen asked, 'Who will help me harvest this wheat?'",
        "Again, all her friends said 'Not I,' and made excuses. The hen harvested the wheat alone.",
        "'Who will help me grind this wheat into flour?' she asked. Once more, everyone refused to help.",
        "Finally, when the delicious bread was baked and smelled wonderful, everyone wanted to share it.",
        "'Who will help me eat this bread?' asked the hen. 'I will!' said everyone. But the hen said, 'No, I'll eat it myself. Those who don't work, don't eat.'"
      ],
      moral: "If you want to enjoy the rewards, you must be willing to do the work. Hard work deserves fair rewards.",
      scenes: [
        {
          background: 'farm',
          characters: [
            { characterId: 'red-hen', position: { x: 50, y: 50 }, size: 'medium', animation: 'working', emotion: 'neutral' },
            { characterId: 'cat', position: { x: 70, y: 40 }, size: 'small', animation: 'idle', emotion: 'neutral' },
            { characterId: 'dog', position: { x: 30, y: 60 }, size: 'small', animation: 'sleeping', emotion: 'neutral' }
          ],
          props: [
            { type: 'barn', position: { x: 80, y: 30 } },
            { type: 'field', position: { x: 40, y: 70 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'red-hen', name: 'Little Red Hen', emoji: '🐓', color: '#DC143C' },
        { id: 'cat', name: 'Cat', emoji: '🐱', color: '#FFA500' },
        { id: 'dog', name: 'Dog', emoji: '🐶', color: '#8B4513' },
        { id: 'pig', name: 'Pig', emoji: '🐷', color: '#FFB6C1' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "Why didn't the hen share her bread?",
          options: [
            "She was too hungry to share",
            "The bread was too small",
            "Her friends didn't help with the work",
            "She forgot to ask them"
          ],
          correct: 2,
          explanation: "The hen didn't share because her friends refused to help with any of the work - planting, harvesting, grinding, or baking. She taught them that those who don't contribute to the work shouldn't expect to share in the rewards."
        }
      }
    },
    {
      id: 8,
      title: "The City Mouse and the Country Mouse",
      content: [
        "In a peaceful countryside, there lived a simple country mouse who was content with his quiet life.",
        "One day, his cousin from the big city came to visit, dressed in fine clothes and looking very important.",
        "The country mouse offered his guest simple food: grains, nuts, and fresh water from the stream.",
        "The city mouse wrinkled his nose. 'This food is so plain! Come with me to the city and see how I live!'",
        "Curious about city life, the country mouse agreed to visit his cousin's home in the bustling city.",
        "In the city, they snuck into a grand mansion where the city mouse lived, full of rich foods and luxuries.",
        "Just as they began to feast on cheese and cake, a huge cat appeared and chased them around the house!",
        "They barely escaped, but then a dog started barking and chasing them through the halls.",
        "The frightened country mouse said, 'Thank you for showing me your life, but I prefer my peaceful home.'",
        "He returned to his simple burrow, realizing that a safe, peaceful life is better than a dangerous, luxurious one."
      ],
      moral: "A simple, peaceful life is better than a luxurious but dangerous one. Happiness comes from contentment, not riches.",
      scenes: [
        {
          background: 'meadow',
          characters: [
            { characterId: 'country-mouse', position: { x: 40, y: 60 }, size: 'small', animation: 'idle', emotion: 'happy' },
            { characterId: 'city-mouse', position: { x: 60, y: 50 }, size: 'small', animation: 'talking', emotion: 'proud' }
          ],
          props: [
            { type: 'tree', position: { x: 20, y: 40 } },
            { type: 'flower', position: { x: 80, y: 70 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'country-mouse', name: 'Country Mouse', emoji: '🐭', color: '#8B4513' },
        { id: 'city-mouse', name: 'City Mouse', emoji: '🐭', color: '#696969' },
        { id: 'cat', name: 'Cat', emoji: '🐱', color: '#000000' },
        { id: 'dog', name: 'Dog', emoji: '🐶', color: '#8B4513' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "Why did the country mouse return home?",
          options: [
            "He missed his family",
            "The city food was too rich",
            "He preferred his safe, peaceful life",
            "He got lost in the city"
          ],
          correct: 2,
          explanation: "The country mouse returned home because he realized that his simple, safe, and peaceful life was better than the city's luxury that came with constant danger from cats and dogs."
        }
      }
    },
    {
      id: 9,
      title: "The Fox and the Grapes",
      content: [
        "On a hot summer day, a hungry fox was walking through a vineyard looking for something to eat.",
        "High above his head, he spotted a bunch of beautiful, juicy grapes hanging from a vine.",
        "The grapes looked perfectly ripe and delicious, glistening in the warm sunlight like purple jewels.",
        "The fox's mouth watered as he imagined how sweet and refreshing those grapes would taste.",
        "He jumped as high as he could, stretching his paws toward the grapes, but they were too high.",
        "Again and again he leaped, each time falling short of the tempting bunch of grapes.",
        "After many attempts, the fox was tired and frustrated. His paws hurt and he was out of breath.",
        "Unable to reach the grapes no matter how hard he tried, the fox gave up and walked away.",
        "As he left, he muttered to himself, 'Those grapes were probably sour anyway. I didn't want them!'",
        "But deep down, the fox knew the grapes were sweet - he just couldn't admit that he had failed to get them."
      ],
      moral: "It's easy to despise what you cannot have. Don't make excuses when you fail - learn from your mistakes instead.",
      scenes: [
        {
          background: 'farm',
          characters: [
            { characterId: 'fox', position: { x: 50, y: 70 }, size: 'medium', animation: 'idle', emotion: 'neutral' }
          ],
          props: [
            { type: 'tree', position: { x: 50, y: 30 } },
            { type: 'rock', position: { x: 30, y: 80 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'fox', name: 'Fox', emoji: '🦊', color: '#FF4500' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "What did the fox say about the grapes when he couldn't reach them?",
          options: [
            "They were too high to reach",
            "They were probably sour anyway",
            "He would try again tomorrow",
            "He needed a ladder to get them"
          ],
          correct: 1,
          explanation: "The fox said the grapes were probably sour anyway, even though he knew they looked delicious. This teaches us not to make excuses when we fail, but to be honest about our limitations and keep trying to improve."
        }
      }
    },
    {
      id: 10,
      title: "The Goose That Laid Golden Eggs",
      content: [
        "A poor farmer and his wife lived in a small cottage and worked hard just to have enough food each day.",
        "One morning, the farmer went to check on his goose and found something amazing - a golden egg in the nest!",
        "He couldn't believe his eyes. The egg was made of pure gold and was worth more money than he'd ever seen.",
        "Every day after that, the magical goose laid one beautiful golden egg, making the farmer's family rich.",
        "The farmer and his wife were able to buy a bigger house, fine clothes, and all the food they wanted.",
        "But as time passed, the farmer became greedy. 'Why wait for one egg a day?' he thought.",
        "'If I cut open the goose, I can get all the golden eggs at once and become even richer!'",
        "Despite his wife's warnings, the greedy farmer killed the goose, expecting to find many golden eggs inside.",
        "But when he opened the goose, there were no golden eggs inside - it was just like any ordinary goose.",
        "The farmer had lost his magical goose forever. His greed had destroyed the source of his good fortune."
      ],
      moral: "Greed can destroy good fortune. Be grateful for what you have and don't try to get everything at once.",
      scenes: [
        {
          background: 'farm',
          characters: [
            { characterId: 'farmer', position: { x: 50, y: 50 }, size: 'medium', animation: 'idle', emotion: 'happy' },
            { characterId: 'goose', position: { x: 70, y: 60 }, size: 'medium', animation: 'idle', emotion: 'neutral' }
          ],
          props: [
            { type: 'house', position: { x: 20, y: 40 } },
            { type: 'nest', position: { x: 75, y: 70 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'farmer', name: 'Farmer', emoji: '👨‍🌾', color: '#8B4513' },
        { id: 'goose', name: 'Golden Goose', emoji: '🪿', color: '#FFD700' },
        { id: 'wife', name: 'Farmer\'s Wife', emoji: '👩‍🌾', color: '#DDA0DD' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "What happened when the farmer killed the goose?",
          options: [
            "He found many golden eggs inside",
            "The goose came back to life",
            "There were no golden eggs inside",
            "Another goose appeared"
          ],
          correct: 2,
          explanation: "When the farmer killed the goose, there were no golden eggs inside - it was just like any ordinary goose. His greed destroyed the magical source of his wealth, teaching us to be grateful for what we have."
        }
      }
    },
    {
      id: 11,
      title: "The Wind and the Sun",
      content: [
        "High in the sky, the Wind and the Sun were having an argument about who was stronger.",
        "'I am the strongest!' boasted the Wind. 'I can blow down trees and move the clouds across the sky!'",
        "'No, I am stronger,' said the Sun gently. 'My warmth gives life to all plants and animals on Earth.'",
        "Just then, they saw a traveler walking down the road below, wearing a thick, warm coat.",
        "'Let's have a contest,' suggested the Sun. 'Whoever can make that man take off his coat is the strongest.'",
        "The Wind went first, blowing as hard as he could, creating a fierce and howling storm.",
        "But the harder the Wind blew, the tighter the man pulled his coat around himself to stay warm.",
        "The Wind blew and blew until he was exhausted, but the man kept his coat on tightly.",
        "Then it was the Sun's turn. He shone down gently and warmly on the traveler below.",
        "As the Sun's gentle warmth spread, the man became comfortable and happily took off his coat himself."
      ],
      moral: "Gentleness and kindness are often more powerful than force and aggression. You can achieve more with warmth than with harshness.",
      scenes: [
        {
          background: 'mountain',
          characters: [
            { characterId: 'traveler', position: { x: 50, y: 70 }, size: 'medium', animation: 'walking', emotion: 'neutral' }
          ],
          props: [
            { type: 'mountain', position: { x: 20, y: 40 } },
            { type: 'path', position: { x: 50, y: 80 } },
            { type: 'tree', position: { x: 80, y: 50 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'wind', name: 'Wind', emoji: '💨', color: '#87CEEB' },
        { id: 'sun', name: 'Sun', emoji: '☀️', color: '#FFD700' },
        { id: 'traveler', name: 'Traveler', emoji: '🚶‍♂️', color: '#8B4513' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "How did the Sun succeed where the Wind failed?",
          options: [
            "By blowing harder than the Wind",
            "By using gentle warmth instead of force",
            "By asking the man politely",
            "By creating a rainstorm"
          ],
          correct: 1,
          explanation: "The Sun succeeded by using gentle warmth instead of force. While the Wind's harsh blowing made the man hold his coat tighter, the Sun's gentle warmth made him comfortable enough to remove it willingly."
        }
      }
    },
    {
      id: 12,
      title: "The Honest Woodcutter",
      content: [
        "Near a deep, clear river lived a poor but honest woodcutter who worked hard every day to feed his family.",
        "One morning, while cutting wood by the riverbank, his old iron axe slipped from his hands and fell into the water.",
        "The woodcutter was very upset because the axe was his only tool, and without it, he couldn't work or earn money.",
        "As he sat by the river feeling sad, a magical water spirit appeared from the sparkling water.",
        "'Why are you crying?' asked the kind spirit. The woodcutter explained about his lost axe.",
        "The spirit dove into the river and came back with a beautiful golden axe. 'Is this yours?' she asked.",
        "'No,' said the honest woodcutter. 'My axe was made of iron, not gold. That's not mine.'",
        "The spirit dove again and returned with a silver axe. 'Is this the one?' she asked hopefully.",
        "'No,' he replied truthfully. 'Mine was just a simple iron axe. I cannot lie to you.'",
        "Impressed by his honesty, the spirit gave him all three axes - the golden, silver, and his original iron axe as a reward for his truthfulness."
      ],
      moral: "Honesty is always rewarded. Being truthful, even when it's difficult, brings the greatest rewards.",
      scenes: [
        {
          background: 'forest',
          characters: [
            { characterId: 'woodcutter', position: { x: 40, y: 60 }, size: 'medium', animation: 'idle', emotion: 'sad' },
            { characterId: 'water-spirit', position: { x: 70, y: 50 }, size: 'medium', animation: 'flying', emotion: 'happy' }
          ],
          props: [
            { type: 'river', position: { x: 70, y: 70 } },
            { type: 'tree', position: { x: 20, y: 40 } },
            { type: 'tree', position: { x: 90, y: 30 } }
          ],
          atmosphere: 'sunny'
        }
      ],
      characters: [
        { id: 'woodcutter', name: 'Woodcutter', emoji: '👨‍🌾', color: '#8B4513' },
        { id: 'water-spirit', name: 'Water Spirit', emoji: '🧚‍♀️', color: '#87CEEB' }
      ],
      interactiveElements: {
        type: 'choice',
        data: {
          question: "Why did the water spirit give the woodcutter all three axes?",
          options: [
            "Because he was poor and needed money",
            "Because he was honest and told the truth",
            "Because he worked very hard",
            "Because he was polite to the spirit"
          ],
          correct: 1,
          explanation: "The water spirit rewarded the woodcutter with all three axes because he was completely honest. Even when offered valuable golden and silver axes, he truthfully said they weren't his, showing that honesty brings the greatest rewards."
        }
      }
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

  const currentStory = stories[currentStoryIndex];
  const totalPages = currentStory.content.length;
  const currentScene = currentStory.scenes[Math.min(currentPage, currentStory.scenes.length - 1)];

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (!showMoral) {
      setShowMoral(true);
    } else {
      handleCompleteStory();
    }
  };

  const handlePrevPage = () => {
    if (showMoral) {
      setShowMoral(false);
    } else if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCompleteStory = () => {
    if (!completedStories.has(currentStory.id)) {
      setCompletedStories(prev => new Set([...prev, currentStory.id]));
      setShowConfetti(true);
      recordAnswer(true, 20);
      addSticker(`story-${currentStory.id}`);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setCurrentPage(0);
    setShowMoral(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setClickedElements(new Set());
  };

  const handleStorySelect = (index: number) => {
    setCurrentStoryIndex(index);
    setCurrentPage(0);
    setShowMoral(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setClickedElements(new Set());
  };

  const handleInteractiveChoice = (choiceIndex: number) => {
    if (selectedAnswer !== null) return;

    const isCorrect = choiceIndex === currentStory.interactiveElements.data.correct;
    const selectedOption = currentStory.interactiveElements.data.options[choiceIndex];
    const correctOption = currentStory.interactiveElements.data.options[currentStory.interactiveElements.data.correct];
    
    setSelectedAnswer(choiceIndex);
    setAnswerFeedback({
      isCorrect,
      selectedOption,
      correctOption,
      explanation: currentStory.interactiveElements.data.explanation
    });

    recordAnswer(isCorrect, isCorrect ? 10 : 0);
    
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      handleNextPage();
    }, 4000);
  };

  const handleElementClick = (elementId: string) => {
    setClickedElements(prev => new Set([...prev, elementId]));
    // Add sound effect or animation here
  };

  const getChoiceButtonClass = (index: number) => {
    if (selectedAnswer === null) {
      return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500';
    }
    
    const isCorrectOption = index === currentStory.interactiveElements.data.correct;
    const isSelectedOption = selectedAnswer === index;
    
    if (isCorrectOption) {
      return 'bg-green-400 text-white border-4 border-green-600';
    }
    
    if (isSelectedOption && !isCorrectOption) {
      return 'bg-red-400 text-white border-4 border-red-600';
    }
    
    return 'bg-gray-300 text-gray-500';
  };

  const getBackgroundGradient = (atmosphere: string) => {
    switch (atmosphere) {
      case 'sunny':
        return 'from-blue-300 via-blue-200 to-green-200';
      case 'cloudy':
        return 'from-gray-300 via-gray-200 to-blue-200';
      case 'night':
        return 'from-purple-900 via-blue-900 to-black';
      case 'forest':
        return 'from-green-400 via-green-300 to-yellow-200';
      case 'meadow':
        return 'from-green-200 via-yellow-100 to-blue-200';
      case 'desert':
        return 'from-yellow-300 via-orange-200 to-red-200';
      case 'ocean':
        return 'from-blue-400 via-cyan-300 to-teal-200';
      case 'mountain':
        return 'from-gray-400 via-blue-300 to-white';
      case 'city':
        return 'from-gray-300 via-blue-200 to-purple-200';
      case 'farm':
        return 'from-green-300 via-yellow-200 to-brown-200';
      default:
        return 'from-blue-300 via-blue-200 to-green-200';
    }
  };

  const getCharacterAnimation = (animation: string) => {
    switch (animation) {
      case 'walking':
        return { x: [0, 5, 0, -5, 0], y: [0, -2, 0, -2, 0] };
      case 'running':
        return { x: [0, 10, 0, -10, 0], y: [0, -5, 0, -5, 0] };
      case 'sleeping':
        return { rotate: [0, -5, 5, -5, 0], scale: [1, 0.95, 1.05, 0.95, 1] };
      case 'talking':
        return { scale: [1, 1.1, 1, 1.1, 1], rotate: [0, 2, -2, 2, 0] };
      case 'working':
        return { rotate: [0, 15, -15, 15, 0], y: [0, -3, 0, -3, 0] };
      case 'flying':
        return { y: [0, -10, 0, -10, 0], x: [0, 3, -3, 3, 0] };
      case 'swimming':
        return { x: [0, 8, 0, -8, 0], rotate: [0, 5, -5, 5, 0] };
      default:
        return { y: [0, -5, 0] };
    }
  };

  const getEmotionFilter = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'brightness(1.2) saturate(1.3)';
      case 'sad':
        return 'brightness(0.8) saturate(0.7)';
      case 'angry':
        return 'brightness(1.1) saturate(1.5) hue-rotate(10deg)';
      case 'surprised':
        return 'brightness(1.3) saturate(1.2)';
      case 'proud':
        return 'brightness(1.2) saturate(1.4)';
      case 'worried':
        return 'brightness(0.9) saturate(0.8)';
      default:
        return 'brightness(1)';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
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
            📚 Interactive Tales — Immersive Story Adventures
          </h1>
          <p className="text-xl md:text-2xl text-purple-500 font-semibold">
            Step into magical worlds and learn valuable life lessons
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Story Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Story Collection
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stories.map((story, index) => (
                  <motion.button
                    key={story.id}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      currentStoryIndex === index
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent'
                    }`}
                    onClick={() => handleStorySelect(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex space-x-1 mb-1">
                          {story.characters.slice(0, 2).map((char, i) => (
                            <span key={i} className="text-lg">{char.emoji}</span>
                          ))}
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{story.title}</div>
                      </div>
                      {completedStories.has(story.id) && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <h3 className="font-bold text-purple-600 mb-3">Story Controls</h3>
                <div className="flex justify-between items-center mb-3">
                  <Button
                    variant={isPlaying ? "error" : "success"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    icon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    icon={soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  >
                    Sound
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>{completedStories.size}/{stories.length}</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedStories.size / stories.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Story Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Story Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{currentStory.title}</h2>
                    <div className="flex items-center text-purple-100">
                      <div className="flex space-x-2 mr-4">
                        {currentStory.characters.map((char, index) => (
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
                            {char.emoji}
                          </motion.span>
                        ))}
                      </div>
                      <div>
                        {!showMoral ? (
                          <span>Page {currentPage + 1} of {totalPages}</span>
                        ) : (
                          <span>Moral of the Story</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {completedStories.has(currentStory.id) && (
                    <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                      <Award className="h-5 w-5 mr-2" />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 bg-yellow-50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">Story Progress</span>
                  <span className="font-bold">
                    {showMoral ? 'Complete!' : `${currentPage + 1}/${totalPages} pages`}
                  </span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: showMoral 
                        ? '100%' 
                        : `${((currentPage + 1) / totalPages) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentPage > 0 && <Sparkles className="h-3 w-3 text-white" />}
                  </motion.div>
                </div>
              </div>

              {/* Interactive Story Scene */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {!showMoral ? (
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="min-h-[500px] flex flex-col"
                    >
                      {/* Interactive Scene */}
                      <div className={`relative h-80 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br ${getBackgroundGradient(currentScene?.atmosphere || 'sunny')}`}>
                        {/* Background Elements */}
                        <div className="absolute inset-0">
                          {/* Sky/Atmosphere */}
                          <div className="absolute top-0 left-0 w-full h-1/3 opacity-30">
                            {currentScene?.atmosphere === 'sunny' && (
                              <motion.div
                                className="absolute top-4 right-8 w-16 h-16 bg-yellow-300 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              />
                            )}
                            {currentScene?.atmosphere === 'night' && (
                              <motion.div
                                className="absolute top-4 right-8 w-12 h-12 bg-yellow-100 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            )}
                          </div>

                          {/* Ground */}
                          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-green-300 opacity-60 rounded-t-full" />
                          
                          {/* Props */}
                          {currentScene?.props.map((prop, index) => (
                            <motion.div
                              key={`prop-${index}`}
                              className="absolute cursor-pointer"
                              style={{
                                left: `${prop.position.x}%`,
                                top: `${prop.position.y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              onClick={() => prop.interactive && handleElementClick(`prop-${index}`)}
                              whileHover={prop.interactive ? { scale: 1.1 } : {}}
                              animate={clickedElements.has(`prop-${index}`) ? { scale: [1, 1.2, 1] } : {}}
                            >
                              {prop.type === 'tree' && (
                                <div className="text-6xl">🌳</div>
                              )}
                              {prop.type === 'rock' && (
                                <div className="text-4xl">🪨</div>
                              )}
                              {prop.type === 'flower' && (
                                <div className="text-3xl">🌸</div>
                              )}
                              {prop.type === 'house' && (
                                <div className="text-5xl">🏠</div>
                              )}
                              {prop.type === 'path' && (
                                <div className="w-32 h-4 bg-yellow-600 rounded-full opacity-70" />
                              )}
                              {prop.type === 'finish-line' && (
                                <div className="text-4xl">🏁</div>
                              )}
                              {prop.type === 'mountain' && (
                                <div className="text-6xl">⛰️</div>
                              )}
                              {prop.type === 'river' && (
                                <div className="w-40 h-6 bg-blue-400 rounded-full opacity-80" />
                              )}
                              {prop.type === 'bridge' && (
                                <div className="text-4xl">🌉</div>
                              )}
                              {prop.type === 'nest' && (
                                <div className="text-3xl">🪺</div>
                              )}
                              {prop.type === 'anthill' && (
                                <div className="text-3xl">🏔️</div>
                              )}
                              {prop.type === 'pond' && (
                                <div className="w-20 h-12 bg-blue-300 rounded-full opacity-80" />
                              )}
                              {prop.type === 'barn' && (
                                <div className="text-5xl">🏚️</div>
                              )}
                              {prop.type === 'field' && (
                                <div className="w-24 h-8 bg-yellow-400 rounded opacity-70" />
                              )}
                              {prop.type === 'city' && (
                                <div className="text-5xl">🏙️</div>
                              )}
                              {prop.type === 'desert-cactus' && (
                                <div className="text-5xl">🌵</div>
                              )}
                              {prop.type === 'oasis' && (
                                <div className="text-4xl">🏝️</div>
                              )}
                            </motion.div>
                          ))}

                          {/* Characters */}
                          {currentScene?.characters.map((sceneChar, index) => {
                            const character = currentStory.characters.find(c => c.id === sceneChar.characterId);
                            if (!character) return null;

                            return (
                              <motion.div
                                key={`char-${sceneChar.characterId}-${index}`}
                                className="absolute cursor-pointer"
                                style={{
                                  left: `${sceneChar.position.x}%`,
                                  top: `${sceneChar.position.y}%`,
                                  transform: 'translate(-50%, -50%)',
                                  filter: getEmotionFilter(sceneChar.emotion)
                                }}
                                animate={getCharacterAnimation(sceneChar.animation)}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                onClick={() => handleElementClick(`char-${sceneChar.characterId}`)}
                                whileHover={{ scale: 1.1 }}
                              >
                                <div className={`${
                                  sceneChar.size === 'small' ? 'text-4xl' :
                                  sceneChar.size === 'large' ? 'text-8xl' : 'text-6xl'
                                }`}>
                                  {character.emoji}
                                </div>
                                
                                {/* Character name tooltip */}
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {character.name}
                                </div>

                                {/* Emotion indicator */}
                                <div className="absolute -top-2 -right-2 text-lg">
                                  {sceneChar.emotion === 'happy' && '😊'}
                                  {sceneChar.emotion === 'sad' && '😢'}
                                  {sceneChar.emotion === 'angry' && '😠'}
                                  {sceneChar.emotion === 'surprised' && '😲'}
                                  {sceneChar.emotion === 'proud' && '😌'}
                                  {sceneChar.emotion === 'worried' && '😟'}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Interactive Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Sparkle effects for clicked elements */}
                          {Array.from(clickedElements).map((elementId, index) => (
                            <motion.div
                              key={elementId}
                              className="absolute text-2xl pointer-events-none"
                              style={{
                                left: `${Math.random() * 80 + 10}%`,
                                top: `${Math.random() * 60 + 20}%`
                              }}
                              initial={{ opacity: 1, scale: 0 }}
                              animate={{ 
                                opacity: 0, 
                                scale: 1,
                                y: -50
                              }}
                              transition={{ duration: 1 }}
                            >
                              ✨
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Story Text */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
                        <motion.p 
                          className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {currentStory.content[currentPage]}
                        </motion.p>
                      </div>

                      {/* Interactive Elements */}
                      {currentPage === totalPages - 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6"
                        >
                          {currentStory.interactiveElements.type === 'choice' && (
                            <div className="bg-yellow-50 rounded-2xl p-6">
                              <h3 className="text-xl font-bold text-yellow-700 mb-4">
                                {currentStory.interactiveElements.data.question}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                {currentStory.interactiveElements.data.options.map((option: string, index: number) => (
                                  <motion.button
                                    key={index}
                                    className={`text-left justify-start p-4 rounded-xl font-semibold transition-all ${getChoiceButtonClass(index)}`}
                                    onClick={() => handleInteractiveChoice(index)}
                                    disabled={selectedAnswer !== null}
                                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
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
                                    className={`rounded-2xl p-6 ${
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
                                    
                                    <h4 className={`text-2xl font-bold mb-4 text-center ${
                                      answerFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                      {answerFeedback.isCorrect ? 'Excellent! 🎉' : 'Not quite right! 🤔'}
                                    </h4>
                                    
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
                                      <h5 className="font-bold text-gray-800 mb-2">Explanation:</h5>
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
                                        <span>+10 XP</span>
                                        <Trophy className="h-6 w-6" />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="min-h-[400px] flex flex-col justify-center items-center text-center"
                    >
                      <div className="text-8xl mb-8">🌟</div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-4 border-yellow-300">
                        <h3 className="text-2xl font-bold text-orange-700 mb-4">Moral of the Story</h3>
                        <p className="text-xl md:text-2xl leading-relaxed text-orange-600 font-medium">
                          {currentStory.moral}
                        </p>
                      </div>
                      
                      {!completedStories.has(currentStory.id) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="mt-8"
                        >
                          <Button
                            variant="success"
                            size="lg"
                            onClick={handleCompleteStory}
                            icon={<Star className="h-5 w-5" />}
                          >
                            Complete Story (+20 XP)
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="secondary"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0 && !showMoral}
                    icon={<ChevronLeft className="h-5 w-5" />}
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages + 1 }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          (index === currentPage && !showMoral) || (index === totalPages && showMoral)
                            ? 'bg-purple-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleNextPage}
                    disabled={selectedAnswer !== null && answerFeedback === null}
                    icon={<ChevronRight className="h-5 w-5" />}
                  >
                    {currentPage < totalPages - 1 ? 'Next' : showMoral ? 'Complete' : 'Moral'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalesGame;