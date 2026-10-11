import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function CommitmentsManager() {
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
    <div className="space-y-6">
      
      {/* Top Banner / Summary */}
      <div className="glass-panel p-6 sm:p-7 bg-gradient-to-r from-[#121936] via-[#0f142a] to-[#0a0f22] border border-amber-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-5 bg-[#0a0f22] border border-white/10 p-4 rounded-2xl shadow-inner">
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
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('commitments')}
          className={`tab-pill ${activeTab === 'commitments' ? 'active' : ''}`}
        >
          <span>Fixed Commitments ({commitments.length})</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
            ₹{pendingCommitmentsTotal} due
          </span>
        </button>

        <button
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commitments.map((c) => {
            const isDueSoon = !c.paid && c.dueDay <= currentDay + 3 && c.dueDay >= currentDay;
            const isOverdue = !c.paid && c.dueDay < currentDay;

            return (
              <div
                key={c.id}
                className={`glass-panel p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                  c.paid
                    ? 'border-emerald-500/30 opacity-80 bg-[#0c1222]'
                    : isOverdue
                    ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/30 to-[#0e1428] shadow-lg shadow-rose-950/30'
                    : isDueSoon
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/25 to-[#0e1428] shadow-lg'
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
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CLEARED & SETTLED
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 font-mono bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30 animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        OVERDUE BILL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                        <Calendar className="w-3.5 h-3.5" />
                        Due Soon
                      </span>
                    )}
                  </div>

                  {!c.paid && (
                    <button
                      onClick={() => payCommitment(c.id)}
                      className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 font-bold shadow-lg"
                    >
                      <span>Pay Now (₹{c.amount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300 shadow">
            <Info className="w-4 h-4 flex-shrink-0 text-cyan-400" />
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
                    s.active ? 'border-violet-500/30 bg-[#0e142a]' : 'border-white/5 opacity-60 bg-[#080c18]'
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
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shadow ${
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
