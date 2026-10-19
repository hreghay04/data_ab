let currentPlotBase64: string | null = null;
let filenameFn: () => string = () => 'graphique';

export function renderPlotArea(): string {
  return `
    <div id="plot-area" style="display:none">
      <img id="plot-img" style="max-width:100%;border-radius:var(--radius-md);border:1px solid var(--border)" />
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" id="btn-plot-download">⬇️ Télécharger l'image</button>
        <button class="btn btn-ghost btn-sm" id="btn-plot-copy">📋 Copier</button>
        <span id="plot-export-msg" style="font-size:0.78rem;color:var(--text-tertiary)"></span>
      </div>
    </div>
  `;
}

export function showPlot(base64: string): void {
  currentPlotBase64 = base64;
  const area = document.getElementById('plot-area');
  const img = document.getElementById('plot-img') as HTMLImageElement | null;
  if (!area || !img) return;
  img.src = `data:image/png;base64,${base64}`;
  area.style.display = 'block';
  setMessage('');
}

export function hidePlot(): void {
  currentPlotBase64 = null;
  const area = document.getElementById('plot-area');
  if (area) area.style.display = 'none';
}

function setMessage(text: string, color = 'var(--text-tertiary)'): void {
  const el = document.getElementById('plot-export-msg');
  if (el) { el.textContent = text; el.style.color = color; }
}

function toBlob(base64: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: 'image/png' });
}

export function bindPlotExport(getFilename: () => string): void {
  filenameFn = getFilename;

  document.getElementById('btn-plot-download')?.addEventListener('click', () => {
    if (!currentPlotBase64) return;
    const url = URL.createObjectURL(toBlob(currentPlotBase64));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameFn()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Image téléchargée ✓', 'var(--success)');
  });

  document.getElementById('btn-plot-copy')?.addEventListener('click', async () => {
    if (!currentPlotBase64) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': toBlob(currentPlotBase64) }),
      ]);
      setMessage('Copié ! Tu peux le coller où tu veux ✓', 'var(--success)');
    } catch {
      setMessage('Copie impossible dans ce navigateur — utilise Télécharger.', 'var(--warning)');
    }
  });
}

// Turns a mission or chart title into a safe, readable file name.
export function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'graphique';
}
