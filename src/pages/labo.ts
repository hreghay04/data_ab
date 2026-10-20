import { renderHeader, bindHeaderEvents } from '../components/header';
import { initEngine, runPython, onStatusChange, resetEngine, preloadEngine } from '../engine/python-engine';
import { loadDataset } from '../missions/index';
import { createCodeEditor, getEditorCode, setEditorCode, destroyEditor } from '../components/code-editor';
import { renderPlotArea, showPlot, hidePlot, bindPlotExport } from '../components/plot-export';
import { renderEngineBoot, bindEngineBoot } from '../components/engine-boot';

let datasets: Record<string, string> = {};

const DEFAULT_CODE = `import pandas as pd
import matplotlib.pyplot as plt

# Datasets : kpop, tennis, chats, mangas, metiers, candidats, pokemon
df = pd.read_csv("kpop.csv")

# Explore !
print(df.head())
print(f"\\n{df.shape[0]} lignes, {df.shape[1]} colonnes")`;

const EXAMPLE_CODE = `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

# Streams moyens par groupe K-pop
streams = df.groupby('groupe')['streams_millions'].mean().sort_values()

plt.figure(figsize=(9, 7))
colors = ['#ff6b9d' if g in ['BLACKPINK','NewJeans','IVE','aespa','G-IDLE','LE SSERAFIM','NMIXX','IZ*ONE'] else '#6366f1' for g in streams.index]
plt.barh(streams.index, streams.values, color=colors)
plt.xlabel('Streams moyens (millions)')
plt.title('Classement K-pop par streams')
plt.tight_layout()
plt.show()`;

export async function renderLabo(): Promise<void> {
  destroyEditor();
  const app = document.getElementById('app')!;

  for (const name of ['kpop.csv', 'tennis.csv', 'chats.csv', 'mangas.csv', 'metiers.csv', 'candidats.csv', 'pokemon.csv']) {
    try { datasets[name] = await loadDataset(name); } catch {}
  }

  app.innerHTML = `
    ${renderHeader('labo')}
    <main class="page">
      <div style="max-width:1400px;margin:0 auto;padding:16px 24px" class="fade-in">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
          <div>
            <h1 style="font-size:var(--text-xl);font-weight:800;letter-spacing:-0.01em">🧪 Laboratoire Python</h1>
            <p class="t-sm muted">Expérimente librement avec Python, pandas et matplotlib</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" id="btn-example">📋 Exemples</button>
            <button class="btn btn-ghost btn-sm" id="btn-export-py">💾 Exporter .py</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-height:70vh" class="lab-layout">
          <!-- Left: editor -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:4px;display:flex;gap:8px;flex-wrap:wrap">
              📂 Datasets :
              <code style="background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;font-size:var(--text-xs)">kpop.csv</code>
              <code style="background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;font-size:var(--text-xs)">tennis.csv</code>
              <code style="background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;font-size:var(--text-xs)">chats.csv</code>
              <code style="background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;font-size:var(--text-xs)">mangas.csv</code>
              <code style="background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;font-size:var(--text-xs)">pokemon.csv</code>
            </div>
            <div id="cm-labo-container" style="flex:1;min-height:400px;display:flex;flex-direction:column"></div>
            <div style="display:flex;gap:8px" class="run-bar">
              <button class="btn btn-primary" id="btn-run" style="flex:1">▶️ Exécuter (Ctrl+Entrée)</button>
              <button class="btn btn-secondary" id="btn-reset">🔄 Réinitialiser</button>
            </div>
            ${renderEngineBoot()}
            <div id="engine-status" class="t-xs dim" style="text-align:center"></div>
          </div>

          <!-- Right: output -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <div id="output-area" class="card" style="flex:1;min-height:300px;max-height:50vh;overflow-y:auto;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:13px;white-space:pre-wrap;padding:16px;border:1px solid rgba(255,255,255,0.04)">
              <span style="color:var(--text-tertiary)">Les résultats apparaîtront ici…</span>
            </div>
            ${renderPlotArea()}
          </div>
        </div>
      </div>
    </main>
  `;

  bindHeaderEvents();

  const container = document.getElementById('cm-labo-container');
  if (container) {
    createCodeEditor(
      container,
      DEFAULT_CODE,
      undefined,
      () => { document.getElementById('btn-run')?.click(); }
    );
  }

  bindLaboEvents();
  bindPlotExport(() => 'datalab-labo-graphique');
  bindEngineBoot();
  preloadEngine();
}

function bindLaboEvents(): void {
  document.getElementById('btn-run')?.addEventListener('click', async () => {
    const code = getEditorCode();
    const output = document.getElementById('output-area')!;

    output.innerHTML = '<span style="color:var(--accent)">⏳ Chargement de Python…</span>';
    hidePlot();

    try {
      await initEngine();
      output.innerHTML = '<span style="color:var(--accent)">▶️ Exécution…</span>';
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
    } catch (err) {
      output.innerHTML = `<span style="color:var(--error)">❌ ${escapeHtml(String(err))}</span>`;
    }
  });

  document.getElementById('btn-reset')?.addEventListener('click', () => {
    resetEngine();
    document.getElementById('output-area')!.innerHTML = '<span style="color:var(--text-tertiary)">Moteur réinitialisé.</span>';
    hidePlot();
  });

  document.getElementById('btn-export-py')?.addEventListener('click', () => {
    const code = getEditorCode();
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datalab-code.py';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-example')?.addEventListener('click', () => {
    setEditorCode(EXAMPLE_CODE);
  });

  onStatusChange((s) => {
    const el = document.getElementById('engine-status');
    if (!el) return;
    const labels: Record<string, string> = {
      idle: '',
      loading: '⏳ Chargement de Python (première fois : 30 à 60 s)…',
      ready: '✅ Python prêt',
      running: '▶️ Exécution en cours…',
      error: '⚠️ Erreur — clique sur Réinitialiser',
    };
    el.textContent = labels[s] || '';
  });
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
