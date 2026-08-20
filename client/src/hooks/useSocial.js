import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialAPI } from '../api/social'
import { useUIStore } from '../store/uiStore'

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => socialAPI.getFeed(pageParam),
    getNextPageParam: (last) => last.next ? new URL(last.next).searchParams.get('page') : undefined,
    select: (data) => ({ pages: data.pages, posts: data.pages.flatMap((p) => p.results) }),
  })
}

export function useExplore() {
  return useInfiniteQuery({
    queryKey: ['explore'],
    queryFn: ({ pageParam = 1 }) => socialAPI.getExplore(pageParam),
    getNextPageParam: (last) => last.next ? new URL(last.next).searchParams.get('page') : undefined,
    select: (data) => ({ pages: data.pages, posts: data.pages.flatMap((p) => p.results) }),
  })
}

export function useUserPosts(username) {
  return useInfiniteQuery({
    queryKey: ['user-posts', username],
    queryFn: ({ pageParam = 1 }) => socialAPI.getUserPosts(username, pageParam),
    getNextPageParam: (last) => last.next ? new URL(last.next).searchParams.get('page') : undefined,
    select: (data) => ({ pages: data.pages, posts: data.pages.flatMap((p) => p.results) }),
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
      queryClient.invalidateQueries({ queryKey: ['explore'] })
      addNotification(data.following ? 'Following' : 'Unfollowed', 'info')
    },
    onError: (err) => {
      const addNotification = useUIStore.getState().addNotification
      addNotification(err?.response?.data?.detail || 'Action failed', 'error')
    },
  })
}

export function useComments(postId) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => socialAPI.getComments(postId, pageParam),
    getNextPageParam: (last) => last.next ? new URL(last.next).searchParams.get('page') : undefined,
    select: (data) => ({ pages: data.pages, comments: data.pages.flatMap((p) => p.results) }),
    enabled: !!postId,
  })
}

export function useCreateComment(postId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content) => socialAPI.createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}

export function useDeleteComment(postId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: socialAPI.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) => socialAPI.getNotifications(pageParam),
    getNextPageParam: (last) => last.next ? new URL(last.next).searchParams.get('page') : undefined,
    select: (data) => ({ pages: data.pages, notifications: data.pages.flatMap((p) => p.results) }),
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications-unread'],
    queryFn: socialAPI.getUnreadCount,
    refetchInterval: 30000,
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: socialAPI.markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })
}