import React, { useCallback, useId } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  value?: string;
  size?: 'small' | 'medium' | 'large';
  onChange?: (checked: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  value,
  size = 'medium',
  onChange,
  className,
  style,
}) => {
  const inputId = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e.target.checked);
    },
    [disabled, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && onChange) {
          onChange(!checked);
        }
      }
    },
    [disabled, checked, onChange]
  );

  return (
    <label
      className={`${styles.checkbox} ${styles[size]} ${disabled ? styles.disabled : ''} ${className || ''}`}
      style={style}
    >
      <span
        className={`${styles.checkboxInput} ${checked ? styles.checked : ''} ${indeterminate ? styles.indeterminate : ''}`}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={styles.nativeInput}
          aria-hidden="true"
        />
        <span className={styles.checkmark}>
          {checked && !indeterminate && (
            <svg viewBox="0 0 14 14" className={styles.checkIcon}>
              <path d="M11.28 3.22a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3.19 3.19a.75.75 0 001.06 0l6.36-6.36z" />
            </svg>
          )}
          {indeterminate && (
            <svg viewBox="0 0 14 14" className={styles.indeterminateIcon}>
              <path d="M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </span>
      {label && (
        <span className={styles.checkboxLabel}>{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
