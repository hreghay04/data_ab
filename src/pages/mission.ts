import { renderHeader, bindHeaderEvents } from '../components/header';
import { loadProgress, saveProgress, addXP, addBadge, unlockNextMission } from '../utils/storage';
import { loadMission, loadDataset } from '../missions/index';
import type { MissionData, MissionStep } from '../missions/index';
import { initEngine, runPython, onStatusChange, resetEngine, preloadEngine } from '../engine/python-engine';
import { createCodeEditor, getEditorCode, setEditorCode, destroyEditor } from '../components/code-editor';
import { renderEngineBoot, bindEngineBoot } from '../components/engine-boot';
import { injectFigures } from '../components/diagrams';
import { renderPlotArea, showPlot, hidePlot, bindPlotExport, slugify } from '../components/plot-export';

let currentMission: MissionData | null = null;
let currentStepIndex = 0;
let datasets: Record<string, string> = {};
let editorContent = '';

export async function renderMission(id: string): Promise<void> {
  const app = document.getElementById('app')!;
  const progress = loadProgress();
  const mp = progress.missions[id];

  if (!mp || mp.status === 'locked') {
    app.innerHTML = `
      ${renderHeader('parcours')}
      <main class="page"><div class="page-content" style="text-align:center;padding:80px 24px">
        <div style="font-size:var(--text-2xl);margin-bottom:16px">🔒</div>
        <h1 style="font-size:var(--text-xl);font-weight:800">Mission verrouillée</h1>
        <p style="color:var(--text-secondary);margin:16px 0">Termine les missions précédentes pour débloquer celle-ci.</p>
        <a href="#/parcours" class="btn btn-primary">← Retour au parcours</a>
      </div></main>
    `;
    bindHeaderEvents();
    return;
  }

  currentMission = await loadMission(id);
  if (!currentMission) {
    app.innerHTML = `
      ${renderHeader('parcours')}
      <main class="page"><div class="page-content" style="text-align:center;padding:80px 24px">
        <h1>Mission introuvable</h1>
        <a href="#/parcours" class="btn btn-primary">← Retour au parcours</a>
      </div></main>
    `;
    bindHeaderEvents();
    return;
  }

  if (mp.status === 'available') {
    mp.status = 'in-progress';
    saveProgress(progress);
  }

  if (currentMission.meta.dataset) {
    try {
      const content = await loadDataset(currentMission.meta.dataset);
      datasets[currentMission.meta.dataset] = content;
    } catch {}
  }
  const allDatasets = ['kpop.csv', 'tennis.csv', 'chats.csv', 'mangas.csv', 'metiers.csv', 'candidats.csv'];
  for (const ds of allDatasets) {
    if (!datasets[ds]) {
      try { datasets[ds] = await loadDataset(ds); } catch {}
    }
  }

  currentStepIndex = 0;
  editorContent = mp.code || '';

  // Start the ~30s download while she reads the intro, not on her first click.
  preloadEngine();

  renderCurrentStep(id);
}

