import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GameSetup } from '@/components/chess/GameSetup';
import { GameScreen } from '@/components/chess/GameScreen';
import { UserMenu } from '@/components/UserMenu';
import type { GameSettings } from '@/lib/chess/types';
import heroBg from '@/assets/hero-bg.jpg';
import { 
  Crown, 
  Zap, 
  Target, 
  Users,
  Trophy,
  Brain,
  ChevronRight
} from 'lucide-react';

type Screen = 'landing' | 'setup' | 'game';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setScreen('game');
  };

  const handleExit = () => {
    setScreen('landing');
    setGameSettings(null);
  };

  if (screen === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  if (screen === 'game' && gameSettings) {
    return <GameScreen settings={gameSettings} onExit={handleExit} />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♔</span>
            <span className="font-display font-bold text-lg">Chess Nexus</span>
          </div>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div 
              className="mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full border border-border/50">
                <span className="text-4xl">♔</span>
                <span className="text-2xl font-display font-bold">Chess Nexus</span>
              </div>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-foreground">Master the</span>
              <br />
              <span className="text-gradient">Art of Chess</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Play, learn, and compete in the world's most elegant strategy game.
              Challenge AI, friends, or players worldwide.
            </p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => setScreen('setup')}
                className="h-14 px-8 text-lg gap-2 bg-primary hover:bg-primary/90 shadow-glow"
              >
                <Zap className="w-5 h-5" />
                Play Now
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg gap-2 border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50"
              >
                <Trophy className="w-5 h-5" />
                View Rankings
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { value: '10K+', label: 'Active Players' },
                { value: '1M+', label: 'Games Played' },
                { value: '150ms', label: 'Avg Latency' },
              ].map((stat) => (
                <div key={stat.label} className="px-4">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Chess Nexus?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience chess like never before with cutting-edge features 
              designed for players of all skill levels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Smart AI Opponents',
                description: 'Challenge our advanced AI across multiple difficulty levels, from beginner to grandmaster.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Play',
                description: 'Start playing in seconds. No registration required for casual games.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Game Analysis',
                description: 'Learn from every game with post-match analysis, highlighting your best moves and mistakes.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Play Together',
                description: 'Local multiplayer on the same device or challenge friends online.',
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: 'Ranked Matches',
                description: 'Compete in ranked games and climb the global leaderboard.',
              },
              {
                icon: <Crown className="w-8 h-8" />,
                title: 'Multiple Time Controls',
                description: 'From bullet to classical, choose the pace that suits your style.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-6xl mb-6 block">♛</span>
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Make Your Move?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of players and start your chess journey today.
            </p>
            <Button
              size="lg"
              onClick={() => setScreen('setup')}
              className="h-16 px-12 text-xl gap-3 bg-primary hover:bg-primary/90 shadow-glow"
            >
              <Zap className="w-6 h-6" />
              Start Playing Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♔</span>
            <span className="font-display font-semibold">Chess Nexus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Chess Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
