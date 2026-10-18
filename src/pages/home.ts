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
        <section class="hero" style="text-align:center;padding:48px 0 32px">
          <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:12px;line-height:1.2">
            Bienvenue dans ton
            <span style="background:linear-gradient(135deg,var(--accent),var(--universe-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">laboratoire</span>
          </h1>
          <p style="font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto 24px">
            Explore des données, code en Python, découvre la data science.<br>
            <strong style="color:var(--accent)">Explore. Code. Discover.</strong>
          </p>
          ${nextMission ? `
            <a href="#/mission/${nextMission.id}" class="btn btn-primary" style="font-size:1rem;padding:14px 32px">
              ${nextMission.status === 'in-progress' ? '▶️ Reprendre ma mission' : '🚀 Commencer l\'aventure'}
            </a>
          ` : `
            <span class="btn btn-secondary">🎉 Toutes les missions terminées !</span>
          `}
        </section>

        <!-- Stats -->
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:40px">
          <div class="card" style="text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--accent)">${progress.xp}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Points d'expérience</div>
          </div>
          <div class="card" style="text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--success)">${completed}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Missions terminées</div>
          </div>
          <div class="card" style="text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--badge-color)">${progress.badges.length}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Badges obtenus</div>
          </div>
        </section>

        <!-- Progression -->
        <section class="card" style="margin-bottom:40px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:1rem;font-weight:700">Ma progression</h3>
            <span style="font-size:0.85rem;color:var(--text-secondary)">${pct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </section>

        <!-- Univers -->
        <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:20px">🗺️ Les univers</h2>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:40px">
          ${renderUniversCard(1, 'Je découvre mes superpouvoirs numériques', 'Données, tableaux, premiers graphiques et statistiques', ['mission-01', 'mission-02', 'mission-03'], progress)}
          ${renderUniversCard(2, 'Je mène mes propres enquêtes', 'Corrélations, régressions et analyses approfondies', ['mission-04', 'mission-05', 'mission-06'], progress)}
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
  const color = `var(--universe-${num})`;

  return `
    <div class="card ${isLocked ? 'locked' : ''}" style="border-left:4px solid ${color};cursor:${isLocked ? 'not-allowed' : 'pointer'}"
         ${!isLocked ? `onclick="location.hash='#/parcours'"` : ''}>
      <div style="font-size:0.75rem;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">
        Univers ${num}
      </div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:6px">${title}</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">${desc}</p>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="progress-bar" style="flex:1">
          <div class="progress-bar-fill" style="width:${missions.length > 0 ? (completedInUnivers / missions.length) * 100 : 0}%;background:${color}"></div>
        </div>
        <span style="font-size:0.75rem;color:var(--text-tertiary)">${completedInUnivers}/${missions.length}</span>
      </div>
      ${isLocked ? '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">🔒 Termine l\'univers précédent</div>' : ''}
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
