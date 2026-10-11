/**
 * @file CommitmentsManager.jsx
 * @description Fixed Commitments & Recurring Subscriptions Vault.
 * Features 1-tap subscription pause/resume, due-day status indicators, and obligation clearance.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, memo } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

function CommitmentsManagerComponent() {
  const {
    commitments,
    subscriptions,
    currentDay,
    daysRemaining,
    payCommitment,
    toggleSubscription,
    pendingCommitmentsTotal,
    pendingSubscriptionsTotal,
    totalPendingLiabilities
  } = useFinance();

  const [activeTab, setActiveTab] = useState('commitments'); // commitments | subscriptions

  return (
    <div className="space-y-6" id="panel-commitments" role="tabpanel" aria-labelledby="tab-commitments">
      
      {/* Top Banner / Summary */}
      <div className="glass-panel p-6 sm:p-7 bg-gradient-to-r from-[var(--bg-surface-3)] via-[var(--bg-surface-2)] to-[var(--bg-well)] border border-amber-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Fixed Obligations & Recurring Subscriptions
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              The Non-Negotiable Bill Vault
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Every commitment locks up your ₹10,000 budget before you can buy chai or Swiggy. Pause subscriptions to instantly restore your daily allowance!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 bg-[var(--bg-well)] border border-white/10 p-4 rounded-2xl shadow-inner">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Pending Liabilities</div>
              <div className="text-2xl sm:text-3xl font-heading font-black font-mono text-amber-400">
                ₹{totalPendingLiabilities.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="border-l border-white/10 pl-5">
              <div className="text-[11px] text-slate-400 font-mono">Budget Locked</div>
              <div className="text-lg font-bold font-mono text-white">
                {Math.round((totalPendingLiabilities / 10000) * 100)}% of ₹10k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3" role="tablist" aria-label="Commitments and Subscriptions categories">
        <button
          role="tab"
          id="tab-fixed-commitments"
          aria-controls="panel-fixed-commitments"
          aria-selected={activeTab === 'commitments'}
          onClick={() => setActiveTab('commitments')}
          className={`tab-pill ${activeTab === 'commitments' ? 'active' : ''}`}
        >
          <span>Fixed Commitments ({commitments.length})</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
            ₹{pendingCommitmentsTotal} due
          </span>
        </button>

        <button
          role="tab"
          id="tab-recurring-subs"
          aria-controls="panel-recurring-subs"
          aria-selected={activeTab === 'subscriptions'}
          onClick={() => setActiveTab('subscriptions')}
          className={`tab-pill ${activeTab === 'subscriptions' ? 'active' : ''}`}
        >
          <span>Active Subscriptions ({subscriptions.filter(s => s.active).length})</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            ₹{pendingSubscriptionsTotal} / mo
          </span>
        </button>
      </div>

      {/* Tab 1: Fixed Commitments */}
      {activeTab === 'commitments' && (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          id="panel-fixed-commitments"
          role="tabpanel"
          aria-labelledby="tab-fixed-commitments"
        >
          {commitments.map((c) => {
            const isDueSoon = !c.paid && c.dueDay <= currentDay + 3 && c.dueDay >= currentDay;
            const isOverdue = !c.paid && c.dueDay < currentDay;

            return (
              <div
                key={c.id}
                className={`glass-panel p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                  c.paid
                    ? 'border-emerald-500/30 opacity-80 bg-[var(--bg-surface)]'
                    : isOverdue
                    ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/30 to-[var(--bg-surface)] shadow-lg shadow-rose-950/30'
                    : isDueSoon
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/25 to-[var(--bg-surface)] shadow-lg'
                    : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                        {c.icon}
                      </span>
                      <div>
                        <h4 className="font-heading font-bold text-white text-base">{c.name}</h4>
                        <div className="text-xs text-slate-400 capitalize flex items-center gap-2 mt-0.5">
                          <span className="bg-white/5 px-2 py-0.5 rounded-md font-mono text-[10px] uppercase">{c.category}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">
                            {c.paid 
                              ? 'Cleared' 
                              : `Due Day ${c.dueDay} (${c.dueDay >= currentDay ? `${c.dueDay - currentDay} days away` : 'Overdue!'})`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-heading font-black font-mono text-xl text-white">
                        ₹{c.amount}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Fixed Liability</span>
                    </div>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2">
                  <div>
                    {c.paid ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        CLEARED & SETTLED
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 font-mono bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30 animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                        OVERDUE BILL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Due Soon
                      </span>
                    )}
                  </div>

                  {!c.paid && (
                    <button
                      onClick={() => payCommitment(c.id)}
                      aria-label={`Pay ${c.name} for ${c.amount} rupees`}
                      className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
                    >
                      <span>Pay Now (₹{c.amount})</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Subscriptions Optimizer */}
      {activeTab === 'subscriptions' && (
        <div 
          className="space-y-4"
          id="panel-recurring-subs"
          role="tabpanel"
          aria-labelledby="tab-recurring-subs"
        >
          
          <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300 shadow">
            <Info className="w-4 h-4 flex-shrink-0 text-cyan-400" aria-hidden="true" />
            <span>
              <strong>Gen Z Hack:</strong> Subscriptions bleed money silently. Toggle any recurring subscription off to instantly release that money back into your liquid spending runway!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptions.map((s) => {
              const dailyImpact = Math.round(s.amount / daysRemaining);

              return (
                <div
                  key={s.id}
                  className={`glass-panel p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                    s.active ? 'border-violet-500/30 bg-[var(--bg-surface)]' : 'border-white/5 opacity-60 bg-[var(--bg-well)]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                          {s.icon}
                        </span>
                        <div>
                          <h4 className="font-heading font-bold text-white text-base">{s.name}</h4>
                          <div className="text-xs text-slate-400 font-mono">
                            Auto-debited Day {s.dueDay} of month
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-heading font-black font-mono text-xl text-white">
                          ₹{s.amount}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">/ month</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle and consequence */}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between mt-2">
                    <div>
                      {s.active ? (
                        <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
                          Active & Charging
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          ○ Paused (+₹{dailyImpact}/d saved)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleSubscription(s.id)}
                      aria-label={`${s.active ? 'Pause or cancel' : 'Resume'} ${s.name} subscription`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shadow focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
                        s.active 
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                      }`}
                    >
                      {s.active ? 'Pause / Cancel' : 'Resume Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

export default memo(CommitmentsManagerComponent);
