import React, { useCallback, useId } from 'react';
import styles from './CheckboxGroup.module.css';
import Checkbox from './Checkbox';

export interface CheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  options?: Array<{ label: React.ReactNode; value: string; disabled?: boolean }>;
  className?: string;
  style?: React.CSSProperties;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value = [],
  defaultValue = [],
  onChange,
  disabled = false,
  options = [],
  className,
  style,
}) => {
  const groupId = useId();
  const controlledValue = value.length > 0 || defaultValue.length === 0
    ? value
    : defaultValue;

  const handleChange = useCallback(
    (checkedValue: string, checked: boolean) => {
      if (disabled) return;

      const newValue = checked
        ? [...controlledValue, checkedValue]
        : controlledValue.filter((v) => v !== checkedValue);

      onChange?.(newValue);
    },
    [disabled, controlledValue, onChange]
  );

  const isChecked = useCallback(
    (itemValue: string) => controlledValue.includes(itemValue),
    [controlledValue]
  );

  return (
    <div
      className={`${styles.checkboxGroup} ${className || ''}`}
      role="group"
      aria-labelledby={groupId}
      style={style}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={isChecked(option.value)}
          disabled={disabled || option.disabled}
          label={option.label}
          value={option.value}
          onChange={(checked) => handleChange(option.value, checked)}
          aria-describedby={groupId}
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
