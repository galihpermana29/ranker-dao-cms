import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './style.scss';

/**
 *
 * @typedef {object} IModalProps
 * @property {boolean} [isOpen]
 * @property {React.ReactNode} [children]
 * @property {React.HTMLProps<HTMLButtonElement>['onClick']} [onClose]
 * @property {React.CSSProperties['maxWidth']} [maxWidth]
 */

/** @type React.FC<IModalProps>  */
export const Modal = ({
  isOpen = false,
  children,
  onClose = () => {},
  maxWidth = 360,
}) => {
  useEffect(() => {
    if (document.body) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="ranker-modal-overlay" />
      <div className="ranker-modal" style={{ maxWidth }}>
        <button className="ranker-modal-close" onClick={onClose}>
          ×
        </button>

        {children}
      </div>
    </>,
    document.getElementById('root')
  );
};
