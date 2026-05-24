import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import GameMap from '@/components/GameMap';
import { LOCATIONS, calculateDistance, calculateScore } from '@/data/locations';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  ready: boolean;
  guessed: boolean;
  lastScore: number;
}

type MPPhase = 'lobby' | 'playing' | 'round_result' | 'game_over';

const BOT_NAMES = ['АстроПилот', 'ГеоМастер', 'Картограф', 'Навигатор', 'Странник', 'Первооткрыватель'];
const BOT_AVATARS = ['🤖', '🧭', '🗺️', '⭐', '🌟', '🚀'];

function makeBots(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `bot_${i}`,
    name: BOT_NAMES[i % BOT_NAMES.length],
    avatar: BOT_AVATARS[i % BOT_AVATARS.length],
    score: 0,
    ready: true,
    guessed: false,
    lastScore: 0,
  }));
}

export default function MultiplayerPage() {
  const [phase, setPhase] = useState<MPPhase>('lobby');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [botCount, setBotCount] = useState(3);
  const [roundCount, setRoundCount] = useState(5);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [locations] = useState(() => [...LOCATIONS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<{ guessLat: number; guessLng: number; actualLat: number; actualLng: number } | null>(null);

  const myPlayer: Player = {
    id: 'me',
    name: playerName || 'Ты',
    avatar: '🌍',
    score: 0,
    ready: true,
    guessed: false,
    lastScore: 0,
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    const bots = makeBots(botCount);
    setPlayers([myPlayer, ...bots]);
  };

  const startGame = () => {
    setPhase('playing');
    setCurrentRound(0);
    setSelectedPos(null);
    setSubmitted(false);
    setTimeLeft(60);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef) clearInterval(timerRef);
    let t = 60;
    const interval = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(interval);
        handleSubmit(true);
      }
    }, 1000);
    setTimerRef(interval);
  };

  const handlePinDrop = useCallback((lat: number, lng: number) => {
    if (!submitted) setSelectedPos({ lat, lng });
  }, [submitted]);

  const handleSubmit = (timeout = false) => {
    if (submitted) return;
    if (timerRef) clearInterval(timerRef);
    setSubmitted(true);

    const loc = locations[currentRound];
    let myScore = 0;

    if (selectedPos) {
      const dist = calculateDistance(selectedPos.lat, selectedPos.lng, loc.lat, loc.lng);
      myScore = calculateScore(dist, timeout ? 0 : timeLeft, 60);
      setResultData({ guessLat: selectedPos.lat, guessLng: selectedPos.lng, actualLat: loc.lat, actualLng: loc.lng });
    }

    // Simulate bot guesses
    setTimeout(() => {
      setPlayers(prev => prev.map(p => {
        if (p.id === 'me') return { ...p, score: p.score + myScore, lastScore: myScore, guessed: true };
        const botScore = Math.floor(Math.random() * 3500) + 500;
        return { ...p, score: p.score + botScore, lastScore: botScore, guessed: true };
      }));
      setPhase('round_result');
    }, 1500);
  };

  const nextRound = () => {
    const next = currentRound + 1;
    if (next >= roundCount) {
      setPhase('game_over');
      return;
    }
    setCurrentRound(next);
    setSelectedPos(null);
    setSubmitted(false);
    setResultData(null);
    setTimeLeft(60);
    setPhase('playing');
    setPlayers(prev => prev.map(p => ({ ...p, guessed: false, lastScore: 0 })));
    startTimer();
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentLocation = locations[currentRound];
  const timerPct = (timeLeft / 60) * 100;
  const timerColor = timerPct > 50 ? 'bg-teal' : timerPct > 25 ? 'bg-gold' : 'bg-destructive';

  // LOBBY
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="glass rounded-3xl p-8 max-w-lg w-full animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={30} className="text-gold" />
            </div>
            <h1 className="font-display font-bold text-2xl mb-1">Мультиплеер</h1>
            <p className="text-muted-foreground text-sm">Сыграй с ботами или жди друзей</p>
          </div>

          {!roomCode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Твоё имя</label>
                <input
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="Путешественник"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-gold/50 focus:outline-none text-foreground placeholder-muted-foreground text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Количество ботов: {botCount}</label>
                <input type="range" min={1} max={7} value={botCount} onChange={e => setBotCount(Number(e.target.value))}
                  className="w-full accent-gold" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>7</span></div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Раундов: {roundCount}</label>
                <input type="range" min={3} max={10} value={roundCount} onChange={e => setRoundCount(Number(e.target.value))}
                  className="w-full accent-gold" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>3</span><span>10</span></div>
              </div>
              <button
                onClick={createRoom}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105"
              >
                <Icon name="Plus" size={18} />
                Создать комнату
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">или</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex gap-2">
                <input placeholder="Код комнаты" className="flex-1 px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-gold/50 focus:outline-none text-foreground placeholder-muted-foreground text-sm" />
                <button className="px-4 py-3 rounded-xl glass border border-border hover:border-gold/30 transition-all text-sm font-medium">
                  Войти
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 text-center border border-gold/20">
                <p className="text-xs text-muted-foreground mb-1">Код комнаты</p>
                <p className="font-display font-bold text-3xl text-gold tracking-widest">{roomCode}</p>
                <p className="text-xs text-muted-foreground mt-1">Поделись с друзьями</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Игроки ({players.length}):</p>
                {players.map(p => (
                  <div key={p.id} className="player-card flex items-center gap-3 p-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="flex-1 text-sm font-medium">{p.id === 'me' ? (playerName || 'Ты') : p.name}</span>
                    <span className="text-xs text-teal">{p.id.startsWith('bot') ? '🤖 Бот' : '✓ Готов'}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105"
              >
                <Icon name="Play" size={18} />
                Начать игру!
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // GAME OVER
  if (phase === 'game_over') {
    const me = players.find(p => p.id === 'me');
    const myRank = sortedPlayers.findIndex(p => p.id === 'me') + 1;
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="glass rounded-3xl p-8 max-w-md w-full animate-scale-in">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🌍'}</div>
            <h2 className="font-display font-bold text-2xl text-gold-gradient mb-1">
              {myRank === 1 ? 'Победа!' : `${myRank}-е место`}
            </h2>
            <p className="text-muted-foreground text-sm">{me?.score.toLocaleString()} очков</p>
          </div>
          <div className="space-y-2 mb-6">
            {sortedPlayers.map((p, i) => (
              <div key={p.id} className={`player-card flex items-center gap-3 p-3 ${p.id === 'me' ? 'active' : ''}`}>
                <span className="font-display font-bold text-lg w-6 text-center text-muted-foreground">
                  {i + 1 === 1 ? '🥇' : i + 1 === 2 ? '🥈' : i + 1 === 3 ? '🥉' : i + 1}
                </span>
                <span className="text-xl">{p.avatar}</span>
                <span className="flex-1 text-sm font-medium">{p.id === 'me' ? (playerName || 'Ты') : p.name}</span>
                <span className="font-bold text-sm text-gold">{p.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPhase('lobby'); setPlayers([]); setRoomCode(''); setCurrentRound(0); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all"
          >
            <Icon name="RotateCcw" size={18} />
            В лобби
          </button>
        </div>
      </div>
    );
  }

  // ROUND RESULT
  if (phase === 'round_result') {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl">Раунд {currentRound + 1} — результаты</h2>
            <span className="text-sm text-muted-foreground">{currentLocation.city}, {currentLocation.country}</span>
          </div>

          {resultData && (
            <div className="glass rounded-2xl overflow-hidden" style={{ height: 240 }}>
              <GameMap onPinDrop={() => {}} selectedPos={null} resultPos={resultData} />
            </div>
          )}

          <div className="grid gap-2">
            {sortedPlayers.map((p, i) => (
              <div key={p.id} className={`player-card flex items-center gap-3 p-3 ${p.id === 'me' ? 'active' : ''}`}>
                <span className="w-6 text-center font-bold text-sm text-muted-foreground">{i + 1}</span>
                <span className="text-xl">{p.avatar}</span>
                <span className="flex-1 text-sm font-medium">{p.id === 'me' ? (playerName || 'Ты') : p.name}</span>
                <span className="text-xs text-teal mr-2">+{p.lastScore.toLocaleString()}</span>
                <span className="font-bold text-sm text-gold">{p.score.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <button
            onClick={nextRound}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105"
          >
            {currentRound + 1 >= roundCount ? 'Финальные результаты' : 'Следующий раунд'}
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 glass-strong border-b border-border/50 z-20">
        <span className="font-display font-bold text-sm">
          Раунд <span className="text-gold">{currentRound + 1}</span>/{roundCount}
        </span>
        <div className="flex items-center gap-3">
          {players.slice(0, 4).map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span className="text-base">{p.avatar}</span>
              <span className="text-xs text-gold font-bold">{p.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
            <div className={`h-full ${timerColor} rounded-full transition-all duration-1000`} style={{ width: `${timerPct}%` }} />
          </div>
          <span className={`font-display font-bold text-sm w-7 ${timeLeft < 15 ? 'text-destructive animate-timer-pulse' : 'text-foreground'}`}>{timeLeft}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="relative flex-1 md:flex-[3]">
          <img src={currentLocation?.imageUrl} alt="Угадай" className="w-full object-cover" style={{ maxHeight: '45vh', minHeight: '200px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
          {submitted && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="glass rounded-2xl px-8 py-6 text-center animate-scale-in">
                <div className="text-4xl mb-2">⏳</div>
                <p className="font-display font-bold text-lg text-gold">Ждём игроков...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 md:flex-[2]">
          <div className="flex-1 min-h-[220px]">
            <GameMap onPinDrop={handlePinDrop} selectedPos={selectedPos} />
          </div>
          <div className="glass-strong border-t border-border/50 p-4">
            <div className="text-xs text-center text-muted-foreground mb-3">
              {selectedPos ? `📍 ${selectedPos.lat.toFixed(2)}°, ${selectedPos.lng.toFixed(2)}°` : 'Нажми на карту чтобы выбрать локацию'}
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={submitted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Send" size={16} />
              {submitted ? 'Ответ отправлен' : selectedPos ? 'Подтвердить выбор' : 'Пропустить раунд'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
