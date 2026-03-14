'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

type Profile = {
  id: string
  fullName: string
  email: string
  phoneNumber?: string
  leverage: number
}

export const useProfile = () => {
  const token = useAuthStore((s) => s.accessToken)
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Profile }>('/profile', token ?? undefined)
      return res.data
    },
    enabled: !!token,
  })

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Pick<Profile, 'fullName' | 'email' | 'phoneNumber' | 'leverage'>>) => {
      const res = await apiClient.put<{ data: Profile }>('/profile', data, token ?? undefined)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['account-summary'] })
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    update: updateMutation.mutateAsync,
    updating: updateMutation.isPending,
  }
}

