"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { addScore } from '@/lib/scoreManager';
import { useRouter } from 'next/navigation';
import { Home, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // pixels
const BOARD_WIDTH_PX = GRID_SIZE * CELL_SIZE;
const BOARD_HEIGHT_PX = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE_SPEED_MS = 150;

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [pendingDirection, setPendingDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Not fully implemented, but good for future
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SNAKE_SPEED_MS);

  const router = useRouter();

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setPendingDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGameSpeed(INITIAL_SNAKE_SPEED_MS);
  }, []);

  const generateFood = useCallback(() => {
    let newFoodPosition: Position;
    do {
      newFoodPosition = getRandomPosition();
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      let newPendingDirection: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') newPendingDirection = 'UP';
          break;
        case 'ArrowDown':
          if (direction !== 'UP') newPendingDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') newPendingDirection = 'LEFT';
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') newPendingDirection = 'RIGHT';
          break;
      }
      if (newPendingDirection) {
        setPendingDirection(newPendingDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);


  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setDirection(pendingDirection); // Apply pending direction at the start of the tick

      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (pendingDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          addScore(score);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
            setGameOver(true);
            addScore(score);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head); // Add new head

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          generateFood();
          // Increase speed slightly
          setGameSpeed(speed => Math.max(50, speed - 2)); 
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }
        return newSnake;
      });
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [snake, food, pendingDirection, gameOver, isPaused, score, gameSpeed, generateFood]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#F0F0F0';
    ctx.fillRect(0, 0, BOARD_WIDTH_PX, BOARD_HEIGHT_PX);
    
    // Draw food
    const foodColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#386641';
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Add a little highlight to food
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(food.x * CELL_SIZE + CELL_SIZE * 0.2, food.y * CELL_SIZE + CELL_SIZE * 0.2, CELL_SIZE * 0.6, CELL_SIZE * 0.6);


    // Draw snake
    const snakeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#386641';
    ctx.fillStyle = snakeColor;
    snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      // Add a border effect to segments
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#F0F0F0';
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Snake eyes for the head
      if (index === 0) {
        ctx.fillStyle = 'white';
        const eyeSize = CELL_SIZE / 5;
        const eyeOffset1 = CELL_SIZE / 4;
        const eyeOffset2 = CELL_SIZE * 3/4 - eyeSize;

        if (direction === 'UP' || direction === 'DOWN') {
            ctx.fillRect(segment.x * CELL_SIZE + eyeOffset1, segment.y * CELL_SIZE + eyeOffset1, eyeSize, eyeSize);
            ctx.fillRect(segment.x * CELL_SIZE + eyeOffset2, segment.y * CELL_SIZE + eyeOffset1, eyeSize, eyeSize);
        } else { // LEFT or RIGHT
            ctx.fillRect(segment.x * CELL_SIZE + eyeOffset1, segment.y * CELL_SIZE + eyeOffset1, eyeSize, eyeSize);
            ctx.fillRect(segment.x * CELL_SIZE + eyeOffset1, segment.y * CELL_SIZE + eyeOffset2, eyeSize, eyeSize);
        }
      }
    });

  }, [snake, food, direction, gameOver]);


  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primary">Snake Mania</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-semibold">Score: <span className="text-accent">{score}</span></div>
          
          <div className="relative border-2 border-primary rounded-md shadow-inner overflow-hidden" style={{ width: BOARD_WIDTH_PX, height: BOARD_HEIGHT_PX }}>
            <canvas ref={canvasRef} width={BOARD_WIDTH_PX} height={BOARD_HEIGHT_PX} />
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-6 z-10 rounded-md">
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <h2 className="text-4xl font-bold">Game Over!</h2>
                <p className="text-2xl">Final Score: {score}</p>
                <div className="flex space-x-4">
                  <Button onClick={resetGame} variant="secondary" size="lg">
                    <RotateCcw className="mr-2 h-5 w-5" /> Play Again
                  </Button>
                  <Button onClick={() => router.push('/')} variant="outline" size="lg">
                    <Home className="mr-2 h-5 w-5" /> Home
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">Use arrow keys to control the snake.</p>
          
          {!gameOver && (
             <Button onClick={() => router.push('/')} variant="ghost" className="mt-4">
                <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
