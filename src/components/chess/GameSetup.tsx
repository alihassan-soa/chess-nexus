import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Users, 
  Monitor,
  Clock,
  ChevronRight,
  Crown,
  Swords,
  BookOpen
} from 'lucide-react';
import type { GameSettings, TimeControl } from '@/lib/chess/types';
import { TIME_CONTROLS } from '@/lib/chess/types';

interface GameSetupProps {
  onStartGame: (settings: GameSettings) => void;
}

type GameMode = 'ai' | 'local' | 'online';
type AIDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';

const difficultyConfig: { value: AIDifficulty; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Learning the ropes', icon: <BookOpen className="w-5 h-5" /> },
  { value: 'intermediate', label: 'Intermediate', description: 'Casual play', icon: <Swords className="w-5 h-5" /> },
  { value: 'advanced', label: 'Advanced', description: 'Serious challenge', icon: <Crown className="w-5 h-5" /> },
  { value: 'master', label: 'Master', description: 'Ultimate test', icon: <Crown className="w-5 h-5 text-accent" /> },
];

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('intermediate');
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[3]);

  const handleStart = () => {
    onStartGame({
      mode,
      timeControl,
      aiDifficulty: mode === 'ai' ? difficulty : undefined,
      boardTheme: 'classic',
      pieceTheme: 'standard',
      soundEnabled: true,
      showCoordinates: true,
      highlightMoves: true,
      highlightLastMove: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-6xl mb-4 block">♔</span>
          </motion.div>
          <h1 className="text-4xl font-display font-bold mb-2">New Game</h1>
          <p className="text-muted-foreground">Choose your game settings</p>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Game Mode</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'ai' as GameMode, label: 'vs Computer', icon: <Bot className="w-5 h-5" /> },
              { value: 'local' as GameMode, label: 'Local Play', icon: <Monitor className="w-5 h-5" /> },
              { value: 'online' as GameMode, label: 'Online', icon: <Users className="w-5 h-5" />, disabled: true },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => !option.disabled && setMode(option.value)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${mode === option.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-muted-foreground/50'
                  }
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={!option.disabled ? { scale: 1.02 } : {}}
                whileTap={!option.disabled ? { scale: 0.98 } : {}}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={mode === option.value ? 'text-primary' : 'text-muted-foreground'}>
                    {option.icon}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                {option.disabled && (
                  <span className="absolute top-1 right-1 text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* AI Difficulty (only for AI mode) */}
        {mode === 'ai' && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">AI Difficulty</h2>
            <div className="grid grid-cols-2 gap-3">
              {difficultyConfig.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${difficulty === option.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-muted-foreground/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={difficulty === option.value ? 'text-primary' : 'text-muted-foreground'}>
                      {option.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Time Control */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Control
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_CONTROLS.map((tc) => (
              <motion.button
                key={tc.name}
                onClick={() => setTimeControl(tc)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-center
                  ${timeControl.name === tc.name 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-muted-foreground/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-sm font-medium">{tc.name.split(' ')[0]}</div>
                <div className="text-xs text-muted-foreground">{tc.name.split(' ')[1]}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleStart}
            className="w-full h-14 text-lg gap-2 bg-primary hover:bg-primary/90"
            size="lg"
          >
            Start Game
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
