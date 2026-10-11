import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

/**
 * Enterprise React Error Boundary
 * Catches JavaScript errors anywhere in the component tree,
 * logs them, and displays a graceful fallback UI.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PULSE OS Uncaught Application Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[var(--bg-nav)] text-slate-100 flex items-center justify-center p-6 selection:bg-rose-500"
        >
          <div className="glass-panel max-w-lg w-full p-8 border border-rose-500/30 bg-gradient-to-b from-[var(--status-rose)]/10 to-[var(--bg-deepest)] text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                Runtime Exception Intercepted
              </span>
              <h1 className="text-2xl font-heading font-black text-white">
                FinPulse System Fault
              </h1>
              <p className="text-xs text-slate-400">
                An unexpected state disruption occurred in the financial simulation engine. Your data integrity is protected.
              </p>
            </div>

            {this.state.error?.message && (
              <pre className="p-3 bg-black/50 border border-rose-500/20 rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reload Session</span>
              </button>
              <button
                onClick={this.handleResetState}
                className="flex-1 btn-danger text-xs py-2.5 font-bold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
