import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Brush, Eraser, Download, RotateCcw, Users, 
  Sparkles, Heart, Star, Sun, Moon, TreePine, Flower2,
  Car, Home, Rocket, Crown, Apple, Camera, Undo2, Redo2,
  Circle, Square, Triangle, Minus, Plus, Trash2, Save,
  PaintBucket, Pencil, Shapes, Image as ImageIcon, X
} from 'lucide-react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

interface DrawingStroke {
  points: DrawingPoint[];
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

interface ColoringTemplate {
  id: string;
  name: string;
  category: string;
  svg: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

const TeamDrawingGame: React.FC = () => {
  const { user, recordAnswer } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'fill'>('brush');
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[]>([]);
  const [mode, setMode] = useState<'free' | 'coloring'>('free');
  const [selectedTemplate, setSelectedTemplate] = useState<ColoringTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [undoStack, setUndoStack] = useState<DrawingStroke[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingStroke[][]>([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3',
    '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#EE5A24', '#0ABDE3',
    '#10AC84', '#F79F1F', '#A3CB38', '#C44569', '#F8B500', '#6C5CE7',
    '#A29BFE', '#FD79A8', '#E17055', '#00B894', '#FDCB6E', '#6C5CE7',
    '#000000', '#FFFFFF', '#95A5A6', '#34495E', '#2C3E50', '#BDC3C7'
  ];

  const brushSizes = [2, 5, 10, 15, 20, 30];

  // Coloring templates organized by category
  const coloringTemplates: ColoringTemplate[] = [
    // Nature
    {
      id: 'sun',
      name: 'Sun',
      category: 'nature',
      difficulty: 'Easy',
      description: 'A bright, happy sun with rays',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="40" fill="none" stroke="#000" stroke-width="3"/>
        <line x1="100" y1="20" x2="100" y2="40" stroke="#000" stroke-width="3"/>
        <line x1="100" y1="160" x2="100" y2="180" stroke="#000" stroke-width="3"/>
        <line x1="20" y1="100" x2="40" y2="100" stroke="#000" stroke-width="3"/>
        <line x1="160" y1="100" x2="180" y2="100" stroke="#000" stroke-width="3"/>
        <line x1="35.86" y1="35.86" x2="50.71" y2="50.71" stroke="#000" stroke-width="3"/>
        <line x1="149.29" y1="149.29" x2="164.14" y2="164.14" stroke="#000" stroke-width="3"/>
        <line x1="164.14" y1="35.86" x2="149.29" y2="50.71" stroke="#000" stroke-width="3"/>
        <line x1="50.71" y1="149.29" x2="35.86" y2="164.14" stroke="#000" stroke-width="3"/>
        <circle cx="85" cy="85" r="3" fill="#000"/>
        <circle cx="115" cy="85" r="3" fill="#000"/>
        <path d="M 80 115 Q 100 130 120 115" stroke="#000" stroke-width="3" fill="none"/>
      </svg>`
    },
    {
      id: 'tree',
      name: 'Tree',
      category: 'nature',
      difficulty: 'Medium',
      description: 'A beautiful tree with leaves',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="90" y="120" width="20" height="60" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="100" cy="80" r="35" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="75" cy="95" r="25" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="125" cy="95" r="25" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="100" cy="110" r="20" fill="none" stroke="#000" stroke-width="3"/>
        <line x1="20" y1="180" x2="180" y2="180" stroke="#000" stroke-width="3"/>
      </svg>`
    },
    {
      id: 'flower',
      name: 'Flower',
      category: 'nature',
      difficulty: 'Easy',
      description: 'A simple flower with petals',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="80" r="15" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="100" cy="50" rx="12" ry="20" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="130" cy="80" rx="20" ry="12" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="100" cy="110" rx="12" ry="20" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="70" cy="80" rx="20" ry="12" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="121" cy="59" rx="15" ry="10" fill="none" stroke="#000" stroke-width="3" transform="rotate(45 121 59)"/>
        <ellipse cx="121" cy="101" rx="15" ry="10" fill="none" stroke="#000" stroke-width="3" transform="rotate(-45 121 101)"/>
        <ellipse cx="79" cy="59" rx="15" ry="10" fill="none" stroke="#000" stroke-width="3" transform="rotate(-45 79 59)"/>
        <ellipse cx="79" cy="101" rx="15" ry="10" fill="none" stroke="#000" stroke-width="3" transform="rotate(45 79 101)"/>
        <line x1="100" y1="95" x2="100" y2="160" stroke="#000" stroke-width="3"/>
        <path d="M 90 130 Q 85 125 80 130" stroke="#000" stroke-width="2" fill="none"/>
        <path d="M 110 140 Q 115 135 120 140" stroke="#000" stroke-width="2" fill="none"/>
      </svg>`
    },
    {
      id: 'butterfly',
      name: 'Butterfly',
      category: 'nature',
      difficulty: 'Medium',
      description: 'A colorful butterfly',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="40" x2="100" y2="160" stroke="#000" stroke-width="3"/>
        <circle cx="100" cy="50" r="4" fill="#000"/>
        <line x1="95" y1="45" x2="90" y2="35" stroke="#000" stroke-width="2"/>
        <line x1="105" y1="45" x2="110" y2="35" stroke="#000" stroke-width="2"/>
        <ellipse cx="75" cy="70" rx="20" ry="30" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="125" cy="70" rx="20" ry="30" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="80" cy="120" rx="15" ry="25" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="120" cy="120" rx="15" ry="25" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="70" cy="65" r="5" fill="none" stroke="#000" stroke-width="2"/>
        <circle cx="130" cy="65" r="5" fill="none" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    // Vehicles
    {
      id: 'car',
      name: 'Car',
      category: 'vehicles',
      difficulty: 'Medium',
      description: 'A fun car to color',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="120" width="120" height="40" rx="5" fill="none" stroke="#000" stroke-width="3"/>
        <path d="M 60 120 L 70 90 L 130 90 L 140 120" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="70" cy="150" r="15" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="130" cy="150" r="15" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="70" cy="150" r="8" fill="none" stroke="#000" stroke-width="2"/>
        <circle cx="130" cy="150" r="8" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="75" y="95" width="15" height="20" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="110" y="95" width="15" height="20" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="45" y="125" width="12" height="8" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="143" y="125" width="12" height="8" fill="none" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    // Buildings
    {
      id: 'house',
      name: 'House',
      category: 'buildings',
      difficulty: 'Easy',
      description: 'A cozy house',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,40 60,80 140,80" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="70" y="80" width="60" height="80" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="85" y="110" width="15" height="25" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="110" y="100" width="15" height="15" fill="none" stroke="#000" stroke-width="3"/>
        <line x1="117.5" y1="100" x2="117.5" y2="115" stroke="#000" stroke-width="2"/>
        <line x1="110" y1="107.5" x2="125" y2="107.5" stroke="#000" stroke-width="2"/>
        <circle cx="88" cy="122" r="2" fill="#000"/>
        <rect x="85" y="140" width="30" height="20" fill="none" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    // Food
    {
      id: 'apple',
      name: 'Apple',
      category: 'food',
      difficulty: 'Easy',
      description: 'A delicious apple',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 60 C 120 60 140 80 140 110 C 140 140 120 160 100 160 C 80 160 60 140 60 110 C 60 80 80 60 100 60" fill="none" stroke="#000" stroke-width="3"/>
        <path d="M 100 60 C 90 50 85 45 90 40 C 95 35 105 40 100 50" fill="none" stroke="#000" stroke-width="3"/>
        <ellipse cx="105" cy="50" rx="8" ry="15" fill="none" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'cupcake',
      name: 'Cupcake',
      category: 'food',
      difficulty: 'Medium',
      description: 'A sweet cupcake',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M 70 120 L 80 160 L 120 160 L 130 120 Z" fill="none" stroke="#000" stroke-width="3"/>
        <path d="M 65 120 C 70 100 80 90 100 90 C 120 90 130 100 135 120" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="90" cy="105" r="4" fill="#000"/>
        <circle cx="110" cy="105" r="4" fill="#000"/>
        <circle cx="100" cy="85" r="3" fill="#000"/>
        <line x1="75" y1="130" x2="125" y2="130" stroke="#000" stroke-width="2"/>
        <line x1="78" y1="140" x2="122" y2="140" stroke="#000" stroke-width="2"/>
        <line x1="81" y1="150" x2="119" y2="150" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    // Fantasy
    {
      id: 'unicorn',
      name: 'Unicorn',
      category: 'fantasy',
      difficulty: 'Hard',
      description: 'A magical unicorn',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="120" rx="40" ry="25" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="80" cy="90" r="25" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="75,65 85,45 95,65" fill="none" stroke="#000" stroke-width="3"/>
        <path d="M 60 85 C 50 80 45 85 50 95 C 55 90 60 90 65 95" fill="none" stroke="#000" stroke-width="2"/>
        <circle cx="75" cy="85" r="3" fill="#000"/>
        <path d="M 70 95 Q 75 100 80 95" stroke="#000" stroke-width="2" fill="none"/>
        <line x1="60" y1="130" x2="50" y2="160" stroke="#000" stroke-width="3"/>
        <line x1="80" y1="140" x2="75" y2="165" stroke="#000" stroke-width="3"/>
        <line x1="120" y1="140" x2="125" y2="165" stroke="#000" stroke-width="3"/>
        <line x1="140" y1="130" x2="150" y2="160" stroke="#000" stroke-width="3"/>
        <path d="M 85 70 C 90 60 100 55 110 60 C 105 65 95 70 90 75" fill="none" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'castle',
      name: 'Castle',
      category: 'fantasy',
      difficulty: 'Hard',
      description: 'A fairy tale castle',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="100" width="80" height="80" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="50" y="80" width="20" height="100" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="130" y="80" width="20" height="100" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="90" y="60" width="20" height="120" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="50,80 55,70 65,70 70,80" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="130,80 135,70 145,70 150,80" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="90,60 95,50 105,50 110,60" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="85" y="140" width="12" height="20" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="103" y="140" width="12" height="20" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="75" y="120" width="10" height="10" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="115" y="120" width="10" height="10" fill="none" stroke="#000" stroke-width="2"/>
        <circle cx="100" cy="150" r="2" fill="#000"/>
      </svg>`
    },
    // Space
    {
      id: 'rocket',
      name: 'Rocket',
      category: 'space',
      difficulty: 'Medium',
      description: 'A space rocket',
      svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="60" rx="15" ry="25" fill="none" stroke="#000" stroke-width="3"/>
        <rect x="85" y="85" width="30" height="60" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="85,145 100,160 115,145" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="70,100 85,110 85,130 70,120" fill="none" stroke="#000" stroke-width="3"/>
        <polygon points="130,100 115,110 115,130 130,120" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="100" cy="100" r="8" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="95" y="115" width="10" height="15" fill="none" stroke="#000" stroke-width="2"/>
        <path d="M 90 170 Q 100 175 110 170" stroke="#000" stroke-width="2" fill="none"/>
        <path d="M 85 175 Q 100 180 115 175" stroke="#000" stroke-width="2" fill="none"/>
      </svg>`
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🎨' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'buildings', name: 'Buildings', icon: '🏠' },
    { id: 'food', name: 'Food', icon: '🍎' },
    { id: 'fantasy', name: 'Fantasy', icon: '🦄' },
    { id: 'space', name: 'Space', icon: '🚀' }
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template if in coloring mode
    if (mode === 'coloring' && selectedTemplate) {
      drawTemplate(ctx, selectedTemplate.svg);
    }

    // Draw all strokes
    redrawStrokes(ctx);
  }, [strokes, selectedTemplate, mode]);

  const drawTemplate = (ctx: CanvasRenderingContext2D, svgString: string) => {
    try {
      // Create a temporary div to parse the SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgString;
      const svgElement = tempDiv.querySelector('svg');
      
      if (!svgElement) return;

      // Convert SVG to canvas drawing commands
      const elements = svgElement.querySelectorAll('*');
      
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = 'none';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      elements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
          case 'circle':
            const cx = parseFloat(element.getAttribute('cx') || '0');
            const cy = parseFloat(element.getAttribute('cy') || '0');
            const r = parseFloat(element.getAttribute('r') || '0');
            
            ctx.beginPath();
            ctx.arc(cx * 4, cy * 3, r * 3, 0, 2 * Math.PI);
            if (element.getAttribute('fill') === '#000') {
              ctx.fillStyle = '#000';
              ctx.fill();
              ctx.fillStyle = 'none';
            } else {
              ctx.stroke();
            }
            break;
            
          case 'rect':
            const x = parseFloat(element.getAttribute('x') || '0');
            const y = parseFloat(element.getAttribute('y') || '0');
            const width = parseFloat(element.getAttribute('width') || '0');
            const height = parseFloat(element.getAttribute('height') || '0');
            
            ctx.beginPath();
            ctx.rect(x * 4, y * 3, width * 4, height * 3);
            ctx.stroke();
            break;
            
          case 'line':
            const x1 = parseFloat(element.getAttribute('x1') || '0');
            const y1 = parseFloat(element.getAttribute('y1') || '0');
            const x2 = parseFloat(element.getAttribute('x2') || '0');
            const y2 = parseFloat(element.getAttribute('y2') || '0');
            
            ctx.beginPath();
            ctx.moveTo(x1 * 4, y1 * 3);
            ctx.lineTo(x2 * 4, y2 * 3);
            ctx.stroke();
            break;
            
          case 'ellipse':
            const ecx = parseFloat(element.getAttribute('cx') || '0');
            const ecy = parseFloat(element.getAttribute('cy') || '0');
            const rx = parseFloat(element.getAttribute('rx') || '0');
            const ry = parseFloat(element.getAttribute('ry') || '0');
            
            ctx.beginPath();
            ctx.ellipse(ecx * 4, ecy * 3, rx * 4, ry * 3, 0, 0, 2 * Math.PI);
            ctx.stroke();
            break;
            
          case 'polygon':
            const points = element.getAttribute('points');
            if (points) {
              const pointPairs = points.split(' ').map(point => {
                const [px, py] = point.split(',').map(Number);
                return [px * 4, py * 3];
              });
              
              ctx.beginPath();
              ctx.moveTo(pointPairs[0][0], pointPairs[0][1]);
              for (let i = 1; i < pointPairs.length; i++) {
                ctx.lineTo(pointPairs[i][0], pointPairs[i][1]);
              }
              ctx.closePath();
              ctx.stroke();
            }
            break;
            
          case 'path':
            const d = element.getAttribute('d');
            if (d) {
              // Simple path parsing for basic commands
              const commands = d.split(/(?=[MLQC])/);
              ctx.beginPath();
              
              commands.forEach(command => {
                const type = command[0];
                const coords = command.slice(1).trim().split(/[\s,]+/).map(Number);
                
                switch (type) {
                  case 'M':
                    ctx.moveTo(coords[0] * 4, coords[1] * 3);
                    break;
                  case 'L':
                    ctx.lineTo(coords[0] * 4, coords[1] * 3);
                    break;
                  case 'Q':
                    ctx.quadraticCurveTo(coords[0] * 4, coords[1] * 3, coords[2] * 4, coords[3] * 3);
                    break;
                }
              });
              ctx.stroke();
            }
            break;
        }
      });
    } catch (error) {
      console.error('Error drawing template:', error);
    }
  };

  const redrawStrokes = (ctx: CanvasRenderingContext2D) => {
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;

      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Flood fill algorithm for the fill tool
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Convert fill color to RGB
    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    // Get the color of the starting pixel
    const startIndex = (startY * width + startX) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    const startA = data[startIndex + 3];

    // If the starting color is the same as fill color, don't fill
    if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) {
      return;
    }

    // Stack for flood fill
    const stack = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
        continue;
      }

      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // Check if this pixel matches the starting color
      if (r !== startR || g !== startG || b !== startB || a !== startA) {
        continue;
      }

      visited.add(key);

      // Fill this pixel
      data[index] = fillRGB.r;
      data[index + 1] = fillRGB.g;
      data[index + 2] = fillRGB.b;
      data[index + 3] = 255;

      // Add neighboring pixels to stack
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (currentTool === 'fill') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Save state for undo
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);

      // Perform flood fill
      floodFill(ctx, Math.floor(pos.x), Math.floor(pos.y), currentColor);

      // Award XP for using fill tool
      if (user) {
        recordAnswer(true, 3);
      }
      return;
    }

    setIsDrawing(true);
    const newPoint: DrawingPoint = {
      x: pos.x,
      y: pos.y,
      color: currentColor,
      size: brushSize,
      tool: currentTool
    };
    setCurrentStroke([newPoint]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'fill') return;

    const pos = getMousePos(e);
    const newPoint: DrawingPoint = {
      x: pos.x,
      y: pos.y,
      color: currentColor,
      size: brushSize,
      tool: currentTool
    };

    setCurrentStroke(prev => [...prev, newPoint]);

    // Draw current stroke in real-time
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      const newStroke: DrawingStroke = {
        points: currentStroke,
        color: currentColor,
        size: brushSize,
        tool: currentTool
      };

      // Save state for undo
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);
      
      setStrokes(prev => [...prev, newStroke]);
      setCurrentStroke([]);

      // Award XP for drawing
      if (user) {
        recordAnswer(true, 5);
      }
    }
  };

  const clearCanvas = () => {
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [strokes, ...prev]);
    setStrokes(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[0];
    setUndoStack(prev => [...prev, strokes]);
    setStrokes(nextState);
    setRedoStack(prev => prev.slice(1));
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `smartplay-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (user) {
      recordAnswer(true, 10);
    }
  };

  const selectTemplate = (template: ColoringTemplate) => {
    setSelectedTemplate(template);
    setMode('coloring');
    setShowTemplates(false);
    clearCanvas();
  };

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return coloringTemplates;
    return coloringTemplates.filter(template => template.category === selectedCategory);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
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
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2">
            🎨 Team Drawing & Coloring
          </h1>
          <p className="text-xl md:text-2xl text-purple-500 font-semibold">
            Create beautiful art together or color amazing templates!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
              {/* Mode Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={mode === 'free' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setMode('free');
                      setSelectedTemplate(null);
                    }}
                    icon={<Brush className="h-4 w-4" />}
                    fullWidth
                  >
                    Free Draw
                  </Button>
                  <Button
                    variant={mode === 'coloring' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setShowTemplates(true)}
                    icon={<ImageIcon className="h-4 w-4" />}
                    fullWidth
                  >
                    Coloring
                  </Button>
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Tools</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={currentTool === 'brush' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('brush')}
                    icon={<Brush className="h-4 w-4" />}
                    fullWidth
                  >
                    Brush
                  </Button>
                  <Button
                    variant={currentTool === 'eraser' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('eraser')}
                    icon={<Eraser className="h-4 w-4" />}
                    fullWidth
                  >
                    Eraser
                  </Button>
                  <Button
                    variant={currentTool === 'fill' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('fill')}
                    icon={<PaintBucket className="h-4 w-4" />}
                    fullWidth
                  >
                    Fill
                  </Button>
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Brush Size: {brushSize}px
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {brushSizes.map(size => (
                    <button
                      key={size}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                        brushSize === size
                          ? 'border-purple-400 bg-purple-100'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setBrushSize(size)}
                    >
                      <div
                        className="bg-gray-800 rounded-full"
                        style={{
                          width: Math.min(size, 20),
                          height: Math.min(size, 20)
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Colors</h3>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${
                        currentColor === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Actions</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      icon={<Undo2 className="h-4 w-4" />}
                      fullWidth
                    >
                      Undo
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      icon={<Redo2 className="h-4 w-4" />}
                      fullWidth
                    >
                      Redo
                    </Button>
                  </div>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={clearCanvas}
                    icon={<Trash2 className="h-4 w-4" />}
                    fullWidth
                  >
                    Clear Canvas
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={downloadDrawing}
                    icon={<Download className="h-4 w-4" />}
                    fullWidth
                  >
                    Save Drawing
                  </Button>
                </div>
              </div>

              {/* Current Template Info */}
              {mode === 'coloring' && selectedTemplate && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                  <h3 className="font-bold text-purple-600 mb-2">Current Template</h3>
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">{selectedTemplate.name}</div>
                    <div className="text-gray-600">{selectedTemplate.description}</div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                      {selectedTemplate.difficulty}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Palette className="h-6 w-6 mr-2" />
                    <span className="font-bold text-lg">
                      {mode === 'free' ? 'Free Drawing Canvas' : `Coloring: ${selectedTemplate?.name || 'Select Template'}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Team Mode</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-auto cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Selection Modal */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Choose a Coloring Template</h2>
                      <p className="text-purple-100">Pick your favorite design to color!</p>
                    </div>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                          selectedCategory === category.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="p-6 overflow-y-auto max-h-96">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getFilteredTemplates().map((template, index) => (
                      <motion.div
                        key={template.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 border-gray-100 hover:border-purple-300"
                        onClick={() => selectTemplate(template)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                          <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: template.svg }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamDrawingGame;