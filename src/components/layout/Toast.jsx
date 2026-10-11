/**
 * @file Toast.jsx
 * @description Global accessible toast notification pill.
 */

import { useFinance } from '../../core/hooks/useFinance';

const TONE = {
  success: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
  warning: 'bg-amber-950/80 border-amber-500/40 text-amber-200',
  info: 'bg-[var(--bg-surface-2)]/90 border-violet-500/40 text-violet-200',
};

const ICON = {
  success: '✨',
  warning: '⚠️',
  info: '⚡',
};

export default function Toast() {
  const { toast } = useFinance();
  if (!toast) return null;

  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50 animate-in">
      <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${TONE[toast.type] || TONE.info}`}>
        <span className="text-base">{ICON[toast.type] || ICON.info}</span>
        <span className="text-xs font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
