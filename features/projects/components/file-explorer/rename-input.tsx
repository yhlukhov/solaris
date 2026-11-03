import { FileIcon, FolderIcon } from '@react-symbols/icons/utils'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { itemPadding } from './constants'
import { cn } from 'cn'

interface Props {
  type: 'file' | 'folder'
  defaultValue: string
  isOpen?: boolean
  level: number
  onSubmit: (name: string) => void
  onCancel: () => void
}

export const RenameInput = ({
  type,
  defaultValue,
  isOpen,
  level,
  onSubmit,
  onCancel,
}: Props) => {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = () => {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      onSubmit(trimmedValue)
    } else {
      onCancel()
    }
  }

  return (
    <div
      className='w-full flex items-center gap-1 h-5.5 bg-accent/30'
      style={{
        paddingLeft: itemPadding(level, type === 'file'),
      }}
    >
      <div className='flex items-center gap-0.5'>
        {type === 'folder' && (
          <ChevronRightIcon
            className={cn(
              'size-4 shrink-0 text-muted-foreground',
              isOpen && 'rotate-90',
            )}
          />
        )}
        {type === 'file' && (
          <FileIcon fileName={value} autoAssign className='size-4' />
        )}
        {type === 'folder' && (
          <FolderIcon folderName={value} className='size-4' />
        )}
      </div>
      <input
        autoFocus
        type='text'
        value={value}
        onBlur={handleSubmit}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            handleSubmit()
          }
          if (e.code === 'Escape') {
            onCancel()
          }
        }}
        onFocus={(e) => {
          if (type === 'folder') {
            e.currentTarget.select()
          } else {
            const lastDotIndex = e.currentTarget.value.lastIndexOf('.')
            if (lastDotIndex > 0) {
              e.currentTarget.setSelectionRange(0, lastDotIndex)
            } else {
              e.currentTarget.select()
            }
          }
        }}
        className='w-full flex-1 bg-transparent text-sm outline-none focus:ring-1 focus: ring-inset focus:ring-ring'
      />
    </div>
  )
}
