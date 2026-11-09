import { Id } from '@/convex/_generated/dataModel'
import { create } from 'zustand'

interface TabState {
  openTabs: Array<Id<'files'>>
  activeTabId: Id<'files'> | null
  previewTabId: Id<'files'> | null
}

interface EditorStore {
  tabs: Map<Id<'projects'>, TabState>
  getTabState: (projectId: Id<'projects'>) => TabState
  openFile: (
    projectId: Id<'projects'>,
    fileId: Id<'files'>,
    options: { pinned: boolean },
  ) => void
  closeTab: (projectId: Id<'projects'>, fileId: Id<'files'>) => void
  closeAllTabs: (projectId: Id<'projects'>) => void
  setActiveTab: (projectId: Id<'projects'>, fileId: Id<'files'>) => void
}

const defaultTabState: TabState = {
  openTabs: [],
  activeTabId: null,
  previewTabId: null,
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tabs: new Map(),

  getTabState: (projectId) => get().tabs.get(projectId) ?? defaultTabState,

  openFile: (projectId, fileId, { pinned }) => {
    const tabs = new Map(get().tabs)
    const state = tabs.get(projectId) ?? defaultTabState
    const { openTabs, previewTabId } = state
    const isOpen = openTabs.includes(fileId)
    // Add file to preview tab
    if (!isOpen && !pinned) {
      const newTabs = previewTabId
        ? openTabs.map((id) => (id === previewTabId ? fileId : id))
        : [...openTabs, fileId]
      tabs.set(projectId, {
        openTabs: newTabs,
        activeTabId: fileId,
        previewTabId: fileId,
      })
      return set({ tabs })
    }
    // Open file as pinned
    if (!isOpen && pinned) {
      tabs.set(projectId, {
        ...state,
        openTabs: [...openTabs, fileId],
        activeTabId: fileId,
      })
      return set({ tabs })
    }
    // File already open - activate (and pin if double-clicked)
    const shouldPin = pinned && previewTabId === fileId
    tabs.set(projectId, {
      ...state,
      activeTabId: fileId,
      previewTabId: shouldPin ? null : previewTabId,
    })
    set({ tabs })
  },

  closeTab: (projectId, fileId) => {
    const tabs = new Map(get().tabs)
    const state = tabs.get(projectId) ?? defaultTabState
    const { openTabs, activeTabId, previewTabId } = state
    const tabIndex = openTabs.findIndex((id) => id === fileId)
    if (tabIndex === -1) return
    const newTabs = openTabs.filter((id) => id !== fileId)
    // Calculate new active tab id:
    let newActiveTabId = activeTabId
    if (activeTabId === fileId) {
      if (newTabs.length === 0) {
        newActiveTabId = null
      } else if (tabIndex >= newTabs.length) {
        newActiveTabId = newTabs[newTabs.length - 1]
      } else {
        newActiveTabId = newTabs[tabIndex]
      }
    }
    tabs.set(projectId, {
      openTabs: newTabs,
      activeTabId: newActiveTabId,
      previewTabId: fileId === previewTabId ? null : previewTabId,
    })
    set({ tabs })
  },

  closeAllTabs: (projectId) => {
    const tabs = new Map(get().tabs)
    tabs.set(projectId, defaultTabState)
    set({ tabs })
  },
  
  setActiveTab: (projectId, fileId) => {
    const tabs = new Map(get().tabs)
    const state = tabs.get(projectId) ?? defaultTabState
    tabs.set(projectId, {
      ...state,
      activeTabId: fileId,
    })
    set({ tabs })
  },
}))
