'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface MarketSymbol {
  symbol: string
  bid: number
  ask: number
  spread: number
  changePercent: number
  icon?: string
}

interface MarketWatchProps {
  symbols: MarketSymbol[]
  selectedSymbol: MarketSymbol | null
  onSelectSymbol: (symbol: MarketSymbol) => void
  category?: string
  onCategoryChange?: (category: string) => void
}

export default function MarketWatch({
  symbols,
  selectedSymbol,
  onSelectSymbol,
  category = 'Forex FX Exotic',
  onCategoryChange,
}: MarketWatchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number) => {
    if (price > 100) return price.toFixed(2)
    if (price > 10) return price.toFixed(3)
    if (price > 1) return price.toFixed(4)
    return price.toFixed(5)
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1d2e] border-l border-[#2d3142] min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-[#2d3142] bg-[#252836]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">Market</span>
          <button className="text-xs text-[#8e92a3] hover:text-white">+</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-3 py-2 border-b border-[#2d3142]">
        <select
          value={category}
          onChange={(e) => onCategoryChange?.(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-[#252836] border border-[#2d3142] rounded text-white focus:outline-none focus:border-[#4f46e5]"
        >
          <option>Forex FX Exotic</option>
          <option>Forex FX Major</option>
          <option>Forex FX Minor</option>
          <option>Crypto</option>
          <option>Commodities</option>
          <option>Indices</option>
          <option>Stocks</option>
        </select>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#2d3142] flex items-center gap-2">
        <Search className="h-4 w-4 text-[#8e92a3]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-transparent text-xs text-white placeholder-[#8e92a3] focus:outline-none"
        />
        <Filter className="h-4 w-4 text-[#8e92a3] cursor-pointer hover:text-white" />
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-[10px] text-[#8e92a3] px-3 py-1 bg-[#252836] font-semibold uppercase">
          Symbol
        </div>
        <table className="w-full text-xs">
          <thead className="bg-[#252836] sticky top-0">
            <tr className="text-[10px] text-[#8e92a3] uppercase">
              <th className="text-left px-3 py-1">Symbol</th>
              <th className="text-right px-3 py-1">BID</th>
              <th className="text-right px-3 py-1">ASK</th>
            </tr>
          </thead>
          <tbody>
            {filteredSymbols.map((symbol) => {
              const isSelected = selectedSymbol?.symbol === symbol.symbol
              return (
                <tr
                  key={symbol.symbol}
                  onClick={() => onSelectSymbol(symbol)}
                  className={`cursor-pointer hover:bg-[#2d3142] transition ${
                    isSelected ? 'bg-[#2d3142] border-l-2 border-[#4f46e5]' : ''
                  }`}
                >
                  <td className="px-3 py-1.5 text-white font-medium">{symbol.symbol}</td>
                  <td className="px-3 py-1.5 text-right text-white">{formatPrice(symbol.bid)}</td>
                  <td className="px-3 py-1.5 text-right text-white">{formatPrice(symbol.ask)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
