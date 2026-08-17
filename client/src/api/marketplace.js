import api from './axios'

export const marketplaceAPI = {
  getGigs: (params) => api.get('/marketplace/gigs/', { params }).then((r) => r.data),
  getGig: (id) => api.get('/marketplace/gigs/' + id + '/').then((r) => r.data),
  createGig: (data) => api.post('/marketplace/gigs/create/', data).then((r) => r.data),
  getCategories: () => api.get('/marketplace/categories/').then((r) => r.data),
}
