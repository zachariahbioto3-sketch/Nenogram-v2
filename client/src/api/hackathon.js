import api from './axios'

export const hackathonAPI = {
  getHackathons: (status) => {
    const params = status ? { status } : {}
    return api.get('/hackathon/', { params })
  },
  getHackathon: (id) => api.get(`/hackathon/${id}/`),
  joinHackathon: (id) => api.post(`/hackathon/${id}/join/`),
  getSubmissions: (id) => api.get(`/hackathon/${id}/submissions/`),
  createSubmission: (id, data) => api.post(`/hackathon/${id}/submit/`, data),
  voteSubmission: (submissionId) => api.post(`/hackathon/submissions/${submissionId}/vote/`),
}