import React, { useCallback, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  /** 当前状态 */
  checked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 开启状态文字 */
  activeText?: ReactNode;
  /** 关闭状态文字 */
  inactiveText?: ReactNode;
  /** 开启状态颜色 */
  activeColor?: string;
  /** 关闭状态颜色 */
  inactiveColor?: string;
  /** 状态变化回调 */
  onChange?: (checked: boolean) => void;
  /** 额外类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
}

const sizeMap = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  disabled = false,
  size = 'medium',
  activeText,
  inactiveText,
  activeColor,
  inactiveColor,
  onChange,
  className,
  style,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const instanceId = useId();
  const switchId = `ui-switch-${instanceId}`;
  const labelId = `ui-switch-label-${instanceId}`;

  const handleClick = useCallback(() => {
    if (disabled) return;
    onChange?.(!checked);
  }, [disabled, checked, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (!disabled) {
          onChange?.(!checked);
        }
      }
    },
    [disabled, checked, onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(e.target.checked);
      }
    },
    [disabled, onChange]
  );

  const hasText = activeText !== undefined || inactiveText !== undefined;

  const switchClasses = [
    styles.switch,
    styles[sizeMap[size]],
    checked ? styles.checked : '',
    disabled ? styles.disabled : '',
    hasText ? styles.withText : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const switchStyle: React.CSSProperties = {
    '--ui-switch-active-color': activeColor,
    '--ui-switch-inactive-color': inactiveColor,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={switchClasses}
      style={switchStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-labelledby={hasText ? labelId : undefined}
      tabIndex={disabled ? -1 : 0}
    >
      {hasText && (
        <span
          id={labelId}
          className={`${styles.text} ${checked ? styles.activeText : styles.inactiveText}`}
        >
          {checked ? activeText : inactiveText}
        </span>
      )}
      <span className={styles.track}>
        <span className={styles.thumb} />
        <input
          ref={inputRef}
          type="checkbox"
          id={switchId}
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={handleInputChange}
          aria-label={hasText ? undefined : 'Switch'}
        />
      </span>
    </div>
  );
};

Switch.displayName = 'Switch';

export default Switch;
