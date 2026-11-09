'use client'

import { Id } from '@/convex/_generated/dataModel'
import { Allotment } from 'allotment'
import { cn } from 'cn'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FileExplorer } from './file-explorer'
import { EditorView } from '@/features/editor/components/editor-view'

const MIN_SIDEBAR_W = 200
const MAX_SIDEBAR_W = 800
const DEFAULT_SIDEBAR_W = 400
const DEFAULT_MAIN_SIZE = 1000

interface Props {
  id: Id<'projects'>
}

export function ProjectIdView({ id }: Props) {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor')

  return (
    <div className='h-full flex flex-col'>
      <nav className='h-8.5 flex items-center bg-sidebar border-b'>
        <Tab
          label='Code'
          isActive={activeView === 'editor'}
          onClick={() => setActiveView('editor')}
        />
        <Tab
          label='Preview'
          isActive={activeView === 'preview'}
          onClick={() => setActiveView('preview')}
        />
        <div className='flex-1 flex justify-end h-full'>
          <div className='flex items-center gap-1.5 h-full px-3 cursor-pointer text-muted-foreground border-l hover:bg-accent/30'>
            <FaGithub className='size-4' />
            <span className='text-sm'>Export</span>
          </div>
        </div>
      </nav>
      <section className='flex-1 relative'>
        <div
          className={cn(
            'absolute inset-0',
            activeView === 'editor' ? 'visible' : 'invisible',
          )}
        >
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_W, DEFAULT_MAIN_SIZE]}>
            <Allotment.Pane
              snap
              minSize={MIN_SIDEBAR_W}
              maxSize={MAX_SIDEBAR_W}
              preferredSize={DEFAULT_SIDEBAR_W}
            >
              <FileExplorer projectId={id} />
            </Allotment.Pane>
            <Allotment.Pane>
              <div className='h-full bg-accent/30'>
                <EditorView projectId={id} />
              </div>
            </Allotment.Pane>
          </Allotment>
        </div>
        <div
          className={cn(
            'absolute inset-0',
            activeView === 'preview' ? 'visible' : 'invisible',
          )}
        >
          <div>Preview</div>
        </div>
      </section>
    </div>
  )
}

// Tab Component:
interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground border-r hover:bg-accent/30',
        isActive && 'bg-background text-foreground',
      )}
    >
      <span className='text-sm'>{label}</span>
    </div>
  )
}
