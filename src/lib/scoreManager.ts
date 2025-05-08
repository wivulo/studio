export interface ScoreEntry {
  score: number;
  date: number; // Timestamp
}

const SCORES_KEY = 'snakeManiaScores';
const MAX_SCORES = 10; // Keep top 10 scores

export const getScores = (): ScoreEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const scoresJson = localStorage.getItem(SCORES_KEY);
  if (scoresJson) {
    try {
      const scores = JSON.parse(scoresJson) as ScoreEntry[];
      return scores.sort((a, b) => b.score - a.score || b.date - a.date);
    } catch (error) {
      console.error("Error parsing scores from localStorage:", error);
      return [];
    }
  }
  return [];
};

export const addScore = (score: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const newScore: ScoreEntry = { score, date: Date.now() };
  const scores = getScores();
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score || b.date - a.date); // Sort by score desc, then date desc
  const updatedScores = scores.slice(0, MAX_SCORES);
  localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
};
