import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialAPI } from '../api/social'
import { useUIStore } from '../store/uiStore'

export function useFeed() {
  return useQuery({ queryKey: ['feed'], queryFn: socialAPI.getFeed })
}

export function useExplore() {
  return useQuery({ queryKey: ['explore'], queryFn: socialAPI.getExplore })
}

export function useUserPosts(username) {
  return useQuery({
    queryKey: ['user-posts', username],
    queryFn: () => socialAPI.getUserPosts(username),
    enabled: !!username,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: socialAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
    onError: (err) => {
      addNotification(err?.response?.data?.detail || 'Post failed', 'error')
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: socialAPI.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}

export function useLikePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: socialAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: socialAPI.toggleFollow,
    onSuccess: (data, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      addNotification(data.following ? 'Following' : 'Unfollowed', 'info')
    },
    onError: (err) => {
      const addNotification = useUIStore.getState().addNotification
      addNotification(err?.response?.data?.detail || 'Action failed', 'error')
    },
  })
}
