import { cn } from 'cn'
import { useState } from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { FileIcon, FolderIcon } from '@react-symbols/icons/utils'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { CreateInput } from './create-input'
import { LoadingRow } from './loading-row'
import { itemPadding } from './constants'
import {
  useCreateFile,
  useRenameFile,
  useDeleteFile,
  useCreateFolder,
  useFolderContents,
} from '../../hooks/useFiles'
import { TreeItemWrapper } from './tree-item-wrapper'
import { RenameInput } from './rename-input'

interface Props {
  item: Doc<'files'>
  projectId: Id<'projects'>
  level?: number
}

export const Tree = ({ item, projectId, level = 0 }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [creating, setCreating] = useState<'file' | 'folder' | null>(null)
  const createFile = useCreateFile()
  const deleteFile = useDeleteFile()
  const renameFile = useRenameFile()
  const createFolder = useCreateFolder()

  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: isOpen && item.type === 'folder',
  })

  const startCreating = (type: 'file' | 'folder') => {
    setIsOpen(true)
    setCreating(type)
  }

  const handleCreate = (name: string) => {
    if (creating === 'file') {
      createFile({
        name,
        projectId,
        content: '',
        parentId: item._id,
      })
    } else {
      createFolder({
        name,
        projectId,
        parentId: item._id,
      })
    }
    setCreating(null)
  }

  const handleRename = (newName: string) => {
    if (newName === item.name) {
      return
    }
    renameFile({
      id: item._id,
      name: newName,
    })
    setIsRenaming(false)
  }

  if (item.type === 'file') {
    if (isRenaming) {
      return (
        <RenameInput
          defaultValue={item.name}
          level={level}
          type='file'
          isOpen={isOpen}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      )
    }
    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => {}}
        onDoubleClick={() => {}}
        onRename={() => {
          setIsRenaming(true)
        }}
        onDelete={() => {
          deleteFile({ id: item._id })
          // TODO: close tab
        }}
      >
        <FileIcon fileName={item.name} autoAssign className='size-4' />
        <span className='truncate text-sm'>{item.name}</span>
      </TreeItemWrapper>
    )
  }

  const folderRow = (
    <div className='flex items-center gap-0.5'>
      <ChevronRightIcon
        className={cn(
          'size-4 shrink-0 text-muted-foreground',
          isOpen && 'rotate-90',
        )}
      />
      <FolderIcon folderName={item.name} className='size-4' />
      <span className='truncate text-sm'>{item.name}</span>
    </div>
  )

  const renderFolderContents = () => (
    <>
      {folderContents === undefined && <LoadingRow level={level + 1} />}
      {folderContents?.map((child) => (
        <Tree
          key={child._id}
          item={child}
          projectId={projectId}
          level={level + 1}
        />
      ))}
    </>
  )

  if (item.type === 'folder') {
    if (creating) {
      return (
        <>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className='group flex items-center gap-1 h-5.5 hover:bg-accent/30 w-full'
            style={{ paddingLeft: itemPadding(level, false) }}
          >
            {folderRow}
          </button>
          {isOpen && (
            <>
              <CreateInput
                type={creating}
                level={level + 1}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
              {renderFolderContents()}
            </>
          )}
        </>
      )
    }

    if (isRenaming) {
      return (
        <>
          <RenameInput
            type='folder'
            defaultValue={item.name}
            level={level}
            onSubmit={handleRename}
            onCancel={() => setIsRenaming(false)}
          />
          {isOpen && renderFolderContents()}
        </>
      )
    }

    return (
      <>
        <TreeItemWrapper
          item={item}
          level={level}
          onClick={() => setIsOpen((value) => !value)}
          onCreateFile={() => startCreating('file')}
          onCreateFolder={() => startCreating('folder')}
          onRename={() => setIsRenaming(true)}
          onDelete={() => {
            deleteFile({ id: item._id })
            // TODO: close tab
          }}
        >
          {folderRow}
        </TreeItemWrapper>
        {isOpen && renderFolderContents()}
      </>
    )
  }
}
