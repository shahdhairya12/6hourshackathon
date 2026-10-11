import React, { useState } from 'react';
import { 
  Dices, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Flame,
  Info,
  Zap,
  Bomb
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURVEBALL_EVENTS } from '../data/initialData';

export default function CurveballRoulette() {
  const {
    spinCurveball,
    curveballHistory,
    currentDay,
    safeDailyAllowance,
    savingsGoals,
    financialRisk
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
    <div className="space-y-6">
      
      {/* Hero Wheel Section */}
      <div className="glass-panel p-6 sm:p-10 relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-[#101732] to-amber-950/30 border border-rose-500/30 text-center shadow-2xl">
        
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider border border-rose-500/40 shadow-inner">
            <Dices className="w-3.5 h-3.5 text-rose-400" />
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
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>
              {hasEmergencyShield ? (
                <><strong>Emergency Shield Active:</strong> ₹{emergencyShield.current} cushion absorbs surprises without breaking your daily allowance!</>
              ) : (
                <><strong>No Emergency Cushion:</strong> Shocks will directly subtract from your daily allowance and spike risk!</>
              )}
            </span>
          </div>

          {/* Spin Button */}
          <div className="pt-3">
            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              className={`btn-primary py-4 px-10 text-sm font-bold shadow-2xl transition-all ${
                isSpinning ? 'opacity-70 scale-95' : 'hover:scale-105'
              }`}
            >
              <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Simulating Life Surprise...' : 'Spin / Draw Random Curveball'}</span>
            </button>
          </div>
        </div>

        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Curveball Cards Pool Showcase */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          <span>Possible Life Events in Pool</span>
          <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            8 Curated Real Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CURVEBALL_EVENTS.map((e) => {
            const isPositive = e.type === 'positive';
            return (
              <div
                key={e.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isPositive
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-[#0c1224] border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-1 bg-white/5 rounded-xl border border-white/10">{e.icon}</span>
                  <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-full ${
                    isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isPositive ? `+₹${e.amount}` : `-₹${Math.abs(e.amount)}`}
                  </span>
                </div>
                <div className="font-bold text-xs text-white mb-1">{e.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{e.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Drawn Events */}
      {curveballHistory.length > 0 && (
        <div className="glass-panel p-6 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Curveballs Encountered This Month ({curveballHistory.length})</span>
            <span className="text-[11px] font-mono text-slate-400">Survival Timeline</span>
          </div>

          <div className="space-y-3">
            {curveballHistory.map((item, idx) => {
              const isPositive = item.type === 'positive';

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow ${
                    isPositive
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-rose-950/25 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          Day {item.occurredDay}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">{item.desc}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-black text-xl ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? `+₹${item.amount}` : `-₹${Math.abs(item.amount)}`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {isPositive ? 'Liquid Windfall' : 'Unexpected Drain'}
                    </div>
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
