/**
 * @file VitalSignsHUD.jsx
 * @description Holographic Financial Vital Signs Heads-Up Display (HUD).
 * Delivers real-time telemetry across Liquid Cash, Safe Daily Spend,
 * Financial Health & DEFCON Readiness, and Risk/Runway Horizon.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { memo } from 'react';
import { 
  Wallet, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Cpu,
  Lock,
  Dices
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

function VitalSignsHUDComponent() {
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
    defconState,
    austerityMode,
    monteCarloFanResult,
    setActiveTab,
    trueFreeCash
  } = useFinance();

  // Allowance tier color & styling
  const allowanceTier = safeDailyAllowance >= 250 
    ? { label: 'Comfortable', color: 'var(--status-emerald)', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40' }
    : safeDailyAllowance >= 140
    ? { label: 'Moderate Leeway', color: 'var(--status-amber)', bg: 'bg-amber-500/15', border: 'border-amber-500/40' }
    : { label: 'Survival Squeeze', color: 'var(--status-red)', bg: 'bg-rose-500/15', border: 'border-rose-500/40' };

  // Calculate percentage of ₹10,000 initial budget remaining in liquid form
  const budgetPctRemaining = Math.max(0, Math.min(100, Math.round((liquidBalance / 10000) * 100)));

  return (
    <section 
      aria-label="Financial Vital Signs HUD" 
      aria-live="polite"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      
      {/* 1. Liquid Balance Holographic Card */}
      <div className="holo-card p-5 rounded-[24px] flex flex-col justify-between relative group hover:border-violet-500/40 transition-all shadow-xl">
        
        <div>
          {/* Header & Chip */}
          <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Wallet className="w-4 h-4 text-violet-400" aria-hidden="true" />
              <span>Liquid Cash Balance</span>
            </div>

            {/* Stylized Fintech Micro-Chip */}
            <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-300/40 rounded px-1.5 py-0.5">
              <Cpu className="w-3 h-3 text-amber-300" aria-hidden="true" />
              <span className="text-[9px] font-mono font-bold text-amber-200">₹10K OS</span>
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
              role="progressbar"
              aria-valuenow={budgetPctRemaining}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Liquid capital remaining"
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${budgetPctRemaining}%` }}
            />
          </div>

          {/* Breakdown Pills */}
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10 font-mono">
            <div className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              <span>Vaults:</span>
              <span className="text-cyan-300 font-bold">₹{totalLockedInSavings}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              <span>Bills hold:</span>
              <span className="text-amber-300 font-bold">₹{totalPendingLiabilities}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Safe Daily Allowance (Hero Card) */}
      <div className={`glass-panel p-5 relative overflow-hidden border ${allowanceTier.border} bg-gradient-to-b from-[var(--bg-surface-3)] via-[var(--bg-surface)] to-[var(--bg-inset)] flex flex-col justify-between shadow-2xl`}>
        
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-bold text-white tracking-wide">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" aria-hidden="true" />
              Safe Daily Spend
            </span>
            <span 
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${allowanceTier.bg} border`}
              style={{ color: allowanceTier.color, borderColor: `color-mix(in srgb, ${allowanceTier.color} 33%, transparent)` }}
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
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            (<strong>₹{Math.max(0, trueFreeCash).toLocaleString('en-IN')}</strong> free cash) ÷ <strong>{daysRemaining}</strong> days left
          </span>
        </div>

        {/* Ambient glow */}
        <div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: allowanceTier.color }}
          aria-hidden="true"
        />
      </div>

      {/* 3. Financial Health Radar & DEFCON Readiness */}
      <div 
        onClick={() => setActiveTab('simulator')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('simulator'); }}
        aria-label={`Financial Health Score: ${financialHealth} out of 100. DEFCON Level ${defconState.level}: ${defconState.name}. Click to open simulator.`}
        className="glass-panel p-5 relative overflow-hidden cursor-pointer group hover:border-cyan-500/50 flex flex-col justify-between shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Financial Health Radar
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: defconState.bgColor,
                borderColor: defconState.borderColor,
                color: defconState.color
              }}
            >
              DEFCON {defconState.level}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black font-mono tracking-tight" style={{ color: healthStatus.color }}>
                  {financialHealth}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="font-bold text-xs text-slate-200 mt-0.5 flex items-center gap-1">
                <span>{healthStatus.emoji}</span>
                <span>{healthStatus.label}</span>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
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
                  style={{ stroke: healthStatus.color }}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Solvency & Austerity Indicators */}
        <div className="border-t border-white/10 pt-2.5 space-y-1 text-[10px] font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Solvency Cushion:</span>
            <span className="text-emerald-400 font-bold">{Math.min(100, Math.round((Math.max(0, trueFreeCash) / 4000) * 100))}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Austerity Mode:</span>
            <span className={austerityMode ? 'text-rose-400 font-bold flex items-center gap-1' : 'text-slate-400'}>
              {austerityMode ? <><Lock className="w-2.5 h-2.5" /> ACTIVE</> : 'STANDBY'}
            </span>
          </div>
        </div>

      </div>

      {/* 4. Risk Index & Monte Carlo Survival Horizon */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/40 flex flex-col justify-between shadow-xl">
        
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Risk & Survival Horizon
            </span>
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase border" 
              style={{ color: riskStatus.color, background: riskStatus.bg, borderColor: `color-mix(in srgb, ${riskStatus.color} 33%, transparent)` }}
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
              <div className="text-[10px] text-slate-400 font-mono uppercase">Survival Odds</div>
              <div className="text-sm font-bold font-mono text-cyan-400 flex items-center justify-end gap-1">
                <Dices className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>{monteCarloFanResult.survivalRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk meter bar & Runway */}
        <div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div 
              role="progressbar"
              aria-valuenow={financialRisk}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Financial risk level"
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${financialRisk}%`, 
                backgroundColor: riskStatus.color,
                boxShadow: `0 0 10px ${riskStatus.color}`
              }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between items-center font-mono pt-1 border-t border-white/10">
            <span>Runway: {runwayDays}d</span>
            <span className={averageDailySpend <= 333 ? 'text-emerald-400' : 'text-amber-400'}>
              {averageDailySpend <= 333 ? '✓ Under ₹333 cap' : '⚡ High Burn'}
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}

export default memo(VitalSignsHUDComponent);
