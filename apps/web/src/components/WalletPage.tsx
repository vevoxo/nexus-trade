'use client'

import { useState } from 'react'
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, DollarSign } from 'lucide-react'
import { useAccountSummary } from '@/hooks/useMarketData'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export default function WalletPage() {
  const { data: account } = useAccountSummary()
  const { accessToken } = useAuthStore()
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }
    setLoading(true)
    try {
      await apiClient.post('/account/deposit-request', {
        amount: parseFloat(depositAmount),
        note: 'User deposit request'
      }, accessToken ?? undefined)
      setMessage({ type: 'success', text: 'Deposit request submitted successfully' })
      setDepositAmount('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit deposit request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0a0e27] p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#94a3b8] mb-2 flex items-center gap-2 sm:gap-3">
            <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />
            Wallet
          </h1>
          <p className="text-sm sm:text-base text-[#ffffff]">Manage your account balance and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-4 shadow-sm">
            <div className="text-sm text-[#94a3b8] mb-1">Total Balance</div>
            <div className="text-2xl font-bold text-white">
              ${account?.balance.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-4 shadow-sm">
            <div className="text-sm text-[#94a3b8] mb-1">Equity</div>
            <div className="text-2xl font-bold text-white">
              ${account?.equity.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-4 shadow-sm">
            <div className="text-sm text-[#94a3b8] mb-1">Free Margin</div>
            <div className="text-2xl font-bold text-white">
              ${account?.freeMargin.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Deposit/Withdraw */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-[#94a3b8]" />
              Deposit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={loading}
                className="w-full py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Request Deposit'}
              </button>
            </div>
          </div>

          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-[#94a3b8]" />
              Withdraw
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <button
                className="w-full py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#f8d7da] text-[#721c24]'
          }`}>
            {message.text}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-[#94a3b8]" />
            Transaction History
          </h2>
          <div className="text-[#94a3b8] text-sm">
            Your transaction history will appear here
          </div>
        </div>
      </div>
    </div>
  )
}
