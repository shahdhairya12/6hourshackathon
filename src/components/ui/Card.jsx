/**
 * @file Card.jsx
 * @description Shared surface primitive. Renders the themed glass / holo / inset
 * surfaces used across PULSE OS so styling stays consistent.
 */

const VARIANTS = {
  glass: 'glass-panel p-6 shadow-xl',
  holo: 'holo-card p-5 shadow-xl',
  inset: 'panel-inset',
  plain: 'rounded-[18px] border border-white/[0.08] bg-[var(--bg-surface)]',
};

/**
 * @param {Object} props
 * @param {'glass'|'holo'|'inset'|'plain'} [props.variant]
 * @param {string} [props.className]
 * @param {React.ElementType} [props.as]
 */
export default function Card({
  variant = 'glass',
  as: Tag = 'section',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`${VARIANTS[variant] || VARIANTS.glass} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
