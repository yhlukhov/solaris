import { EditorView } from "@codemirror/view"

export const customTheme = EditorView.theme(
  {
    '&': {
      // height: '100%',
      outline: 'none !important',
    },
    '.cm-content': {
      fontFamily: 'var(--font-plex-mono), monospace',
      fontSize: '14px',
    },
    '.cm-scroller': {
      scrollbarWidth: 'thin',
      scrollbarColor: '#3f3f46 transparent',
    },
    '.cm-minimap-gutter': {
      width: '90px',
      maxWidth: '90px',
      minWidth: '90px',
    },
    '.cm-minimap-gutter canvas': {
      width: '100%',
    },
    '.cm-minimap-overlay': {
      borderRadius: '2px',
    },
  },
  { dark: true },
)