import SnakeGame from '@/components/game/SnakeGame';

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-background overflow-hidden">
      <SnakeGame />
    </div>
  );
}
