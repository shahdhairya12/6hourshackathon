/**
 * @file Footer.jsx
 * @description Accessible application footer with gamification status,
 * month reset control and simulation day indicator.
 */

import { RotateCcw, Trophy } from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';

export default function Footer() {
  const { currentDay, resetMonth, setIsWrapModalOpen, gamification } = useFinance();

  return (
    <footer className="border-t border-white/[0.07] py-6 px-4 bg-[var(--bg-deep)] text-center text-xs text-slate-500">
      <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-cyan-400 grid place-items-center text-[10px] font-black text-white">
            ⚡
          </span>
          <span className="font-heading font-bold tracking-tight text-slate-200">PULSE // OS</span>
          <span className="text-slate-700">•</span>
          <span>Gen Z 30-Day ₹10,000 Financial Survival Engine</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsWrapModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-mono text-[11px]"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{gamification.title}</span>
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={resetMonth}
            aria-label="Reset Month Simulation"
            className="hover:text-rose-400 transition-colors flex items-center gap-1.5 font-mono text-[11px] rounded outline-none"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Month</span>
          </button>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400 font-mono text-[11px]">Day {currentDay}/30 Active</span>
        </div>
      </div>
    </footer>
  );
}
