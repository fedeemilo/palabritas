export interface Word {
  word: string;
  imageUrl: string;
  difficulty: number;
}

export interface WordsData {
  nivel1: Word[];
  nivel2: Word[];
  nivel3: Word[];
}

export type Level = 'nivel1' | 'nivel2' | 'nivel3';

export interface GameState {
  currentLevel: Level;
  currentWordIndex: number;
  completedWords: number;
  totalWords: number;
}
