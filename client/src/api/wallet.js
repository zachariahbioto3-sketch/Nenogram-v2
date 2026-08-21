import api from './axios'

export const walletAPI = {
  getWallet:       () => api.get('/wallet/').then((r) => r.data),
  getTransactions: () => api.get('/wallet/transactions/').then((r) => r.data),
  deposit:         (amount, method) => api.post('/wallet/deposit/', { amount, method }).then((r) => r.data),
  mpesaStk:        (amount, phone) => api.post('/wallet/mpesa/stk/', { amount, phone }).then((r) => r.data),
  withdraw:        (amount, phone) => api.post('/wallet/withdraw/', { amount, phone }).then((r) => r.data),
  transfer:        (amount, username, currency_type) => api.post('/wallet/transfer/', { amount, username, currency_type }).then((r) => r.data),
}
