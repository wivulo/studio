
"use client";

import type { ScoreEntry } from '@/lib/scoreManager';
import { getScores } from '@/lib/scoreManager';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ScoreHistory() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  if (scores.length === 0) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <History className="h-6 w-6 text-primary" />
            Histórico de Pontuações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma pontuação registrada ainda. Jogue para ver seu histórico!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg max-h-[300px] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6 text-primary" />
          Histórico de Pontuações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[350px] pr-4"> {/* Added ScrollArea with max height */}
          <Table>
            <TableCaption>Tuas pontuações</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((entry, index) => (
                <TableRow key={`${entry.date}-${entry.score}-${index}`}> {/* Ensured a more unique key */}
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell className="text-right">
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

