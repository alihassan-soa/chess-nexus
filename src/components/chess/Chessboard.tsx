import { useMemo } from 'react';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { ChessSquare } from './ChessSquare';
import { getKingSquare } from '@/lib/chess/engine';
import type { GameState, Square, GameSettings } from '@/lib/chess/types';

interface ChessboardProps {
  gameState: GameState;
  selectedSquare: Square | null;
  legalMoves: Square[];
  onSquareClick: (square: Square) => void;
  settings: GameSettings;
  flipped?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export function Chessboard({
  gameState,
  selectedSquare,
  legalMoves,
  onSquareClick,
  settings,
  flipped = false,
}: ChessboardProps) {
  const game = useMemo(() => new Chess(gameState.fen), [gameState.fen]);
  const board = game.board();

  const checkSquare = useMemo(() => {
    if (gameState.isCheck) {
      return getKingSquare(game, gameState.turn);
    }
    return null;
  }, [game, gameState.isCheck, gameState.turn]);

  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  return (
    <motion.div
      className="relative w-full max-w-[min(90vw,600px)] aspect-square mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Board container with shadow and border */}
      <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden border-4 border-[hsl(25,20%,25%)]">
        {/* Board grid */}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {ranks.map((rank, rowIndex) =>
            files.map((file, colIndex) => {
              const square = `${file}${rank}` as Square;
              const boardRow = flipped ? 7 - rowIndex : rowIndex;
              const boardCol = flipped ? 7 - colIndex : colIndex;
              const piece = board[boardRow][boardCol];
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selectedSquare === square;
              const isLegalMove = legalMoves.includes(square);
              const isLastMove = gameState.lastMove?.from === square || gameState.lastMove?.to === square;
              const isCheck = checkSquare === square;

              return (
                <ChessSquare
                  key={square}
                  square={square}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isLegalMove={isLegalMove && settings.highlightMoves}
                  isLastMove={isLastMove && settings.highlightLastMove}
                  isCheck={isCheck}
                  showCoordinates={settings.showCoordinates}
                  file={file}
                  rank={rank}
                  onSquareClick={onSquareClick}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Game over overlay */}
      {gameState.isGameOver && (
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center p-6">
            <h2 className="text-3xl font-display font-bold mb-2">
              {gameState.isCheckmate && 'Checkmate!'}
              {gameState.isStalemate && 'Stalemate!'}
              {gameState.isDraw && !gameState.isStalemate && 'Draw!'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {gameState.isCheckmate && (
                gameState.turn === 'w' ? 'Black wins!' : 'White wins!'
              )}
              {(gameState.isStalemate || (gameState.isDraw && !gameState.isStalemate)) && 
                'The game is a draw'
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
