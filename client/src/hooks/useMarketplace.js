import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { marketplaceAPI } from '../api/marketplace'
import { useUIStore } from '../store/uiStore'

export function useGigs(filters) {
  return useQuery({
    queryKey: ['gigs', filters],
    queryFn: () => marketplaceAPI.getGigs(filters),
  })
}

export function useGig(id) {
  return useQuery({
    queryKey: ['gig', id],
    queryFn: () => marketplaceAPI.getGig(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: marketplaceAPI.getCategories,
  })
}

export function useCreateGig() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.createGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] })
      addNotification('Gig created successfully', 'success')
    },
    onError: (err) => {
      const errors = err?.response?.data
      const msg = errors ? Object.values(errors).flat()[0] : 'Failed to create gig'
      addNotification(msg, 'error')
    },
  })
}
