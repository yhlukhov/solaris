import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import {
  verifyAuth,
  verifyProjectOwnership,
  compareFilesFn,
  deleteFileRecursive,
  getFilePathRecursively,
} from './utils'

//* QUERIES:

export const getFiles = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const identity = await verifyAuth(ctx)
    const project = await ctx.db.get('projects', projectId)
    verifyProjectOwnership(project, identity)
    return await ctx.db
      .query('files')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect()
  },
})

export const getFile = query({
  args: {
    id: v.id('files'),
  },
  handler: async (ctx, { id }) => {
    const identity = await verifyAuth(ctx)
    const file = await ctx.db.get('files', id)
    if (!file) {
      throw new Error('File not found')
    }
    const project = await ctx.db.get('projects', file.projectId)
    verifyProjectOwnership(project, identity)
    return file
  },
})

export const getFilePath = query({
  args: {
    fileId: v.id('files'),
  },
  handler: async (ctx, { fileId }) => {
    const identity = await verifyAuth(ctx)
    const file = await ctx.db.get('files', fileId)
    if (!file) {
      throw new Error('File not found')
    }
    const project = await ctx.db.get('projects', file.projectId)
    verifyProjectOwnership(project, identity)
    const path = [] as { _id: string, name: string}[]
    await getFilePathRecursively(file, path, ctx)
    return path
  },
})

export const getFolderContents = query({
  args: {
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
  },
  handler: async (ctx, { projectId, parentId }) => {
    const identity = await verifyAuth(ctx)
    const project = await ctx.db.get('projects', projectId)
    verifyProjectOwnership(project, identity)
    const folderContents = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', projectId).eq('parentId', parentId),
      )
      .collect()
    return folderContents.sort(compareFilesFn)
  },
})

//* MUTATIONS:

export const createFile = mutation({
  args: {
    name: v.string(),
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
    content: v.string(),
  },
  handler: async (ctx, { name, projectId, parentId, content }) => {
    const identity = await verifyAuth(ctx)
    const project = await ctx.db.get('projects', projectId)
    verifyProjectOwnership(project, identity)
    // Check if the file with same name already exists in this folder
    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', projectId).eq('parentId', parentId),
      )
      .collect()
    const existing = files.find(
      (file) => file.name === name && file.type === 'file',
    )
    if (existing) throw new Error('File already exists')
    const updatedAt = Date.now()
    await ctx.db.insert('files', {
      name,
      projectId,
      parentId,
      content,
      updatedAt,
      type: 'file',
    })
    await ctx.db.patch('projects', projectId, {
      updatedAt,
    })
  },
})

export const createFolder = mutation({
  args: {
    name: v.string(),
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
  },
  handler: async (ctx, { name, projectId, parentId }) => {
    const identity = await verifyAuth(ctx)
    const project = await ctx.db.get('projects', projectId)
    verifyProjectOwnership(project, identity)
    // Check if the folder with same name already exists in this folder
    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', projectId).eq('parentId', parentId),
      )
      .collect()
    const existing = files.find(
      (file) => file.name === name && file.type === 'folder',
    )
    if (existing) throw new Error('Folder already exists')
    const updatedAt = Date.now()
    await ctx.db.insert('files', {
      name,
      projectId,
      parentId,
      updatedAt,
      type: 'folder',
    })
    await ctx.db.patch('projects', projectId, {
      updatedAt,
    })
  },
})

export const renameFile = mutation({
  args: {
    id: v.id('files'),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const identity = await verifyAuth(ctx)
    const file = await ctx.db.get('files', id)
    if (!file) {
      throw new Error('File not found')
    }
    const project = await ctx.db.get('projects', file.projectId)
    verifyProjectOwnership(project, identity)
    // Check if the file with new name already exists in this folder
    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', file.projectId).eq('parentId', file.parentId),
      )
      .collect()
    const existing = files.find(
      (sibling) =>
        sibling.name === name &&
        sibling.type === file.type &&
        sibling._id !== id,
    )
    if (existing) throw new Error(`A ${file.type} already exists`)
    const updatedAt = Date.now()
    await ctx.db.patch('files', id, { name, updatedAt })
    await ctx.db.patch('projects', file.projectId, {
      updatedAt,
    })
  },
})

export const deleteFile = mutation({
  args: {
    id: v.id('files'),
  },
  handler: async (ctx, { id }) => {
    const identity = await verifyAuth(ctx)
    const file = await ctx.db.get('files', id)
    if (!file) throw new Error('File not found')
    const project = await ctx.db.get('projects', file.projectId)
    verifyProjectOwnership(project, identity)
    await deleteFileRecursive(file, ctx)
    await ctx.db.patch('projects', file.projectId, {
      updatedAt: Date.now(),
    })
  },
})

export const updateFile = mutation({
  args: {
    id: v.id('files'),
    content: v.string(),
  },
  handler: async (ctx, { id, content }) => {
    const identity = await verifyAuth(ctx)
    const file = await ctx.db.get('files', id)
    if (!file) throw new Error('File not found')
    const project = await ctx.db.get('projects', file.projectId)
    verifyProjectOwnership(project, identity)
    const updatedAt = Date.now()
    await ctx.db.patch('files', id, {
      content,
      updatedAt,
    })
    await ctx.db.patch('projects', file.projectId, {
      updatedAt,
    })
  },
})
