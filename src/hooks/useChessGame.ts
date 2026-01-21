import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { 
  createGame, 
  getGameState, 
  getLegalMoves, 
  makeMove, 
  isPromotion,
  getAIMove 
} from '@/lib/chess/engine';
import { useChessSounds } from '@/hooks/useChessSounds';
import type { GameState, GameSettings, Square, Move } from '@/lib/chess/types';

interface UseChessGameReturn {
  gameState: GameState;
  selectedSquare: Square | null;
  legalMoves: Square[];
  selectSquare: (square: Square) => void;
  movePiece: (from: Square, to: Square) => boolean;
  resetGame: () => void;
  undoLastMove: () => void;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  whiteTime: number;
  blackTime: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
}

export function useChessGame(initialSettings?: Partial<GameSettings>): UseChessGameReturn {
  const gameRef = useRef<Chess>(createGame());
  const [gameState, setGameState] = useState<GameState>(() => getGameState(gameRef.current));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'local',
    timeControl: { name: 'Blitz 5+3', baseTime: 300, increment: 3 },
    aiDifficulty: 'intermediate',
    boardTheme: 'classic',
    pieceTheme: 'standard',
    soundEnabled: true,
    showCoordinates: true,
    highlightMoves: true,
    highlightLastMove: true,
    ...initialSettings,
  });
  
  const [whiteTime, setWhiteTime] = useState(settings.timeControl.baseTime);
  const [blackTime, setBlackTime] = useState(settings.timeControl.baseTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sound effects
  const { playMoveSound, setEnabled: setSoundEnabled } = useChessSounds(settings.soundEnabled);
  
  // Sync sound enabled state with settings
  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled, setSoundEnabled]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && !gameState.isGameOver) {
      timerRef.current = setInterval(() => {
        if (gameState.turn === 'w') {
          setWhiteTime((prev) => Math.max(0, prev - 1));
        } else {
          setBlackTime((prev) => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, gameState.turn, gameState.isGameOver]);

  // AI move logic
  useEffect(() => {
    if (settings.mode === 'ai' && gameState.turn === 'b' && !gameState.isGameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameRef.current, settings.aiDifficulty || 'intermediate');
        if (aiMove) {
          makeMove(gameRef.current, aiMove.from, aiMove.to, aiMove.promotion as 'q' | 'r' | 'b' | 'n');
          const newState = getGameState(gameRef.current);
          setGameState(newState);
          // Play sound for AI move
          playMoveSound(aiMove, newState.isCheck, newState.isGameOver);
          // Add increment
          setBlackTime((prev) => prev + settings.timeControl.increment);
        }
      }, 500 + Math.random() * 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, gameState.isGameOver, settings.mode, settings.aiDifficulty, settings.timeControl.increment, playMoveSound]);

  const selectSquare = useCallback((square: Square) => {
    const piece = gameRef.current.get(square);
    
    // If clicking on own piece, select it
    if (piece && piece.color === gameState.turn) {
      setSelectedSquare(square);
      if (settings.highlightMoves) {
        setLegalMoves(getLegalMoves(gameRef.current, square));
      }
    } 
    // If a piece is selected and clicking on a legal move, make the move
    else if (selectedSquare && legalMoves.includes(square)) {
      const from = selectedSquare;
      const to = square;
      
      // Check for promotion
      let move;
      if (isPromotion(gameRef.current, from, to)) {
        // For simplicity, auto-promote to queen
        move = makeMove(gameRef.current, from, to, 'q');
      } else {
        move = makeMove(gameRef.current, from, to);
      }
      
      const newState = getGameState(gameRef.current);
      setGameState(newState);
      setSelectedSquare(null);
      setLegalMoves([]);
      
      // Play sound for the move
      if (move) {
        playMoveSound(move, newState.isCheck, newState.isGameOver);
      }
      
      // Add increment to the player who just moved
      if (gameState.turn === 'w') {
        setWhiteTime((prev) => prev + settings.timeControl.increment);
      } else {
        setBlackTime((prev) => prev + settings.timeControl.increment);
      }
    } 
    // Otherwise, deselect
    else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [selectedSquare, legalMoves, gameState.turn, settings.highlightMoves, settings.timeControl.increment, playMoveSound]);

  const movePiece = useCallback((from: Square, to: Square): boolean => {
    const promotion = isPromotion(gameRef.current, from, to) ? 'q' : undefined;
    const move = makeMove(gameRef.current, from, to, promotion);
    
    if (move) {
      const newState = getGameState(gameRef.current);
      setGameState(newState);
      setSelectedSquare(null);
      setLegalMoves([]);
      
      // Play sound
      playMoveSound(move, newState.isCheck, newState.isGameOver);
      
      // Add increment
      if (gameState.turn === 'w') {
        setWhiteTime((prev) => prev + settings.timeControl.increment);
      } else {
        setBlackTime((prev) => prev + settings.timeControl.increment);
      }
      return true;
    }
    return false;
  }, [gameState.turn, settings.timeControl.increment, playMoveSound]);

  const resetGame = useCallback(() => {
    gameRef.current = createGame();
    setGameState(getGameState(gameRef.current));
    setSelectedSquare(null);
    setLegalMoves([]);
    setWhiteTime(settings.timeControl.baseTime);
    setBlackTime(settings.timeControl.baseTime);
    setIsTimerRunning(false);
  }, [settings.timeControl.baseTime]);

  const undoLastMove = useCallback(() => {
    gameRef.current.undo();
    if (settings.mode === 'ai') {
      gameRef.current.undo(); // Undo AI move too
    }
    setGameState(getGameState(gameRef.current));
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [settings.mode]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.timeControl) {
      setWhiteTime(newSettings.timeControl.baseTime);
      setBlackTime(newSettings.timeControl.baseTime);
    }
  }, []);

  const startTimer = useCallback(() => setIsTimerRunning(true), []);
  const pauseTimer = useCallback(() => setIsTimerRunning(false), []);

  return {
    gameState,
    selectedSquare,
    legalMoves,
    selectSquare,
    movePiece,
    resetGame,
    undoLastMove,
    settings,
    updateSettings,
    whiteTime,
    blackTime,
    isTimerRunning,
    startTimer,
    pauseTimer,
  };
}
