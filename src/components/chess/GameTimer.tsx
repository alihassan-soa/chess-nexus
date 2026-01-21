import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Color } from '@/lib/chess/types';

interface GameTimerProps {
  time: number;
  color: Color;
  isActive: boolean;
  playerName: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameTimer({ time, color, isActive, playerName }: GameTimerProps) {
  const isLow = time <= 30;
  const isCritical = time <= 10;

  return (
    <motion.div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        ${isActive 
          ? isCritical 
            ? 'bg-destructive/20 border border-destructive' 
            : isLow 
              ? 'bg-secondary/20 border border-secondary'
              : 'bg-primary/20 border border-primary'
          : 'bg-card border border-border'
        }
        transition-all duration-300
      `}
      animate={isActive && isCritical ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${color === 'w' ? 'bg-[hsl(40,30%,95%)]' : 'bg-[hsl(220,15%,15%)]'}
      `}>
        <span className={`text-lg ${color === 'w' ? 'text-[hsl(220,15%,15%)]' : 'text-[hsl(40,30%,95%)]'}`}>
          {color === 'w' ? '♔' : '♚'}
        </span>
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{playerName}</p>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`
            text-xl font-mono font-bold
            ${isActive 
              ? isCritical 
                ? 'text-destructive' 
                : isLow 
                  ? 'text-secondary'
                  : 'text-primary'
              : 'text-foreground'
            }
          `}>
            {formatTime(time)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
