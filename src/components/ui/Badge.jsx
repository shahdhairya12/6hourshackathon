/**
 * @file Badge.jsx
 * @description Small pill used for status, tags and counters.
 */

const TONES = {
  neutral: 'bg-white/[0.06] text-slate-300 border-white/[0.1]',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/35',
  teal: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/35',
};

/**
 * @param {Object} props
 * @param {keyof typeof TONES} [props.tone]
 * @param {string} [props.className]
 */
export default function Badge({ tone = 'neutral', className = '', children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold font-mono ${TONES[tone] || TONES.neutral} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
