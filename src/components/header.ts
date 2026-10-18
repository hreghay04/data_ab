import { loadProgress, getCompletedCount, getTotalMissions } from '../utils/storage';
import { toggleTheme, getThemeIcon } from '../utils/theme';

export function renderHeader(activePage: string): string {
  const progress = loadProgress();
  const completed = getCompletedCount(progress);
  const total = getTotalMissions(progress);

  return `
    <header class="header">
      <div class="header-logo" onclick="location.hash='#/'">
        <span>🔬 DATA LAB</span>
      </div>
      <nav class="header-nav">
        <a href="#/" class="nav-link ${activePage === 'home' ? 'active' : ''}">Accueil</a>
        <a href="#/parcours" class="nav-link ${activePage === 'parcours' ? 'active' : ''}">Parcours</a>
        <a href="#/labo" class="nav-link ${activePage === 'labo' ? 'active' : ''}">Laboratoire</a>
      </nav>
      <div class="header-actions">
        <div class="xp-badge">⚡ ${progress.xp} XP</div>
        <div class="level-badge">Niv. ${progress.level}</div>
        <span style="font-size:0.8rem;color:var(--text-tertiary)">${completed}/${total}</span>
        <button class="theme-toggle" id="theme-toggle">${getThemeIcon()}</button>
      </div>
    </header>
    <nav class="nav-mobile" id="nav-mobile">
      <a href="#/" class="nav-link ${activePage === 'home' ? 'active' : ''}">🏠<br>Accueil</a>
      <a href="#/parcours" class="nav-link ${activePage === 'parcours' ? 'active' : ''}">🗺️<br>Parcours</a>
      <a href="#/labo" class="nav-link ${activePage === 'labo' ? 'active' : ''}">🧪<br>Labo</a>
    </nav>
  `;
}

export function bindHeaderEvents(): void {
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = getThemeIcon();
  });
}
