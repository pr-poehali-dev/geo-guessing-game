export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface PlayerStats {
  totalGames: number;
  totalScore: number;
  bestScore: number;
  perfectRounds: number;
  gamesWon: number;
  multiplayerGames: number;
  hintsUsed: number;
  correctCountries: number;
  correctCities: number;
  streakMax: number;
  currentStreak: number;
}

export const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalScore: 0,
  bestScore: 0,
  perfectRounds: 0,
  gamesWon: 0,
  multiplayerGames: 0,
  hintsUsed: 0,
  correctCountries: 0,
  correctCities: 0,
  streakMax: 0,
  currentStreak: 0,
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game', title: 'Первый шаг', description: 'Сыграй первую игру', icon: '🚀',
    rarity: 'common', points: 50,
    condition: (s) => s.totalGames >= 1
  },
  {
    id: 'explorer_10', title: 'Путешественник', description: 'Сыграй 10 игр', icon: '🌍',
    rarity: 'common', points: 100,
    condition: (s) => s.totalGames >= 10
  },
  {
    id: 'explorer_50', title: 'Бывалый странник', description: 'Сыграй 50 игр', icon: '🗺️',
    rarity: 'rare', points: 300,
    condition: (s) => s.totalGames >= 50
  },
  {
    id: 'perfect_round', title: 'Снайпер', description: 'Набери 5000 очков за раунд', icon: '🎯',
    rarity: 'rare', points: 200,
    condition: (s) => s.perfectRounds >= 1
  },
  {
    id: 'perfect_5', title: 'Легкий прогулочек', description: 'Набери 5000 очков 5 раз', icon: '💎',
    rarity: 'epic', points: 500,
    condition: (s) => s.perfectRounds >= 5
  },
  {
    id: 'high_score', title: 'Рекордсмен', description: 'Набери 20000 очков за игру', icon: '🏆',
    rarity: 'epic', points: 400,
    condition: (s) => s.bestScore >= 20000
  },
  {
    id: 'multiplayer_win', title: 'Победитель', description: 'Победи в мультиплеере', icon: '👑',
    rarity: 'rare', points: 250,
    condition: (s) => s.gamesWon >= 1
  },
  {
    id: 'multiplayer_10', title: 'Командный игрок', description: 'Сыграй 10 мультиплеер матчей', icon: '🤝',
    rarity: 'rare', points: 200,
    condition: (s) => s.multiplayerGames >= 10
  },
  {
    id: 'no_hints', title: 'Без подсказок', description: 'Угадай страну правильно без подсказок', icon: '🧠',
    rarity: 'common', points: 150,
    condition: (s) => s.correctCountries >= 1
  },
  {
    id: 'city_master', title: 'Знаток городов', description: 'Угадай правильно 10 городов', icon: '🏙️',
    rarity: 'rare', points: 300,
    condition: (s) => s.correctCities >= 10
  },
  {
    id: 'streak_5', title: 'В ударе', description: 'Правильно угадай 5 раз подряд', icon: '🔥',
    rarity: 'rare', points: 250,
    condition: (s) => s.streakMax >= 5
  },
  {
    id: 'legend', title: 'Легенда', description: 'Набери 100 000 очков суммарно', icon: '⭐',
    rarity: 'legendary', points: 1000,
    condition: (s) => s.totalScore >= 100000
  },
];

export function checkNewAchievements(stats: PlayerStats, unlocked: string[]): Achievement[] {
  return ACHIEVEMENTS.filter(a => !unlocked.includes(a.id) && a.condition(stats));
}
