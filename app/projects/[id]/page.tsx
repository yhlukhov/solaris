import { Id } from '@/convex/_generated/dataModel'
import { ProjectIdView } from '@/features/projects/components/project-id-view'

export const instant = false

interface Params {
  params: Promise<{
    id: Id<'projects'>
  }>
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params
  return <ProjectIdView id={id} />
}
