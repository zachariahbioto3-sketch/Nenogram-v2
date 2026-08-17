import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoAPI } from '../api/nano'
import { useUIStore } from '../store/uiStore'

export function useNanos() {
  return useQuery({ queryKey: ['nanos'], queryFn: nanoAPI.getNanos })
}

export function usePublicNanos() {
  return useQuery({ queryKey: ['nanos-public'], queryFn: nanoAPI.getPublicNanos })
}

export function useNano(slug) {
  return useQuery({
    queryKey: ['nano', slug],
    queryFn: () => nanoAPI.getNano(slug),
    enabled: !!slug,
  })
}

export function useCreateNano() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.createNano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nanos'] })
      addNotification('Nano created', 'success')
    },
    onError: () => addNotification('Failed to create nano', 'error'),
  })
}

export function useUpdateNano() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ slug, data }) => nanoAPI.updateNano(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['nanos'] })
      queryClient.invalidateQueries({ queryKey: ['nano', slug] })
      addNotification('Saved', 'success')
    },
    onError: () => addNotification('Save failed', 'error'),
  })
}

export function useDeleteNano() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: nanoAPI.deleteNano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nanos'] })
      addNotification('Nano deleted', 'info')
    },
    onError: () => addNotification('Delete failed', 'error'),
  })
}
