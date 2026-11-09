import { Fragment, useEffect } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { FileIcon } from '@react-symbols/icons/utils'
import { useFilePath } from '@/features/projects/hooks/useFiles'
import { useEditor } from '../hooks/use-editor'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function FileBreadcrumbs({ projectId }: { projectId: Id<'projects'> }) {
  const { activeTabId } = useEditor(projectId)
  const filePath = useFilePath(activeTabId)

  if (filePath === undefined || !activeTabId) {
    return (
      <div className='p-2 bg-background pl-4 border-b'>
        <Breadcrumb>
          <BreadcrumbList className='sm:gap-0.5 gap-0.5'>
            <BreadcrumbItem className='text-sm'>
              <BreadcrumbPage>&nbsp;</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  return (
    <div className='p-2 bg-background pl-4 border-b'>
      <Breadcrumb>
        <BreadcrumbList className='sm:gap-0.5 gap-0.5'>
          {filePath.map((path, index) => {
            const isLast = index === filePath.length - 1
            return (
              <Fragment key={path._id}>
                <BreadcrumbItem className='text-sm'>
                  {isLast ? (
                    <BreadcrumbPage className='flex items-center gap-1'>
                      <FileIcon
                        fileName={path.name}
                        autoAssign
                        className='size-4'
                      />
                      {path.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href='#'>{path.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
