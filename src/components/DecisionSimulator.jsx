import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  BookmarkCheck, 
  Sliders, 
  Bot, 
  Zap, 
  ShoppingBag, 
  Info, 
  Scale 
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { SIMULATION_PRESETS, CATEGORIES } from '../data/initialData';

export default function DecisionSimulator() {
  const {
    liquidBalance,
    safeDailyAllowance,
    financialRisk,
    financialHealth,
    simulation,
    setSimulation,
    simulatedImpact,
    commitSimulation,
    saveToWishlist,
    totalPendingLiabilities
  } = useFinance();

  const [activePresetId, setActivePresetId] = useState('p1');

  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setSimulation({
      name: preset.name,
      amount: preset.amount,
      category: preset.category,
      icon: preset.icon,
      frequency: preset.frequency,
      active: true,
    });
  };

  const handleCustomAmountChange = (val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setActivePresetId(null);
    setSimulation(prev => ({
      ...prev,
      amount: num,
      active: true,
    }));
  };

  const handleNameChange = (val) => {
    setActivePresetId(null);
    setSimulation(prev => ({
      ...prev,
      name: val,
      active: true,
    }));
  };

  const handleCategoryChange = (val) => {
    setSimulation(prev => ({
      ...prev,
      category: val,
      active: true,
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* High-Level Studio Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-violet-950/50 via-[#0e142c] to-cyan-950/40 border border-violet-500/30 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-violet-500/40 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            Decision Sandbox // What-If Simulation Studio
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight mb-2">
            Simulate Financial Consequences Before Spending
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Test any expense against your limited ₹10,000 budget. Experience instant mathematical reactions on your daily allowance, savings goals, monthly runway, and risk profile.
          </p>
        </div>

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Studio Grid: Controls vs Consequence Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Decision Sandbox Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Presets Chips */}
          <div className="glass-panel p-5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-violet-400" />
                Gen Z Temptation Presets
              </span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                1-Tap Test
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SIMULATION_PRESETS.map((p) => {
                const isSelected = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-900/60 via-indigo-900/50 to-[#121936] border-violet-500/70 shadow-lg shadow-violet-900/40 ring-1 ring-violet-500/30'
                        : 'bg-[#0f142a]/70 border-white/5 hover:border-white/15 hover:bg-[#151c38]'
                    }`}
                  >
                    <span className="text-2xl p-1 bg-white/5 rounded-xl border border-white/10">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{p.name}</div>
                      <div className="text-xs font-mono font-black text-violet-400 mt-0.5">₹{p.amount}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Scenario Builder */}
          <div className="glass-panel p-5 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Or Custom Purchase Scenario</span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Item Name / Impulse Craving</label>
              <input
                type="text"
                value={simulation.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Late night Swiggy or Zara jacket"
                className="w-full bg-[#0a0f21] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 shadow-inner"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Category</label>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.slice(0, 6).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      simulation.category === c.id
                        ? 'bg-violet-600/30 border-violet-500 text-white font-bold shadow'
                        : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Slider and Number Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-slate-300 font-medium">Cost in Rupees (₹)</label>
                <div className="flex items-center gap-1 bg-[#0a0f21] border border-white/10 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    min="10"
                    max="6000"
                    step="50"
                    value={simulation.amount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-20 bg-transparent text-sm font-mono font-black text-cyan-300 text-right focus:outline-none"
                  />
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="4000"
                step="50"
                value={simulation.amount || 0}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="my-3"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹50 (Snack)</span>
                <span>₹1,500 (Outfit)</span>
                <span>₹4,000 (Major Splurge)</span>
              </div>
            </div>

            {/* Quick Amount Add Buttons */}
            <div className="flex gap-1.5 pt-1">
              {[200, 500, 1000, 1500].map(add => (
                <button
                  key={add}
                  onClick={() => handleCustomAmountChange((Number(simulation.amount) || 0) + add)}
                  className="flex-1 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-mono font-semibold"
                >
                  +₹{add}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Live Interconnected Consequence Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* AI Verdict Terminal Card */}
          <div className={`glass-panel p-5 sm:p-6 relative overflow-hidden border-2 transition-all shadow-xl ${
            simulatedImpact.verdict.status === 'danger'
              ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/40 to-[#0e1327]'
              : simulatedImpact.verdict.status === 'warning'
              ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/30 to-[#0e1327]'
              : 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 to-[#0e1327]'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl flex-shrink-0 border shadow-lg ${
                simulatedImpact.verdict.status === 'danger'
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                  : simulatedImpact.verdict.status === 'warning'
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}>
                <Bot className="w-7 h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    FinPulse AI Simulator Analysis
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-white/10 text-white border border-white/10">
                    TESTING: ₹{simulation.amount}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-heading font-black text-white mb-2 leading-tight">
                  {simulatedImpact.verdict.headline}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  {simulatedImpact.verdict.analysis}
                </p>

                <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <Info className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                  <span>{simulatedImpact.verdict.action}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Matrix (Before vs After) */}
          <div className="glass-panel p-5 sm:p-6 shadow-xl">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-violet-400" />
                Interconnected Consequence Matrix (Before vs After)
              </span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Mathematical Ripple
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Metric 1: Daily Allowance */}
              <div className="p-4 rounded-2xl bg-[#0b1022] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Daily Safe Spend
                  </span>
                  <span className="font-mono text-xs text-rose-400 font-black bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                    -{simulatedImpact.dailyDrop > 0 ? `₹${simulatedImpact.dailyDrop}/d` : '₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono line-through block">₹{safeDailyAllowance}/day</span>
                    <span className="text-2xl font-heading font-black font-mono text-white">
                      ₹{simulatedImpact.simSafeDaily}
                      <span className="text-xs font-normal text-slate-400">/day</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      simulatedImpact.simSafeDaily >= 200 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {simulatedImpact.simSafeDaily >= 200 ? 'Feasible' : 'Tight'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 2: Remaining Liquid Cash */}
              <div className="p-4 rounded-2xl bg-[#0b1022] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">Liquid Balance</span>
                  <span className="font-mono text-xs text-rose-400 font-black bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                    -₹{simulation.amount || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono line-through block">₹{liquidBalance}</span>
                    <span className={`text-2xl font-heading font-black font-mono ${
                      simulatedImpact.simLiquid < 0 ? 'text-rose-400' : 'text-white'
                    }`}>
                      ₹{simulatedImpact.simLiquid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Bills hold: ₹{totalPendingLiabilities}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Financial Risk Score */}
              <div className="p-4 rounded-2xl bg-[#0b1022] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Financial Risk
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +{Math.max(0, simulatedImpact.simRisk - financialRisk)}% Spike
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono line-through block">{financialRisk}%</span>
                    <span className="text-2xl font-heading font-black font-mono text-white">
                      {simulatedImpact.simRisk}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      simulatedImpact.simRisk < 50 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {simulatedImpact.simRisk < 50 ? 'Manageable' : 'Elevated'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 4: Financial Health Score */}
              <div className="p-4 rounded-2xl bg-[#0b1022] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Health Score
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                    -{Math.max(0, financialHealth - simulatedImpact.simHealth)} pts
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono line-through block">{financialHealth} pts</span>
                    <span className="text-2xl font-heading font-black font-mono text-white">
                      {simulatedImpact.simHealth}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Impacted
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Savings Goal Trade-off Opportunity Cost */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[#0e1428] border border-violet-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl p-1.5 bg-white/5 rounded-xl border border-white/10">🎫</span>
                <span className="text-slate-300 leading-relaxed">
                  <strong>Opportunity Cost:</strong> This ₹{simulation.amount} could instead fund{' '}
                  <strong className="text-violet-300 font-mono text-sm">
                    {Math.round(((simulation.amount || 0) / 2500) * 100)}%
                  </strong>{' '}
                  of your Coldplay Concert Ticket goal!
                </span>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Commit to Real Balance */}
              <button
                onClick={commitSimulation}
                className="btn-primary py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute & Buy (Spend Real ₹)</span>
              </button>

              {/* Save to Wishlist (Delayed Gratification) */}
              <button
                onClick={saveToWishlist}
                className="btn-success py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-300" />
                <span>Park in 48h Wishlist (Save ₹)</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
