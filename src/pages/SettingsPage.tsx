import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { loadSettings, saveSettings, GameSettings } from '@/hooks/useGameState';

export default function SettingsPage() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults: GameSettings = { difficulty: 'mixed', rounds: 5, timeLimit: 60, maxHints: 2 };
    setSettings(defaults);
    saveSettings(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-2">Настройки игры</h1>
        <p className="text-muted-foreground text-sm">Настрой игру под себя</p>
      </div>

      {/* Difficulty */}
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Icon name="Zap" size={17} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base">Сложность</h2>
            <p className="text-xs text-muted-foreground">Определяет набор локаций</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'easy', label: 'Лёгкий', desc: 'Столицы мира', icon: '🌱', color: 'border-teal/40 text-teal bg-teal/10' },
            { id: 'medium', label: 'Средний', desc: 'Крупные города', icon: '🔥', color: 'border-gold/40 text-gold bg-gold/10' },
            { id: 'hard', label: 'Сложный', desc: 'Редкие места', icon: '💀', color: 'border-destructive/40 text-destructive bg-destructive/10' },
            { id: 'mixed', label: 'Случайный', desc: 'Всё вперемешку', icon: '🎲', color: 'border-border text-foreground bg-secondary/40' },
          ].map(d => (
            <button
              key={d.id}
              onClick={() => update('difficulty', d.id as GameSettings['difficulty'])}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${settings.difficulty === d.id ? d.color + ' scale-[1.02]' : 'border-border bg-secondary/20 hover:border-border/80'}`}
            >
              <span className="text-xl mt-0.5">{d.icon}</span>
              <div>
                <p className="font-medium text-sm">{d.label}</p>
                <p className="text-xs opacity-70">{d.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Rounds */}
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Icon name="Hash" size={17} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base">Раундов: <span className="text-gold">{settings.rounds}</span></h2>
            <p className="text-xs text-muted-foreground">Количество локаций за игру</p>
          </div>
        </div>
        <input
          type="range" min={3} max={15} step={1} value={settings.rounds}
          onChange={e => update('rounds', Number(e.target.value))}
          className="w-full accent-gold h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>3 (быстро)</span>
          <span>15 (марафон)</span>
        </div>
        <div className="flex gap-2 mt-3">
          {[3, 5, 8, 10, 15].map(n => (
            <button
              key={n}
              onClick={() => update('rounds', n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${settings.rounds === n ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* Timer */}
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Icon name="Clock" size={17} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base">
              Таймер: <span className="text-gold">{settings.timeLimit === 0 ? 'Без ограничений' : `${settings.timeLimit} сек`}</span>
            </h2>
            <p className="text-xs text-muted-foreground">Быстрее — больше очков</p>
          </div>
        </div>
        <input
          type="range" min={0} max={180} step={15} value={settings.timeLimit}
          onChange={e => update('timeLimit', Number(e.target.value))}
          className="w-full accent-gold h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>∞ (нет)</span>
          <span>3 мин</span>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[0, 30, 60, 90, 120].map(n => (
            <button
              key={n}
              onClick={() => update('timeLimit', n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${settings.timeLimit === n ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border'}`}
            >
              {n === 0 ? '∞' : `${n}с`}
            </button>
          ))}
        </div>
      </section>

      {/* Hints */}
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Icon name="Lightbulb" size={17} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base">
              Подсказки: <span className="text-gold">{settings.maxHints}</span>
            </h2>
            <p className="text-xs text-muted-foreground">Максимум за один раунд</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[0, 1, 2].map(n => (
            <button
              key={n}
              onClick={() => update('maxHints', n)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${settings.maxHints === n ? 'border-gold/40 bg-gold/10 text-gold' : 'border-border bg-secondary/20 text-muted-foreground hover:text-foreground'}`}
            >
              {n === 0 ? 'Без подсказок' : n === 1 ? '1 подсказка' : '2 подсказки'}
            </button>
          ))}
        </div>
        {settings.maxHints === 0 && (
          <p className="text-xs text-destructive/70 mt-2">⚠️ Режим «Хардкор» — ни единой подсказки!</p>
        )}
      </section>

      {/* Preview */}
      <div className="glass rounded-2xl p-4 border border-gold/15 bg-gold/3">
        <p className="text-xs text-gold font-medium mb-2">Предпросмотр игры:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>🎮 {settings.rounds} раундов</span>
          <span>⏱ {settings.timeLimit === 0 ? 'Без таймера' : `${settings.timeLimit} сек`}</span>
          <span>💡 {settings.maxHints} подсказки</span>
          <span>🎯 {settings.difficulty === 'easy' ? 'Лёгкая' : settings.difficulty === 'medium' ? 'Средняя' : settings.difficulty === 'hard' ? 'Сложная' : 'Случайная'} сложность</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-border hover:border-destructive/30 text-sm text-muted-foreground hover:text-destructive transition-all"
        >
          <Icon name="RotateCcw" size={15} />
          Сбросить
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-background font-bold hover:bg-gold-light transition-all hover:scale-105"
        >
          {saved ? (
            <><Icon name="Check" size={18} /> Сохранено!</>
          ) : (
            <><Icon name="Save" size={18} /> Сохранить настройки</>
          )}
        </button>
      </div>
    </div>
  );
}
