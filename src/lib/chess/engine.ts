import { Chess } from 'chess.js';
import type { GameState, Move, Square, Color } from './types';

export function createGame(fen?: string): Chess {
  return new Chess(fen);
}

export function getGameState(game: Chess): GameState {
  const history = game.history({ verbose: true });
  const lastMove = history.length > 0 
    ? { from: history[history.length - 1].from, to: history[history.length - 1].to }
    : null;

  return {
    fen: game.fen(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    moveHistory: history,
    lastMove,
  };
}

export function getLegalMoves(game: Chess, square: Square): Square[] {
  const moves = game.moves({ square, verbose: true });
  return moves.map((move) => move.to);
}

export function makeMove(
  game: Chess,
  from: Square,
  to: Square,
  promotion?: 'q' | 'r' | 'b' | 'n'
): Move | null {
  try {
    return game.move({ from, to, promotion: promotion || 'q' });
  } catch {
    return null;
  }
}

export function isPromotion(game: Chess, from: Square, to: Square): boolean {
  const piece = game.get(from);
  if (!piece || piece.type !== 'p') return false;
  
  const toRank = to[1];
  return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
}

export function undoMove(game: Chess): Move | null {
  return game.undo();
}

export function getKingSquare(game: Chess, color: Color): Square | null {
  const board = game.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'k' && piece.color === color) {
        const files = 'abcdefgh';
        return `${files[col]}${8 - row}` as Square;
      }
    }
  }
  return null;
}

// Simple AI that makes random legal moves or captures when possible
export function getAIMove(game: Chess, difficulty: string): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Sort moves by capture value for basic strategy
  const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
  };

  const scoredMoves = moves.map((move) => {
    let score = 0;
    
    // Prioritize captures
    if (move.captured) {
      score += pieceValues[move.captured] * 10;
    }
    
    // Prioritize checks
    const testGame = new Chess(game.fen());
    testGame.move(move);
    if (testGame.isCheck()) score += 5;
    if (testGame.isCheckmate()) score += 1000;
    
    // Add randomness based on difficulty
    const randomFactor = difficulty === 'beginner' ? 50 : 
                         difficulty === 'intermediate' ? 20 : 
                         difficulty === 'advanced' ? 5 : 2;
    score += Math.random() * randomFactor;
    
    return { move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  
  // Pick from top moves with some randomness
  const topCount = difficulty === 'beginner' ? moves.length : 
                   difficulty === 'intermediate' ? Math.min(5, moves.length) :
                   difficulty === 'advanced' ? Math.min(3, moves.length) : 1;
  
  const selectedIndex = Math.floor(Math.random() * topCount);
  return scoredMoves[selectedIndex].move;
}
