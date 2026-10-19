import { renderHeader, bindHeaderEvents } from '../components/header';
import { loadProgress, getCompletedCount, getTotalMissions, exportProgress, importProgress } from '../utils/storage';
import type { UserProgress } from '../utils/storage';
import { preloadEngine } from '../engine/python-engine';

export function renderHome(): void {
  const app = document.getElementById('app')!;
  const progress = loadProgress();
  const completed = getCompletedCount(progress);
  const total = getTotalMissions(progress);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const nextMission = Object.values(progress.missions)
    .find(m => m.status === 'available' || m.status === 'in-progress');

  app.innerHTML = `
    ${renderHeader('home')}
    <main class="page">
      <div class="page-content">

        <!-- Hero -->
        <section class="hero fade-in">
          <div class="hero-bg">
            <div class="hero-orb"></div>
            <div class="hero-orb"></div>
            <div class="hero-orb"></div>
          </div>
          <h1 class="hero-title">
            Bienvenue dans ton<br>
            <span class="hero-gradient">laboratoire de données</span>
          </h1>
          <p class="hero-subtitle">
            Explore des datasets, code en Python, crée des graphiques.<br>
            Deviens une exploratrice des données, une mission à la fois.
          </p>
          ${nextMission ? `
            <a href="#/mission/${nextMission.id}" class="btn btn-primary hero-cta">
              ${nextMission.status === 'in-progress' ? '▶️ Reprendre ma mission' : '🚀 Commencer l\'aventure'}
            </a>
          ` : `
            <span class="btn btn-secondary hero-cta">🎉 Toutes les missions terminées !</span>
          `}
        </section>

        <!-- Stats -->
        <section style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:40px" class="stagger">
          <div class="stat-card accent">
            <div class="stat-value">${progress.xp}</div>
            <div class="stat-label">Points d'expérience</div>
          </div>
          <div class="stat-card success">
            <div class="stat-value">${completed}</div>
            <div class="stat-label">Missions terminées</div>
          </div>
          <div class="stat-card badge-c">
            <div class="stat-value">${progress.badges.length}</div>
            <div class="stat-label">Badges obtenus</div>
          </div>
        </section>

        <!-- Progression -->
        <section class="card slide-up" style="margin-bottom:40px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:1rem;font-weight:700">📊 Ma progression</h3>
            <span style="font-size:0.85rem;color:var(--text-secondary);font-weight:600">${pct}%</span>
          </div>
          <div class="progress-bar" style="height:10px">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </section>

        <!-- Univers -->
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;letter-spacing:-0.01em">🗺️ Les univers</h2>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:40px" class="stagger">
          ${renderUniversCard(1, 'Je découvre mes superpouvoirs numériques', 'Données, tableaux, premiers graphiques et statistiques', ['mission-01', 'mission-02', 'mission-03'], progress)}
          ${renderUniversCard(2, 'Je mène mes propres enquêtes', 'Premier modèle d\'IA, prédictions et corrélations', ['mission-04', 'mission-05', 'mission-06'], progress)}
          ${renderUniversCard(3, 'Je construis ma première IA', 'Classification, prédiction et biais', ['mission-07', 'mission-08', 'mission-09'], progress)}
          ${renderUniversCard(4, 'Mon premier projet data science', 'Choix de sujet, analyse complète et présentation', ['mission-10', 'mission-11', 'mission-12'], progress)}
        </section>

        <!-- Actions -->
        <section style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px">
          <button class="btn btn-secondary" id="btn-export">📥 Exporter ma progression</button>
          <button class="btn btn-secondary" id="btn-import">📤 Importer une sauvegarde</button>
          <input type="file" id="import-file" accept=".json" style="display:none" />
        </section>
      </div>
    </main>
  `;

  bindHeaderEvents();
  bindHomeEvents();
  preloadEngine();
}

function renderUniversCard(num: number, title: string, desc: string, missionIds: string[], progress: UserProgress): string {
  const missions = missionIds.map(id => progress.missions[id]).filter(Boolean);
  const completedInUnivers = missions.filter(m => m.status === 'completed').length;
  const isLocked = num > 1 && missions.every(m => m.status === 'locked');
  const colors = ['', '#6366f1', '#06b6d4', '#f59e0b', '#10b981'];
  const color = colors[num];

  return `
    <div class="universe-card ${isLocked ? 'locked' : ''}"
         style="--uc:${color}"
         ${!isLocked ? `onclick="location.hash='#/parcours'"` : ''}>
      <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${color};border-radius:4px 0 0 4px"></div>
      <div style="font-size:0.7rem;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;display:flex;align-items:center;gap:8px">
        <span style="width:26px;height:26px;border-radius:50%;background:${color};color:white;display:inline-flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800">${num}</span>
        Univers ${num}
      </div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:6px">${title}</h3>
      <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:14px;line-height:1.6">${desc}</p>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="progress-bar" style="flex:1;height:6px">
          <div class="progress-bar-fill" style="width:${missions.length > 0 ? (completedInUnivers / missions.length) * 100 : 0}%;background:${color}"></div>
        </div>
        <span style="font-size:0.72rem;color:var(--text-tertiary);font-weight:600">${completedInUnivers}/${missions.length}</span>
      </div>
      ${isLocked ? '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:10px">🔒 Termine l\'univers précédent</div>' : ''}
    </div>
  `;
}

function bindHomeEvents(): void {
  document.getElementById('btn-export')?.addEventListener('click', () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datalab-progression.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-import')?.addEventListener('click', () => {
    document.getElementById('import-file')?.click();
  });

  document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importProgress(reader.result as string);
      if (result) {
        alert('Progression importée avec succès !');
        location.reload();
      } else {
        alert('Fichier invalide. Vérifie que c\'est bien un export DATA LAB.');
      }
    };
    reader.readAsText(file);
  });
}
