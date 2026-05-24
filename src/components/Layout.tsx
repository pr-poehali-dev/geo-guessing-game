import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: 'Globe' },
  { id: 'game', label: 'Одиночная', icon: 'Crosshair' },
  { id: 'multiplayer', label: 'Мультиплеер', icon: 'Users' },
  { id: 'leaderboard', label: 'Рейтинг', icon: 'Trophy' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const AMBIENT_TRACKS = [
  { name: 'Cosmic Drift', url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' },
  { name: 'Deep Space', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3' },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndex = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(AMBIENT_TRACKS[0].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    return () => { audioRef.current?.pause(); };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.play().catch(() => {});
      setMusicOn(true);
    }
  };

  return (
    <div className="min-h-screen bg-background relative noise-overlay">
      {/* Stars */}
      <div className="stars-bg" aria-hidden>
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animation: `star-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-4 md:px-8 py-4 glass-strong border-b border-border/50">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover-scale">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center shadow-lg">
            <Icon name="Globe" size={18} className="text-background" />
          </div>
          <span className="font-display font-700 text-lg text-gold-gradient hidden sm:block">GeoStar</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-gold/15 text-gold border border-gold/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Music */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(v => !v)}
              onContextMenu={(e) => { e.preventDefault(); toggleMusic(); }}
              className={`p-2 rounded-lg transition-all duration-200 ${musicOn ? 'text-gold bg-gold/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Нажмите ПКМ для вкл/выкл, ЛКМ для громкости"
            >
              <Icon name={musicOn ? 'Music' : 'VolumeX'} size={17} />
            </button>
            {showVolumeSlider && (
              <div className="absolute right-0 top-12 glass-strong rounded-xl p-3 w-36 z-50 animate-scale-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Музыка</span>
                  <button onClick={toggleMusic} className={`text-xs px-2 py-0.5 rounded ${musicOn ? 'bg-gold/20 text-gold' : 'bg-secondary text-muted-foreground'}`}>
                    {musicOn ? 'Вкл' : 'Выкл'}
                  </button>
                </div>
                <input
                  type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="text-xs text-center text-muted-foreground mt-1">{Math.round(volume * 100)}%</div>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <nav className="absolute top-16 left-0 right-0 glass-strong border-b border-border/50 py-2 animate-fade-in">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium transition-all ${
                  currentPage === item.id ? 'text-gold bg-gold/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Click outside to close volume */}
      {showVolumeSlider && (
        <div className="fixed inset-0 z-40" onClick={() => setShowVolumeSlider(false)} />
      )}
    </div>
  );
}
