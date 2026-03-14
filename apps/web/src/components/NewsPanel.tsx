'use client'

import { useEffect, useState } from 'react'
import { Bell, RefreshCw, TrendingUp, TrendingDown, Activity, Zap, Brain, Target, AlertTriangle, Sparkles } from 'lucide-react'

type NewsItem = {
  id: string
  title: string
  category: 'Forex' | 'Crypto' | 'Stocks' | 'Commodities' | 'Indices'
  time: string
  impact: 'Low' | 'Medium' | 'High' | 'Critical'
  sentiment: 'Bullish' | 'Bearish' | 'Neutral'
  predictedMove: number // percentage
  aiConfidence: number // 0-100
  affectedSymbols: string[]
  aiInsight: string
  marketPulse: number // 0-100
}

const FUTURE_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'AI Quantum Analysis: EURUSD showing 87.3% probability of upward momentum in next 4 hours',
    category: 'Forex',
    time: 'Just now',
    impact: 'High',
    sentiment: 'Bullish',
    predictedMove: 0.45,
    aiConfidence: 87,
    affectedSymbols: ['EURUSD', 'EURGBP', 'EURNOK'],
    aiInsight: 'Neural network detected pattern matching 94% historical accuracy. Support level at 1.08620 holding strong.',
    marketPulse: 78,
  },
  {
    id: 'n2',
    title: 'Blockchain Sentiment Engine: BTC institutional flow surge detected - 3.2B USD in last 15 minutes',
    category: 'Crypto',
    time: '30s ago',
    impact: 'Critical',
    sentiment: 'Bullish',
    predictedMove: 2.8,
    aiConfidence: 92,
    affectedSymbols: ['BTCUSD', 'ETHUSD', 'SOLUSD'],
    aiInsight: 'AI detected whale accumulation pattern. Price target: $69,200 within 6 hours. Confidence: 92%',
    marketPulse: 95,
  },
  {
    id: 'n3',
    title: 'Predictive Analytics: XAUUSD quantum resistance level breached - AI forecasts +1.2% move',
    category: 'Commodities',
    time: '1m ago',
    impact: 'High',
    sentiment: 'Bullish',
    predictedMove: 1.2,
    aiConfidence: 81,
    affectedSymbols: ['XAUUSD', 'XAGUSD'],
    aiInsight: 'Machine learning model identified breakout pattern. Next resistance: $2,185.50. Momentum building.',
    marketPulse: 72,
  },
  {
    id: 'n4',
    title: 'Deep Learning Forecast: SPX500 futures showing consolidation pattern - AI suggests sideways movement',
    category: 'Indices',
    time: '2m ago',
    impact: 'Medium',
    sentiment: 'Neutral',
    predictedMove: 0.15,
    aiConfidence: 65,
    affectedSymbols: ['SPX500', 'NAS100', 'DJI30'],
    aiInsight: 'Neural network analysis indicates range-bound trading. Support: 4,850. Resistance: 4,920.',
    marketPulse: 45,
  },
  {
    id: 'n5',
    title: 'AI Sentiment Analysis: AAPL showing strong buy signals from 247 institutional algorithms',
    category: 'Stocks',
    time: '3m ago',
    impact: 'High',
    sentiment: 'Bullish',
    predictedMove: 1.8,
    aiConfidence: 88,
    affectedSymbols: ['AAPL', 'MSFT', 'AMZN'],
    aiInsight: 'Quantum trading algorithms detected accumulation. Target: $198.50. Stop loss recommended at $192.30.',
    marketPulse: 82,
  },
  {
    id: 'n6',
    title: 'Real-time AI Prediction: GBPUSD volatility spike detected - Neural network suggests 0.8% swing potential',
    category: 'Forex',
    time: '4m ago',
    impact: 'Medium',
    sentiment: 'Bullish',
    predictedMove: 0.8,
    aiConfidence: 74,
    affectedSymbols: ['GBPUSD', 'EURGBP'],
    aiInsight: 'AI detected unusual volume pattern. Momentum indicator: Strong. Entry signal: Active.',
    marketPulse: 68,
  },
]

