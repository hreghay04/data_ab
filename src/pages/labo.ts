import { renderHeader, bindHeaderEvents } from '../components/header';
import { initEngine, runPython, onStatusChange, resetEngine } from '../engine/python-engine';
import { loadDataset } from '../missions/index';

let datasets: Record<string, string> = {};

export async function renderLabo(): Promise<void> {
  const app = document.getElementById('app')!;

  // Preload datasets
  for (const name of ['chansons.csv', 'temperatures.csv']) {
    try { datasets[name] = await loadDataset(name); } catch {}
  }

  app.innerHTML = `
    ${renderHeader('labo')}
    <main class="page">
      <div style="max-width:1400px;margin:0 auto;padding:16px 24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
          <div>
            <h1 style="font-size:1.3rem;font-weight:800">🧪 Laboratoire Python</h1>
            <p style="font-size:0.85rem;color:var(--text-secondary)">Expérimente librement avec Python, pandas et matplotlib</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" id="btn-example">📋 Exemples</button>
            <button class="btn btn-ghost btn-sm" id="btn-export-py">💾 Exporter .py</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-height:70vh" class="lab-layout">
          <!-- Left: editor -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="font-size:0.8rem;color:var(--text-tertiary);margin-bottom:4px">
              📂 Datasets disponibles : <code>chansons.csv</code>, <code>temperatures.csv</code>
            </div>
            <textarea id="code-editor"
              style="flex:1;min-height:400px;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:14px;padding:16px;border:1px solid var(--border);border-radius:var(--radius-md);resize:vertical;tab-size:4;line-height:1.5"
              spellcheck="false">import pandas as pd
import matplotlib.pyplot as plt

# Charge un dataset
df = pd.read_csv("chansons.csv")

# Explore !
print(df.head())
print(f"\\n{df.shape[0]} lignes, {df.shape[1]} colonnes")</textarea>
            <div style="display:flex;gap:8px">
              <button class="btn btn-primary" id="btn-run" style="flex:1">▶️ Exécuter (Ctrl+Entrée)</button>
              <button class="btn btn-secondary" id="btn-reset">🔄 Réinitialiser le moteur</button>
            </div>
            <div id="engine-status" style="font-size:0.8rem;color:var(--text-tertiary);text-align:center"></div>
          </div>

          <!-- Right: output -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <div id="output-area" class="card" style="flex:1;min-height:300px;max-height:50vh;overflow-y:auto;background:var(--bg-code);color:var(--text-on-dark);font-family:var(--font-mono);font-size:13px;white-space:pre-wrap;padding:16px">
              <span style="color:var(--text-tertiary)">Les résultats apparaîtront ici…</span>
            </div>
            <div id="plot-area" style="display:none">
              <img id="plot-img" style="max-width:100%;border-radius:var(--radius-md);border:1px solid var(--border)" />
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  bindHeaderEvents();
  bindLaboEvents();
}

function bindLaboEvents(): void {
  const editor = document.getElementById('code-editor') as HTMLTextAreaElement;

  editor?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('btn-run')?.click();
    }
  });

  document.getElementById('btn-run')?.addEventListener('click', async () => {
    const code = editor?.value || '';
    const output = document.getElementById('output-area')!;
    const plotArea = document.getElementById('plot-area')!;
    const plotImg = document.getElementById('plot-img') as HTMLImageElement;

    output.innerHTML = '<span style="color:var(--accent)">⏳ Chargement de Python…</span>';
    plotArea.style.display = 'none';

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

      if (result.plot) {
        plotArea.style.display = 'block';
        plotImg.src = `data:image/png;base64,${result.plot}`;
      }
    } catch (err) {
      output.innerHTML = `<span style="color:var(--error)">❌ ${escapeHtml(String(err))}</span>`;
    }
  });

  document.getElementById('btn-reset')?.addEventListener('click', () => {
    resetEngine();
    document.getElementById('output-area')!.innerHTML = '<span style="color:var(--text-tertiary)">Moteur réinitialisé. Clique sur Exécuter pour relancer.</span>';
    document.getElementById('plot-area')!.style.display = 'none';
  });

  document.getElementById('btn-export-py')?.addEventListener('click', () => {
    const code = editor?.value || '';
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datalab-code.py';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-example')?.addEventListener('click', () => {
    if (editor) {
      editor.value = `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

# Popularité moyenne par genre
pop = df.groupby('genre')['popularite'].mean().sort_values()

plt.figure(figsize=(8, 5))
plt.barh(pop.index, pop.values, color='#6366f1')
plt.xlabel('Popularité moyenne')
plt.title('Popularité par genre musical')
plt.tight_layout()
plt.show()`;
    }
  });

  onStatusChange((s) => {
    const el = document.getElementById('engine-status');
    if (!el) return;
    const labels: Record<string, string> = {
      idle: '',
      loading: '⏳ Chargement de Python (première fois : ~15 secondes)…',
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
