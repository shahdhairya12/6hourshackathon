import React from 'react';
import { 
  Wallet, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Cpu 
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function VitalSignsHUD() {
  const {
    liquidBalance,
    totalLockedInSavings,
    totalPendingLiabilities,
    safeDailyAllowance,
    daysRemaining,
    runwayDays,
    averageDailySpend,
    financialRisk,
    riskStatus,
    financialHealth,
    healthStatus,
    setActiveTab,
    trueFreeCash
  } = useFinance();

  // Allowance tier color & styling
  const allowanceTier = safeDailyAllowance >= 250 
    ? { label: 'Comfortable', color: '#10B981', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', glow: 'glow-emerald' }
    : safeDailyAllowance >= 140
    ? { label: 'Moderate Leeway', color: '#F59E0B', bg: 'bg-amber-500/15', border: 'border-amber-500/40', glow: 'glow-amber' }
    : { label: 'Survival Squeeze', color: '#EF4444', bg: 'bg-rose-500/15', border: 'border-rose-500/40', glow: 'glow-rose' };

  // Calculate percentage of ₹10,000 initial budget remaining in liquid form
  const budgetPctRemaining = Math.max(0, Math.min(100, Math.round((liquidBalance / 10000) * 100)));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Liquid Balance Holographic Card */}
      <div className="holo-card p-5 rounded-[22px] flex flex-col justify-between relative group hover:border-violet-500/50 transition-all">
        
        <div>
          {/* Header & Chip */}
          <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Wallet className="w-4 h-4 text-violet-400" />
              <span>Liquid Cash Balance</span>
            </div>

            {/* Stylized Fintech Micro-Chip */}
            <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-300/40 rounded px-1.5 py-0.5">
              <Cpu className="w-3 h-3 text-amber-300" />
              <span className="text-[9px] font-mono font-bold text-amber-200">₹10K</span>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              ₹{liquidBalance.toLocaleString('en-IN')}
            </span>
            {liquidBalance < 0 && (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/40 font-mono animate-pulse">
                DEFICIT
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-mono mb-3">
            {budgetPctRemaining}% of monthly capital liquid
          </div>
        </div>

        {/* Progress bar towards ₹10k */}
        <div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${budgetPctRemaining}%` }}
            />
          </div>

          {/* Breakdown Pills */}
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10 font-mono">
            <div className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Vaults:</span>
              <span className="text-cyan-300 font-bold">₹{totalLockedInSavings}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Bills hold:</span>
              <span className="text-amber-300 font-bold">₹{totalPendingLiabilities}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Safe Daily Allowance (Hero Card) */}
      <div className={`glass-panel p-5 relative overflow-hidden border-2 ${allowanceTier.border} bg-gradient-to-b from-[#141d3d] via-[#0f1730] to-[#0a1024] flex flex-col justify-between shadow-2xl`}>
        
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-bold text-white tracking-wide">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              Safe Daily Spend
            </span>
            <span 
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${allowanceTier.bg} border`}
              style={{ color: allowanceTier.color, borderColor: allowanceTier.color + '55' }}
            >
              {allowanceTier.label}
            </span>
          </div>

          {/* Main Hero Number */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight font-mono text-white">
              ₹{safeDailyAllowance.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ day</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Discretionary cap for today & next {daysRemaining} days
          </div>
        </div>

        {/* Dynamic Formula Popover Box */}
        <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            (<strong>₹{Math.max(0, trueFreeCash).toLocaleString('en-IN')}</strong> free cash) ÷ <strong>{daysRemaining}</strong> remaining days
          </span>
        </div>

        {/* Ambient glow */}
        <div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: allowanceTier.color }}
        />
      </div>

      {/* 3. Financial Health Radar */}
      <div 
        onClick={() => setActiveTab('simulator')}
        className="glass-panel p-5 relative overflow-hidden cursor-pointer group hover:border-cyan-500/50 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Financial Health Radar
            </span>
            <span className="text-sm">{healthStatus.emoji}</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black font-mono tracking-tight" style={{ color: healthStatus.color }}>
                  {financialHealth}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="font-bold text-xs text-slate-200 mt-0.5">{healthStatus.label}</div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeWidth="3.5"
                  strokeDasharray={`${financialHealth}, 100`}
                  strokeLinecap="round"
                  stroke={healthStatus.color}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mini 3-Segment Discipline Breakdown */}
        <div className="border-t border-white/10 pt-2.5 space-y-1.5 text-[10px] font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Solvency Cushion:</span>
            <span className="text-emerald-400 font-bold">{Math.min(100, Math.round((Math.max(0, trueFreeCash) / 4000) * 100))}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Savings Discipline:</span>
            <span className="text-cyan-400 font-bold">{Math.min(100, Math.round((totalLockedInSavings / 3000) * 100))}%</span>
          </div>
        </div>

      </div>

      {/* 4. Risk & Runway Horizon */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/40 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Risk Index & Runway
            </span>
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase border" 
              style={{ color: riskStatus.color, background: riskStatus.bg, borderColor: riskStatus.color + '55' }}
            >
              {riskStatus.label}
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-heading font-black font-mono tracking-tight" style={{ color: riskStatus.color }}>
                {financialRisk}%
              </span>
              <span className="text-xs text-slate-400 font-mono">stress</span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Runway</div>
              <div className={`text-base font-bold font-mono ${runwayDays >= daysRemaining ? 'text-emerald-400' : 'text-rose-400'}`}>
                {runwayDays} Days
              </div>
            </div>
          </div>
        </div>

        {/* Risk meter bar */}
        <div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${financialRisk}%`, 
                backgroundColor: riskStatus.color,
                boxShadow: `0 0 10px ${riskStatus.color}`
              }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between items-center font-mono pt-1 border-t border-white/10">
            <span>Burn: ~₹{averageDailySpend}/d</span>
            <span className={averageDailySpend <= 333 ? 'text-emerald-400' : 'text-amber-400'}>
              {averageDailySpend <= 333 ? '✓ Under ₹333 cap' : '⚡ Over pacing'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
