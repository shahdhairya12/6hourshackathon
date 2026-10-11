import React, { useState, Suspense, lazy } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { useFinance } from './hooks/useFinance';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import ForecastChart from './components/ForecastChart';
import AddTransactionModal from './components/AddTransactionModal';
import FinancialWrapModal from './components/FinancialWrapModal';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  RotateCcw, 
  Trophy
} from 'lucide-react';

// Lazy loaded views for optimal chunk splitting and performance
const DecisionSimulator = lazy(() => import('./components/DecisionSimulator'));
const CommitmentsManager = lazy(() => import('./components/CommitmentsManager'));
const SavingsVaults = lazy(() => import('./components/SavingsVaults'));
const CurveballRoulette = lazy(() => import('./components/CurveballRoulette'));

function AppContent() {
  const { 
    activeTab, 
    toast, 
    resetMonth, 
    currentDay,
    isWrapModalOpen,
    setIsWrapModalOpen,
    gamification
  } = useFinance();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#060813] text-slate-100 selection:bg-violet-500 selection:text-white">
      
      {/* Skip Link for WCAG Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Sticky Modern Navbar with Accessibility */}
      <Navbar 
        onOpenAddModal={() => setIsAddModalOpen(true)} 
        onOpenWrapModal={() => setIsWrapModalOpen(true)}
      />

      {/* Main Dynamic Workspace Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 app-container outline-none">
        {activeTab === 'dashboard' && (
          <OverviewDashboard onOpenAddModal={() => setIsAddModalOpen(true)} />
        )}
        
        {activeTab === 'simulator' && (
          <Suspense fallback={<SkeletonLoader />}>
            <DecisionSimulator />
          </Suspense>
        )}

        {activeTab === 'trajectory' && (
          <div className="space-y-6">
            <ForecastChart />
          </div>
        )}

        {activeTab === 'commitments' && (
          <Suspense fallback={<SkeletonLoader />}>
            <CommitmentsManager />
          </Suspense>
        )}

        {activeTab === 'goals' && (
          <Suspense fallback={<SkeletonLoader />}>
            <SavingsVaults />
          </Suspense>
        )}

        {activeTab === 'curveball' && (
          <Suspense fallback={<SkeletonLoader />}>
            <CurveballRoulette />
          </Suspense>
        )}
      </main>

      {/* Global Interactive Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <FinancialWrapModal
        isOpen={isWrapModalOpen}
        onClose={() => setIsWrapModalOpen(false)}
      />

      {/* Dynamic Toast Feedback Pill */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-bounce duration-300"
        >
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
              : 'bg-violet-950/90 border-violet-500/50 text-violet-200'
          }`}>
            <span className="text-base">
              {toast.type === 'success' ? '✨' : toast.type === 'warning' ? '⚠️' : '⚡'}
            </span>
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Clean Accessible Footer */}
      <footer className="border-t border-white/10 py-6 px-4 bg-[#05070e] text-center text-xs text-slate-500">
        <div className="max-w-[1420px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-white">PULSE // OS</span>
            <span>•</span>
            <span>Gen Z 30-Day ₹10,000 Financial Survival Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsWrapModalOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{gamification.title}</span>
            </button>
            <span>•</span>
            <button
              onClick={resetMonth}
              aria-label="Reset Month Simulation"
              className="hover:text-rose-400 transition-colors flex items-center gap-1 font-mono text-[11px] focus-visible:ring-2 focus-visible:ring-rose-400 rounded outline-none"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Month</span>
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
    <ErrorBoundary>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </ErrorBoundary>
  );
}

