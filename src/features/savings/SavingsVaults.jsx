/**
 * @file SavingsVaults.jsx
 * @description Micro-Savings Vaults & Emergency Buffer manager.
 * Implements friction against impulse unlocking, shock-absorption mechanics, and goal milestone trackers.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, useEffect, memo } from 'react';
import { 
  ShieldCheck, 
  PiggyBank, 
  Lock, 
  Unlock, 
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

function SavingsVaultsComponent() {
  const {
    savingsGoals,
    totalLockedInSavings,
    liquidBalance,
    depositToGoal,
    withdrawFromGoal
  } = useFinance();

  const [depositModal, setDepositModal] = useState(null);
  const [withdrawModal, setWithdrawModal] = useState(null);
  const [actionAmount, setActionAmount] = useState('250');

  // Handle escape key to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDepositModal(null);
        setWithdrawModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDepositSubmit = () => {
    if (depositModal && actionAmount) {
      depositToGoal(depositModal.id, Number(actionAmount));
      setDepositModal(null);
      setActionAmount('250');
    }
  };

  const handleWithdrawSubmit = () => {
    if (withdrawModal && actionAmount) {
      withdrawFromGoal(withdrawModal.id, Number(actionAmount));
      setWithdrawModal(null);
      setActionAmount('250');
    }
  };

  return (
    <div className="space-y-6" id="panel-goals" role="tabpanel" aria-labelledby="tab-goals">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-7 bg-gradient-to-r from-[var(--bg-surface-3)] via-[var(--bg-surface-2)] to-[var(--bg-surface)] border border-cyan-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">
              <PiggyBank className="w-3.5 h-3.5" aria-hidden="true" />
              Micro-Savings Vaults & Future Goals
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Lock Up Money for What Really Matters
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Locking money in these vaults removes it from your liquid Swiggy budget. Every rupee locked strengthens your Financial Health and cushions against surprise curveballs.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-[var(--bg-well)] border border-white/10 p-4 rounded-2xl shadow-inner">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Total Locked Savings</div>
              <div className="text-2xl sm:text-3xl font-heading font-black font-mono text-cyan-300">
                ₹{totalLockedInSavings.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="border-l border-white/10 pl-5">
              <div className="text-[11px] text-slate-400 font-mono">Liquid Left</div>
              <div className="text-lg font-bold font-mono text-white">
                ₹{liquidBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const isCompleted = goal.current >= goal.target;
          const isEmergency = goal.name.toLowerCase().includes('emergency');

          return (
            <div
              key={goal.id}
              className={`glass-panel p-6 relative overflow-hidden transition-all flex flex-col justify-between shadow-xl ${
                isCompleted 
                  ? 'border-emerald-500/40 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-well)]' 
                  : isEmergency
                  ? 'border-cyan-500/30 bg-gradient-to-b from-[var(--bg-surface-2)] to-[var(--bg-well)]' 
                  : 'border-white/10 bg-[var(--bg-well)]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      {goal.icon}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-white text-base">{goal.name}</h4>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Target Day: {goal.deadlineDay} of 30
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {pct}%
                  </span>
                </div>

                {/* Battery-Style Progress Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-bold">₹{goal.current} locked</span>
                    <span className="text-slate-400">Target: ₹{goal.target}</span>
                  </div>

                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/10 p-[1.5px]">
                    <div
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progress for goal ${goal.name}`}
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: goal.color || 'var(--aurora-cyan-deep)',
                        boxShadow: `0 0 12px ${goal.color || 'var(--aurora-cyan-deep)'}`
                      }}
                    />
                  </div>
                </div>

                {/* Special Perk info if Emergency Buffer */}
                {isEmergency && (
                  <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>
                      {goal.current >= 800 ? 'Active: Shock absorption perk unlocked!' : 'Lock ₹800 to unlock shock perk.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => {
                    setDepositModal(goal);
                    setActionAmount('250');
                  }}
                  aria-label={`Lock funds into ${goal.name}`}
                  className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5 font-bold focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lock Funds</span>
                </button>

                {goal.current > 0 && (
                  <button
                    onClick={() => {
                      setWithdrawModal(goal);
                      setActionAmount(Math.min(250, goal.current).toString());
                    }}
                    aria-label={`Unlock funds from ${goal.name}`}
                    className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 font-bold text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
                  >
                    <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Unlock</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="deposit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="glass-panel p-6 max-w-md w-full border border-violet-500/40 bg-[var(--bg-surface-2)] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-heading font-black text-white text-lg" id="deposit-modal-title">
                <Lock className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <span>Lock Cash in {depositModal.name}</span>
              </div>
              <button
                onClick={() => setDepositModal(null)}
                aria-label="Close deposit dialog"
                className="text-slate-400 hover:text-white text-sm p-1 focus-visible:ring-2 focus-visible:ring-violet-400 rounded outline-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Moving money to this goal guarantees you won't blow it on impulse food or cabs. It locks cash away from your liquid balance and adjusts your daily allowance safely.
            </p>

            <div>
              <label htmlFor="deposit-amount-input" className="text-xs text-slate-300 font-medium block mb-1.5">Deposit Amount (₹)</label>
              <input
                id="deposit-amount-input"
                type="number"
                min="50"
                max={liquidBalance}
                step="50"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="w-full bg-[var(--bg-inset)] border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-cyan-300 focus:outline-none focus:border-violet-500 shadow-inner"
              />
              <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                Liquid cash available: ₹{liquidBalance}
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2">
              {[100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setActionAmount(amt.toString())}
                  className="flex-1 py-1.5 text-xs font-mono font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setDepositModal(null)}
                className="flex-1 btn-secondary text-xs py-2.5 focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDepositSubmit}
                className="flex-1 btn-primary text-xs py-2.5 font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
              >
                Confirm Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdraw-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="glass-panel p-6 max-w-md w-full border border-rose-500/40 bg-[var(--bg-surface-2)] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-heading font-black text-white text-lg" id="withdraw-modal-title">
                <AlertCircle className="w-5 h-5 text-amber-400" aria-hidden="true" />
                <span>Unlock From {withdrawModal.name}</span>
              </div>
              <button
                onClick={() => setWithdrawModal(null)}
                aria-label="Close withdraw dialog"
                className="text-slate-400 hover:text-white text-sm p-1 focus-visible:ring-2 focus-visible:ring-rose-400 rounded outline-none"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 leading-relaxed">
              ⚠️ <strong>Friction Alert:</strong> Withdrawing from your goal weakens your financial discipline score and delays your target completion!
            </div>

            <div>
              <label htmlFor="withdraw-amount-input" className="text-xs text-slate-300 font-medium block mb-1.5">Withdraw Amount (₹)</label>
              <input
                id="withdraw-amount-input"
                type="number"
                min="50"
                max={withdrawModal.current}
                step="50"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="w-full bg-[var(--bg-inset)] border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
              />
              <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                Currently locked in vault: ₹{withdrawModal.current}
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setWithdrawModal(null)}
                className="flex-1 btn-secondary text-xs py-2.5 focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
              >
                Keep Locked
              </button>
              <button
                onClick={handleWithdrawSubmit}
                className="flex-1 btn-danger text-xs py-2.5 font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
              >
                Confirm Unlock
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default memo(SavingsVaultsComponent);
