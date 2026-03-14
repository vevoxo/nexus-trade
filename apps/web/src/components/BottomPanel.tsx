'use client'

import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Zap } from 'lucide-react'

interface Position {
  id: string
  openTime: string
  symbol: string
  volume: number
  side: 'BUY' | 'SELL'
  openPrice: number
  currentPrice: number
  stopLoss: number
  takeProfit: number
  swap: number
  commission: number
  profit: number
}

interface BottomPanelProps {
  positions: Position[]
  onClosePosition: (id: string) => void
}

export default function BottomPanel({ positions, onClosePosition }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'pending'>('positions')
  const [closingId, setClosingId] = useState<string | null>(null)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    if (price > 100) return price.toFixed(2)
    if (price > 10) return price.toFixed(3)
    if (price > 1) return price.toFixed(4)
    return price.toFixed(5)
  }

  const handleClose = async (id: string) => {
    setClosingId(id)
    try {
      await onClosePosition(id)
      setTimeout(() => setClosingId(null), 1000)
    } catch (error) {
      setClosingId(null)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#1a1d2e] via-[#151824] to-[#0f1219] border-t border-[#2d3142]/50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#4f46e5] rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Tabs - Futuristic Design */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#2d3142]/50 bg-[#252836]/50 backdrop-blur-sm relative z-10">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative overflow-hidden ${
            activeTab === 'positions'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-lg shadow-[#4f46e5]/30'
              : 'text-[#8e92a3] hover:text-white hover:bg-[#2d3142]/50'
          }`}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Positions
            {positions.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {positions.length}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-lg shadow-[#4f46e5]/30'
              : 'text-[#8e92a3] hover:text-white hover:bg-[#2d3142]/50'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-lg shadow-[#4f46e5]/30'
              : 'text-[#8e92a3] hover:text-white hover:bg-[#2d3142]/50'
          }`}
        >
          Pending orders
        </button>
        <button className="ml-auto px-2 py-1 text-xs text-[#8e92a3] hover:text-white hover:bg-[#2d3142]/50 rounded transition">
          +
        </button>
      </div>

      {/* Content - Futuristic Table */}
      <div className="flex-1 overflow-auto relative z-10">
        {activeTab === 'positions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
            <thead className="bg-[#252836]/50 backdrop-blur-sm sticky top-0 border-b border-[#2d3142]/50">
              <tr className="text-[10px] text-[#8e92a3] uppercase tracking-wider">
                <th className="text-left px-3 py-2">ORDER</th>
                <th className="text-left px-3 py-2">OPEN DATE</th>
                <th className="text-left px-3 py-2">TYPE</th>
                <th className="text-right px-3 py-2">VOLUME</th>
                <th className="text-right px-3 py-2">SL PRICE</th>
                <th className="text-right px-3 py-2">TP PRICE</th>
                <th className="text-right px-3 py-2">OPEN PRICE</th>
                <th className="text-right px-3 py-2">MARKET PRICE</th>
                <th className="text-right px-3 py-2">COMMISSION</th>
                <th className="text-right px-3 py-2">SWAPS</th>
                <th className="text-right px-3 py-2">GROSS PROFIT</th>
                <th className="text-center px-3 py-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-[#252836]/30 border border-[#2d3142]/50">
                        <Zap className="h-8 w-8 text-[#4f46e5] animate-pulse" />
                      </div>
                      <p className="text-sm text-[#8e92a3]">No open positions</p>
                      <p className="text-xs text-[#64748b]">Click BUY or SELL to open a trade</p>
                    </div>
                  </td>
                </tr>
              ) : (
                positions.map((position) => {
                  const isClosing = closingId === position.id
                  return (
                    <tr
                      key={position.id}
                      className={`border-b border-[#2d3142]/30 hover:bg-[#252836]/30 transition-all ${
                        isClosing ? 'bg-[#4f46e5]/10' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5">
                        <span className="text-white font-semibold">{position.symbol}</span>
                      </td>
                      <td className="px-3 py-2.5 text-white font-mono text-[10px]">
                        {formatDate(position.openTime)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                          position.side === 'BUY'
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                            : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                        }`}>
                          {position.side === 'BUY' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {position.side}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">{position.volume}</td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">
                        {position.stopLoss > 0 ? formatPrice(position.stopLoss) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">
                        {position.takeProfit > 0 ? formatPrice(position.takeProfit) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">{formatPrice(position.openPrice)}</td>
                      <td className="px-3 py-2.5 text-right text-white font-mono animate-pulse">
                        {formatPrice(position.currentPrice)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">${position.commission.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-right text-white font-mono">${position.swap.toFixed(2)}</td>
                      <td className={`px-3 py-2.5 text-right font-bold font-mono ${
                        position.profit >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}>
                        {position.profit >= 0 ? '+' : ''}${position.profit.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => handleClose(position.id)}
                          disabled={isClosing}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all transform ${
                            isClosing
                              ? 'bg-[#4f46e5] text-white animate-pulse'
                              : 'bg-[#ef4444] text-white hover:bg-[#dc2626] hover:scale-105 active:scale-95'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isClosing ? 'Closing...' : 'Close'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            </table>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-[#252836]/30 border border-[#2d3142]/50">
                <Zap className="h-8 w-8 text-[#4f46e5] animate-pulse" />
              </div>
              <p className="text-sm text-[#8e92a3]">No closed positions</p>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-[#252836]/30 border border-[#2d3142]/50">
                <Zap className="h-8 w-8 text-[#4f46e5] animate-pulse" />
              </div>
              <p className="text-sm text-[#8e92a3]">No pending orders</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
