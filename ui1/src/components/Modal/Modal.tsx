import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useId,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  width?: string | number;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  content,
  footer,
  width = 520,
  closeOnOverlay = true,
  closeOnEsc = true,
  showClose = true,
  onClose,
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  className = '',
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const instanceId = useId();

  const normalizedWidth = typeof width === 'number' ? `${width}px` : width;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleEnter = useCallback(() => {
    previousActiveElement.current = document.activeElement;
    setIsVisible(true);
    requestAnimationFrame(() => {
      setIsAnimating(true);
      if (modalRef.current) {
        modalRef.current.focus();
      }
    });
  }, []);

  const handleLeave = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (open) {
      handleEnter();
      document.body.style.overflow = 'hidden';
    } else if (isVisible) {
      handleLeave();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isVisible, handleEnter, handleLeave]);

  useEffect(() => {
    if (!closeOnEsc || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEsc, open, handleClose]);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [open, isVisible]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        handleClose();
      }
    },
    [closeOnOverlay, handleClose]
  );

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  }, [onConfirm, handleClose]);

  const renderDefaultFooter = () => (
    <>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={handleClose}
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={styles.confirmBtn}
        onClick={handleConfirm}
      >
        {confirmText}
      </button>
    </>
  );

  if (!isVisible) return null;

  const modalContent = (
    <div
      className={`${styles.overlay} ${isAnimating ? styles.overlayVisible : ''}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${isAnimating ? styles.modalVisible : ''} ${className}`}
        style={{ width: normalizedWidth, ...style }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `modal-title-${instanceId}` : undefined}
        aria-describedby={content ? `modal-content-${instanceId}` : undefined}
        tabIndex={-1}
      >
        {(title || showClose) && (
          <div className={styles.header}>
            {title && (
              <h2 id={`modal-title-${instanceId}`} className={styles.title}>
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="关闭"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M14 4L4 14M4 4l10 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {content && (
          <div
            id={`modal-content-${instanceId}`}
            className={styles.body}
          >
            {content}
          </div>
        )}

        {footer !== undefined ? (
          <div className={styles.footer}>{footer}</div>
        ) : (onConfirm !== undefined || onClose !== undefined) ? (
          <div className={styles.footer}>{renderDefaultFooter()}</div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
