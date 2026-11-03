import { FileIcon, FolderIcon } from '@react-symbols/icons/utils'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { itemPadding } from './constants'

interface Props {
  type: 'file' | 'folder'
  level: number
  onSubmit: (name: string) => void
  onCancel: () => void
}

export const CreateInput = ({ type, level, onSubmit, onCancel }: Props) => {
  const [value, setValue] = useState('')
  const handleSubmit = () => {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      onSubmit(trimmedValue)
    } else {
      onCancel()
    }
  }

  return (
    <div className='w-full flex items-center gap-1 h-5.5 bg-accent/30' style={{
      paddingLeft: itemPadding(level, type === 'file')
    }}>
      <div className='flex items-center gap-0.5'>
        {type === 'folder' && (
          <ChevronRightIcon className='size-4 shrink-0 text-muted-foreground' />
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
        className='w-full flex-1 bg-transparent text-sm outline-none focus:ring-1 focus: ring-inset focus:ring-ring'
      />
    </div>
  )
}
