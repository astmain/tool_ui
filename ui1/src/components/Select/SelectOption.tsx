import React from 'react';
import styles from './Select.module.css';

export interface SelectOptionProps {
  label: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  label,
  value,
  disabled = false,
  selected = false,
  focused = false,
  onClick,
  onMouseEnter,
}) => {
  const classNames = [
    styles.option,
    selected && styles.selected,
    disabled && styles.disabled,
    focused && styles.focused,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      data-value={value}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onMouseEnter}
    >
      <span>{label}</span>
      {selected && (
        <span className={styles.optionCheck}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M11.28 3.22a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3.19 3.19a.75.75 0 001.06 0l6.36-6.36z"
              fill="currentColor"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default SelectOption;
