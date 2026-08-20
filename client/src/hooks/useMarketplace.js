import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUIStore } from "../store/uiStore"
import { marketplaceAPI } from "../api/marketplace"

export function useGigs(params) {
  return useQuery({
    queryKey: ["gigs", params],
    queryFn: () => marketplaceAPI.getGigs(params).then((r) => r.data),
  })
}

export function useGig(id) {
  return useQuery({
    queryKey: ["gig", id],
    queryFn: () => marketplaceAPI.getGig(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useJobs(params) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => marketplaceAPI.getJobs(params).then((r) => r.data),
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => marketplaceAPI.getJob(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: () => marketplaceAPI.getContracts().then((r) => r.data),
  })
}

export function useContract(id) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => marketplaceAPI.getContract(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateGig() {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.createGig,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs"] })
      addNotification("Gig created", "success")
    },
    onError: () => addNotification("Failed to create gig", "error"),
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] })
      addNotification("Job posted", "success")
    },
    onError: () => addNotification("Failed to post job", "error"),
  })
}

export function usePlaceBid(jobId) {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => marketplaceAPI.placeBid(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job", jobId] })
      addNotification("Bid placed", "success")
    },
    onError: (err) => {
      const msg = err.response?.data?.detail || "Failed to place bid"
      addNotification(msg, "error")
    },
  })
}

export function useAcceptBid() {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: marketplaceAPI.acceptBid,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] })
      qc.invalidateQueries({ queryKey: ["jobs"] })
      addNotification("Bid accepted — contract created", "success")
    },
    onError: (err) => {
      const msg = err.response?.data?.detail || "Failed to accept bid"
      addNotification(msg, "error")
    },
  })
}

export function useSubmitMilestone(milestoneId) {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (data) => marketplaceAPI.submitMilestone(milestoneId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] })
      addNotification("Milestone submitted", "success")
    },
    onError: () => addNotification("Failed to submit milestone", "error"),
  })
}

export function useApproveMilestone(milestoneId) {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: () => marketplaceAPI.approveMilestone(milestoneId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] })
      addNotification("Milestone approved — payment released", "success")
    },
    onError: () => addNotification("Failed to approve milestone", "error"),
  })
}


export function useJobBids(jobId) {
  return useQuery({
    queryKey: ["job-bids", jobId],
    queryFn: () => marketplaceAPI.getJobBids(jobId).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : (data?.results ?? [])
    }),
    enabled: !!jobId,
  })
}

export function useRejectBid(jobId) {
  const qc = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: (bidId) => marketplaceAPI.rejectBid(bidId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-bids", jobId] })
      addNotification("Bid rejected", "info")
    },
    onError: () => addNotification("Failed to reject bid", "error"),
  })
}
