'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, Zap, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: {
      bg: 'bg-gradient-to-r from-[#10b981] to-[#059669]',
      border: 'border-[#10b981]',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]',
      border: 'border-[#ef4444]',
      icon: XCircle,
    },
    info: {
      bg: 'bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]',
      border: 'border-[#4f46e5]',
      icon: Zap,
    },
  }

  const { bg, border, icon: Icon } = colors[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bg} border-2 ${border} rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm flex items-center gap-3 min-w-[300px]`}>
        <Icon className="h-5 w-5 text-white flex-shrink-0" />
        <p className="text-sm font-semibold text-white flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
