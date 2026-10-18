import { loadProgress, saveProgress } from './storage';

export function initTheme(): void {
  const progress = loadProgress();
  applyTheme(progress.settings.theme);
}

export function applyTheme(theme: 'light' | 'dark' | 'system'): void {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function toggleTheme(): void {
  const progress = loadProgress();
  const current = progress.settings.theme;
  const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
  progress.settings.theme = next;
  saveProgress(progress);
  applyTheme(next);
  return;
}

export function getThemeIcon(): string {
  const progress = loadProgress();
  switch (progress.settings.theme) {
    case 'dark': return '🌙';
    case 'light': return '☀️';
    default: return '💻';
  }
}
