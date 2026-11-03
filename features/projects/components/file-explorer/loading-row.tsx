import { cn } from 'cn'
import { itemPadding } from './constants'
import { Spinner } from '@/components/ui/spinner'

export const LoadingRow = ({
  className,
  level = 0,
}: {
  className?: string
  level?: number
}) => (
  <div
    className={cn('h-5.5 flex items-center text-muted-foreground', className)}
    style={{
      paddingLeft: itemPadding(level, true),
    }}
  >
    <Spinner className='size-4 text-ring ml-0.5' />
  </div>
)
