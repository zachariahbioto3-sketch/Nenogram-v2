import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hackathonAPI } from '../api/hackathon'
import { useUIStore } from '../store/uiStore'

export const useHackathons = (status) =>
  useQuery({
    queryKey: ['hackathons', status],
    queryFn: () => hackathonAPI.getHackathons(status).then((r) => r.data),
  })

export const useHackathon = (id) =>
  useQuery({
    queryKey: ['hackathon', id],
    queryFn: () => hackathonAPI.getHackathon(id).then((r) => r.data),
    enabled: !!id,
  })

export const useSubmissions = (id) =>
  useQuery({
    queryKey: ['hackathon-submissions', id],
    queryFn: () => hackathonAPI.getSubmissions(id).then((r) => r.data),
    enabled: !!id,
  })

export const useJoinHackathon = () => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (id) => hackathonAPI.joinHackathon(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['hackathons'] })
      qc.invalidateQueries({ queryKey: ['hackathon', id] })
      notify({ type: 'success', message: 'Joined hackathon!' })
    },
    onError: (err) => {
      const msg = err.response?.data?.error || 'Failed to join.'
      notify({ type: 'error', message: msg })
    },
  })
}

export const useCreateSubmission = (hackathonId) => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => hackathonAPI.createSubmission(hackathonId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hackathon-submissions', hackathonId] })
      notify({ type: 'success', message: 'Submission created!' })
    },
    onError: (err) => {
      const msg = err.response?.data?.error || 'Submission failed.'
      notify({ type: 'error', message: msg })
    },
  })
}

export const useVoteSubmission = (hackathonId) => {
  const qc = useQueryClient()
  const notify = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (submissionId) => hackathonAPI.voteSubmission(submissionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hackathon-submissions', hackathonId] })
    },
    onError: (err) => {
      const msg = err.response?.data?.error || 'Vote failed.'
      notify({ type: 'error', message: msg })
    },
  })
}