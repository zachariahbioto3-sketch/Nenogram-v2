import api from './axios'

export const workspaceAPI = {
  getFolders: (parentId) => {
    const params = parentId ? { parent: parentId } : { parent: 'null' }
    return api.get('/workspace/folders/', { params })
  },
  createFolder: (data) => api.post('/workspace/folders/', data),
  updateFolder: (id, data) => api.patch(`/workspace/folders/${id}/`, data),
  deleteFolder: (id) => api.delete(`/workspace/folders/${id}/`),

  getFiles: (folderId) => {
    const params = folderId ? { folder: folderId } : { folder: 'null' }
    return api.get('/workspace/files/', { params })
  },
  getFile: (id) => api.get(`/workspace/files/${id}/`),
  createFile: (data) => api.post('/workspace/files/', data),
  updateFile: (id, data) => api.patch(`/workspace/files/${id}/`, data),
  deleteFile: (id) => api.delete(`/workspace/files/${id}/`),
}