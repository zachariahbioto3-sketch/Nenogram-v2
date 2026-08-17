import { useQuery } from '@tanstack/react-query'
import { authAPI } from '../api/auth'

export function useProfile(username) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => authAPI.getProfile(username),
    enabled: !!username,
  })
}
