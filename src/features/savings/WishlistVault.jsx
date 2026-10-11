/**
 * @file WishlistVault.jsx
 * @description Delayed Gratification Vault & Impulse Stopper.
 * Quantifies exact rupees preserved and runway protected via the 48-Hour Wishlist.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { memo } from 'react';
import { 
  BookmarkCheck, 
  Clock, 
  Trophy
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

function WishlistVaultComponent() {
  const { wishlist, daysRemaining } = useFinance();

  const totalSavedMoney = wishlist.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  if (wishlist.length === 0) {
    return (
      <section 
        aria-label="Delayed Gratification Vault Status"
        className="glass-panel p-6 sm:p-7 text-center border-dashed border-white/10 shadow-lg"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <BookmarkCheck className="w-6 h-6" aria-hidden="true" />
        </div>
        <h4 className="font-heading font-bold text-white text-base">Delayed Gratification Vault is Ready</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
          When tempted to make an impulse spend in the Decision Simulator, choose "Park in 48h Wishlist" to avoid impulse buying and preserve your runway!
        </p>
      </section>
    );
  }

  return (
    <section 
      aria-label="Delayed Gratification Vault Summary"
      className="glass-panel p-6 sm:p-7 space-y-4 border-emerald-500/30 bg-gradient-to-r from-emerald-950/25 via-[var(--bg-surface)] to-[var(--bg-surface-2)] shadow-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Impulse Stopper // Delayed Gratification Victory
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
            ₹{totalSavedMoney.toLocaleString('en-IN')} Preserved by Pausing Impulses
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Behavioral psychology proves over 70% of Gen Z impulse urges disappear if paused for 48 hours. Here are the temptations you conquered:
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shadow">
          +{Math.round(totalSavedMoney / Math.max(1, daysRemaining))} ₹/day preserved!
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-white/10 flex items-center justify-between shadow-inner hover:border-emerald-500/40 transition-colors"
          >
            <div>
              <div className="font-bold text-xs text-white truncate">{item.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span>Day {item.savedOnDay}</span>
                <span>•</span>
                <span className="capitalize">{item.category}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-black text-emerald-400 text-base">
                ₹{item.amount}
              </div>
              <span className="text-[9px] text-emerald-300 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                Saved!
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(WishlistVaultComponent);
