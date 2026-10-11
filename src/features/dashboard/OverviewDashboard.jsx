/**
 * @file OverviewDashboard.jsx
 * @description Master Fintech Dashboard view aggregating Vital Signs HUD,
 * What-If Decision Spotlight, 30-Day SVG Trajectory, Ledger, and Micro-Vaults.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { memo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Dices, 
  PiggyBank, 
  Zap 
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';
import { Badge, Button, Card, ProgressBar } from '../../components/ui';
import VitalSignsHUD from './VitalSignsHUD';
import ForecastChart from '../forecast/ForecastChart';
import WishlistVault from '../savings/WishlistVault';
import TransactionLedger from '../transactions/TransactionLedger';
import { SIMULATION_PRESETS } from '../../data/initialData';

function OverviewDashboardComponent({ onOpenAddModal }) {
  const {
    currentDay,
    daysRemaining,
    commitments,
    savingsGoals,
    setActiveTab,
    setSimulation
  } = useFinance();

  // Find next unpaid commitment
  const nextCommitment = commitments.find(c => !c.paid && c.dueDay >= currentDay);

  const handleQuickSimulate = (preset) => {
    setSimulation({
      name: preset.name,
      amount: preset.amount,
      category: preset.category,
      icon: preset.icon,
      frequency: preset.frequency,
      active: true,
    });
    setActiveTab('simulator');
  };

  return (
    <div className="space-y-6" id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard">
      
      {/* 1. Vital Signs Heads-Up Display */}
      <VitalSignsHUD />

      {/* 2. Spotlight: "Decision Simulator" Call to Action Widget */}
      <section 
        aria-label="Decision Simulator Spotlight"
        className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[var(--bg-surface-2)] border border-violet-500/25 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-violet-300 uppercase tracking-wider mb-2.5 bg-violet-500/20 px-3.5 py-1 rounded-full border border-violet-500/40 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" aria-hidden="true" />
              Centerpiece Feature // What-If Sandbox
            </div>
            <h2 className="text-xl sm:text-3xl font-heading font-black text-white tracking-tight mb-2">
              Tempted to Spend? Simulate Consequences First.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every ₹100 spent changes your daily allowance for the next {daysRemaining} days. Test your cravings before tapping UPI!
            </p>

            {/* Quick 1-Tap Chips */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {SIMULATION_PRESETS.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickSimulate(p)}
                  aria-label={`Simulate ${p.name} for ${p.amount} rupees`}
                  className="px-3.5 py-2 rounded-2xl bg-[var(--bg-well)] hover:bg-violet-600/30 hover:border-violet-500/60 border border-white/10 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 group shadow focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono font-black text-violet-400 group-hover:text-white">₹{p.amount}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <Button
              onClick={() => setActiveTab('simulator')}
              className="py-3.5 px-7 shadow-2xl whitespace-nowrap focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
            >
              <Zap className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Open Decision Simulator</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>

            <Button
              variant="secondary"
              onClick={() => setActiveTab('curveball')}
              className="py-3 px-5 text-xs font-bold focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
            >
              <Dices className="w-4 h-4 text-rose-400" aria-hidden="true" />
              <span>Spin Life Curveball</span>
            </Button>
          </div>
        </div>

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      </section>

      {/* 3. Upcoming Obligations Warning Strip */}
      {nextCommitment && (
        <section 
          aria-label="Upcoming Commitment Alert"
          className="p-4 sm:p-5 rounded-2xl bg-amber-950/25 border border-amber-500/35 flex flex-wrap items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 shadow-inner">
              {nextCommitment.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Upcoming Priority Bill:
                </span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  {nextCommitment.name} (₹{nextCommitment.amount})
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Due on Day {nextCommitment.dueDay} of 30 ({nextCommitment.dueDay - currentDay} days away). Keep this reserved in liquid cash!
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setActiveTab('commitments')}
            aria-label="Manage upcoming bills"
            className="py-2 px-4 text-xs font-bold text-amber-300 hover:text-white border-amber-500/30 font-mono focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            <span>Manage Bills</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </section>
      )}

      {/* 4. Two-Column Layout: Forecast Chart + Micro-Vaults / Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Forecast Curve & Ledger (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ForecastChart />
          <TransactionLedger onOpenAddModal={onOpenAddModal} />
        </div>

        {/* Right Column: Micro-Savings & Delayed Gratification (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Micro-Savings Vaults Card */}
          <Card 
            as="section"
            aria-label="Micro-Savings Summary"
            className="p-5 sm:p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span>Micro-Savings Vaults</span>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                aria-label="View all savings vaults"
                className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              {savingsGoals.map(g => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <Card key={g.id} variant="inset" className="p-3.5 rounded-2xl space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="text-lg">{g.icon}</span>
                        <span className="truncate">{g.name}</span>
                      </span>
                      <Badge tone="teal">{pct}%</Badge>
                    </div>

                    <ProgressBar
                      value={pct}
                      color={g.color || 'var(--aurora-cyan-deep)'}
                      ariaLabel={`Progress for goal ${g.name}`}
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                      <span>₹{g.current} locked</span>
                      <span>Target: ₹{g.target}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          {/* Impulse-Stopped Wishlist Vault */}
          <WishlistVault />

        </div>

      </div>

    </div>
  );
}

export default memo(OverviewDashboardComponent);
