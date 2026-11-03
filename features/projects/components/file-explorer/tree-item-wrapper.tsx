import { cn } from 'cn'
import { Doc } from '@/convex/_generated/dataModel'
import { itemPadding } from './constants'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface Props {
  item: Doc<'files'>
  level: number
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
  onDoubleClick?: () => void
  onRename?: () => void
  onDelete?: () => void
  onCreateFile?: () => void
  onCreateFolder?: () => void
}

export function TreeItemWrapper({
  item,
  children,
  level,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onRename?.()
            }
          }}
          className={cn(
            'group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30 outline-none focus:ring-1 focus:ring-inset focus:ring-ring',
            isActive && 'bg-accent/30',
          )}
          style={{ paddingLeft: itemPadding(level, item.type === 'file') }}
        >
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {item.type === 'folder' && (
          <>
            <ContextMenuItem onClick={onCreateFile} className={'text-sm'}>
              New File...
            </ContextMenuItem>
            <ContextMenuItem onClick={onCreateFolder} className={'text-sm'}>
              New Folder...
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={onRename} className={'text-sm'}>
          Rename...
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className={'text-sm'}>
          Delete permanently
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
