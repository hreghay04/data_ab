export interface MissionProgress {
  id: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  mode: 'decouverte' | 'exploratrice' | 'experte';
  code: string;
  attempts: number;
  completedAt?: number;
  bestMode?: string;
  hypothesisText?: string;
  reflectionText?: string;
}

export interface UserProgress {
  version: 2;
  xp: number;
  level: number;
  badges: string[];
  missions: Record<string, MissionProgress>;
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: number;
  };
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'datalab_progress';

function defaultProgress(): UserProgress {
  return {
    version: 2,
    xp: 0,
    level: 1,
    badges: [],
    missions: {
      'mission-01': { id: 'mission-01', status: 'available', mode: 'decouverte', code: '', attempts: 0 },
      'mission-02': { id: 'mission-02', status: 'locked', mode: 'decouverte', code: '', attempts: 0 },
      'mission-03': { id: 'mission-03', status: 'locked', mode: 'decouverte', code: '', attempts: 0 },
    },
    settings: { theme: 'system', fontSize: 14 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    if (!data || data.version !== 2) return defaultProgress();
    return data as UserProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    progress.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* quota exceeded — silent */ }
}

export function exportProgress(): string {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
}

export function importProgress(json: string): UserProgress | null {
  try {
    const data = JSON.parse(json);
    if (!data || data.version !== 2 || !data.missions) return null;
    saveProgress(data);
    return data;
  } catch {
    return null;
  }
}

export function unlockNextMission(progress: UserProgress, currentId: string): void {
  const ids = Object.keys(progress.missions).sort();
  const idx = ids.indexOf(currentId);
  if (idx >= 0 && idx < ids.length - 1) {
    const nextId = ids[idx + 1];
    if (progress.missions[nextId].status === 'locked') {
      progress.missions[nextId].status = 'available';
    }
  }
}

export function addXP(progress: UserProgress, amount: number): void {
  progress.xp += amount;
  progress.level = Math.floor(progress.xp / 100) + 1;
}

export function addBadge(progress: UserProgress, badge: string): void {
  if (!progress.badges.includes(badge)) {
    progress.badges.push(badge);
  }
}

export function getCompletedCount(progress: UserProgress): number {
  return Object.values(progress.missions).filter(m => m.status === 'completed').length;
}

export function getTotalMissions(progress: UserProgress): number {
  return Object.keys(progress.missions).length;
}
