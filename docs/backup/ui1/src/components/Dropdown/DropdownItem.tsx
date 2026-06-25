import { forwardRef, useCallback } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import styles from './Dropdown.module.css';

export interface DropdownItemProps {
  itemKey: string;
  children?: ReactNode;
  disabled?: boolean;
  divided?: boolean;
  hasSubMenu?: boolean;
  className?: string;
  onSelect?: (key: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      itemKey,
      children,
      disabled = false,
      divided = false,
      hasSubMenu = false,
      className,
      onSelect,
      onKeyDown,
    },
    ref
  ) => {
    const handleClick = useCallback(() => {
      if (!disabled && !hasSubMenu) {
        onSelect?.(itemKey);
      }
    }, [disabled, hasSubMenu, itemKey, onSelect]);

    const itemClasses = [
      styles.menuItem,
      divided ? styles.divided : '',
      disabled ? styles.itemDisabled : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <>
        {divided && <div className={styles.divider} role="separator" />}
        <div
          ref={ref}
          className={itemClasses}
          role="menuitem"
          data-dropdown-item
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={onKeyDown}
        >
          <span className={styles.menuItemLabel}>{children}</span>
          {hasSubMenu && (
            <span className={styles.subMenuArrow}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 2.5L8 6L4.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      </>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';
