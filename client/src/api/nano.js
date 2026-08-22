import api from './axios'

export const nanoAPI = {
  // Folders
  getFolders: (parentId) => {
    const params = parentId ? { parent: parentId } : { parent: 'null' }
    return api.get('/nano/folders/', { params }).then((r) => r.data)
  },
  createFolder: (data) => api.post('/nano/folders/', data).then((r) => r.data),
  updateFolder: (id, data) => api.patch('/nano/folders/' + id + '/', data).then((r) => r.data),
  deleteFolder: (id) => api.delete('/nano/folders/' + id + '/').then((r) => r.data),

  // Files
  getFiles: (folderId) => {
    const params = folderId ? { folder: folderId } : { folder: 'null' }
    return api.get('/nano/files/', { params }).then((r) => r.data)
  },
  getFile: (id) => api.get('/nano/files/' + id + '/').then((r) => r.data),
  createFile: (data) => api.post('/nano/files/', data).then((r) => r.data),
  updateFile: (id, data) => api.patch('/nano/files/' + id + '/', data).then((r) => r.data),
  deleteFile: (id) => api.delete('/nano/files/' + id + '/').then((r) => r.data),
  publishFile: (id) => api.post('/nano/files/' + id + '/publish/').then((r) => r.data),
  unpublishFile: (id) => api.post('/nano/files/' + id + '/unpublish/').then((r) => r.data),

  // Thumbnail
  uploadThumbnail: (id, file) => {
    const fd = new FormData()
    fd.append('thumbnail', file)
    return api.patch('/nano/files/' + id + '/thumbnail/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
  uploadThumbnailUrl: (id, url) => {
    const fd = new FormData()
    fd.append('thumbnail_url', url)
    return api.patch('/nano/files/' + id + '/thumbnail/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
  removeThumbnail: (id) => {
    const fd = new FormData()
    fd.append('remove', '1')
    return api.patch('/nano/files/' + id + '/thumbnail/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  // Inline image upload
  uploadInlineImage: (file) => {
    const fd = new FormData()
    fd.append('image', file)
    return api.post('/nano/images/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  // Feed
  getFeed: () => api.get('/nano/feed/').then((r) => r.data),
}
