import { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * Modal — Generic accessible modal dialog.
 *
 * Props:
 *  - isOpen   : boolean — controls visibility
 *  - onClose  : () => void — called when backdrop or Escape is pressed
 *  - title    : string — modal header text
 *  - size     : 'sm' | 'md' | 'lg'  (default: 'md')
 *  - children : modal body content
 */
const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  const dialogRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap focus inside modal while open
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from bubbling
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
