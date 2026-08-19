import api from "./axios"

export const marketplaceAPI = {
  // Categories
  getCategories: () => api.get("/marketplace/categories/"),

  // Gigs
  getGigs: (params) => api.get("/marketplace/gigs/", { params }),
  getGig: (id) => api.get("/marketplace/gigs/" + id + "/"),
  createGig: (data) => api.post("/marketplace/gigs/", data),
  updateGig: (id, data) => api.patch("/marketplace/gigs/" + id + "/", data),
  deleteGig: (id) => api.delete("/marketplace/gigs/" + id + "/"),
  orderGig: (id, data) => api.post("/marketplace/gigs/" + id + "/order/", data),

  // Jobs
  getJobs: (params) => api.get("/marketplace/jobs/", { params }),
  getJob: (id) => api.get("/marketplace/jobs/" + id + "/"),
  createJob: (data) => api.post("/marketplace/jobs/", data),
  updateJob: (id, data) => api.patch("/marketplace/jobs/" + id + "/", data),
  getJobBids: (jobId) => api.get("/marketplace/jobs/" + jobId + "/bids/"),
  placeBid: (jobId, data) => api.post("/marketplace/jobs/" + jobId + "/bid/", data),

  // Bids
  acceptBid: (bidId) => api.post("/marketplace/bids/" + bidId + "/accept/"),

  // Contracts
  getContracts: () => api.get("/marketplace/contracts/"),
  getContract: (id) => api.get("/marketplace/contracts/" + id + "/"),

  // Milestones
  submitMilestone: (id, data) => api.post("/marketplace/milestones/" + id + "/submit/", data),
  approveMilestone: (id) => api.post("/marketplace/milestones/" + id + "/approve/"),

  // Disputes
  rejectBid: (bidId) => api.post("/marketplace/bids/" + bidId + "/reject/"),
  createDispute: (data) => api.post("/marketplace/disputes/", data),
}
