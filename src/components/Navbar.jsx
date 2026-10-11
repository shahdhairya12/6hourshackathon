import React, { useState } from 'react';
import { 
  Zap, 
  Calendar, 
  RotateCcw, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  TrendingUp, 
  ShieldAlert,
  Sparkles,
  Trophy,
  Activity,
  Layers,
  PiggyBank
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { PERSONAS } from '../data/initialData';

export default function Navbar({ onOpenAddModal, onOpenWrapModal }) {
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
    gamification
  } = useFinance();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060813]/85 backdrop-blur-2xl">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Persona */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/25">
            <div className="w-full h-full bg-[#0b1022] rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400 fill-violet-400/30 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-tight text-xl text-white">PULSE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/35">
                ₹10K // 30D OS
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Trophy className="w-3 h-3 text-amber-400" />
                Lvl {gamification.level}
              </span>
            </div>
            
            {/* Persona Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                aria-haspopup="true"
                aria-expanded={showPersonaMenu}
                aria-label={`Current Profile: ${currentPersona.name}. Click to change.`}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mt-0.5 group focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md outline-none"
              >
                <span>{currentPersona.avatar} {currentPersona.name}</span>
                <span className="text-[10px] text-violet-400 underline group-hover:text-violet-300 font-mono">change</span>
              </button>

              {showPersonaMenu && (
                <div 
                  role="menu"
                  className="absolute left-0 top-7 w-72 rounded-2xl bg-[#0d1428] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider font-mono">
                    Select Gen Z Profile
                  </div>
                  {PERSONAS.map(p => (
                    <button
                      key={p.id}
                      role="menuitem"
                      onClick={() => {
                        switchPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-all text-xs ${
                        p.id === selectedPersonaId 
                          ? 'bg-violet-600/25 border border-violet-500/50 text-white font-bold' 
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="text-xl p-1 bg-white/5 rounded-lg border border-white/10">{p.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold flex items-center justify-between text-xs">
                          <span className="truncate">{p.name}</span>
                          {p.id === selectedPersonaId && <span className="text-[10px] text-violet-400 font-mono">✓ Active</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 30-Day Timeline Stepper HUD */}
        <div className="flex items-center gap-2 bg-[#0c1124] border border-white/10 rounded-2xl p-1.5 px-3 shadow-inner">
          <div className="flex items-center gap-2 pr-2.5 border-r border-white/10">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Month Pace</div>
              <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                Day <span className="text-cyan-400">{currentDay}</span> / 30
                <span className="text-[10px] font-normal text-slate-400">({daysRemaining}d left)</span>
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => advanceDay(1)}
              aria-label="Advance month by 1 Day"
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white/5 hover:bg-violet-600/30 hover:text-violet-300 text-slate-200 border border-white/5 transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
            >
              +1 Day
            </button>
            <button
              onClick={() => advanceDay(5)}
              aria-label="Fast forward month by 5 Days"
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/20 transition-all hidden sm:flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
            >
              +5 Days
            </button>
            <button
              onClick={resetMonth}
              aria-label="Reset month back to Day 1"
              title="Reset Month to Day 1"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Actions (Wrap, Audio, Add Spend) */}
        <div className="flex items-center gap-2">
          {/* Financial Wrap Button */}
          <button
            onClick={onOpenWrapModal}
            aria-label="View 30-Day Financial Wrap Receipt"
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-violet-500/15 hover:from-amber-500/25 hover:to-violet-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">FinPulse Wrap</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Log Spend Button */}
          <button
            onClick={onOpenAddModal}
            aria-label="Log new spend or income"
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Spend</span>
          </button>
        </div>
      </div>

      {/* Accessible Navigation Tabs */}
      <nav 
        aria-label="Primary Navigation" 
        className="max-w-[1420px] mx-auto px-4 sm:px-6 overflow-x-auto flex items-center gap-2 py-2 border-t border-white/5 no-scrollbar"
      >
        <div role="tablist" className="flex items-center gap-2">
          <button
            role="tab"
            aria-selected={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            className={`tab-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Dashboard</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'simulator'}
            onClick={() => setActiveTab('simulator')}
            className={`tab-pill relative ${activeTab === 'simulator' ? 'active' : ''}`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>What-If Decision Simulator</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-2 right-2 hidden sm:block" />
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'trajectory'}
            onClick={() => setActiveTab('trajectory')}
            className={`tab-pill ${activeTab === 'trajectory' ? 'active' : ''}`}
          >
            <Activity className="w-4 h-4" />
            <span>30-Day Forecast Curve</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'commitments'}
            onClick={() => setActiveTab('commitments')}
            className={`tab-pill ${activeTab === 'commitments' ? 'active' : ''}`}
          >
            <Layers className="w-4 h-4" />
            <span>Bills & Subscriptions</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'goals'}
            onClick={() => setActiveTab('goals')}
            className={`tab-pill ${activeTab === 'goals' ? 'active' : ''}`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>Savings Vaults</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'curveball'}
            onClick={() => setActiveTab('curveball')}
            className={`tab-pill ${activeTab === 'curveball' ? 'active' : ''}`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Life Curveball Roulette</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
