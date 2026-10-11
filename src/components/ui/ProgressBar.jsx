/**
 * @file ProgressBar.jsx
 * @description Accessible progress meter with optional accent glow.
 */

/**
 * @param {Object} props
 * @param {number} props.value - 0..100
 * @param {string} [props.color] - Accent color
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export default function ProgressBar({
  value = 0,
  color = 'var(--aurora-violet)',
  size = 'md',
  ariaLabel = 'Progress',
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, value));
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className={`w-full rounded-full bg-black/40 border border-white/[0.06] overflow-hidden ${height} ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
      />
    </div>
  );
}
