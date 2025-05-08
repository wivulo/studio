import SnakeGame from '@/components/game/SnakeGame';

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-8">
      <SnakeGame />
    </div>
  );
}
