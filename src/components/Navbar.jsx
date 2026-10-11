import React, { useState } from 'react';
import { 
  Zap, 
  ChevronRight, 
  Calendar, 
  RotateCcw, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  User, 
  TrendingUp, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { PERSONAS } from '../data/initialData';

export default function Navbar({ onOpenAddModal }) {
  const {
    currentDay,
    daysRemaining,
    advanceDay,
    resetMonth,
    selectedPersonaId,
    currentPersona,
    switchPersona,
    soundEnabled,
    handleToggleSound,
    activeTab,
    setActiveTab,
    financialHealth,
    financialRisk
  } = useFinance();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#070913]/80 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Persona */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-[#0d1224] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400 fill-violet-400/30 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-tight text-xl text-white">PULSE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ₹10K // 30D OS
              </span>
            </div>
            
            {/* Persona Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mt-0.5 group"
              >
                <span>{currentPersona.avatar} {currentPersona.name}</span>
                <span className="text-[10px] text-violet-400 underline group-hover:text-violet-300">change</span>
              </button>

              {showPersonaMenu && (
                <div className="absolute left-0 top-7 w-72 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl p-2 z-50">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Select Gen Z Profile
                  </div>
                  {PERSONAS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-all text-xs ${
                        p.id === selectedPersonaId 
                          ? 'bg-violet-600/20 border border-violet-500/40 text-white' 
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{p.avatar}</span>
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          {p.name}
                          {p.id === selectedPersonaId && <span className="text-[10px] text-violet-400">✓ Active</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{p.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 30-Day Timeline Stepper HUD */}
        <div className="flex items-center gap-2 bg-[#12182b] border border-white/10 rounded-2xl p-1.5 px-3 shadow-inner">
          <div className="flex items-center gap-2 pr-2 border-r border-white/10">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Month Pace</div>
              <div className="font-mono text-sm font-bold text-white flex items-center gap-1">
                Day <span className="text-cyan-400">{currentDay}</span> / 30
                <span className="text-[11px] font-normal text-slate-400">({daysRemaining}d left)</span>
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => advanceDay(1)}
              title="Advance 1 Day"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-violet-600/30 hover:text-violet-300 text-slate-200 border border-white/5 transition-all flex items-center gap-1"
            >
              +1 Day
            </button>
            <button
              onClick={() => advanceDay(5)}
              title="Fast forward 5 Days"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/20 transition-all hidden sm:flex items-center gap-1"
            >
              +5 Days
            </button>
            <button
              onClick={resetMonth}
              title="Reset Month to Day 1"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Quick Action & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Spend</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 overflow-x-auto flex items-center gap-2 py-2 border-t border-white/5 no-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`tab-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`tab-pill relative ${activeTab === 'simulator' ? 'active' : ''}`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>What-If Decision Simulator</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-2 right-2 hidden sm:block" />
        </button>

        <button
          onClick={() => setActiveTab('trajectory')}
          className={`tab-pill ${activeTab === 'trajectory' ? 'active' : ''}`}
        >
          <Calendar className="w-4 h-4" />
          <span>30-Day Forecast Curve</span>
        </button>

        <button
          onClick={() => setActiveTab('commitments')}
          className={`tab-pill ${activeTab === 'commitments' ? 'active' : ''}`}
        >
          <span>Bills & Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`tab-pill ${activeTab === 'goals' ? 'active' : ''}`}
        >
          <span>Savings Vaults</span>
        </button>

        <button
          onClick={() => setActiveTab('curveball')}
          className={`tab-pill ${activeTab === 'curveball' ? 'active' : ''}`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Life Curveball Roulette</span>
        </button>
      </div>
    </header>
  );
}
