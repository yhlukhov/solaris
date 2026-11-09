import { useMutation, useQuery } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

export function useFile(id: Id<'files'> | null) {
  return useQuery(api.files.getFile, id ? { id } : 'skip')
}

export function useFilePath(fileId: Id<'files'> | null) {
  return useQuery(api.files.getFilePath, fileId ? { fileId } : 'skip')
}

export function useCreateFile() {
  return useMutation(api.files.createFile)
}

export function useUpdateFile() {
  return useMutation(api.files.updateFile)
}

export function useRenameFile() {
  return useMutation(api.files.renameFile)
}

export function useDeleteFile() {
  return useMutation(api.files.deleteFile)
}

export function useCreateFolder() {
  return useMutation(api.files.createFolder)
}

export function useFolderContents({
  projectId,
  parentId,
  enabled = true,
}: {
  projectId: Id<'projects'>
  parentId?: Id<'files'>
  enabled?: boolean
}) {
  return useQuery(api.files.getFolderContents, enabled ? {
    projectId,
    parentId
  } : 'skip')
}
