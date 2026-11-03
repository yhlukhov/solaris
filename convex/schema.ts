import { defineSchema } from 'convex/server'
import { projects } from './tables/projects'
import { files } from './tables/files'

export default defineSchema({
  projects,
  files,
})
