import api from './axios'

export const walletAPI = {
  getWallet: () => api.get('/wallet/').then((r) => r.data),
  getTransactions: () => api.get('/wallet/transactions/').then((r) => r.data),
  deposit: (amount, method) => api.post('/wallet/deposit/', { amount, method }).then((r) => r.data),
  mpesaStk: (amount, phone) => api.post('/wallet/mpesa/stk/', { amount, phone }).then((r) => r.data),
}
