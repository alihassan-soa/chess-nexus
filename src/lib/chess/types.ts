import type { Chess, Move, Square, PieceSymbol, Color } from 'chess.js';

export type { Chess, Move, Square, PieceSymbol, Color };

export interface GameState {
  fen: string;
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  lastMove: { from: Square; to: Square } | null;
}

export interface TimeControl {
  name: string;
  baseTime: number; // in seconds
  increment: number; // in seconds
}

export interface PlayerInfo {
  name: string;
  color: Color;
  timeRemaining: number; // in seconds
  rating?: number;
}

export interface GameSettings {
  mode: 'local' | 'ai' | 'online';
  timeControl: TimeControl;
  aiDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'master';
  boardTheme: 'classic' | 'modern' | 'wood' | 'tournament';
  pieceTheme: 'standard' | 'neo' | 'alpha';
  soundEnabled: boolean;
  showCoordinates: boolean;
  highlightMoves: boolean;
  highlightLastMove: boolean;
}

export const TIME_CONTROLS: TimeControl[] = [
  { name: 'Bullet 1+0', baseTime: 60, increment: 0 },
  { name: 'Bullet 2+1', baseTime: 120, increment: 1 },
  { name: 'Blitz 3+0', baseTime: 180, increment: 0 },
  { name: 'Blitz 5+3', baseTime: 300, increment: 3 },
  { name: 'Rapid 10+0', baseTime: 600, increment: 0 },
  { name: 'Rapid 15+10', baseTime: 900, increment: 10 },
  { name: 'Classical 30+0', baseTime: 1800, increment: 0 },
];

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'local',
  timeControl: TIME_CONTROLS[3], // Blitz 5+3
  aiDifficulty: 'intermediate',
  boardTheme: 'classic',
  pieceTheme: 'standard',
  soundEnabled: true,
  showCoordinates: true,
  highlightMoves: true,
  highlightLastMove: true,
};

// Chess piece unicode symbols
export const PIECE_SYMBOLS: Record<Color, Record<PieceSymbol, string>> = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙',
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  },
};
