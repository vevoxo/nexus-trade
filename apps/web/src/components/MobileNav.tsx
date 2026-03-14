'use client'

import { BarChart3, Briefcase, Plus, User, Wallet } from 'lucide-react'

interface MobileNavProps {
  activeTab: 'chart' | 'positions'
  onTabChange: (tab: 'chart' | 'positions') => void
  onTradeClick: () => void
}

export default function MobileNav({ activeTab, onTabChange, onTradeClick }: MobileNavProps) {
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={onTradeClick}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-accent-purple/40 z-50 active:scale-95 transition-transform"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-bg-panel border-t border-[#1e293b] flex items-center justify-around px-4">
        <NavItem 
          icon={<BarChart3 size={22} />} 
          label="Chart" 
          active={activeTab === 'chart'}
          onClick={() => onTabChange('chart')}
        />
        <NavItem 
          icon={<Briefcase size={22} />} 
          label="Positions" 
          active={activeTab === 'positions'}
          onClick={() => onTabChange('positions')}
        />
        <NavItem 
          icon={<Wallet size={22} />} 
          label="Wallet" 
          active={false}
          onClick={() => {}}
        />
        <NavItem 
          icon={<User size={22} />} 
          label="Profile" 
          active={false}
          onClick={() => {}}
        />
      </nav>
    </>
  )
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
        active ? 'text-accent-cyan' : 'text-[#64748b]'
      }`}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </button>
  )
}

