import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  Undo2, 
  Flag, 
  Play, 
  Pause,
  FlipVertical,
  Settings 
} from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onResign?: () => void;
  onFlipBoard: () => void;
  onToggleTimer: () => void;
  isTimerRunning: boolean;
  isGameOver: boolean;
  canUndo: boolean;
}

export function GameControls({
  onNewGame,
  onUndo,
  onFlipBoard,
  onToggleTimer,
  isTimerRunning,
  isGameOver,
  canUndo,
}: GameControlsProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onNewGame}
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo || isGameOver}
        className="gap-2"
      >
        <Undo2 className="w-4 h-4" />
        Undo
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onFlipBoard}
        className="gap-2"
      >
        <FlipVertical className="w-4 h-4" />
        Flip
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleTimer}
        disabled={isGameOver}
        className="gap-2"
      >
        {isTimerRunning ? (
          <>
            <Pause className="w-4 h-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start
          </>
        )}
      </Button>
    </motion.div>
  );
}
