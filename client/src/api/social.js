import api from './axios'

export const socialAPI = {
  getFeed: () => api.get('/social/feed/').then((r) => r.data),
  getExplore: () => api.get('/social/explore/').then((r) => r.data),
  createPost: (content) => api.post('/social/posts/', { content }).then((r) => r.data),
  deletePost: (id) => api.delete('/social/posts/' + id + '/').then((r) => r.data),
  toggleLike: (id) => api.post('/social/posts/' + id + '/like/').then((r) => r.data),
  toggleFollow: (username) => api.post('/social/follow/' + username + '/').then((r) => r.data),
  getUserPosts: (username) => api.get('/social/profile/' + username + '/posts/').then((r) => r.data),
}
