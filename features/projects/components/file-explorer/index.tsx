import { cn } from 'cn'
import { useState } from 'react'
import {
  ChevronRightIcon,
  CopyMinusIcon,
  FilePlusCornerIcon,
  FolderPlusIcon,
} from 'lucide-react'
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
} from '../../hooks/useFiles'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProject } from '../../hooks/useProjects'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { CreateInput } from './create-input'
import { LoadingRow } from './loading-row'
import { Tree } from './tree'

interface Props {
  projectId: Id<'projects'>
}

export const FileExplorer = ({ projectId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [collapseKey, setCollapseKey] = useState(0)
  const [creating, setCreating] = useState<'file' | 'folder' | null>(null)
  const project = useProject(projectId)
  const createFile = useCreateFile()
  const createFolder = useCreateFolder()
  const rootFiles = useFolderContents({ projectId, enabled: isOpen })

  const handleCreate = (name: string) => {
    if (creating === 'file') {
      createFile({
        name,
        projectId,
        content: '',
        parentId: undefined,
      })
    } else if (creating === 'folder') {
      createFolder({
        name,
        projectId,
        parentId: undefined,
      })
    }
    setCreating(null)
  }

  return (
    <div className='h-full bg-sidebar'>
      <ScrollArea>
        <div
          role='button'
          onClick={() => setIsOpen((value) => !value)}
          className='group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold'
        >
          <ChevronRightIcon
            className={cn(
              'size-4 shrink-0 text-muted-foreground',
              isOpen && 'rotate-90',
            )}
          />
          <p className='text-xs uppercase line-clamp-1'>
            {project?.name ?? 'Loading...'}
          </p>
          <div className='opacity-0 group-hover/project:opacity-100 transition-none duration-0 flex items-center gap-0.5 ml-auto'>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setIsOpen(true)
                setCreating('file')
              }}
              variant={'highlight'}
              size={'icon-xs'}
            >
              <FilePlusCornerIcon className='size-3.5' />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setIsOpen(true)
                setCreating('folder')
              }}
              variant={'highlight'}
              size={'icon-xs'}
            >
              <FolderPlusIcon className='size-3.5' />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setCollapseKey((prev) => prev + 1)
              }}
              variant={'highlight'}
              size={'icon-xs'}
            >
              <CopyMinusIcon className='size-3.5' />
            </Button>
          </div>
        </div>
        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}
            {rootFiles?.map(item => (
              <Tree
                key={`${item._id}-${collapseKey}`}
                item={item}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  )
}
