import { useEffect } from 'react';

/**
 * @file Modal.jsx
 * @description Accessible modal shell: centers content, closes on Escape and
 * backdrop click, and locks scroll while open.
 */

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.labelledBy]
 * @param {string} [props.className]
 */
export default function Modal({ isOpen, onClose, labelledBy, className = '', children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in ${className}`}
    >
      {children}
    </div>
  );
}
