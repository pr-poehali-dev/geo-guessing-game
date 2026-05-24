import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import MultiplayerPage from '@/pages/MultiplayerPage';
import ProfilePage from '@/pages/ProfilePage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={setPage} />;
      case 'game': return <GamePage />;
      case 'multiplayer': return <MultiplayerPage />;
      case 'profile': return <ProfilePage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage onNavigate={setPage} />;
    }
  };

  const showLayout = page !== 'game' && page !== 'multiplayer';

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {showLayout ? (
        <Layout currentPage={page} onNavigate={setPage}>
          {renderPage()}
        </Layout>
      ) : (
        <div className="min-h-screen bg-background relative noise-overlay">
          <div className="stars-bg" aria-hidden>
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  animation: `star-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          {/* Mini header for game pages */}
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 glass-strong border-b border-border/50">
            <button
              onClick={() => setPage('home')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-gold font-display font-bold">⬅ GeoStar</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setPage('settings')}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-secondary/60 transition-all"
              >
                Настройки
              </button>
              <button
                onClick={() => setPage('multiplayer')}
                className={`text-xs px-2 py-1 rounded-lg transition-all ${page === 'multiplayer' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              >
                Мультиплеер
              </button>
            </div>
          </div>
          <div className="pt-12">
            {renderPage()}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
