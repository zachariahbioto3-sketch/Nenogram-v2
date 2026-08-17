import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceAPI } from '../api/workspace'
import { useUIStore } from '../store/uiStore'

export const useFolders = (parentId) =>
  useQuery({
    queryKey: ['workspace-folders', parentId ?? 'root'],
    queryFn: () => workspaceAPI.getFolders(parentId).then((r) => r.data),
  })

export const useFiles = (folderId) =>
  useQuery({
    queryKey: ['workspace-files', folderId ?? 'root'],
    queryFn: () => workspaceAPI.getFiles(folderId).then((r) => r.data),
  })

export const useFile = (id) =>
  useQuery({
    queryKey: ['workspace-file', id],
    queryFn: () => workspaceAPI.getFile(id).then((r) => r.data),
    enabled: !!id,
  })

export const useCreateFolder = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => workspaceAPI.createFolder(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['workspace-folders', vars.parent ?? 'root'] })
      notify({ type: 'success', message: 'Folder created.' })
    },
    onError: () => notify({ type: 'error', message: 'Failed to create folder.' }),
  })
}

export const useUpdateFolder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => workspaceAPI.updateFolder(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workspace-folders'] }),
  })
}

export const useDeleteFolder = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (id) => workspaceAPI.deleteFolder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspace-folders'] })
      notify({ type: 'success', message: 'Folder deleted.' })
    },
  })
}

export const useCreateFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => workspaceAPI.createFile(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['workspace-files', vars.folder ?? 'root'] })
      notify({ type: 'success', message: 'File created.' })
    },
    onError: () => notify({ type: 'error', message: 'Failed to create file.' }),
  })
}

export const useUpdateFile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => workspaceAPI.updateFile(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['workspace-file', res.data.id] })
      qc.invalidateQueries({ queryKey: ['workspace-files'] })
    },
  })
}

export const useDeleteFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (id) => workspaceAPI.deleteFile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspace-files'] })
      notify({ type: 'success', message: 'File deleted.' })
    },
  })
}