export function NewsPanel() {
  const [items, setItems] = useState<NewsItem[]>(FUTURE_NEWS)
  const [toast, setToast] = useState<NewsItem | null>(null)
  const [pulseAnimation, setPulseAnimation] = useState(0)

  const refresh = () => {
    const stamp = Date.now()
    const rotated = [...FUTURE_NEWS].map((n, i) => ({
      ...n,
      id: `${n.id}-${stamp}-${i}`,
      time: i === 0 ? 'Just now' : `${i * 30}s ago`,
      predictedMove: n.predictedMove + (Math.random() * 0.2 - 0.1),
      aiConfidence: Math.min(100, Math.max(60, n.aiConfidence + (Math.random() * 10 - 5))),
      marketPulse: Math.min(100, Math.max(30, n.marketPulse + (Math.random() * 10 - 5))),
    }))
    setItems(rotated)
    setToast(rotated[0])
  }

  useEffect(() => {
    const id = setInterval(() => {
      refresh()
    }, 45000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const pulseId = setInterval(() => {
      setPulseAnimation((prev) => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(pulseId)
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(id)
  }, [toast])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'High':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return <TrendingUp size={12} className="text-green-400" />
      case 'Bearish':
        return <TrendingDown size={12} className="text-red-400" />
      default:
        return <Activity size={12} className="text-slate-400" />
    }
  }

  return (
    <>
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#0c1220] to-[#0b0f1f] p-4 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md animate-pulse" />
              <Brain size={20} className="relative text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI Market Intelligence
                </span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-400 font-semibold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Quantum Neural Network · Real-time Analysis</div>
            </div>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 text-xs text-slate-300 transition-all"
          >
            <RefreshCw size={12} className="animate-spin-slow" />
            Sync
          </button>
        </div>

        {/* Market Pulse Indicator */}
        <div className="relative rounded-xl border border-white/10 bg-gradient-to-r from-[#0a0f1c] to-[#0c1220] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Market Pulse</span>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {Math.round((items[0]?.marketPulse || 0) + Math.sin(pulseAnimation * 0.1) * 2)}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300"
              style={{
                width: `${(items[0]?.marketPulse || 0) + Math.sin(pulseAnimation * 0.1) * 2}%`,
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
              }}
            />
          </div>
        </div>

        {/* News Items */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/3 to-transparent p-3 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300"
            >
              {/* Animated border glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
              
              <div className="relative">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] font-semibold text-slate-300">
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${getImpactColor(item.impact)}`}>
                      {item.impact === 'Critical' && <AlertTriangle size={10} />}
                      {item.impact}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 flex items-center gap-1">
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{item.time}</span>
                </div>

                {/* Title */}
                <div className="text-sm font-semibold text-white mb-2 leading-snug">{item.title}</div>

                {/* AI Insights Row */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Target size={10} className="text-cyan-400" />
                    <span className="text-[10px] font-mono text-cyan-400">
                      {item.predictedMove > 0 ? '+' : ''}
                      {item.predictedMove.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Brain size={10} className="text-purple-400" />
                    <span className="text-[10px] font-mono text-purple-400">{item.aiConfidence}% AI</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.affectedSymbols.slice(0, 3).map((sym) => (
                      <span
                        key={sym}
                        className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-400"
                      >
                        {sym}
                      </span>
                    ))}
                    {item.affectedSymbols.length > 3 && (
                      <span className="text-[9px] text-slate-500">+{item.affectedSymbols.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 border border-cyan-500/10">
                  <div className="flex items-start gap-2">
                    <Sparkles size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-slate-300 leading-relaxed">{item.aiInsight}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Futuristic Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="relative rounded-xl border border-cyan-500/30 bg-gradient-to-br from-[#0f172a] via-[#0c1220] to-[#0b0f1f] p-4 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl min-w-[320px]">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-sm animate-pulse" />
                    <Zap size={16} className="relative text-cyan-400" />
                  </div>
                  <span className="text-xs font-semibold text-cyan-400">AI Alert</span>
                </div>
                <span className="text-[10px] text-slate-500">{toast.time}</span>
              </div>
              <div className="text-sm font-bold text-white mb-2 leading-snug">{toast.title}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-lg border text-[10px] font-semibold ${getImpactColor(toast.impact)}`}>
                  {toast.impact}
                </span>
                <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                  {toast.predictedMove > 0 ? '+' : ''}
                  {toast.predictedMove.toFixed(2)}% predicted
                </span>
                <span className="px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-400">
                  {toast.aiConfidence}% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  )
}

