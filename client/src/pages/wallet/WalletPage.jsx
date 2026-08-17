import { useState } from 'react'
import { useWallet, useTransactions, useMpesaDeposit } from '../../hooks/useWallet'

export default function WalletPage() {
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { mutate: mpesaDeposit, isPending: depositing } = useMpesaDeposit()
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('mpesa')
  const [sent, setSent] = useState(false)

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return
    if (method === 'mpesa') {
      if (!phone.trim()) return
      mpesaDeposit({ amount: Number(amount), phone: phone.trim() }, {
        onSuccess: () => { setSent(true) },
      })
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setAmount('')
    setPhone('')
    setSent(false)
    setMethod('mpesa')
  }

  const txColor = (type) => {
    if (['deposit', 'earning', 'escrow_release'].includes(type)) return 'var(--success)'
    if (['withdrawal', 'purchase', 'escrow_hold'].includes(type)) return 'var(--danger)'
    return 'var(--text-secondary)'
  }

  const txSign = (type) => ['deposit', 'earning', 'escrow_release'].includes(type) ? '+' : '-'

  return (
    <div style={{ maxWidth: '600px' }}>

      {/* Balance Card */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px' }}>
        {walletLoading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading wallet...</div>
        ) : wallet ? (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>real balance</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {wallet.currency} {Number(wallet.real_balance).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>
              {Number(wallet.nenocoin_balance).toFixed(4)} NC
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>@ {wallet.nenocoin_rate} KES/NC</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowModal(true)} style={{ padding: '9px 20px', background: 'var(--accent)', color: '#0a0a0a', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Deposit
              </button>
              <button style={{ padding: '9px 20px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', cursor: 'not-allowed', opacity: 0.5 }}>
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--danger)', fontSize: '14px' }}>Could not load wallet.</div>
        )}
      </div>

      {/* Transactions */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Transactions</span>
        </div>
        {txLoading ? (
          <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
        ) : transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {tx.transaction_type.replace('_', ' ')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(tx.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  <span style={{ marginLeft: '8px', color: tx.status === 'completed' ? 'var(--success)' : tx.status === 'failed' ? 'var(--danger)' : 'var(--warning)' }}>
                    {tx.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: txColor(tx.transaction_type), fontFamily: 'var(--font-mono)' }}>
                {txSign(tx.transaction_type)}{Number(tx.amount).toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '32px 20px', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>No transactions yet.</div>
        )}
      </div>

      {/* Deposit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '380px' }}>
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📱</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Check your phone</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                  An M-Pesa prompt has been sent to {phone}. Enter your PIN to complete the deposit.
                </div>
                <button onClick={closeModal} style={{ width: '100%', padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Deposit Funds</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {['mpesa', 'stripe'].map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '9px', border: '1px solid', borderColor: method === m ? 'var(--accent)' : 'var(--border)', borderRadius: 'var(--radius-md)', background: method === m ? 'var(--accent-dim)' : 'transparent', color: method === m ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: method === m ? 600 : 400, cursor: 'pointer' }}>
                      {m === 'mpesa' ? 'M-Pesa' : 'Stripe'}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>amount (KES)</label>
                  <input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='e.g. 500' style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {method === 'mpesa' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>phone number</label>
                    <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='e.g. 0712345678' style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                )}
                {method === 'stripe' && (
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stripe integration coming in Phase 12.</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={closeModal} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleDeposit} disabled={depositing || method === 'stripe'} style={{ flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: depositing ? 'not-allowed' : 'pointer', opacity: depositing || method === 'stripe' ? 0.6 : 1 }}>
                    {depositing ? 'Sending...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
