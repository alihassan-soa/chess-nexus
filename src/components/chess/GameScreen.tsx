import { useState } from 'react';
import { motion } from 'framer-motion';
import { Chessboard } from '@/components/chess/Chessboard';
import { GameTimer } from '@/components/chess/GameTimer';
import { MoveHistory } from '@/components/chess/MoveHistory';
import { GameControls } from '@/components/chess/GameControls';
import { useChessGame } from '@/hooks/useChessGame';
import type { GameSettings } from '@/lib/chess/types';

interface GameScreenProps {
  settings: GameSettings;
  onExit: () => void;
}

export function GameScreen({ settings, onExit }: GameScreenProps) {
  const {
    gameState,
    selectedSquare,
    legalMoves,
    selectSquare,
    resetGame,
    undoLastMove,
    whiteTime,
    blackTime,
    isTimerRunning,
    startTimer,
    pauseTimer,
    settings: gameSettings,
  } = useChessGame(settings);

  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Menu
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {settings.mode === 'ai' && `vs AI (${settings.aiDifficulty})`}
              {settings.mode === 'local' && 'Local Multiplayer'}
            </span>
          </div>
        </motion.header>

        {/* Game Layout */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main board area */}
          <div className="space-y-4">
            {/* Top timer (opponent) */}
            <GameTimer
              time={isFlipped ? whiteTime : blackTime}
              color={isFlipped ? 'w' : 'b'}
              isActive={gameState.turn === (isFlipped ? 'w' : 'b') && isTimerRunning}
              playerName={isFlipped ? 'White' : 'Black'}
            />

            {/* Chessboard */}
            <Chessboard
              gameState={gameState}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={selectSquare}
              settings={gameSettings}
              flipped={isFlipped}
            />

            {/* Bottom timer (player) */}
            <GameTimer
              time={isFlipped ? blackTime : whiteTime}
              color={isFlipped ? 'b' : 'w'}
              isActive={gameState.turn === (isFlipped ? 'b' : 'w') && isTimerRunning}
              playerName={isFlipped ? 'Black' : 'White'}
            />

            {/* Controls */}
            <GameControls
              onNewGame={resetGame}
              onUndo={undoLastMove}
              onFlipBoard={() => setIsFlipped(!isFlipped)}
              onToggleTimer={handleToggleTimer}
              isTimerRunning={isTimerRunning}
              isGameOver={gameState.isGameOver}
              canUndo={gameState.moveHistory.length > 0}
            />
          </div>

          {/* Sidebar */}
          <motion.aside 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Game status */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold text-sm mb-2">Game Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  gameState.isGameOver 
                    ? 'bg-muted' 
                    : gameState.turn === 'w' 
                      ? 'bg-[hsl(40,30%,95%)] border border-border' 
                      : 'bg-[hsl(220,15%,15%)]'
                }`} />
                <span className="text-sm">
                  {gameState.isGameOver 
                    ? 'Game Over' 
                    : `${gameState.turn === 'w' ? 'White' : 'Black'} to move`
                  }
                </span>
                {gameState.isCheck && !gameState.isCheckmate && (
                  <span className="text-xs text-destructive font-medium">Check!</span>
                )}
              </div>
            </div>

            {/* Move history */}
            <MoveHistory moves={gameState.moveHistory} />

            {/* Game info */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold text-sm mb-2">Time Control</h3>
              <p className="text-sm text-muted-foreground">{settings.timeControl.name}</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
