export interface Word {
  word: string;
  emoji: string;
  difficulty: number;
}

export interface WordsData {
  nivel1: Word[];
  nivel2: Word[];
  nivel3: Word[];
  nivel4: Word[];
  nivel5: Word[];
  nivel6: Word[];
  nivel7: Word[];
  nivel8: Word[];
  nivel9: Word[];
}

export type Level = 'nivel1' | 'nivel2' | 'nivel3' | 'nivel4' | 'nivel5' | 'nivel6' | 'nivel7' | 'nivel8' | 'nivel9';

export interface GameState {
  currentLevel: Level;
  currentWordIndex: number;
  completedWords: number;
  totalWords: number;
}
