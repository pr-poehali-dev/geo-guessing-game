import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { loadProfile, loadStats } from '@/hooks/useGameState';

interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  games: number;
  country: string;
  isMe?: boolean;
}

function generateLeaderboard(myName: string, myAvatar: string, myScore: number, myGames: number): LeaderEntry[] {
  const names = [
    { name: 'ГеоМастер', avatar: '🧭', country: 'Россия' },
    { name: 'WorldExplorer', avatar: '🌍', country: 'США' },
    { name: 'Картограф99', avatar: '🗺️', country: 'Германия' },
    { name: 'Первооткрыватель', avatar: '🏔️', country: 'Япония' },
    { name: 'АтласПро', avatar: '⭐', country: 'Франция' },
    { name: 'NavigatorX', avatar: '🧠', country: 'Великобритания' },
    { name: 'Странник777', avatar: '🚀', country: 'Бразилия' },
    { name: 'GlobeHunter', avatar: '🌊', country: 'Австралия' },
    { name: 'MapMaster', avatar: '🦅', country: 'Канада' },
  ];

  const fakeEntries: LeaderEntry[] = names.map((n, i) => ({
    rank: 0,
    name: n.name,
    avatar: n.avatar,
    score: Math.floor(Math.random() * 80000) + 20000,
    games: Math.floor(Math.random() * 150) + 20,
    country: n.country,
  }));

  const myEntry: LeaderEntry = {
    rank: 0,
    name: myName || 'Путешественник',
    avatar: myAvatar || '🌍',
    score: myScore,
    games: myGames,
    country: 'Россия',
    isMe: true,
  };

  const all = [...fakeEntries, myEntry].sort((a, b) => b.score - a.score);
  return all.map((e, i) => ({ ...e, rank: i + 1 }));
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'all' | 'week' | 'day'>('all');
  const profile = loadProfile();
  const stats = loadStats();
  const entries = generateLeaderboard(profile.name, profile.avatar, stats.bestScore, stats.totalGames);
  const myEntry = entries.find(e => e.isMe);

  const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-2">Рейтинг игроков</h1>
        <p className="text-muted-foreground text-sm">Глобальная таблица лидеров</p>
      </div>

      {/* My rank highlight */}
      {myEntry && (
        <div className="glass rounded-2xl p-5 border border-gold/25 bg-gold/5 animate-fade-in">
          <p className="text-xs text-gold mb-2 font-medium">Твоя позиция</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center font-display font-bold text-gold text-lg">
              {myEntry.rank}
            </div>
            <span className="text-2xl">{myEntry.avatar}</span>
            <div className="flex-1">
              <p className="font-medium">{myEntry.name}</p>
              <p className="text-xs text-muted-foreground">{myEntry.games} игр</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-gold text-xl">{myEntry.score.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">очков</p>
            </div>
          </div>
        </div>
      )}

      {/* Period filter */}
      <div className="flex gap-1 p-1 glass rounded-xl">
        {[
          { id: 'all', label: 'Все время' },
          { id: 'week', label: 'Неделя' },
          { id: 'day', label: 'Сегодня' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as 'all' | 'week' | 'day')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${period === p.id ? 'bg-gold/15 text-gold border border-gold/25' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-3">
        {entries.slice(0, 3).map((e, i) => {
          const order = [1, 0, 2][i];
          const entry = entries[order];
          const sizes = ['h-20', 'h-24', 'h-20'];
          return (
            <div key={entry.rank} className={`glass rounded-2xl p-4 text-center flex flex-col items-center justify-end ${sizes[i]} ${entry.isMe ? 'border border-gold/30' : ''} hover-lift`}>
              <span className="text-2xl mb-1">{entry.avatar}</span>
              <p className="text-xs font-medium truncate w-full text-center">{entry.name}</p>
              <p className="font-display font-bold text-sm text-gold">{entry.score.toLocaleString()}</p>
              <p className="text-xl mt-1">{MEDAL[entry.rank]}</p>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {entries.map(e => (
          <div
            key={e.rank}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all hover-lift ${e.isMe ? 'glass border border-gold/25 bg-gold/5' : 'glass'}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-bold ${e.rank <= 3 ? 'bg-gold/15 text-gold' : 'bg-secondary text-muted-foreground'}`}>
              {MEDAL[e.rank] || e.rank}
            </div>
            <span className="text-2xl">{e.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{e.name}</span>
                {e.isMe && <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full border border-gold/25">Ты</span>}
              </div>
              <span className="text-xs text-muted-foreground">{e.country} · {e.games} игр</span>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-gold text-sm">{e.score.toLocaleString()}</p>
              <div className="flex items-center justify-end gap-1">
                <Icon name="Star" size={11} className="text-gold" />
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">Рейтинг обновляется после каждой игры</p>
      </div>
    </div>
  );
}
