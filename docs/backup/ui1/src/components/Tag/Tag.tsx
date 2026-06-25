import React, { useCallback } from 'react';
import styles from './Tag.module.css';

export interface TagProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  closable?: boolean;
  hit?: boolean;
  color?: string;
  effect?: 'light' | 'dark' | 'plain';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const Tag: React.FC<TagProps> = ({
  type = 'primary',
  size = 'medium',
  closable = false,
  hit = false,
  color,
  effect = 'light',
  className,
  style,
  children,
  onClose,
}) => {
  const handleCloseClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onClose?.(e);
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
      }
    },
    [onClose]
  );

  const customStyle = color
    ? {
        ...style,
        '--tag-custom-color': color,
      } as React.CSSProperties
    : style;

  const tagClasses = [
    styles.tag,
    styles[size],
    styles[type],
    styles[effect],
    hit ? styles.hit : '',
    color ? styles.customColor : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={tagClasses}
      style={customStyle}
      role={closable ? 'button' : undefined}
      tabIndex={closable ? 0 : undefined}
      onKeyDown={closable ? handleKeyDown : undefined}
    >
      <span className={styles.tagContent}>{children}</span>
      {closable && (
        <span
          className={styles.closeIcon}
          onClick={handleCloseClick}
          role="button"
          aria-label="Close tag"
          tabIndex={-1}
        >
          <svg viewBox="0 0 14 14" className={styles.closeIconSvg}>
            <path d="M4.293 4.293a1 1 0 011.414 0L7 5.586l1.293-1.293a1 1 0 111.414 1.414L8.414 7l1.293 1.293a1 1 0 01-1.414 1.414L7 8.414l-1.293 1.293a1 1 0 01-1.414-1.414L5.586 7 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </span>
      )}
    </span>
  );
};

export default Tag;
