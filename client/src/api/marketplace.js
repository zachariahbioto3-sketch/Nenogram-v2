import api from './axios'

export const marketplaceAPI = {
  getGigs: (params) => api.get('/marketplace/gigs/', { params }).then((r) => r.data),
  getGig: (id) => api.get('/marketplace/gigs/' + id + '/').then((r) => r.data),
  createGig: (data) => api.post('/marketplace/gigs/create/', data).then((r) => r.data),
  getCategories: () => api.get('/marketplace/categories/').then((r) => r.data),

  getJobs: (params) => api.get('/marketplace/jobs/', { params }).then((r) => r.data),
  getJob: (id) => api.get('/marketplace/jobs/' + id + '/').then((r) => r.data),
  createJob: (data) => api.post('/marketplace/jobs/', data).then((r) => r.data),
  getJobBids: (jobId) => api.get('/marketplace/jobs/' + jobId + '/bids/').then((r) => r.data),
  placeBid: (jobId, data) => api.post('/marketplace/jobs/' + jobId + '/bids/', data).then((r) => r.data),
  acceptBid: (bidId) => api.post('/marketplace/bids/' + bidId + '/accept/').then((r) => r.data),
  rejectBid: (bidId) => api.post('/marketplace/bids/' + bidId + '/reject/').then((r) => r.data),
}