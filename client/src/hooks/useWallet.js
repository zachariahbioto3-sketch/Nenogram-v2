import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletAPI } from '../api/wallet'
import { useUIStore } from '../store/uiStore'

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: walletAPI.getTransactions,
  })
}

export function useDeposit() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ amount, method }) => walletAPI.deposit(amount, method),
    onSuccess: (data) => {
      addNotification('Deposit initiated — ref: ' + data.reference, 'success')
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail ?? 'Deposit failed'
      addNotification(msg, 'error')
    },
  })
}

export function useMpesaDeposit() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ amount, phone }) => walletAPI.mpesaStk(amount, phone),
    onSuccess: (data) => {
      addNotification('STK push sent — check your phone', 'success')
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['wallet'] }), 5000)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['wallet'] }), 10000)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['wallet'] }), 20000)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['transactions'] }), 20000)
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail ?? 'M-Pesa request failed'
      addNotification(msg, 'error')
    },
  })
}
