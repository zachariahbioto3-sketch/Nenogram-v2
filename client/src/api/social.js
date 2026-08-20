import api from './axios'

export const socialAPI = {
  getFeed: (page = 1) => api.get('/social/feed/', { params: { page } }).then((r) => r.data),
  getExplore: (page = 1) => api.get('/social/explore/', { params: { page } }).then((r) => r.data),
  createPost: ({ content, image }) => {
    const form = new FormData()
    form.append('content', content)
    if (image) form.append('image', image)
    return api.post('/social/posts/', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
  deletePost: (id) => api.delete('/social/posts/' + id + '/').then((r) => r.data),
  toggleLike: (id) => api.post('/social/posts/' + id + '/like/').then((r) => r.data),
  toggleFollow: (username) => api.post('/social/follow/' + username + '/').then((r) => r.data),
  getUserPosts: (username, page = 1) => api.get('/social/profile/' + username + '/posts/', { params: { page } }).then((r) => r.data),
  getComments: (postId, page = 1) => api.get('/social/posts/' + postId + '/comments/', { params: { page } }).then((r) => r.data),
  createComment: (postId, content) => api.post('/social/posts/' + postId + '/comments/', { content }).then((r) => r.data),
  deleteComment: (id) => api.delete('/social/comments/' + id + '/').then((r) => r.data),
  getNotifications: (page = 1) => api.get('/social/notifications/', { params: { page } }).then((r) => r.data),
  markNotificationsRead: () => api.post('/social/notifications/mark-read/').then((r) => r.data),
  getUnreadCount: () => api.get('/social/notifications/unread-count/').then((r) => r.data),
}