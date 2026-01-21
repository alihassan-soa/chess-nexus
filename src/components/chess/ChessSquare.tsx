import { motion } from 'framer-motion';
import { ChessPiece } from './ChessPiece';
import type { PieceSymbol, Color, Square } from '@/lib/chess/types';

interface ChessSquareProps {
  square: Square;
  piece: { type: PieceSymbol; color: Color } | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  showCoordinates: boolean;
  file: string;
  rank: number;
  onSquareClick: (square: Square) => void;
  onDragStart?: (square: Square) => void;
  onDragEnd?: (square: Square) => void;
}

export function ChessSquare({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMove,
  isCheck,
  showCoordinates,
  file,
  rank,
  onSquareClick,
}: ChessSquareProps) {
  const baseColor = isLight 
    ? 'bg-[hsl(35,30%,75%)]' 
    : 'bg-[hsl(25,25%,35%)]';
  
  const highlightColor = isCheck
    ? 'bg-[hsl(0,70%,50%,0.6)]'
    : isSelected
    ? 'bg-[hsl(152,60%,50%,0.5)]'
    : isLastMove
    ? 'bg-[hsl(45,70%,60%,0.4)]'
    : '';

  return (
    <motion.div
      className={`
        relative aspect-square flex items-center justify-center
        ${baseColor}
        ${highlightColor}
        cursor-pointer
        transition-colors duration-150
      `}
      onClick={() => onSquareClick(square)}
      whileHover={{ opacity: 0.9 }}
    >
      {/* Legal move indicator */}
      {isLegalMove && (
        <motion.div
          className={`
            absolute rounded-full
            ${piece 
              ? 'inset-0 border-4 border-[hsl(152,60%,50%,0.7)]' 
              : 'w-[30%] h-[30%] bg-[hsl(152,60%,50%,0.5)]'
            }
          `}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Piece */}
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          isSelected={isSelected}
        />
      )}

      {/* Coordinates */}
      {showCoordinates && (
        <>
          {rank === 1 && (
            <span className={`
              absolute bottom-0.5 right-1 text-[10px] font-medium
              ${isLight ? 'text-[hsl(25,25%,35%)]' : 'text-[hsl(35,30%,75%)]'}
            `}>
              {file}
            </span>
          )}
          {file === 'a' && (
            <span className={`
              absolute top-0.5 left-1 text-[10px] font-medium
              ${isLight ? 'text-[hsl(25,25%,35%)]' : 'text-[hsl(35,30%,75%)]'}
            `}>
              {rank}
            </span>
          )}
        </>
      )}
    </motion.div>
  );
}
