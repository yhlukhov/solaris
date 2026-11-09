import { UserIdentity } from 'convex/server'
import type { Doc, Id } from './_generated/dataModel'
import { MutationCtx, QueryCtx } from './_generated/server'

// Verify authentication status and return user identity
export async function verifyAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Unauthorized')
  }
  return identity
}

// Verify project existance and ownership
export function verifyProjectOwnership(
  project: Doc<'projects'> | null,
  identity: UserIdentity,
) {
  if (!project) {
    throw new Error('Project not found')
  }
  if (project.ownerId !== identity.subject) {
    throw new Error('Unauthorized access to this project')
  }
}

// Compare function to filter documetns by type and name
export function compareFilesFn(a: Doc<'files'>, b: Doc<'files'>) {
  // Folders come before files
  if (a.type === 'folder' && b.type === 'file') return -1
  if (a.type === 'file' && b.type === 'folder') return 1
  // Withing same type, sort alphabetically
  return a.name.localeCompare(b.name)
}

// Delete file/folder recursively
export async function deleteFileRecursive(
  file: Doc<'files'>,
  ctx: MutationCtx,
) {
  if (file.type === 'folder') {
    const children = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', file.projectId).eq('parentId', file._id),
      )
      .collect()
    for (const child of children) {
      await deleteFileRecursive(child, ctx)
    }
  }
  if (file.storageId) {
    await ctx.storage.delete(file.storageId)
  }
  await ctx.db.delete('files', file._id)
}

// Get file's parent recursively
export async function getFilePathRecursively(
  file: Doc<'files'>,
  path: { _id: string; name: string }[],
  ctx: QueryCtx,
) {
  path.unshift({ _id: file._id, name: file.name })
  if (file.parentId) {
    const parent = await ctx.db.get('files', file.parentId)
    if (parent) {
      await getFilePathRecursively(parent, path, ctx)
    }
  }
}
