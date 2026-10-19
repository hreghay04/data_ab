import { MISSIONS_META } from '../missions/index';

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
  validatedSteps?: number[];
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

function missionIds(): string[] {
  return Object.keys(MISSIONS_META).sort();
}

function defaultProgress(): UserProgress {
  const missions: Record<string, MissionProgress> = {};
  missionIds().forEach((id, i) => {
    missions[id] = {
      id,
      status: i === 0 ? 'available' : 'locked',
      mode: 'decouverte',
      code: '',
      attempts: 0,
    };
  });
  return {
    version: 2,
    xp: 0,
    level: 1,
    badges: [],
    missions,
    settings: { theme: 'system', fontSize: 14 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Saves made before a mission existed have no entry for it. Add the missing
// ones, and open any whose predecessor is already finished.
function syncMissions(progress: UserProgress): UserProgress {
  const ids = missionIds();
  ids.forEach((id, i) => {
    if (!progress.missions[id]) {
      progress.missions[id] = {
        id,
        status: i === 0 ? 'available' : 'locked',
        mode: 'decouverte',
        code: '',
        attempts: 0,
      };
    }
  });
  ids.forEach((id, i) => {
    if (i > 0 && progress.missions[id].status === 'locked'
        && progress.missions[ids[i - 1]]?.status === 'completed') {
      progress.missions[id].status = 'available';
    }
  });
  return progress;
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    if (!data || data.version !== 2 || !data.missions) return defaultProgress();
    return syncMissions(data as UserProgress);
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
    const synced = syncMissions(data as UserProgress);
    saveProgress(synced);
    return synced;
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
