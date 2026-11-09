import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { useEditor } from '../hooks/use-editor'
import { TopNavigation } from './top-navigation'
import { Id } from '@/convex/_generated/dataModel'
import { FileBreadcrumbs } from './file-breadcrumbs'
import { useFile, useUpdateFile } from '@/features/projects/hooks/useFiles'
import { CodeEditor } from './code-editor'
const DEBOUNCE_MS = 4000

export function EditorView({ projectId }: { projectId: Id<'projects'> }) {
  const { activeTabId } = useEditor(projectId)
  const activeFile = useFile(activeTabId)
  const updateFile = useUpdateFile()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActiveFileBinary = activeFile && activeFile.storageId
  const isActiveFileText = activeFile && !activeFile.storageId

  const handleUpdate = useCallback((content: string, fileId: Id<'files'>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      updateFile({ id: fileId, content })
    }, DEBOUNCE_MS)
  }, [])

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center'>
        <TopNavigation projectId={projectId} />
      </div>
      {activeTabId && <FileBreadcrumbs projectId={projectId} />}
      <div className='flex-1 min-h-0 bg-background'>
        {!activeFile && (
          <div className='size-full flex items-center justify-center'>
            <Image
              src='/logo-alt.svg'
              alt='Solaris'
              width={50}
              height={50}
              className='opacity-25'
            />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            initialValue={activeFile.content}
            onChange={(content) => handleUpdate(content, activeFile._id)}
          />
        )}
        {isActiveFileBinary && (
          <p className='text-orange-400'>TODO: Implement binary preview</p>
        )}
      </div>
    </div>
  )
}
