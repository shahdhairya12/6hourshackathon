/**
 * @file FinancialWrapModal.jsx
 * @description Spotify-Wrapped style financial summary card.
 * Summarizes the user's 30-day performance, gamification badges, impulse money saved, and clipboard sharing.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useEffect, memo } from 'react';
import { 
  Trophy, 
  Sparkles, 
  X,
  Copy
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

function FinancialWrapModalComponent({ isOpen, onClose }) {
  const {
    currentPersona,
    currentDay,
    liquidBalance,
    safeDailyAllowance,
    financialHealth,
    healthStatus,
    gamification,
    wishlist,
    showToast
  } = useFinance();

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast('Copied FinPulse Wrap summary to clipboard! 📋', 'success');
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="wrap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full border border-violet-500/40 bg-gradient-to-b from-[var(--bg-surface-3)] via-[var(--bg-surface-2)] to-[var(--bg-inset)] space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Wrap Modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider border border-violet-500/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
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
        <div className="p-5 rounded-2xl bg-[var(--bg-well)] border border-white/10 space-y-4 shadow-inner">
          
          {/* Level & Title */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Fintech Level</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Level {gamification.level} // {gamification.title}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              {gamification.unlockedCount}/5 Badges
            </span>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Liquid Balance</span>
              <span className="font-heading font-black text-base text-white font-mono">
                ₹{liquidBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Daily Safe Spend</span>
              <span className="font-heading font-black text-base text-cyan-300 font-mono">
                ₹{safeDailyAllowance}/day
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Health Score</span>
              <span className="font-heading font-black text-base font-mono" style={{ color: healthStatus.color }}>
                {financialHealth}/100
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Impulses Resisted</span>
              <span className="font-heading font-black text-base text-emerald-400 font-mono">
                ₹{totalSavedInWishlist.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-2">Unlocked Badges</span>
            <div className="flex flex-wrap gap-2">
              {gamification.badges.map(b => (
                <div
                  key={b.id}
                  className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 border font-mono ${
                    b.unlocked 
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-200' 
                      : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span className="text-[11px] font-bold">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopySummary}
          className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xl focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
        >
          <Copy className="w-4 h-4" aria-hidden="true" />
          <span>Copy FinPulse Receipt to Clipboard</span>
        </button>

      </div>
    </div>
  );
}

export default memo(FinancialWrapModalComponent);
