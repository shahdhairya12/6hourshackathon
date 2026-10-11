import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import DecisionSimulator from './components/DecisionSimulator';
import ForecastChart from './components/ForecastChart';
import CommitmentsManager from './components/CommitmentsManager';
import SavingsVaults from './components/SavingsVaults';
import CurveballRoulette from './components/CurveballRoulette';
import AddTransactionModal from './components/AddTransactionModal';
import { 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Zap,
  Info
} from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, toast, resetMonth, currentDay } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 selection:bg-violet-500 selection:text-white">
      
      {/* Sticky Modern Navbar */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Dynamic Workspace Content */}
      <main className="flex-1 app-container">
        {activeTab === 'dashboard' && (
          <OverviewDashboard onOpenAddModal={() => setIsAddModalOpen(true)} />
        )}
        
        {activeTab === 'simulator' && (
          <DecisionSimulator />
        )}

        {activeTab === 'trajectory' && (
          <div className="space-y-6">
            <ForecastChart />
          </div>
        )}

        {activeTab === 'commitments' && (
          <CommitmentsManager />
        )}

        {activeTab === 'goals' && (
          <SavingsVaults />
        )}

        {activeTab === 'curveball' && (
          <CurveballRoulette />
        )}
      </main>

      {/* Global Interactive Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Dynamic Toast Feedback Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
              : 'bg-violet-950/90 border-violet-500/40 text-violet-200'
          }`}>
            <span className="text-base">
              {toast.type === 'success' ? '✨' : toast.type === 'warning' ? '⚠️' : '⚡'}
            </span>
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-white/5 py-6 px-4 bg-[#05070e] text-center text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-white">PULSE // OS</span>
            <span>•</span>
            <span>Gen Z 30-Day ₹10,000 Financial Survival Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetMonth}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Month Simulation</span>
            </button>
            <span>•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Day {currentDay}/30 Active
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
