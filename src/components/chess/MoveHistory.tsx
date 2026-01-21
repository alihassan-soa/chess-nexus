import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Move } from '@/lib/chess/types';

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  // Group moves into pairs (white move, black move)
  const movePairs: { number: number; white: Move; black?: Move }[] = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <h3 className="font-display font-semibold text-sm">Move History</h3>
      </div>
      
      <ScrollArea className="h-[200px] md:h-[300px]">
        <div className="p-2">
          {movePairs.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              No moves yet
            </p>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, index) => (
                <motion.div
                  key={pair.number}
                  className="flex items-center text-sm font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <span className="w-8 text-muted-foreground">{pair.number}.</span>
                  <span className="w-16 px-2 py-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors">
                    {pair.white.san}
                  </span>
                  {pair.black && (
                    <span className="w-16 px-2 py-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors">
                      {pair.black.san}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