function renderCurrentStep(missionId: string): void {
  destroyEditor();
  const app = document.getElementById('app')!;
  const mission = currentMission!;
  const step = mission.steps[currentStepIndex];
  const progress = loadProgress();
  const mp = progress.missions[missionId];
  const mode = mp.mode;
  const totalSteps = mission.steps.length;
  const stepPct = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  app.innerHTML = `
    ${renderHeader('parcours')}
    <main class="page">
      <div style="max-width:1400px;margin:0 auto;padding:16px 24px" class="fade-in">
        <!-- Top bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:12px">
            <a href="#/parcours" class="btn btn-ghost btn-sm">← Parcours</a>
            <h2 style="font-size:var(--text-lg);font-weight:700">${mission.meta.title}</h2>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <select id="mode-select" class="btn btn-secondary btn-sm" style="padding:6px 12px;background:var(--bg-tertiary)">
              <option value="decouverte" ${mode === 'decouverte' ? 'selected' : ''}>🌱 Découverte</option>
              <option value="exploratrice" ${mode === 'exploratrice' ? 'selected' : ''}>🔍 Exploratrice</option>
              <option value="experte" ${mode === 'experte' ? 'selected' : ''}>⚡ Experte</option>
            </select>
            <span class="t-xs dim bold">Étape ${currentStepIndex + 1}/${totalSteps}</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="progress-bar" style="margin-bottom:20px;height:5px;border-radius:5px">
          <div class="progress-bar-fill" style="width:${stepPct}%"></div>
        </div>

        ${renderStepContent(step, mode, missionId)}
      </div>
    </main>
  `;

  bindHeaderEvents();
  bindMissionEvents(missionId);
  bindPlotExport(() => `datalab-${slugify(mission.meta.title)}-${slugify(step.title)}`);
  bindEngineBoot();

  if (step.type === 'code' || step.type === 'challenge') {
    const container = document.getElementById('cm-editor-container');
    if (container) {
      const code = editorContent || step.code?.[mode as keyof typeof step.code] || step.code?.decouverte || '';
      if (!editorContent) editorContent = code;
      createCodeEditor(
        container,
        code,
        (c) => { editorContent = c; },
        () => { document.getElementById('btn-run')?.click(); }
      );
    }
    if ((mp.validatedSteps || []).includes(currentStepIndex)) {
      renderValidationFeedback({ ok: true, message: 'Tu as déjà réussi cette étape. Tu peux la relancer ou passer à la suite.' });
      const explanation = document.getElementById('explanation');
      if (explanation) explanation.style.display = 'block';
    }
  }
}

