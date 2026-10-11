/**
 * @file DecisionSimulator.jsx
 * @description The Centerpiece Pre-Decision What-If Sandbox of PULSE OS.
 * Features 4-Archetype Neural AI Advisors, Roommate Bill Splitter,
 * Tactile Indian UPI Soundbox Audio, and Live Interconnected Consequence Matrix.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, useMemo, memo } from 'react';
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
  Scale,
  Users,
  Radio,
  Lock
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';
import { SIMULATION_PRESETS, CATEGORIES } from '../../data/initialData';
import { generateAiAdvice } from '../../services/aiAdvisorService';
import { AI_ADVISOR_ARCHETYPES } from '../../constants/financeRules';
import { sound } from '../../services/soundService';

function DecisionSimulatorComponent() {
  const {
    liquidBalance,
    safeDailyAllowance,
    financialRisk,
    financialHealth,
    simulation,
    setSimulation,
    splitCount,
    setSplitCount,
    simulatedImpact,
    commitSimulation,
    saveToWishlist,
    totalPendingLiabilities,
    aiArchetype,
    setAiArchetype,
    austerityMode,
    daysRemaining,
    upiSoundboxEnabled
  } = useFinance();

  const [activePresetId, setActivePresetId] = useState('p1');

  // Compute AI advice dynamically from active archetype
  const aiAdvice = useMemo(() => {
    return generateAiAdvice({
      archetype: aiArchetype,
      itemName: simulation.name || 'This spend',
      amount: simulation.amount || 0,
      liquidBalance,
      safeDailyAllowance,
      simSafeDaily: simulatedImpact.simSafeDaily,
      daysRemaining,
      totalPendingLiabilities,
      splitCount
    });
  }, [
    aiArchetype,
    simulation.name,
    simulation.amount,
    liquidBalance,
    safeDailyAllowance,
    simulatedImpact.simSafeDaily,
    daysRemaining,
    totalPendingLiabilities,
    splitCount
  ]);

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
    sound.playClick();
  };

  const handleCustomAmountChange = (val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
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
    sound.playClick();
  };

  const handleTestSoundbox = () => {
    const amt = Math.round((simulation.amount || 460) / Math.max(1, splitCount));
    sound.playUpiSoundbox(amt, simulation.name || 'FinPulse');
  };

  const effectivePrice = Math.round((simulation.amount || 0) / Math.max(1, splitCount));

  return (
    <div className="space-y-6" id="panel-simulator" role="tabpanel" aria-labelledby="tab-simulator">
      
      {/* High-Level Studio Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-violet-950/50 via-[var(--bg-surface)] to-cyan-950/40 border border-violet-500/30 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-violet-500/40 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" aria-hidden="true" />
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
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      </div>

      {/* Main Studio Grid: Controls vs Consequence Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Decision Sandbox Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Presets Chips */}
          <div className="glass-panel p-5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
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
                    aria-pressed={isSelected}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-2.5 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-900/60 via-indigo-900/50 to-[var(--bg-surface-3)] border-violet-500/70 shadow-lg shadow-violet-900/40 ring-1 ring-violet-500/30'
                        : 'bg-[var(--bg-surface-2)]/70 border-white/5 hover:border-white/15 hover:bg-[var(--bg-surface-3)]'
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

          {/* Custom Scenario Builder & Roommate Splitter */}
          <div className="glass-panel p-5 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span>Custom Purchase Scenario</span>
              </span>
              {upiSoundboxEnabled && (
                <button
                  type="button"
                  onClick={handleTestSoundbox}
                  aria-label="Test Indian UPI Soundbox voice announcement"
                  className="text-[10px] text-cyan-300 hover:text-cyan-200 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1 transition-colors"
                >
                  <Radio className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                  <span>Test Voice</span>
                </button>
              )}
            </div>

            <div>
              <label htmlFor="sim-item-name" className="text-xs text-slate-300 font-medium block mb-1.5">
                Item Name / Impulse Craving
              </label>
              <input
                id="sim-item-name"
                type="text"
                value={simulation.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Midnight Biryani or Zara jacket"
                className="w-full bg-[var(--bg-well)] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 shadow-inner"
              />
            </div>

            {/* Category Select */}
            <div>
              <span className="text-xs text-slate-300 font-medium block mb-1.5">Category</span>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.slice(0, 6).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    aria-pressed={simulation.category === c.id}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
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
                <label htmlFor="sim-amount-input" className="text-xs text-slate-300 font-medium">
                  Cost in Rupees (₹)
                </label>
                <div className="flex items-center gap-1 bg-[var(--bg-well)] border border-white/10 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-slate-400 font-mono">₹</span>
                  <input
                    id="sim-amount-input"
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
                aria-label="Simulation purchase amount in rupees"
                value={simulation.amount || 0}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="my-3 w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹50 (Chai/Snack)</span>
                <span>₹1,500 (Outfit/Drop)</span>
                <span>₹4,000 (Major Splurge)</span>
              </div>
            </div>

            {/* Gen Z Roommate / Friend Splitter */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  Split with Friends / Roommates
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {splitCount === 1 ? 'Solo (100%)' : `${splitCount} Ways (₹${effectivePrice}/each)`}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => { setSplitCount(count); sound.playClick(); }}
                    aria-pressed={splitCount === count}
                    className={`py-1.5 text-xs rounded-xl border font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none ${
                      splitCount === count
                        ? 'bg-cyan-500/25 border-cyan-500 text-cyan-200 shadow'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {count === 1 ? 'Solo' : `÷${count}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Amount Add Chips */}
            <div className="flex gap-1.5 pt-1">
              {[200, 500, 1000, 1500].map(add => (
                <button
                  key={add}
                  onClick={() => handleCustomAmountChange((Number(simulation.amount) || 0) + add)}
                  className="flex-1 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-mono font-semibold transition-all focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
                >
                  +₹{add}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Live Interconnected Consequence Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* AI Advisor Persona Selector & Terminal Card */}
          <div className="glass-panel p-5 sm:p-6 relative overflow-hidden border-2 transition-all shadow-xl space-y-4">
            
            {/* Persona Archetype Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  FinPulse AI Advisor:
                </span>
              </div>

              {/* 4 Switchable Archetypes */}
              <div className="flex items-center gap-1">
                {Object.values(AI_ADVISOR_ARCHETYPES).map(arch => (
                  <button
                    key={arch.id}
                    onClick={() => { setAiArchetype(arch.id); sound.playClick(); }}
                    aria-pressed={aiArchetype === arch.id}
                    className={`px-2 py-1 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none ${
                      aiArchetype === arch.id
                        ? 'bg-violet-600/30 border-violet-500 text-white shadow'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{arch.avatar}</span>
                    <span className="hidden sm:inline">{arch.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Advisor Commentary Card */}
            <div className="flex items-start gap-3.5">
              <div className={`p-3 rounded-2xl flex-shrink-0 border shadow-lg ${
                aiAdvice.severity === 'danger'
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                  : aiAdvice.severity === 'warning'
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}>
                <span className="text-2xl">{AI_ADVISOR_ARCHETYPES[Object.keys(AI_ADVISOR_ARCHETYPES).find(k => AI_ADVISOR_ARCHETYPES[k].id === aiArchetype) || 'ROAST_MASTER'].avatar}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${aiAdvice.badgeColor}`}>
                    {aiAdvice.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/10">
                    TESTING: ₹{effectivePrice} {splitCount > 1 ? `(÷${splitCount})` : ''}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-heading font-black text-white mb-1.5 leading-tight">
                  {aiAdvice.headline}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  {aiAdvice.critique}
                </p>

                <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <Info className="w-4 h-4 flex-shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>{aiAdvice.compromise}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Impact Matrix (Before vs After) */}
          <div className="glass-panel p-5 sm:p-6 shadow-xl">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-violet-400" aria-hidden="true" />
                Interconnected Consequence Matrix (Before vs After)
              </span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Live Ripple
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Metric 1: Daily Allowance */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
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
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">Liquid Balance</span>
                  <span className="font-mono text-xs text-rose-400 font-black bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                    -₹{effectivePrice}
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
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
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
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
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
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[var(--bg-surface)] border border-violet-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl p-1.5 bg-white/5 rounded-xl border border-white/10">🎫</span>
                <span className="text-slate-300 leading-relaxed">
                  <strong>Opportunity Cost:</strong> This ₹{effectivePrice} could instead fund{' '}
                  <strong className="text-violet-300 font-mono text-sm">
                    {Math.round((effectivePrice / 2500) * 100)}%
                  </strong>{' '}
                  of your Coldplay Concert Ticket goal!
                </span>
              </div>
            </div>

            {/* Decision Action Pathways */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Commit to Real Balance */}
              <button
                onClick={commitSimulation}
                disabled={austerityMode}
                aria-label={`Execute and buy ${simulation.name} for ${effectivePrice} rupees`}
                className={`py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl rounded-2xl transition-all focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
                  austerityMode
                    ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {austerityMode ? (
                  <>
                    <Lock className="w-4 h-4 text-rose-400" aria-hidden="true" />
                    <span>Austerity Frozen</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" aria-hidden="true" />
                    <span>Execute & Buy (Spend ₹{effectivePrice})</span>
                  </>
                )}
              </button>

              {/* Save to Wishlist (Delayed Gratification) */}
              <button
                onClick={saveToWishlist}
                aria-label={`Park ${simulation.name} in 48-Hour Wishlist and save ${effectivePrice} rupees`}
                className="btn-success py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                <span>Park in 48h Wishlist (Save ₹{effectivePrice})</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default memo(DecisionSimulatorComponent);
