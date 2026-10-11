import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  X,
  Copy
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function FinancialWrapModal({ isOpen, onClose }) {
  const {
    currentPersona,
    currentDay,
    liquidBalance,
    safeDailyAllowance,
    financialHealth,
    healthStatus,
    gamification,
    wishlist,
    totalSpent,
    showToast
  } = useFinance();

  if (!isOpen) return null;

  const totalSavedInWishlist = wishlist.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  const handleCopySummary = () => {
    const text = `⚡ PULSE // Gen Z ₹10k 30-Day Wrap ⚡
👤 Profile: ${currentPersona.name} (Day ${currentDay}/30)
🛡️ Status: ${gamification.title} (Level ${gamification.level})
💰 Liquid Balance: ₹${liquidBalance.toLocaleString('en-IN')}
🔥 Safe Daily Spend: ₹${safeDailyAllowance}/day
🧘 Impulses Conquered: ${wishlist.length} (Saved ₹${totalSavedInWishlist.toLocaleString('en-IN')}!)
✨ Financial Health: ${financialHealth}/100 (${healthStatus.label})`;

    navigator.clipboard?.writeText(text);
    showToast('Copied FinPulse Wrap summary to clipboard! 📋', 'success');
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="wrap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full border border-violet-500/40 bg-gradient-to-b from-[#131b38] via-[#0d1326] to-[#070b18] space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Wrap Modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider border border-violet-500/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            FinPulse Wrapped // Gen Z Receipt
          </div>
          <h3 id="wrap-modal-title" className="text-2xl font-heading font-black text-white">
            Your 30-Day Financial Vibe
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {currentPersona.avatar} {currentPersona.name} • Day {currentDay}/30
          </p>
        </div>

        {/* Receipt Card Visual */}
        <div className="p-5 rounded-2xl bg-[#090e1e] border border-white/10 space-y-4 shadow-inner">
          
          {/* Level & Title */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Fintech Level</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Level {gamification.level}: {gamification.title}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              {healthStatus.emoji} {financialHealth}/100
            </span>
          </div>

          {/* Vitals Breakdown */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Liquid Cash Remaining:</span>
              <span className="font-bold text-white">₹{liquidBalance.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Safe Daily Allowance:</span>
              <span className="font-bold text-emerald-400">₹{safeDailyAllowance}/day</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Total Spent So Far:</span>
              <span className="font-bold text-amber-400">₹{totalSpent.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Impulses Delayed (Wishlist):</span>
              <span className="font-bold text-cyan-400">{wishlist.length} items (₹{totalSavedInWishlist})</span>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-2">
              Unlocked Badges ({gamification.unlockedCount}/{gamification.badges.length})
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {gamification.badges.map(b => (
                <div
                  key={b.id}
                  className={`p-2 rounded-xl text-[11px] flex items-center gap-2 border ${
                    b.unlocked 
                      ? 'bg-violet-950/40 border-violet-500/40 text-violet-200' 
                      : 'bg-white/5 border-transparent text-slate-600 opacity-50'
                  }`}
                >
                  <span className="text-sm">{b.icon}</span>
                  <span className="font-medium truncate">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary text-xs py-2.5 font-bold"
          >
            Close
          </button>
          <button
            onClick={handleCopySummary}
            className="flex-1 btn-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
