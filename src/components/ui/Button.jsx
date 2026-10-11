/**
 * @file Button.jsx
 * @description Shared button primitive mapping the design-system button classes.
 */

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-[14px] px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors',
};

/**
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'success'|'ghost'} [props.variant]
 * @param {string} [props.className]
 * @param {React.ElementType} [props.as]
 */
export default function Button({
  variant = 'primary',
  as: Tag = 'button',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag type={Tag === 'button' ? type : undefined} className={`${VARIANTS[variant] || VARIANTS.primary} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
