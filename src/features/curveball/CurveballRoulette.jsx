/**
 * @file CurveballRoulette.jsx
 * @description Life Happens Unpredictable Event Roulette.
 * Simulates real-world financial friction (cracked screens, medicine, surprise bonuses)
 * and tests the emergency buffer's shock absorption.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, memo } from 'react';
import { 
  Dices, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';
import { CURVEBALL_EVENTS } from '../../data/initialData';

function CurveballRouletteComponent() {
  const {
    spinCurveball,
    curveballHistory,
    savingsGoals
  } = useFinance();

  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinClick = () => {
    setIsSpinning(true);
    spinCurveball();
    setTimeout(() => {
      setIsSpinning(false);
    }, 1200);
  };

  const emergencyShield = savingsGoals.find(g => g.name.toLowerCase().includes('emergency'));
  const hasEmergencyShield = emergencyShield && emergencyShield.current >= 800;

  return (
    <div className="space-y-6" id="panel-curveball" role="tabpanel" aria-labelledby="tab-curveball">
      
      {/* Hero Wheel Section */}
      <div className="glass-panel p-6 sm:p-10 relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-[var(--bg-surface-2)] to-amber-950/30 border border-rose-500/30 text-center shadow-2xl">
        
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider border border-rose-500/40 shadow-inner">
            <Dices className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            Reality Check // Life Happens Roulette
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
            The Unpredictable Life Event Roulette
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In the real world, budgets don’t stay linear. Phone screens shatter, rain storms double cab fares, or a random freelance advance drops. Can your ₹10,000 budget survive a random shock?
          </p>

          {/* Emergency Shield Status */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-center gap-2.5 font-medium shadow-inner ${
            hasEmergencyShield 
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>
              {hasEmergencyShield ? (
                <><strong>Emergency Shield Active:</strong> ₹{emergencyShield.current} cushion absorbs surprises without breaking your daily allowance!</>
              ) : (
                <><strong>No Emergency Cushion:</strong> Shocks will directly subtract from your daily allowance and spike risk!</>
              )}
            </span>
          </div>

          {/* Spin Trigger Button */}
          <div className="pt-4">
            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              aria-label="Spin life curveball roulette wheel"
              className={`py-4 px-9 rounded-2xl font-heading font-black text-base transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl focus-visible:ring-2 focus-visible:ring-rose-400 outline-none ${
                isSpinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-900/50 hover:scale-105 active:scale-95'
              }`}
            >
              <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{isSpinning ? 'Rolling Reality Shock...' : 'Spin the Curveball Wheel!'}</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      </div>

      {/* History of triggered curveballs */}
      <div className="glass-panel p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2">
            <span>Life Events Encountered This Month</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {curveballHistory.length}
            </span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {CURVEBALL_EVENTS.length} Total Curveballs in Engine
          </span>
        </div>

        {curveballHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
            No shocks have hit your ₹10,000 budget yet. Spin the wheel to test your financial resilience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {curveballHistory.map((item, index) => {
              const isPositive = item.type === 'positive';
              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`p-4 rounded-2xl border flex items-center justify-between shadow-inner ${
                    isPositive 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10">{item.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-white">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        Hit on Day {item.occurredDay || '1'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-black text-lg ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? '+' : '-'}₹{Math.abs(item.amount)}
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                      isPositive 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {isPositive ? 'Windfall' : 'Shock'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default memo(CurveballRouletteComponent);
