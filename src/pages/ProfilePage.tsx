import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { loadStats, loadUnlockedAchievements, loadProfile, saveProfile } from '@/hooks/useGameState';
import { ACHIEVEMENTS } from '@/data/achievements';

const AVATARS = ['🌍', '🚀', '🗺️', '⭐', '🧭', '🏔️', '🌊', '🦅', '🧠', '🎯', '🏆', '👑'];
const RARITY_COLORS: Record<string, string> = {
  common: 'border-border text-muted-foreground',
  rare: 'border-teal/40 text-teal',
  epic: 'border-gold/40 text-gold',
  legendary: 'border-yellow-400/60 text-yellow-400',
};
const RARITY_BG: Record<string, string> = {
  common: 'bg-secondary/30',
  rare: 'bg-teal/5',
  epic: 'bg-gold/5',
  legendary: 'bg-yellow-400/5',
};
const RARITY_LABEL: Record<string, string> = {
  common: 'Обычное',
  rare: 'Редкое',
  epic: 'Эпическое',
  legendary: 'Легендарное',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);
  const [tab, setTab] = useState<'stats' | 'achievements'>('stats');

  const stats = loadStats();
  const unlockedIds = loadUnlockedAchievements();
  const totalPoints = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).reduce((s, a) => s + a.points, 0);
  const joinedDate = new Date(profile.joined).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  const saveEdit = () => {
    const updated = { ...profile, name: tempName || 'Путешественник', avatar: tempAvatar };
    setProfile(updated);
    saveProfile(updated);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Profile card */}
      <div className="glass rounded-3xl p-8 animate-fade-in">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-teal/20 border border-gold/25 flex items-center justify-center text-5xl">
              {profile.avatar}
            </div>
            {editing && (
              <button onClick={() => setEditing(false)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center">✕</button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="font-display font-bold text-xl bg-secondary/60 border border-gold/30 rounded-lg px-3 py-1.5 text-foreground focus:outline-none w-full max-w-xs mb-2"
                maxLength={20}
              />
            ) : (
              <h1 className="font-display font-bold text-2xl mb-1 truncate">{profile.name}</h1>
            )}
            <p className="text-muted-foreground text-sm">С нами с {joinedDate}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="achievement-badge px-3 py-1 text-xs font-medium text-gold">{totalPoints} очков достижений</span>
              <span className="text-xs text-muted-foreground">{unlockedIds.length}/{ACHIEVEMENTS.length} достижений</span>
            </div>
          </div>
          <button
            onClick={() => editing ? saveEdit() : setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-border hover:border-gold/30 text-sm transition-all"
          >
            <Icon name={editing ? 'Check' : 'Pencil'} size={15} className={editing ? 'text-teal' : 'text-muted-foreground'} />
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        {editing && (
          <div className="mt-4 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">Выбери аватар:</p>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setTempAvatar(a)}
                  className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${tempAvatar === a ? 'bg-gold/20 border-2 border-gold scale-110' : 'bg-secondary/40 border border-border hover:border-gold/30'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl">
        {[{ id: 'stats', label: 'Статистика', icon: 'BarChart2' }, { id: 'achievements', label: 'Достижения', icon: 'Award' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as 'stats' | 'achievements')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-gold/15 text-gold border border-gold/25' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' ? (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Всего игр', value: stats.totalGames, icon: '🎮' },
              { label: 'Лучший счёт', value: stats.bestScore.toLocaleString(), icon: '🏆' },
              { label: 'Всего очков', value: stats.totalScore.toLocaleString(), icon: '⭐' },
              { label: 'Перфект раундов', value: stats.perfectRounds, icon: '🎯' },
              { label: 'Правильных стран', value: stats.correctCountries, icon: '🌍' },
              { label: 'Правильных городов', value: stats.correctCities, icon: '🏙️' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center hover-lift">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-display font-bold text-xl text-gold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {stats.totalGames === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="text-muted-foreground">Ещё нет сыгранных игр. Начни своё первое путешествие!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {ACHIEVEMENTS.map(a => {
            const unlocked = unlockedIds.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${RARITY_BG[a.rarity]} ${RARITY_COLORS[a.rarity]} ${unlocked ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className="text-3xl">{unlocked ? a.icon : '🔒'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{a.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${RARITY_COLORS[a.rarity]} ${RARITY_BG[a.rarity]}`}>
                      {RARITY_LABEL[a.rarity]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{unlocked ? a.description : '???'}</p>
                </div>
                <span className="text-xs font-bold text-gold whitespace-nowrap">+{a.points} pts</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
