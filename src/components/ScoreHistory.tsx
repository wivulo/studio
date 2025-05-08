
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
            Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No scores recorded yet. Play a game to see your history!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6 text-primary" />
          Score History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your top scores.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((entry, index) => (
              <TableRow key={`${entry.date}-${index}`}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.score}</TableCell>
                <TableCell className="text-right">
                  {new Date(entry.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
