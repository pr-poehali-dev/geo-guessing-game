import { useState, useEffect, useCallback, useRef } from 'react';
import { Location, getRandomLocations, calculateDistance, calculateScore } from '@/data/locations';
import { PlayerStats, DEFAULT_STATS, checkNewAchievements, Achievement } from '@/data/achievements';

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  rounds: number;
  timeLimit: number;
  maxHints: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'mixed',
  rounds: 5,
  timeLimit: 60,
  maxHints: 2,
};

export interface RoundResult {
  location: Location;
  guessLat: number | null;
  guessLng: number | null;
  distance: number | null;
  score: number;
  timeUsed: number;
  hintsUsed: number;
}

export interface GameState {
  phase: 'idle' | 'playing' | 'round_result' | 'game_over';
  locations: Location[];
  currentRoundIndex: number;
  results: RoundResult[];
  totalScore: number;
  timeLeft: number;
  hintsRevealedCount: number;
  selectedPos: { lat: number; lng: number } | null;
  newAchievements: Achievement[];
}

const STORAGE_KEY = 'geostar_stats';
const ACHIEVEMENTS_KEY = 'geostar_achievements';
const SETTINGS_KEY = 'geostar_settings';
const PROFILE_KEY = 'geostar_profile';

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
  } catch { return { ...DEFAULT_STATS }; }
}

export function saveStats(stats: PlayerStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function loadUnlockedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveUnlockedAchievements(ids: string[]) {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids));
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(s: GameSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { name: 'Путешественник', avatar: '🌍', joined: new Date().toISOString() };
  } catch { return { name: 'Путешественник', avatar: '🌍', joined: new Date().toISOString() }; }
}

export function saveProfile(p: { name: string; avatar: string; joined: string }) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function useGameState(settings: GameSettings) {
  const [state, setState] = useState<GameState>({
    phase: 'idle',
    locations: [],
    currentRoundIndex: 0,
    results: [],
    totalScore: 0,
    timeLeft: settings.timeLimit,
    hintsRevealedCount: 0,
    selectedPos: null,
    newAchievements: [],
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startGame = useCallback(() => {
    const diff = settings.difficulty === 'mixed' ? undefined : settings.difficulty;
    const locs = getRandomLocations(settings.rounds, diff);
    roundStartTimeRef.current = Date.now();
    setState({
      phase: 'playing',
      locations: locs,
      currentRoundIndex: 0,
      results: [],
      totalScore: 0,
      timeLeft: settings.timeLimit,
      hintsRevealedCount: 0,
      selectedPos: null,
      newAchievements: [],
    });
  }, [settings]);

  useEffect(() => {
    if (state.phase === 'playing' && settings.timeLimit > 0) {
      clearTimer();
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            clearTimer();
            submitGuess(prev, true);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return clearTimer;
  }, [state.phase, state.currentRoundIndex]);

  const submitGuess = useCallback((currentState?: GameState, timeout = false) => {
    setState(prev => {
      const s = currentState || prev;
      if (s.phase !== 'playing') return prev;
      const location = s.locations[s.currentRoundIndex];
      const timeUsed = Math.floor((Date.now() - roundStartTimeRef.current) / 1000);
      let distance: number | null = null;
      let score = 0;
      if (s.selectedPos) {
        distance = calculateDistance(s.selectedPos.lat, s.selectedPos.lng, location.lat, location.lng);
        score = calculateScore(distance, s.timeLeft, settings.timeLimit);
      }
      const result: RoundResult = {
        location, guessLat: s.selectedPos?.lat ?? null, guessLng: s.selectedPos?.lng ?? null,
        distance, score, timeUsed, hintsUsed: s.hintsRevealedCount,
      };
      clearTimer();
      return { ...prev, phase: 'round_result', results: [...prev.results, result], totalScore: prev.totalScore + score };
    });
  }, [settings.timeLimit]);

  const nextRound = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentRoundIndex + 1;
      if (nextIndex >= prev.locations.length) {
        const stats = loadStats();
        const totalScore = prev.totalScore;
        const updatedStats: PlayerStats = {
          ...stats,
          totalGames: stats.totalGames + 1,
          totalScore: stats.totalScore + totalScore,
          bestScore: Math.max(stats.bestScore, totalScore),
          perfectRounds: stats.perfectRounds + prev.results.filter(r => r.score >= 4900).length,
          hintsUsed: stats.hintsUsed + prev.results.reduce((a, r) => a + r.hintsUsed, 0),
          correctCountries: stats.correctCountries + prev.results.filter(r => r.distance !== null && r.distance < 500).length,
          correctCities: stats.correctCities + prev.results.filter(r => r.distance !== null && r.distance < 50).length,
        };
        saveStats(updatedStats);
        const unlocked = loadUnlockedAchievements();
        const newAch = checkNewAchievements(updatedStats, unlocked);
        if (newAch.length > 0) saveUnlockedAchievements([...unlocked, ...newAch.map(a => a.id)]);
        return { ...prev, phase: 'game_over', newAchievements: newAch };
      }
      roundStartTimeRef.current = Date.now();
      return {
        ...prev, phase: 'playing', currentRoundIndex: nextIndex,
        timeLeft: settings.timeLimit, hintsRevealedCount: 0, selectedPos: null,
      };
    });
  }, [settings.timeLimit]);

  const revealHint = useCallback(() => {
    setState(prev => {
      if (prev.hintsRevealedCount >= settings.maxHints) return prev;
      return { ...prev, hintsRevealedCount: prev.hintsRevealedCount + 1 };
    });
  }, [settings.maxHints]);

  const setSelectedPos = useCallback((pos: { lat: number; lng: number } | null) => {
    setState(prev => ({ ...prev, selectedPos: pos }));
  }, []);

  const handleSubmit = useCallback(() => submitGuess(), [submitGuess]);

  return { state, startGame, submitGuess: handleSubmit, nextRound, revealHint, setSelectedPos };
}
