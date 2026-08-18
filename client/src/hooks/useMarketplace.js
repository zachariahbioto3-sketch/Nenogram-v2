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

export function useJobs(filters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => marketplaceAPI.getJobs(filters),
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => marketplaceAPI.getJob(id),
    enabled: !!id,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      addNotification('Job posted successfully', 'success')
    },
    onError: (err) => {
      const errors = err?.response?.data
      const msg = errors ? Object.values(errors).flat()[0] : 'Failed to post job'
      addNotification(msg, 'error')
    },
  })
}

export function useJobBids(jobId) {
  return useQuery({
    queryKey: ['jobBids', jobId],
    queryFn: () => marketplaceAPI.getJobBids(jobId),
    enabled: !!jobId,
  })
}

export function usePlaceBid(jobId) {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => marketplaceAPI.placeBid(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobBids', jobId] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      addNotification('Bid placed successfully', 'success')
    },
    onError: (err) => {
      const detail = err?.response?.data?.detail
      const msg = detail || 'Failed to place bid'
      addNotification(msg, 'error')
    },
  })
}

export function useAcceptBid(jobId) {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.acceptBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobBids', jobId] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      addNotification('Bid accepted. Escrow funded.', 'success')
    },
    onError: (err) => {
      const detail = err?.response?.data?.detail
      addNotification(detail || 'Failed to accept bid', 'error')
    },
  })
}

export function useRejectBid(jobId) {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.rejectBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobBids', jobId] })
      addNotification('Bid rejected', 'info')
    },
    onError: () => addNotification('Failed to reject bid', 'error'),
  })
}