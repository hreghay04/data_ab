import { renderHeader, bindHeaderEvents } from '../components/header';
import { loadProgress } from '../utils/storage';
import { MISSIONS_META } from '../missions/index';

export function renderParcours(): void {
  const app = document.getElementById('app')!;
  const progress = loadProgress();

  const universes = [
    { num: 1, title: 'Je découvre mes superpouvoirs numériques', emoji: '✨', missions: ['mission-01', 'mission-02', 'mission-03'] },
    { num: 2, title: 'Je mène mes propres enquêtes', emoji: '🔍', missions: ['mission-04', 'mission-05', 'mission-06'] },
    { num: 3, title: 'Je construis ma première IA', emoji: '🤖', missions: ['mission-07', 'mission-08', 'mission-09'] },
    { num: 4, title: 'Mon premier projet data science', emoji: '🎓', missions: ['mission-10', 'mission-11', 'mission-12'] },
  ];

  const colors = ['', '#6366f1', '#06b6d4', '#f59e0b', '#10b981'];

  app.innerHTML = `
    ${renderHeader('parcours')}
    <main class="page">
      <div class="page-content">
        <div class="fade-in" style="margin-bottom:32px">
          <h1 style="font-size:2rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:6px">
            🗺️ Mon parcours
          </h1>
          <p style="color:var(--text-secondary);font-size:0.95rem">12 missions pour devenir une exploratrice des données</p>
        </div>

        ${universes.map(u => {
          const color = colors[u.num];
          return `
            <section class="slide-up" style="margin-bottom:44px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
                <span style="width:36px;height:36px;border-radius:12px;background:${color};color:white;display:inline-flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800">${u.num}</span>
                <h2 style="font-size:1.1rem;font-weight:700">${u.emoji} ${u.title}</h2>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px" class="stagger">
                ${u.missions.map(id => {
                  const meta = MISSIONS_META[id];
                  const mp = progress.missions[id];
                  if (!meta) return `<div class="mission-card locked" data-universe="${u.num}">
                    <div class="mission-card-number">Mission ${id.replace('mission-', '')}</div>
                    <div class="mission-card-title">🔒 Bientôt disponible</div>
                    <div class="mission-card-desc">Cette mission sera disponible dans une prochaine mise à jour.</div>
                  </div>`;
                  const status = mp?.status || 'locked';
                  const isLocked = status === 'locked';
                  const statusLabel = status === 'completed' ? '✅ Terminée' : status === 'in-progress' ? '⏳ En cours' : status === 'available' ? '🟢 Disponible' : '🔒 Verrouillée';
                  const statusClass = status === 'completed' ? 'completed' : status === 'in-progress' ? 'in-progress' : 'available';
                  return `
                    <div class="mission-card ${isLocked ? 'locked' : ''}" data-universe="${u.num}"
                         ${!isLocked ? `onclick="location.hash='#/mission/${id}'"` : ''}>
                      <div class="mission-card-number">Mission ${meta.number} · ${meta.duration}</div>
                      <div class="mission-card-title">${meta.title}</div>
                      <div class="mission-card-desc">${meta.description}</div>
                      <div class="mission-card-footer">
                        <span class="mission-status ${statusClass}">${statusLabel}</span>
                        ${meta.badge ? `<span style="font-size:0.78rem;color:var(--badge-color);font-weight:600">🏅 ${meta.badge}</span>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </section>
          `;
        }).join('')}
      </div>
    </main>
  `;

  bindHeaderEvents();
}
