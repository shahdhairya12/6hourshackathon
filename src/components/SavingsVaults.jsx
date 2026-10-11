import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PiggyBank, 
  Lock, 
  Unlock, 
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function SavingsVaults() {
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
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-7 bg-gradient-to-r from-[#0d1630] via-[#101e40] to-[#0a1224] border border-cyan-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">
              <PiggyBank className="w-3.5 h-3.5" />
              Micro-Savings Vaults & Future Goals
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Lock Up Money for What Really Matters
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Locking money in these vaults removes it from your liquid Swiggy budget. Every rupee locked strengthens your Financial Health and cushions against surprise curveballs.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-[#080d1e] border border-white/10 p-4 rounded-2xl shadow-inner">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Total Locked in Vaults</div>
              <div className="text-2xl sm:text-3xl font-heading font-black font-mono text-cyan-400">
                ₹{totalLockedInSavings.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="border-l border-white/10 pl-5">
              <div className="text-[11px] text-slate-400 font-mono">Liquid Free Balance</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                ₹{liquidBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {savingsGoals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const isCompleted = g.current >= g.target;
          const isEmergency = g.name.toLowerCase().includes('emergency');

          return (
            <div
              key={g.id}
              className={`glass-panel p-6 relative overflow-hidden transition-all flex flex-col justify-between shadow-xl ${
                isCompleted 
                  ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/30 to-[#0e1428]' 
                  : isEmergency 
                  ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-[#0c1224]' 
                  : 'border-white/10'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      {g.icon}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-white text-base leading-snug">{g.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target Day: {g.deadlineDay} of 30
                      </span>
                    </div>
                  </div>

                  {isEmergency && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase shadow">
                      Risk Shield
                    </span>
                  )}
                </div>

                {/* Progress Numbers */}
                <div className="flex items-baseline justify-between mt-4 mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-heading font-black font-mono text-white">
                      ₹{g.current.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ ₹{g.target.toLocaleString('en-IN')}</span>
                  </div>

                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {pct}% Funded
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-4 border border-white/5">
                  <div
                    className="h-full transition-all duration-700 rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: g.color || '#8B5CF6',
                      boxShadow: `0 0 14px ${g.color || '#8B5CF6'}`
                    }}
                  />
                </div>

                {/* Perks or requirement text */}
                <div className="text-[11px] text-slate-300 mb-5 bg-black/40 p-3 rounded-xl border border-white/10 leading-relaxed">
                  {isEmergency ? (
                    <span className="text-cyan-300 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      Absorbs random curveball shocks without dropping your daily safe spend.
                    </span>
                  ) : (
                    <span>
                      🎯 Need ₹{(g.target - g.current).toLocaleString('en-IN')} more to achieve before Day {g.deadlineDay}.
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 border-t border-white/10 pt-4">
                <button
                  onClick={() => setDepositModal(g)}
                  className="flex-1 btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Funds</span>
                </button>

                <button
                  onClick={() => setWithdrawModal(g)}
                  disabled={g.current <= 0}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow"
                  title="Unlock funds back to liquid cash"
                >
                  <Unlock className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="glass-panel p-6 max-w-md w-full border border-violet-500/40 bg-[#0d1428] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-heading font-black text-white text-lg">
                <span className="text-2xl">{depositModal.icon}</span>
                <span>Lock Funds: {depositModal.name}</span>
              </div>
              <button
                onClick={() => setDepositModal(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
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
                className="w-full bg-[#070b18] border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-cyan-300 focus:outline-none focus:border-violet-500 shadow-inner"
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
                  className="flex-1 py-1.5 text-xs font-mono font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setDepositModal(null)}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleDepositSubmit}
                className="flex-1 btn-primary text-xs py-2.5 font-bold shadow-lg"
              >
                Confirm Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="glass-panel p-6 max-w-md w-full border border-rose-500/40 bg-[#0d1428] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-heading font-black text-white text-lg">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span>Unlock From {withdrawModal.name}</span>
              </div>
              <button
                onClick={() => setWithdrawModal(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
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
                className="w-full bg-[#070b18] border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
              />
              <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                Currently locked in vault: ₹{withdrawModal.current}
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setWithdrawModal(null)}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Keep Locked
              </button>
              <button
                onClick={handleWithdrawSubmit}
                className="flex-1 btn-danger text-xs py-2.5 font-bold shadow-lg"
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
