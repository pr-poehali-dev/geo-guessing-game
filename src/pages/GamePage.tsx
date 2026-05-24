import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import GameMap from '@/components/GameMap';
import { useGameState, loadSettings } from '@/hooks/useGameState';

export default function GamePage() {
  const [settings] = useState(loadSettings);
  const { state, startGame, submitGuess, nextRound, revealHint, setSelectedPos } = useGameState(settings);
  const [mapExpanded, setMapExpanded] = useState(false);

  const handlePinDrop = useCallback((lat: number, lng: number) => {
    setSelectedPos({ lat, lng });
  }, [setSelectedPos]);

  const currentLocation = state.locations[state.currentRoundIndex];
  const currentResult = state.results[state.currentRoundIndex];
  const timerPct = settings.timeLimit > 0 ? (state.timeLeft / settings.timeLimit) * 100 : 100;
  const timerColor = timerPct > 50 ? 'bg-teal' : timerPct > 25 ? 'bg-gold' : 'bg-destructive';
  const timerWarning = timerPct < 25 && settings.timeLimit > 0;

  if (state.phase === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-6">
            <Icon name="Crosshair" size={36} className="text-gold" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">Одиночная игра</h1>
          <p className="text-muted-foreground mb-2 text-sm">
            {settings.rounds} раундов · {settings.difficulty === 'mixed' ? 'Смешанная' : settings.difficulty === 'easy' ? 'Лёгкая' : settings.difficulty === 'medium' ? 'Средняя' : 'Сложная'} сложность
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            Таймер: {settings.timeLimit > 0 ? `${settings.timeLimit} сек` : 'Без таймера'} · Подсказки: {settings.maxHints}
          </p>
          <button
            onClick={startGame}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gold text-background font-display font-bold text-lg hover:bg-gold-light transition-all hover:scale-105 shadow-lg shadow-gold/20"
          >
            <Icon name="Play" size={22} />
            Начать игру
          </button>
          <p className="text-muted-foreground text-xs mt-4">Настроить можно в разделе «Настройки»</p>
        </div>
      </div>
    );
  }

  if (state.phase === 'game_over') {
    const avgScore = state.results.length ? Math.round(state.totalScore / state.results.length) : 0;
    const maxRounds = settings.rounds;
    const pct = Math.round((state.totalScore / (maxRounds * 5000)) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="glass rounded-3xl p-8 max-w-lg w-full animate-scale-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '🌍' : '🗺️'}</div>
            <h1 className="font-display font-bold text-3xl mb-2 text-gold-gradient">Игра окончена!</h1>
            <p className="text-muted-foreground">Итоговый результат</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <div className="font-display font-bold text-2xl text-gold">{state.totalScore.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Очков всего</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="font-display font-bold text-2xl text-teal">{avgScore.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">В среднем</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="font-display font-bold text-2xl text-foreground">{pct}%</div>
              <div className="text-xs text-muted-foreground mt-1">Точность</div>
            </div>
          </div>

          {/* Round results */}
          <div className="space-y-2 mb-6">
            {state.results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{r.location.city}</p>
                    <p className="text-xs text-muted-foreground">{r.location.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gold">{r.score.toLocaleString()} pts</p>
                  {r.distance !== null && (
                    <p className="text-xs text-muted-foreground">{r.distance < 1 ? '<1 км' : `${Math.round(r.distance)} км`}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* New achievements */}
          {state.newAchievements.length > 0 && (
            <div className="mb-6 p-4 achievement-badge rounded-xl">
              <p className="text-xs text-gold font-medium mb-2">🎉 Новые достижения!</p>
              <div className="flex flex-wrap gap-2">
                {state.newAchievements.map(a => (
                  <span key={a.id} className="flex items-center gap-1 text-sm">
                    <span>{a.icon}</span> <span className="font-medium">{a.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all"
            >
              <Icon name="RotateCcw" size={18} />
              Играть снова
            </button>
            <button
              onClick={() => window.location.hash = '#leaderboard'}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-border hover:border-gold/30 transition-all"
            >
              <Icon name="Trophy" size={18} className="text-gold" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === 'round_result' && currentResult) {
    const hasGuess = currentResult.guessLat !== null;
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 animate-fade-in">
            <div className="text-5xl mb-3">{currentResult.score >= 4000 ? '🎯' : currentResult.score >= 2000 ? '👍' : '😬'}</div>
            <h2 className="font-display font-bold text-3xl text-gold-gradient">{currentResult.score.toLocaleString()} очков</h2>
            <p className="text-muted-foreground mt-1">
              {hasGuess && currentResult.distance !== null
                ? `${currentResult.distance < 1 ? 'Менее 1 км' : `${Math.round(currentResult.distance)} км`} от правильного ответа`
                : 'Ты не успел сделать выбор'}
            </p>
          </div>

          <div className="glass rounded-2xl overflow-hidden mb-6">
            <div className="aspect-video relative">
              <img src={currentResult.location.imageUrl} alt="Локация" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display font-bold text-xl">{currentResult.location.city}, {currentResult.location.country}</h3>
                <p className="text-muted-foreground text-sm">{currentResult.location.continent}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-sm font-medium text-teal mb-1">💡 Интересный факт</p>
            <p className="text-sm text-muted-foreground">{currentResult.location.funFact}</p>
          </div>

          {hasGuess && (
            <div className="glass rounded-2xl overflow-hidden mb-4" style={{ height: 280 }}>
              <GameMap
                onPinDrop={() => {}}
                selectedPos={null}
                resultPos={currentResult.guessLat !== null && currentResult.guessLng !== null ? {
                  guessLat: currentResult.guessLat,
                  guessLng: currentResult.guessLng,
                  actualLat: currentResult.location.lat,
                  actualLng: currentResult.location.lng,
                } : null}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gold inline-block" /> Твой выбор</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-teal inline-block" /> Правильный</span>
            </div>
            <button
              onClick={nextRound}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105"
            >
              {state.currentRoundIndex + 1 >= state.locations.length ? 'Результаты' : 'Следующий'}
              <Icon name="ChevronRight" size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 glass-strong border-b border-border/50 z-20">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-sm text-muted-foreground">
            Раунд <span className="text-foreground">{state.currentRoundIndex + 1}</span>/{state.locations.length}
          </span>
          <div className="flex gap-1">
            {state.locations.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < state.currentRoundIndex ? 'w-6 bg-gold' :
                  i === state.currentRoundIndex ? 'w-6 bg-gold animate-pulse' : 'w-6 bg-border'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            <Icon name="Star" size={14} className="inline text-gold mr-1" />
            {state.totalScore.toLocaleString()}
          </span>
          {settings.timeLimit > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full ${timerColor} rounded-full transition-all duration-1000`} style={{ width: `${timerPct}%` }} />
              </div>
              <span className={`font-display font-bold text-sm w-8 text-right ${timerWarning ? 'text-destructive animate-timer-pulse' : 'text-foreground'}`}>
                {state.timeLeft}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Photo */}
        <div className="relative flex-1 md:flex-[3]">
          {currentLocation && (
            <img
              src={currentLocation.imageUrl}
              alt="Угадай локацию"
              className="w-full h-full object-cover"
              style={{ maxHeight: mapExpanded ? '30vh' : '45vh', minHeight: '220px' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 pointer-events-none" />

          {/* Hints */}
          {currentLocation && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
              {Array.from({ length: state.hintsRevealedCount }, (_, i) => (
                <div key={i} className="hint-card px-3 py-2 text-sm animate-fade-in">
                  <span className="text-teal mr-2">💡</span>
                  {currentLocation.hints[i]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map + controls */}
        <div className="flex flex-col flex-1 md:flex-[2] bg-surface-1">
          {/* Map */}
          <div className={`transition-all duration-300 ${mapExpanded ? 'flex-1' : 'h-64 md:flex-1'}`}>
            <GameMap onPinDrop={handlePinDrop} selectedPos={state.selectedPos} />
          </div>

          {/* Controls */}
          <div className="glass-strong border-t border-border/50 p-4 space-y-3">
            {state.selectedPos ? (
              <div className="text-xs text-center text-muted-foreground">
                📍 {state.selectedPos.lat.toFixed(2)}°, {state.selectedPos.lng.toFixed(2)}°
              </div>
            ) : (
              <div className="text-xs text-center text-muted-foreground">
                Нажми на карту чтобы поставить метку
              </div>
            )}

            <div className="flex gap-2">
              {/* Hint button */}
              <button
                onClick={revealHint}
                disabled={state.hintsRevealedCount >= settings.maxHints || state.hintsRevealedCount >= (currentLocation?.hints.length ?? 0)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border hover:border-gold/30 text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="Lightbulb" size={15} className="text-gold" />
                Подсказка ({settings.maxHints - state.hintsRevealedCount})
              </button>

              {/* Submit */}
              <button
                onClick={submitGuess}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105 disabled:opacity-50"
              >
                <Icon name="Send" size={16} />
                {state.selectedPos ? 'Подтвердить' : 'Пропустить'}
              </button>
            </div>

            <button
              onClick={() => setMapExpanded(v => !v)}
              className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {mapExpanded ? '▲ Свернуть карту' : '▼ Развернуть карту'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
