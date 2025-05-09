import { Button } from '@/components/ui/button';
import { ScoreHistory } from '@/components/ScoreHistory';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow p-6 bg-background text-foreground overflow-y-auto">
      <div className="flex flex-col items-center space-y-12 text-center">
        <header className="space-y-4 text-center">
          <h1 className="text-6xl font-extrabold tracking-tight text-primary drop-shadow-md">
            Snake Mania
          </h1>
          <p className="text-xl text-muted-foreground">
            O clássico jogo da cobrinha.
          </p>
        </header>

        <Link href="/game" passHref>
          <Button size="lg" className="px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
            <Play className="mr-2 h-6 w-6" />
            Começar o Jogo
          </Button>
        </Link>

        <ScoreHistory />
      </div>
    </main>
  );
}
