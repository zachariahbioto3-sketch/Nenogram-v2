import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoAPI } from '../api/nano'
import { useUIStore } from '../store/uiStore'

// Folders
export const useFolders = (parentId) =>
  useQuery({
    queryKey: ['nano-folders', parentId ?? 'root'],
    queryFn: () => nanoAPI.getFolders(parentId),
  })

export const useCreateFolder = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.createFolder,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['nano-folders', vars.parent ?? 'root'] })
      notify('Folder created', 'success')
    },
    onError: () => notify('Failed to create folder', 'error'),
  })
}

export const useDeleteFolder = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.deleteFolder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nano-folders'] })
      notify('Folder deleted', 'info')
    },
    onError: () => notify('Failed to delete folder', 'error'),
  })
}

// Files
export const useFiles = (folderId) =>
  useQuery({
    queryKey: ['nano-files', folderId ?? 'root'],
    queryFn: () => nanoAPI.getFiles(folderId),
  })

export const useFile = (id) =>
  useQuery({
    queryKey: ['nano-file', id],
    queryFn: () => nanoAPI.getFile(id),
    enabled: !!id,
  })

export const useCreateFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.createFile,
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ['nano-files', vars.folder ?? 'root'] })
      notify('File created', 'success')
    },
    onError: () => notify('Failed to create file', 'error'),
  })
}

export const useUpdateFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ id, data }) => nanoAPI.updateFile(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      qc.invalidateQueries({ queryKey: ['nano-files'] })
    },
    onError: () => notify('Save failed', 'error'),
  })
}

export const useDeleteFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.deleteFile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nano-files'] })
      notify('File deleted', 'info')
    },
    onError: () => notify('Failed to delete file', 'error'),
  })
}

export const usePublishFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.publishFile,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      qc.invalidateQueries({ queryKey: ['nano-files'] })
      qc.invalidateQueries({ queryKey: ['nano-feed'] })
      notify('Published to Nenogram Today', 'success')
    },
    onError: () => notify('Publish failed', 'error'),
  })
}

export const useUnpublishFile = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.unpublishFile,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      qc.invalidateQueries({ queryKey: ['nano-files'] })
      qc.invalidateQueries({ queryKey: ['nano-feed'] })
      notify('Unpublished', 'info')
    },
    onError: () => notify('Failed to unpublish', 'error'),
  })
}

// Thumbnail
export const useUploadThumbnail = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ id, file }) => nanoAPI.uploadThumbnail(id, file),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      notify('Thumbnail saved', 'success')
    },
    onError: () => notify('Thumbnail upload failed', 'error'),
  })
}

export const useUploadThumbnailUrl = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ id, url }) => nanoAPI.uploadThumbnailUrl(id, url),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      notify('Thumbnail saved', 'success')
    },
    onError: () => notify('Failed to fetch image from URL', 'error'),
  })
}

export const useRemoveThumbnail = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ id }) => nanoAPI.removeThumbnail(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['nano-file', data.id] })
      notify('Thumbnail removed', 'info')
    },
    onError: () => notify('Failed to remove thumbnail', 'error'),
  })
}

// Feed
export const useNanoFeed = () =>
  useQuery({
    queryKey: ['nano-feed'],
    queryFn: nanoAPI.getFeed,
  })
