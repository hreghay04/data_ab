import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { indentOnInput, bracketMatching, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

let activeView: EditorView | null = null;

export function createCodeEditor(
  container: HTMLElement,
  initialCode: string,
  onChange?: (code: string) => void,
  onRun?: () => void
): EditorView {
  if (activeView) {
    activeView.destroy();
    activeView = null;
  }

  const runKeymap = onRun ? keymap.of([{
    key: 'Mod-Enter',
    run: () => { onRun(); return true; }
  }]) : keymap.of([]);

  const updateListener = onChange ? EditorView.updateListener.of((update) => {
    if (update.docChanged) onChange(update.state.doc.toString());
  }) : [];

  const view = new EditorView({
    state: EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        python(),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        runKeymap,
        updateListener,
        EditorView.theme({
          '&': { height: '100%', minHeight: '250px' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    }),
    parent: container,
  });

  activeView = view;
  return view;
}

export function getEditorCode(): string {
  return activeView?.state.doc.toString() || '';
}

export function setEditorCode(code: string): void {
  if (!activeView) return;
  activeView.dispatch({
    changes: { from: 0, to: activeView.state.doc.length, insert: code }
  });
}

export function destroyEditor(): void {
  if (activeView) {
    activeView.destroy();
    activeView = null;
  }
}
