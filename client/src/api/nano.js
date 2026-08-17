import api from './axios'

export const nanoAPI = {
  getNanos: () => api.get('/nano/').then((r) => r.data),
  getPublicNanos: () => api.get('/nano/public/').then((r) => r.data),
  getNano: (slug) => api.get('/nano/' + slug + '/').then((r) => r.data),
  createNano: (data) => api.post('/nano/', data).then((r) => r.data),
  updateNano: (slug, data) => api.put('/nano/' + slug + '/', data).then((r) => r.data),
  deleteNano: (slug) => api.delete('/nano/' + slug + '/').then((r) => r.data),
}
