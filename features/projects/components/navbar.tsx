import { cn } from 'cn'
import Image from 'next/image'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Id } from '@/convex/_generated/dataModel'
import { useProject, useRenameProject } from '../hooks/useProjects'
import { Button } from '@/components/ui/button'
import { poppings } from '@/app/fonts'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CloudCheckIcon, LoaderIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function Navbar({ projectId }: { projectId: Id<'projects'> }) {
  const project = useProject(projectId)
  const renameProject = useRenameProject()
  const [name, setName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)

  const handleStartRename = () => {
    if (!project) return
    setName(project.name)
    setIsRenaming(true)
  }

  const handleSubmit = () => {
    if (!project) return
    setIsRenaming(false)
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName === project?.name) return
    renameProject({ id: projectId, name: trimmedName })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsRenaming(false)
    }
  }

  return (
    <nav className='flex justify-between items-center gap-x-2 px-2 py-1 bg-sidebar border-b'>
      <div className='flex items-center gap-x-2'>
        <Breadcrumb>
          <BreadcrumbList className='gap-1!'>
            <BreadcrumbItem>
              <BreadcrumbLink
                className='flex items-center gap-1.5'
                render={
                  <a href='/'>
                    <Button variant={'ghost'} className='w-fit! p-1.5! h-7!'>
                      <div className='flex items-center gap-1'>
                        <Image
                          src={'/logo.svg'}
                          alt='Logo'
                          width={20}
                          height={20}
                        />
                        <span
                          className={cn(
                            'text-sm font-medium',
                            poppings.className,
                          )}
                        >
                          Solaris
                        </span>
                      </div>
                    </Button>
                  </a>
                }
              ></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='mr-1' />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className='p-1 rounded-xs text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-50 truncate'
                />
              ) : (
                <BreadcrumbPage
                  className='text-sm cursor-pointer hover:text-primary font-medium max-w-50 truncate'
                  onClick={handleStartRename}
                >
                  {project?.name ?? 'Loading...'}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === 'importing' ? (
          <Tooltip>
            <TooltipTrigger>
              <LoaderIcon className='size-4 text-muted-foreground animate-spin' />
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <CloudCheckIcon className='size-4 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Saved{' '}
              {project
                ? formatDistanceToNow(project.updatedAt, { addSuffix: true })
                : 'recently'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <UserButton />
      </div>
    </nav>
  )
}
