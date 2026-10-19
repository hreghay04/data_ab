let pyodide = null;

async function initPyodide() {
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
  });
  await pyodide.loadPackage(['pandas', 'numpy', 'matplotlib']);

  // Suppress warnings and setup matplotlib
  await pyodide.runPythonAsync(`
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*Pyarrow.*")
warnings.filterwarnings("ignore", message=".*agg.*")

import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import io, base64

# Charts are shown on a dark panel and exported as-is. Without this, matplotlib
# draws a white plot area and black titles on the dark figure background, which
# leaves titles and axis labels nearly unreadable.
plt.rcParams.update({
    'figure.facecolor': '#1e1e2e',
    'figure.edgecolor': '#1e1e2e',
    'savefig.facecolor': '#1e1e2e',
    'axes.facecolor': '#1e1e2e',
    'axes.edgecolor': '#3a3a55',
    'axes.labelcolor': '#e8e8f0',
    'axes.titlecolor': '#ffffff',
    'text.color': '#e8e8f0',
    'xtick.color': '#a0a0c0',
    'ytick.color': '#a0a0c0',
    'grid.color': '#2f2f4a',
    'legend.facecolor': '#252540',
    'legend.edgecolor': '#3a3a55',
})

# Override plt.show to silently do nothing (plots are captured separately)
_original_show = plt.show
def _silent_show(*args, **kwargs):
    pass
plt.show = _silent_show

def _datalab_show_plot():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight',
                facecolor='#1e1e2e', edgecolor='none')
    buf.seek(0)
    img = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close('all')
    return img
  `);

  postMessage({ type: 'ready' });
}

let sklearnLoaded = false;

async function runCode(code, datasets) {
  if (!pyodide) {
    postMessage({ type: 'error', error: 'Pyodide non initialisé' });
    return;
  }

  // scikit-learn is ~8MB — load it only when the code actually needs it
  if (!sklearnLoaded && /\bsklearn\b|\bscikit-learn\b/.test(code)) {
    postMessage({ type: 'loading-package', name: 'scikit-learn' });
    await pyodide.loadPackage('scikit-learn');
    sklearnLoaded = true;
  }

  // Load datasets into pyodide filesystem
  if (datasets) {
    for (const [name, content] of Object.entries(datasets)) {
      pyodide.FS.writeFile(`/home/pyodide/${name}`, content);
    }
  }

  // Suppress warnings and capture stdout/stderr
  await pyodide.runPythonAsync(`
import sys, io, warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*Pyarrow.*")
warnings.filterwarnings("ignore", message=".*agg.*")
_stdout = io.StringIO()
_stderr = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
  `);

  try {
    await pyodide.runPythonAsync(code);

    const stdout = pyodide.runPython('_stdout.getvalue()');
    const stderr = pyodide.runPython('_stderr.getvalue()');

    // Check if there are plots
    let plot = null;
    const hasFigures = pyodide.runPython('len(plt.get_fignums()) > 0');
    if (hasFigures) {
      plot = pyodide.runPython('_datalab_show_plot()');
    }

    // Reset stdout/stderr
    await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `);

    postMessage({ type: 'result', stdout, stderr, plot });
  } catch (err) {
    await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `);

    let errorMsg = err.message || String(err);
    // Clean up pyodide error traces for readability
    const lines = errorMsg.split('\n');
    const userLines = lines.filter(l =>
      !l.includes('pyodide') && !l.includes('wasm') && !l.includes('Module.')
    );
    if (userLines.length > 0) errorMsg = userLines.join('\n');

    postMessage({ type: 'error', error: errorMsg });
  }
}

self.onmessage = async (e) => {
  const { type, code, datasets } = e.data;
  if (type === 'init') {
    try {
      await initPyodide();
    } catch (err) {
      postMessage({ type: 'error', error: 'Impossible de charger Pyodide : ' + err.message });
    }
  } else if (type === 'run') {
    await runCode(code, datasets);
  } else if (type === 'reset') {
    // Reload pyodide
    pyodide = null;
    sklearnLoaded = false;
    await initPyodide();
  }
};
