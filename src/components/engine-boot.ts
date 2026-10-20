import { onProgress, getStatus } from '../engine/python-engine';

let unsubscribe: (() => void) | null = null;

export function renderEngineBoot(): string {
  return `
    <div class="engine-boot" id="engine-boot">
      <div class="engine-boot-label">
        <span id="engine-boot-text">Préparation de Python…</span>
        <strong id="engine-boot-pct">0 %</strong>
      </div>
      <div class="progress-bar" style="height:6px">
        <div class="progress-bar-fill" id="engine-boot-bar" style="width:0%"></div>
      </div>
      <div class="engine-boot-note">
        Python s'installe dans ton navigateur. C'est long la première fois
        (30 à 60 s), puis quasi instantané — ton navigateur le garde en mémoire.
      </div>
    </div>
  `;
}

export function bindEngineBoot(): void {
  // Pages re-render on every step, so drop the previous subscription instead of
  // stacking listeners that write to detached nodes.
  unsubscribe?.();
  unsubscribe = null;

  if (getStatus() === 'ready') return;

  unsubscribe = onProgress((pct, label) => {
    const boite = document.getElementById('engine-boot');
    if (!boite) return;
    if (pct >= 100) {
      boite.classList.remove('visible');
      return;
    }
    boite.classList.add('visible');
    const texte = document.getElementById('engine-boot-text');
    const pourcent = document.getElementById('engine-boot-pct');
    const barre = document.getElementById('engine-boot-bar');
    if (texte) texte.textContent = label;
    if (pourcent) pourcent.textContent = `${pct} %`;
    if (barre) barre.style.width = `${pct}%`;
  });
}
