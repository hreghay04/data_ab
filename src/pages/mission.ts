import { renderHeader, bindHeaderEvents } from '../components/header';
import { loadProgress, saveProgress, addXP, addBadge, unlockNextMission } from '../utils/storage';
import { loadMission, loadDataset } from '../missions/index';
import type { MissionData, MissionStep } from '../missions/index';
import { initEngine, runPython, onStatusChange, getStatus, resetEngine } from '../engine/python-engine';

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
        <h1>🔒 Mission verrouillée</h1>
        <p style="color:var(--text-secondary);margin:16px 0">Termine les missions précédentes pour débloquer celle-ci.</p>
        <a href="#/parcours" class="btn btn-primary">Retour au parcours</a>
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
        <a href="#/parcours" class="btn btn-primary">Retour au parcours</a>
      </div></main>
    `;
    bindHeaderEvents();
    return;
  }

  // Mark as in-progress
  if (mp.status === 'available') {
    mp.status = 'in-progress';
    saveProgress(progress);
  }

  // Load datasets
  if (currentMission.meta.dataset) {
    try {
      const content = await loadDataset(currentMission.meta.dataset);
      datasets[currentMission.meta.dataset] = content;
    } catch { /* dataset load error — will show in execution */ }
  }
  // Load additional datasets that missions may reference
  const allDatasets = ['kpop.csv', 'tennis.csv', 'chats.csv'];
  for (const ds of allDatasets) {
    if (!datasets[ds]) {
      try { datasets[ds] = await loadDataset(ds); } catch {}
    }
  }

  // Restore saved step or start from 0
  currentStepIndex = 0;
  editorContent = mp.code || '';

  renderCurrentStep(id);
}

function renderCurrentStep(missionId: string): void {
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
      <div style="max-width:1400px;margin:0 auto;padding:16px 24px">
        <!-- Top bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:12px">
            <a href="#/parcours" class="btn btn-ghost btn-sm">← Parcours</a>
            <h2 style="font-size:1.1rem;font-weight:700">${mission.meta.title}</h2>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <select id="mode-select" class="btn btn-secondary btn-sm" style="padding:6px 10px">
              <option value="decouverte" ${mode === 'decouverte' ? 'selected' : ''}>🌱 Découverte</option>
              <option value="exploratrice" ${mode === 'exploratrice' ? 'selected' : ''}>🔍 Exploratrice</option>
              <option value="experte" ${mode === 'experte' ? 'selected' : ''}>⚡ Experte</option>
            </select>
            <span style="font-size:0.8rem;color:var(--text-tertiary)">Étape ${currentStepIndex + 1}/${totalSteps}</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="progress-bar" style="margin-bottom:20px;height:6px">
          <div class="progress-bar-fill" style="width:${stepPct}%"></div>
        </div>

        ${renderStepContent(step, mode, missionId)}
      </div>
    </main>
  `;

  bindHeaderEvents();
  bindMissionEvents(missionId);
}

