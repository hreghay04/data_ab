export type EngineStatus = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  plot: string | null;
  error: string | null;
}

type StatusCallback = (status: EngineStatus) => void;

let worker: Worker | null = null;
let status: EngineStatus = 'idle';
let statusListeners: StatusCallback[] = [];
let pendingResolve: ((result: ExecutionResult) => void) | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function setStatus(s: EngineStatus) {
  status = s;
  statusListeners.forEach(fn => fn(s));
}

export function onStatusChange(fn: StatusCallback): () => void {
  statusListeners.push(fn);
  fn(status);
  return () => { statusListeners = statusListeners.filter(f => f !== fn); };
}

export function getStatus(): EngineStatus { return status; }

export function initEngine(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (status === 'ready') { resolve(); return; }
    if (status === 'loading') {
      const unsub = onStatusChange(s => {
        if (s === 'ready') { unsub(); resolve(); }
        if (s === 'error') { unsub(); reject(new Error('Échec du chargement')); }
      });
      return;
    }

    setStatus('loading');
    worker = new Worker(
      new URL('./python-worker.js', import.meta.url),
      { type: 'classic' }
    );

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'ready') {
        setStatus('ready');
        resolve();
      } else if (msg.type === 'result') {
        if (timeoutId) clearTimeout(timeoutId);
        setStatus('ready');
        pendingResolve?.({
          stdout: msg.stdout || '',
          stderr: msg.stderr || '',
          plot: msg.plot || null,
          error: null,
        });
        pendingResolve = null;
      } else if (msg.type === 'error') {
        if (timeoutId) clearTimeout(timeoutId);
        setStatus('ready');
        pendingResolve?.({
          stdout: '',
          stderr: '',
          plot: null,
          error: msg.error,
        });
        pendingResolve = null;
      }
    };

    worker.onerror = () => {
      setStatus('error');
      reject(new Error('Erreur du moteur Python'));
    };

    worker.postMessage({ type: 'init' });
  });
}

export function runPython(code: string, datasets?: Record<string, string>): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    if (!worker || status !== 'ready') {
      reject(new Error('Le moteur Python n\'est pas prêt'));
      return;
    }

    setStatus('running');
    pendingResolve = resolve;

    // 30s timeout
    timeoutId = setTimeout(() => {
      setStatus('error');
      pendingResolve?.({
        stdout: '',
        stderr: '',
        plot: null,
        error: '⏱️ Exécution trop longue (> 30s). Vérifie qu\'il n\'y a pas de boucle infinie.',
      });
      pendingResolve = null;
      resetEngine();
    }, 30000);

    worker.postMessage({ type: 'run', code, datasets });
  });
}

export function resetEngine(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  status = 'idle';
  pendingResolve = null;
  if (timeoutId) clearTimeout(timeoutId);
}

export async function preloadEngine(): Promise<void> {
  if (status === 'idle') {
    try { await initEngine(); } catch { /* silent preload failure */ }
  }
}
