'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, X } from 'lucide-react'

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

interface PositionsPanelProps {
  positions: Position[]
  onClosePosition: (id: string) => void
}

export default function PositionsPanel({ positions, onClosePosition }: PositionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'pending' | 'finance' | 'closed'>('open')
  const [expanded, setExpanded] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'open', label: 'OPEN POSITIONS', count: positions.length },
    { id: 'pending', label: 'PENDING ORDERS', count: 0 },
    { id: 'finance', label: 'FINANCE', count: null },
    { id: 'closed', label: 'CLOSED POSITIONS', count: 0 },
  ] as const

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === positions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(positions.map(p => p.id)))
    }
  }

  const floatingPL = positions.reduce((sum, p) => sum + p.profit, 0)

  return (
    <div className="h-full flex flex-col bg-gradient-to-r from-[#0d1326] via-[#0b1020] to-[#0c1226] border-t border-white/5">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 backdrop-blur">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-[11px] font-semibold tracking-tight transition border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-accent-cyan'
                  : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-1 text-accent-cyan">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:text-white"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            EXPAND LIST
          </button>
        </div>
      </div>

      {/* Table */}
      {expanded && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-white/5 backdrop-blur sticky top-0">
              <tr className="text-slate-500 uppercase">
                <th className="px-3 py-2 text-left w-8">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === positions.length && positions.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                  />
                </th>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Open Time</th>
                <th className="px-3 py-2 text-left">Symbol</th>
                <th className="px-3 py-2 text-right">Volume</th>
                <th className="px-3 py-2 text-center">Side</th>
                <th className="px-3 py-2 text-right">Open Price</th>
                <th className="px-3 py-2 text-right">Current Price</th>
                <th className="px-3 py-2 text-right">S/L</th>
                <th className="px-3 py-2 text-right">T/P</th>
                <th className="px-3 py-2 text-right">Swap</th>
                <th className="px-3 py-2 text-right">Commission</th>
                <th className="px-3 py-2 text-right">Net Profit</th>
                <th className="px-3 py-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr 
                  key={position.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-3 py-2">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(position.id)}
                      onChange={() => toggleSelect(position.id)}
                      className="w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-500 font-mono text-[10px]">
                    {position.id.slice(0, 8)}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-100">{position.openTime}</td>
                  <td className="px-3 py-2 font-semibold tracking-tight">{position.symbol}</td>
                  <td className="px-3 py-2 text-right font-mono">{position.volume.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`font-semibold ${position.side === 'BUY' ? 'text-buy-green' : 'text-sell-red'}`}>
                      {position.side}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{position.openPrice.toFixed(5)}</td>
                  <td className="px-3 py-2 text-right font-mono">{position.currentPrice.toFixed(5)}</td>
                  <td className="px-3 py-2 text-right font-mono text-slate-500">
                    {position.stopLoss === 0 ? '0.00000' : position.stopLoss.toFixed(5)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-500">
                    {position.takeProfit === 0 ? '0.00000' : position.takeProfit.toFixed(5)}
                  </td>
                  <td className={`px-3 py-2 text-right font-mono ${position.swap < 0 ? 'text-loss' : ''}`}>
                    {position.swap.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{position.commission.toFixed(2)}</td>
                  <td className={`px-3 py-2 text-right font-mono font-semibold ${
                    position.profit >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {position.profit >= 0 ? '+' : ''}{position.profit.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button 
                      onClick={() => onClosePosition(position.id)}
                      className="p-1 text-slate-400 hover:text-sell-red hover:bg-sell-red/10 rounded transition-colors"
                      title="Close Position"
                    >
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {positions.length === 0 && (
            <div className="flex items-center justify-center py-8 text-[#64748b]">
              No open positions
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/5 backdrop-blur">
        <div className="text-xs text-slate-400">
          Floating P/L: 
          <span className={`ml-2 font-mono font-semibold ${floatingPL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {floatingPL >= 0 ? '+' : ''}{floatingPL.toFixed(2)} USD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">SELECT ALL</span>
          <input 
            type="checkbox" 
            checked={selectedIds.size === positions.length && positions.length > 0}
            onChange={toggleSelectAll}
            className="w-3.5 h-3.5 rounded border-white/10 bg-white/5"
          />
        </div>
      </div>
    </div>
  )
}