function renderStepContent(step: MissionStep, mode: string, missionId: string): string {
  const contentHtml = markdownLite(step.content);

  if (step.type === 'code' || step.type === 'challenge') {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-height:500px" class="lab-layout">
        <!-- Left: instructions -->
        <div class="card" style="overflow-y:auto;max-height:70vh">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
            <span style="font-size:var(--text-lg)">${step.type === 'challenge' ? '🏆' : '💻'}</span>
            <h3 style="font-size:var(--text-lg);font-weight:700">${step.title}</h3>
          </div>
          <div class="mission-content" style="font-size:var(--text-sm);line-height:1.7">${contentHtml}</div>
          ${step.hints ? renderHints(step.hints) : ''}
          ${step.explanation ? `<div id="explanation" style="display:none;margin-top:16px;padding:16px;background:var(--accent-light);border-radius:var(--radius-md);border:1px solid rgba(99,102,241,0.1)">
            <strong style="color:var(--accent)">💡 Explication :</strong><br><div style="margin-top:8px;font-size:var(--text-sm);line-height:1.6">${markdownLite(step.explanation)}</div>
          </div>` : ''}
        </div>

        <!-- Right: editor + output -->
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="position:relative;flex:1;min-height:250px;display:flex;flex-direction:column">
            <div style="position:absolute;top:8px;right:8px;z-index:10;display:flex;gap:6px">
              <button class="btn btn-sm btn-ghost" id="btn-reset-code" title="Réinitialiser" style="background:rgba(0,0,0,0.3);color:#aaa;border-radius:6px;font-size:var(--text-xs)">🔄</button>
              <button class="btn btn-sm btn-ghost" id="btn-export-code" title="Exporter" style="background:rgba(0,0,0,0.3);color:#aaa;border-radius:6px;font-size:var(--text-xs)">💾</button>
            </div>
            <div id="cm-editor-container" style="flex:1;display:flex;flex-direction:column"></div>
          </div>
          <div style="display:flex;gap:8px" class="run-bar">
            <button class="btn btn-primary" id="btn-run" style="flex:1">▶️ Exécuter (Ctrl+Entrée)</button>
            <button class="btn btn-secondary" id="btn-stop" style="display:none">⏹️ Stop</button>
          </div>
          ${renderEngineBoot()}
          <div id="engine-status" class="t-xs dim" style="text-align:center"></div>
          <div id="validation-feedback" style="display:none;padding:12px 14px;border-radius:var(--radius-md);border:1px solid transparent"></div>
          <div id="output-area" class="card" style="min-height:120px;max-height:350px;overflow-y:auto;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:13px;white-space:pre-wrap;padding:16px;border:1px solid rgba(255,255,255,0.04)">
            <span style="color:var(--text-tertiary)">Les résultats apparaîtront ici…</span>
          </div>
          ${renderPlotArea()}
        </div>
      </div>

      <!-- Navigation -->
      <div style="display:flex;justify-content:space-between;margin-top:20px;padding-bottom:40px">
        <button class="btn btn-ghost" id="btn-prev" ${currentStepIndex === 0 ? 'disabled style="opacity:0.3"' : ''}>← Précédent</button>
        <button class="btn btn-primary" id="btn-next">Suivant →</button>
      </div>
    `;
  }

  // Non-code steps
  const icons: Record<string, string> = { intro: '🚀', hypothesis: '🤔', learn: '📖', reflect: '💭', complete: '🎉' };
  const icon = icons[step.type] || '📝';

  return `
    <div style="max-width:700px;margin:0 auto" class="slide-up">
      <div class="card" style="padding:36px">
        <div style="font-size:var(--text-2xl);margin-bottom:12px">${icon}</div>
        <h3 style="font-size:var(--text-xl);font-weight:800;margin-bottom:18px;letter-spacing:-0.01em">${step.title}</h3>
        <div class="mission-content" style="font-size:var(--text-md);line-height:1.8;color:var(--text-secondary)">${contentHtml}</div>

        ${step.type === 'hypothesis' ? `
          <textarea id="hypothesis-input" placeholder="Note ton hypothèse ici…"
            style="width:100%;min-height:80px;margin-top:20px;padding:14px;border:1px solid var(--border);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-sm);background:var(--bg-tertiary);color:var(--text-primary);resize:vertical;transition:border-color 0.2s"
          >${escapeHtml(loadProgress().missions[missionId]?.hypothesisText || '')}</textarea>
        ` : ''}

        ${step.type === 'reflect' ? renderHypothesisRecall(missionId) : ''}
        ${step.type === 'complete' ? renderCompletionPanel(missionId) : ''}
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px;padding-bottom:40px">
        <button class="btn btn-ghost" id="btn-prev" ${currentStepIndex === 0 ? 'disabled style="opacity:0.3"' : ''}>← Précédent</button>
        ${step.type !== 'complete' ? `<button class="btn btn-primary" id="btn-next">Suivant →</button>` : ''}
      </div>
    </div>
  `;
}

interface ValidationOutcome {
  ok: boolean;
  message: string;
}

// Experte steps are open-ended canvases, so demanding an exact output string
// there would be wrong — producing a working result is the bar instead.
function checkValidation(
  step: MissionStep,
  result: { stdout: string; error: string | null; plot: string | null },
  mode: string,
): ValidationOutcome | null {
  if (!step.validation) return null;
  if (result.error) {
    return { ok: false, message: 'Ton code s\'est arrêté sur une erreur. Lis le message ci-dessus — il dit souvent exactement quelle ligne pose problème.' };
  }

  const produced = result.stdout.trim().length > 0 || !!result.plot;

  if (mode === 'experte' || step.validation.type === 'no-error') {
    return produced
      ? { ok: true, message: 'Ton code tourne sans erreur et produit un résultat.' }
      : { ok: false, message: 'Ton code tourne, mais il n\'affiche rien. Ajoute un print() ou un graphique pour voir ce qu\'il fait.' };
  }

  const expected = step.validation.expected || '';
  if (step.validation.type === 'output-contains') {
    const ok = result.stdout.toLowerCase().includes(expected.toLowerCase());
    return ok
      ? { ok: true, message: 'Le résultat attendu est bien là.' }
      : { ok: false, message: `Ton code tourne, mais sa sortie ne contient pas encore « ${expected} ». Regarde les indices si tu bloques.` };
  }
  if (step.validation.type === 'output-matches') {
    let ok = false;
    try { ok = new RegExp(expected).test(result.stdout); } catch { ok = false; }
    return ok
      ? { ok: true, message: 'Le résultat attendu est bien là.' }
      : { ok: false, message: 'Ton code tourne, mais le résultat n\'a pas encore la forme attendue.' };
  }
  return null;
}

function codeStepIndexes(): number[] {
  if (!currentMission) return [];
  return currentMission.steps
    .map((s, i) => (s.type === 'code' || s.type === 'challenge' ? i : -1))
    .filter(i => i >= 0);
}

function renderValidationFeedback(outcome: ValidationOutcome | null): void {
  const el = document.getElementById('validation-feedback');
  if (!el) return;
  if (!outcome) { el.style.display = 'none'; return; }
  const color = outcome.ok ? 'var(--success)' : 'var(--warning)';
  const bg = outcome.ok ? 'var(--success-light)' : 'var(--warning-light)';
  el.style.display = 'block';
  el.style.background = bg;
  el.style.borderColor = color;
  el.innerHTML = `<span style="color:${color};font-weight:700">${outcome.ok ? '✅ Étape réussie' : '🔸 Pas encore'}</span>
    <div style="margin-top:4px;font-size:var(--text-sm);color:var(--text-secondary)">${escapeHtml(outcome.message)}</div>`;
}

// She writes a prediction at the start of every mission; without this it was
// stored and never shown again, so the hypothesis never got confronted.
function renderHypothesisRecall(missionId: string): string {
  const mp = loadProgress().missions[missionId];
  const texte = (mp?.hypothesisText || '').trim();
  if (!texte) return '';
  const etape = currentMission?.steps.find(s => s.type === 'hypothesis');
  return `
    <div style="margin-top:26px;padding:18px 20px;border-radius:var(--radius-md);
                background:var(--accent-light);border:1px solid rgba(99,102,241,0.15)">
      <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;
                  letter-spacing:0.06em;color:var(--accent);margin-bottom:8px">
        🤔 Ce que tu avais prédit au début
      </div>
      ${etape ? `<div style="font-size:var(--text-sm);color:var(--text-tertiary);margin-bottom:8px">${escapeHtml(etape.title)}</div>` : ''}
      <blockquote style="margin:0;padding-left:12px;border-left:3px solid var(--accent);
                         font-size:var(--text-sm);line-height:1.7;white-space:pre-wrap">${escapeHtml(texte)}</blockquote>
      <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:12px">
        Avais-tu vu juste ? Qu'est-ce qui t'a le plus surprise ?
      </div>
    </div>
  `;
}

function renderCompletionPanel(missionId: string): string {
  const mission = currentMission!;
  const mp = loadProgress().missions[missionId];
  const done = new Set(mp?.validatedSteps || []);
  const codeSteps = codeStepIndexes();
  const remaining = codeSteps.filter(i => !done.has(i));
  const badge = mission.meta.badge;

  const checklist = codeSteps.map(i => {
    const ok = done.has(i);
    return `<li style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:var(--text-sm);${ok ? '' : 'color:var(--text-tertiary)'}">
      <span>${ok ? '✅' : '⬜'}</span>
      <span style="${ok ? '' : 'cursor:pointer;text-decoration:underline dotted'}" ${ok ? '' : `data-goto="${i}"`}>${escapeHtml(mission.steps[i].title)}</span>
    </li>`;
  }).join('');

  return `
    <div style="margin-top:26px;padding:20px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
      <div style="font-size:var(--text-sm);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:10px">
        Étapes de code — ${codeSteps.length - remaining.length}/${codeSteps.length} réussies
      </div>
      <ul style="list-style:none">${checklist}</ul>
    </div>

    <div style="text-align:center;margin-top:24px">
      ${remaining.length === 0 ? `
        <button class="btn btn-primary hero-cta" id="btn-complete" data-full="1">
          🎉 Terminer la mission
        </button>
        <div style="font-size:var(--text-sm);color:var(--text-tertiary);margin-top:10px">
          +${mission.meta.xp} XP${badge ? ` et le badge 🏅 ${escapeHtml(badge)}` : ''}
        </div>
      ` : `
        <button class="btn btn-primary hero-cta" id="btn-goto-remaining" data-goto="${remaining[0]}">
          ▶️ Reprendre : ${escapeHtml(mission.steps[remaining[0]].title)}
        </button>
        <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:14px;line-height:1.6">
          Il te reste <strong>${remaining.length} étape${remaining.length > 1 ? 's' : ''}</strong> à faire tourner.
          ${badge ? `Le badge 🏅 ${escapeHtml(badge)} se débloque quand tout est réussi.` : ''}
        </div>
        <button class="btn btn-ghost btn-sm" id="btn-complete" data-full="0" style="margin-top:10px">
          Terminer quand même (+${Math.round(mission.meta.xp / 2)} XP, sans le badge)
        </button>
      `}
    </div>
  `;
}

function renderHints(hints: string[]): string {
  return `
    <div style="margin-top:18px">
      ${hints.map((hint, i) => `
        <details style="margin-bottom:8px">
          <summary style="cursor:pointer;color:var(--accent);font-weight:600;font-size:var(--text-sm);padding:8px 0;transition:color 0.2s">
            💡 Indice ${i + 1}
          </summary>
          <div style="padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-md);font-size:var(--text-sm);margin-top:4px;white-space:pre-wrap;line-height:1.6">${escapeHtml(hint)}</div>
        </details>
      `).join('')}
    </div>
  `;
}

function bindMissionEvents(missionId: string): void {
  const progress = loadProgress();
  const mp = progress.missions[missionId];

  document.getElementById('mode-select')?.addEventListener('change', (e) => {
    const newMode = (e.target as HTMLSelectElement).value as 'decouverte' | 'exploratrice' | 'experte';
    mp.mode = newMode;
    editorContent = '';
    saveProgress(progress);
    renderCurrentStep(missionId);
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      saveCurrentCode(missionId);
      currentStepIndex--;
      editorContent = '';
      renderCurrentStep(missionId);
    }
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (currentMission && currentStepIndex < currentMission.steps.length - 1) {
      saveCurrentCode(missionId);
      currentStepIndex++;
      editorContent = '';
      renderCurrentStep(missionId);
    }
  });

  // Run
  document.getElementById('btn-run')?.addEventListener('click', async () => {
    const code = getEditorCode();
    const output = document.getElementById('output-area')!;
    const btnRun = document.getElementById('btn-run') as HTMLButtonElement;
    const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;

    output.innerHTML = '<span style="color:var(--accent)">⏳ Chargement de Python…</span>';
    hidePlot();
    btnRun.style.display = 'none';
    btnStop.style.display = 'inline-flex';

    try {
      await initEngine();
      output.innerHTML = '<span style="color:var(--accent)">▶️ Exécution en cours…</span>';
      const result = await runPython(code, datasets);

      let html = '';
      if (result.error) {
        html = `<span style="color:var(--error)">❌ Erreur :\n${escapeHtml(result.error)}</span>`;
      } else {
        if (result.stdout) html += escapeHtml(result.stdout);
        if (result.stderr) html += `\n<span style="color:var(--warning)">${escapeHtml(result.stderr)}</span>`;
        if (!result.stdout && !result.stderr) html = '<span style="color:var(--text-tertiary)">✅ Code exécuté (aucune sortie)</span>';
      }
      output.innerHTML = html;

      if (result.plot) showPlot(result.plot);

      editorContent = code;
      saveCurrentCode(missionId);
      mp.attempts++;

      const step = currentMission!.steps[currentStepIndex];
      const outcome = checkValidation(step, result, mp.mode);
      renderValidationFeedback(outcome);
      if (outcome?.ok) {
        const done = new Set(mp.validatedSteps || []);
        done.add(currentStepIndex);
        mp.validatedSteps = [...done].sort((a, b) => a - b);
        const explanation = document.getElementById('explanation');
        if (explanation) explanation.style.display = 'block';
      }
      saveProgress(progress);
    } catch (err) {
      output.innerHTML = `<span style="color:var(--error)">❌ ${escapeHtml(String(err))}</span>`;
    }

    btnRun.style.display = 'inline-flex';
    btnStop.style.display = 'none';
  });

  document.getElementById('btn-stop')?.addEventListener('click', () => {
    resetEngine();
    document.getElementById('output-area')!.innerHTML = '<span style="color:var(--warning)">⏹️ Exécution arrêtée.</span>';
    (document.getElementById('btn-run') as HTMLButtonElement).style.display = 'inline-flex';
    (document.getElementById('btn-stop') as HTMLButtonElement).style.display = 'none';
  });

  document.getElementById('btn-reset-code')?.addEventListener('click', () => {
    if (confirm('Réinitialiser le code ?')) {
      const step = currentMission!.steps[currentStepIndex];
      const mode = mp.mode;
      const code = step.code?.[mode as keyof typeof step.code] || step.code?.decouverte || '';
      editorContent = code;
      setEditorCode(code);
    }
  });

  document.getElementById('btn-export-code')?.addEventListener('click', () => {
    const code = getEditorCode();
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${missionId}-code.py`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-complete')?.addEventListener('click', (e) => {
    const mission = currentMission!;
    const full = (e.currentTarget as HTMLElement).dataset.full === '1';
    mp.status = 'completed';
    mp.completedAt = Date.now();
    addXP(progress, full ? mission.meta.xp : Math.round(mission.meta.xp / 2));
    if (full && mission.meta.badge) addBadge(progress, mission.meta.badge);
    unlockNextMission(progress, missionId);
    saveProgress(progress);
    location.hash = '#/parcours';
  });

  // Jump back to a code step that hasn't been completed yet
  document.querySelectorAll<HTMLElement>('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const target = Number(el.dataset.goto);
      if (!Number.isNaN(target)) {
        saveCurrentCode(missionId);
        currentStepIndex = target;
        editorContent = '';
        renderCurrentStep(missionId);
      }
    });
  });

  document.getElementById('hypothesis-input')?.addEventListener('input', (e) => {
    mp.hypothesisText = (e.target as HTMLTextAreaElement).value;
    saveProgress(progress);
  });

  onStatusChange((s) => {
    const el = document.getElementById('engine-status');
    if (!el) return;
    const labels: Record<string, string> = {
      idle: '',
      loading: '⏳ Chargement de Python…',
      ready: '✅ Python prêt (Ctrl+Entrée pour exécuter)',
      running: '▶️ Exécution…',
      error: '⚠️ Erreur du moteur',
    };
    el.textContent = labels[s] || '';
  });
}

function saveCurrentCode(missionId: string): void {
  const progress = loadProgress();
  const mp = progress.missions[missionId];
  if (mp && editorContent) {
    mp.code = editorContent;
    saveProgress(progress);
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markdownLite(text: string): string {
  const out = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:var(--bg-code);color:var(--text-on-dark);padding:12px;border-radius:var(--radius-md);overflow-x:auto;font-size:var(--text-sm);margin:8px 0"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-size:0.88em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li style="margin-left:16px">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');
  return injectFigures(out);
}