function renderStepContent(step: MissionStep, mode: string, missionId: string): string {
  const contentHtml = markdownLite(step.content);

  if (step.type === 'code' || step.type === 'challenge') {
    const code = step.code?.[mode as keyof typeof step.code] || step.code?.decouverte || '';
    if (!editorContent) editorContent = code;

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-height:500px" class="lab-layout">
        <!-- Left: instructions -->
        <div class="card" style="overflow-y:auto;max-height:70vh">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:12px">${step.title}</h3>
          <div class="mission-content">${contentHtml}</div>
          ${step.hints ? renderHints(step.hints) : ''}
          ${step.explanation ? `<div id="explanation" style="display:none;margin-top:16px;padding:16px;background:var(--accent-light);border-radius:var(--radius-md)">
            <strong>💡 Explication :</strong><br>${markdownLite(step.explanation)}
          </div>` : ''}
        </div>

        <!-- Right: editor + output -->
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="position:relative;flex:1;min-height:250px">
            <div style="position:absolute;top:8px;right:8px;z-index:5;display:flex;gap:6px">
              <button class="btn btn-sm btn-ghost" id="btn-reset-code" title="Réinitialiser le code">🔄</button>
              <button class="btn btn-sm btn-ghost" id="btn-export-code" title="Exporter en .py">💾</button>
            </div>
            <textarea id="code-editor"
              style="width:100%;height:100%;min-height:250px;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:14px;padding:16px;border:1px solid var(--border);border-radius:var(--radius-md);resize:vertical;tab-size:4;line-height:1.5"
              spellcheck="false">${escapeHtml(editorContent)}</textarea>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" id="btn-run" style="flex:1">▶️ Exécuter</button>
            <button class="btn btn-secondary" id="btn-stop" style="display:none">⏹️ Arrêter</button>
          </div>
          <div id="engine-status" style="font-size:0.8rem;color:var(--text-tertiary);text-align:center"></div>
          <div id="output-area" class="card" style="min-height:150px;max-height:400px;overflow-y:auto;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:13px;white-space:pre-wrap;padding:16px">
            <span style="color:var(--text-tertiary)">Les résultats apparaîtront ici après exécution…</span>
          </div>
          <div id="plot-area" style="display:none">
            <img id="plot-img" style="max-width:100%;border-radius:var(--radius-md);border:1px solid var(--border)" />
          </div>
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
  return `
    <div style="max-width:700px;margin:0 auto">
      <div class="card" style="padding:32px">
        <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:16px">${step.title}</h3>
        <div class="mission-content" style="font-size:1rem;line-height:1.8">${contentHtml}</div>

        ${step.type === 'hypothesis' ? `
          <textarea id="hypothesis-input" placeholder="Note ton hypothèse ici…"
            style="width:100%;min-height:80px;margin-top:16px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:0.95rem;background:var(--bg-tertiary);color:var(--text-primary);resize:vertical"
          >${escapeHtml(loadProgress().missions[missionId]?.hypothesisText || '')}</textarea>
        ` : ''}

        ${step.type === 'complete' ? `
          <div style="text-align:center;margin-top:24px">
            <button class="btn btn-primary" id="btn-complete" style="font-size:1.1rem;padding:16px 40px">
              🎉 Terminer la mission
            </button>
          </div>
        ` : ''}
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px;padding-bottom:40px">
        <button class="btn btn-ghost" id="btn-prev" ${currentStepIndex === 0 ? 'disabled style="opacity:0.3"' : ''}>← Précédent</button>
        ${step.type !== 'complete' ? `<button class="btn btn-primary" id="btn-next">Suivant →</button>` : ''}
      </div>
    </div>
  `;
}

function renderHints(hints: string[]): string {
  return `
    <div style="margin-top:16px">
      ${hints.map((hint, i) => `
        <details style="margin-bottom:8px">
          <summary style="cursor:pointer;color:var(--accent);font-weight:600;font-size:0.9rem;padding:8px 0">
            💡 Indice ${i + 1}
          </summary>
          <div style="padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-md);font-size:0.9rem;margin-top:4px;white-space:pre-wrap">${escapeHtml(hint)}</div>
        </details>
      `).join('')}
    </div>
  `;
}

function bindMissionEvents(missionId: string): void {
  const progress = loadProgress();
  const mp = progress.missions[missionId];

  // Mode select
  document.getElementById('mode-select')?.addEventListener('change', (e) => {
    const newMode = (e.target as HTMLSelectElement).value as 'decouverte' | 'exploratrice' | 'experte';
    mp.mode = newMode;
    editorContent = '';
    saveProgress(progress);
    renderCurrentStep(missionId);
  });

  // Navigation
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

  // Code editor
  const editor = document.getElementById('code-editor') as HTMLTextAreaElement;
  if (editor) {
    editor.addEventListener('input', () => { editorContent = editor.value; });
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        editorContent = editor.value;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-run')?.click();
      }
    });
  }

  // Run
  document.getElementById('btn-run')?.addEventListener('click', async () => {
    const code = (document.getElementById('code-editor') as HTMLTextAreaElement)?.value || '';
    const output = document.getElementById('output-area')!;
    const plotArea = document.getElementById('plot-area')!;
    const plotImg = document.getElementById('plot-img') as HTMLImageElement;
    const btnRun = document.getElementById('btn-run') as HTMLButtonElement;
    const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;

    output.innerHTML = '<span style="color:var(--accent)">⏳ Chargement de Python…</span>';
    plotArea.style.display = 'none';
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

      if (result.plot) {
        plotArea.style.display = 'block';
        plotImg.src = `data:image/png;base64,${result.plot}`;
      }

      // Save code
      editorContent = code;
      saveCurrentCode(missionId);
      mp.attempts++;
      saveProgress(progress);

    } catch (err) {
      output.innerHTML = `<span style="color:var(--error)">❌ ${escapeHtml(String(err))}</span>`;
    }

    btnRun.style.display = 'inline-flex';
    btnStop.style.display = 'none';
  });

  // Stop
  document.getElementById('btn-stop')?.addEventListener('click', () => {
    resetEngine();
    document.getElementById('output-area')!.innerHTML = '<span style="color:var(--warning)">⏹️ Exécution arrêtée. Le moteur Python va redémarrer.</span>';
    const btnRun = document.getElementById('btn-run') as HTMLButtonElement;
    const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;
    btnRun.style.display = 'inline-flex';
    btnStop.style.display = 'none';
  });

  // Reset code
  document.getElementById('btn-reset-code')?.addEventListener('click', () => {
    if (confirm('Réinitialiser le code ? Tu perdras tes modifications sur cette étape.')) {
      const step = currentMission!.steps[currentStepIndex];
      const mode = mp.mode;
      const code = step.code?.[mode as keyof typeof step.code] || step.code?.decouverte || '';
      editorContent = code;
      const editor = document.getElementById('code-editor') as HTMLTextAreaElement;
      if (editor) editor.value = code;
    }
  });

  // Export code
  document.getElementById('btn-export-code')?.addEventListener('click', () => {
    const code = (document.getElementById('code-editor') as HTMLTextAreaElement)?.value || '';
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${missionId}-code.py`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Complete mission
  document.getElementById('btn-complete')?.addEventListener('click', () => {
    const mission = currentMission!;
    mp.status = 'completed';
    mp.completedAt = Date.now();
    addXP(progress, mission.meta.xp);
    if (mission.meta.badge) addBadge(progress, mission.meta.badge);
    unlockNextMission(progress, missionId);
    saveProgress(progress);
    location.hash = '#/parcours';
  });

  // Hypothesis save
  document.getElementById('hypothesis-input')?.addEventListener('input', (e) => {
    mp.hypothesisText = (e.target as HTMLTextAreaElement).value;
    saveProgress(progress);
  });

  // Engine status
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
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:var(--bg-code);color:var(--text-on-dark);padding:12px;border-radius:var(--radius-md);overflow-x:auto;font-size:0.85rem;margin:8px 0"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li style="margin-left:16px">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');
}
