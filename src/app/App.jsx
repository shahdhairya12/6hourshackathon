import React, { useState, Suspense, lazy } from 'react';
import { FinanceProvider } from '../core/context/FinanceContext';
import { useFinance } from '../core/hooks/useFinance';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/layout/Toast';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import OverviewDashboard from '../features/dashboard/OverviewDashboard';
import ForecastChart from '../features/forecast/ForecastChart';
import AddTransactionModal from '../features/transactions/AddTransactionModal';
import FinancialWrapModal from '../features/wrap/FinancialWrapModal';
import ErrorBoundary from './ErrorBoundary';

// Lazy loaded views for optimal chunk splitting and performance
const DecisionSimulator = lazy(() => import('../features/simulator/DecisionSimulator'));
const CommitmentsManager = lazy(() => import('../features/commitments/CommitmentsManager'));
const SavingsVaults = lazy(() => import('../features/savings/SavingsVaults'));
const CurveballRoulette = lazy(() => import('../features/curveball/CurveballRoulette'));

function AppContent() {
  const {
    activeTab,
    isWrapModalOpen,
    setIsWrapModalOpen,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-slate-100 selection:bg-violet-500 selection:text-white">

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
      <Toast />

      {/* Clean Accessible Footer */}
      <Footer />

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
