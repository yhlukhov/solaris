import { useEffect, useMemo, useRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { getLanguageExtension } from '../extensions/language'
import { customSetup } from '../extensions/custom-setup'
import { oneDark } from '@codemirror/theme-one-dark'
import { indentWithTab } from '@codemirror/commands'
import { customTheme } from '../extensions/theme'
import { minimap } from '../extensions/minimap'

interface Props {
  fileName: string
  initialValue?: string
  onChange: (content:string) => void
}

export function CodeEditor({ fileName, initialValue = '', onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const languageExtention = useMemo(
    () => getLanguageExtension(fileName),
    [fileName],
  )

  useEffect(function buildEditorView() {
    if (!editorRef.current) return
    
    const view = new EditorView({
      doc: initialValue,
      parent: editorRef.current,
      extensions: [
        customSetup,
        oneDark,
        customTheme,
        languageExtention,
        keymap.of([indentWithTab]),
        indentationMarkers(),
        minimap,
        EditorView.updateListener.of((update) => {
          if(update.docChanged) {
            onChange(update.state.doc.toString())
          }
        })
      ],
    })
    viewRef.current = view
    return function unmount() {
      view.destroy()
    }
  }, [languageExtention ])

  return <div ref={editorRef} className='size-full pl-4 bg-background' />
}
