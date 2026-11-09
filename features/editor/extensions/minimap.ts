import { EditorView } from '@codemirror/view'
import { showMinimap } from '@replit/codemirror-minimap'

const create = (v: EditorView) => {
  const dom = document.createElement('div')
  return { dom }
}

export const minimap = showMinimap.compute(['doc'], (state) => {
  return {
    create,
    gutters: [{ 1: '#00FF00', 2: '#00FF00' }],
  }
})
