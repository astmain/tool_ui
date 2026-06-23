import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { Placement, Align } from './Dropdown';
import styles from './Dropdown.module.css';

export interface DropdownMenuProps {
  id?: string;
  children?: ReactNode;
  placement?: Placement;
  align?: Align;
  style?: React.CSSProperties;
  visible?: boolean;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      id,
      children,
      placement = 'bottom',
      align = 'start',
      style,
      visible,
      className,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    const placementClass = styles[`placement${placement.charAt(0).toUpperCase() + placement.slice(1)}`];
    const alignClass = styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`];

    const menuClasses = [
      styles.menu,
      placementClass,
      alignClass,
      visible ? styles.menuVisible : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        id={id}
        className={menuClasses}
        style={style}
        role="menu"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-orientation="vertical"
      >
        <div className={styles.menuInner}>
          {children}
        </div>
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';
