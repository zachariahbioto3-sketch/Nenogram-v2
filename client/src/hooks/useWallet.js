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
      addNotification({ message: 'Deposit initiated - ref: ' + data.reference, type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      addNotification({ message: err?.response?.data?.detail ?? 'Deposit failed', type: 'error' })
    },
  })
}

export function useMpesaDeposit() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ amount, phone }) => walletAPI.mpesaStk(amount, phone),
    onSuccess: () => {
      addNotification({ message: 'STK push sent - check your phone', type: 'success' })
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['wallet'] }), 5000)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['wallet'] }), 10000)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['transactions'] }), 20000)
    },
    onError: (err) => {
      addNotification({ message: err?.response?.data?.detail ?? 'M-Pesa request failed', type: 'error' })
    },
  })
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ amount, phone }) => walletAPI.withdraw(amount, phone),
    onSuccess: (data) => {
      addNotification({ message: 'Withdrawal initiated - ref: ' + data.reference, type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      addNotification({ message: err?.response?.data?.detail ?? 'Withdrawal failed', type: 'error' })
    },
  })
}

export function useTransfer() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)
  return useMutation({
    mutationFn: ({ amount, username, currency_type }) => walletAPI.transfer(amount, username, currency_type),
    onSuccess: (data) => {
      addNotification({ message: 'Transferred to @' + data.recipient, type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      addNotification({ message: err?.response?.data?.detail ?? 'Transfer failed', type: 'error' })
    },
  })
}
