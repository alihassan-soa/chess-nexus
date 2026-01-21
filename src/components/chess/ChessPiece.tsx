import { motion } from 'framer-motion';
import type { PieceSymbol, Color } from '@/lib/chess/types';
import { PIECE_SYMBOLS } from '@/lib/chess/types';

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  isSelected?: boolean;
  isDragging?: boolean;
}

export function ChessPiece({ type, color, isSelected, isDragging }: ChessPieceProps) {
  return (
    <motion.div
      className={`
        flex items-center justify-center w-full h-full select-none cursor-grab
        ${isSelected ? 'z-10' : ''}
        ${isDragging ? 'cursor-grabbing opacity-90' : ''}
      `}
      initial={false}
      animate={{
        scale: isSelected ? 1.1 : 1,
        filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'none',
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span
        className={`
          text-[2.8rem] sm:text-[3.5rem] md:text-[4rem] leading-none
          font-normal select-none pointer-events-none
          ${color === 'w' 
            ? 'text-[hsl(40,30%,95%)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' 
            : 'text-[hsl(220,15%,15%)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]'
          }
        `}
        style={{
          textShadow: color === 'w' 
            ? '0 2px 4px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.8)' 
            : '0 1px 2px rgba(255,255,255,0.1)',
        }}
      >
        {PIECE_SYMBOLS[color][type]}
      </span>
    </motion.div>
  );
}
