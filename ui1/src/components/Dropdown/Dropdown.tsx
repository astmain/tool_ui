import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { DropdownMenu } from './DropdownMenu';
import { DropdownItem } from './DropdownItem';
import styles from './Dropdown.module.css';

export interface MenuItem {
  /** 唯一标识 */
  key: string;
  /** 显示文本 */
  label: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示分割线 */
  divided?: boolean;
  /** 子菜单 */
  children?: MenuItem[];
}

export interface DropdownProps {
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'manual';
  /** 弹出方向 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** 对齐方式 */
  align?: 'start' | 'end';
  /** 菜单项列表 */
  menu?: MenuItem[];
  /** 选中回调 */
  onSelect?: (key: string) => void;
  /** 下拉触发器内容 */
  children?: ReactNode;
  /** 触发器元素（用于手动模式） */
  triggerElement?: ReactNode;
  /** 延迟显示（毫秒） */
  showTimeout?: number;
  /** 延迟隐藏（毫秒） */
  hideTimeout?: number;
  /** 额外类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 是否禁用 */
  disabled?: boolean;
}

export interface DropdownRef {
  /** 手动显示菜单 */
  show: () => void;
  /** 手动隐藏菜单 */
  hide: () => void;
}

type Placement = NonNullable<DropdownProps['placement']>;
type Align = NonNullable<DropdownProps['align']>;

const placementPositionMap: Record<Placement, 'top' | 'bottom'> = {
  top: 'bottom',
  bottom: 'top',
  left: 'bottom',
  right: 'bottom',
};

const placementAlignMap: Record<Align, 'left' | 'right'> = {
  start: 'left',
  end: 'right',
};

function getMenuPosition(
  triggerRect: DOMRect,
  menuRect: DOMRect,
  placement: Placement,
  align: Align
): { top: number; left: number } {
  const gap = 4;
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'bottom':
      top = triggerRect.bottom + gap;
      left = align === 'end' ? triggerRect.right - menuRect.width : triggerRect.left;
      break;
    case 'top':
      top = triggerRect.top - menuRect.height - gap;
      left = align === 'end' ? triggerRect.right - menuRect.width : triggerRect.left;
      break;
    case 'left':
      top = triggerRect.top;
      left = triggerRect.left - menuRect.width - gap;
      break;
    case 'right':
      top = triggerRect.top;
      left = triggerRect.right + gap;
      break;
  }

  // Boundary clamping
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (left + menuRect.width > vw) {
    left = Math.max(0, vw - menuRect.width - 8);
  }
  if (left < 0) {
    left = 8;
  }
  if (top + menuRect.height > vh) {
    top = Math.max(8, vh - menuRect.height - 8);
  }
  if (top < 0) {
    top = 8;
  }

  return { top, left };
}

export const Dropdown = forwardRef<DropdownRef, DropdownProps>(
  (
    {
      trigger = 'click',
      placement = 'bottom',
      align = 'start',
      menu = [],
      onSelect,
      children,
      triggerElement,
      showTimeout = 150,
      hideTimeout = 150,
      className,
      style,
      disabled = false,
    },
    ref
  ) => {
    const instanceId = useId();
    const menuId = `ui-dropdown-menu-${instanceId}`;
    const triggerId = `ui-dropdown-trigger-${instanceId}`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [visible, setVisible] = useState(false);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    const clearTimers = useCallback(() => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }, []);

    const updateMenuPosition = useCallback(() => {
      if (!triggerRef.current || !menuRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuEl = menuRef.current;
      const menuRect = menuEl.getBoundingClientRect();
      const pos = getMenuPosition(triggerRect, menuRect, placement, align);
      setMenuStyle({ top: pos.top, left: pos.left });
    }, [placement, align]);

    const showMenu = useCallback(() => {
      if (disabled) return;
      clearTimers();
      showTimerRef.current = setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateMenuPosition();
          });
        });
      }, showTimeout);
    }, [disabled, clearTimers, showTimeout, updateMenuPosition]);

    const hideMenu = useCallback(() => {
      clearTimers();
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, hideTimeout);
    }, [clearTimers, hideTimeout]);

    const handleSelect = useCallback(
      (key: string) => {
        onSelect?.(key);
        hideMenu();
      },
      [onSelect, hideMenu]
    );

    const handleTriggerClick = useCallback(() => {
      if (disabled) return;
      if (trigger === 'click') {
        if (visible) {
          hideMenu();
        } else {
          showMenu();
        }
      }
    }, [trigger, visible, showMenu, hideMenu, disabled]);

    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      if (trigger === 'hover') {
        showMenu();
      }
    }, [trigger, showMenu, disabled]);

    const handleMouseLeave = useCallback(() => {
      if (disabled) return;
      if (trigger === 'hover') {
        hideMenu();
      }
    }, [trigger, hideMenu, disabled]);

    const handleMenuMouseEnter = useCallback(() => {
      if (disabled) return;
      clearTimers();
    }, [clearTimers, disabled]);

    const handleMenuMouseLeave = useCallback(() => {
      if (disabled) return;
      if (trigger === 'hover') {
        hideMenu();
      }
    }, [trigger, hideMenu, disabled]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Escape') {
          hideMenu();
        }
        if (e.key === 'Enter' || e.key === ' ') {
          if (!visible) {
            e.preventDefault();
            showMenu();
          }
        }
        if (e.key === 'ArrowDown' && visible) {
          e.preventDefault();
          const first = menuRef.current?.querySelector<HTMLElement>(
            '[data-dropdown-item]:not([aria-disabled="true"])'
          );
          first?.focus();
        }
      },
      [disabled, visible, showMenu, hideMenu]
    );

    const handleItemKeyDown = useCallback(
      (e: React.KeyboardEvent, key: string, hasSubMenu: boolean) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!hasSubMenu) {
            handleSelect(key);
          }
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const items = menuRef.current?.querySelectorAll<HTMLElement>('[data-dropdown-item]');
          if (!items) return;
          const current = e.currentTarget as HTMLElement;
          const idx = Array.from(items).indexOf(current);
          const next = items[idx + 1];
          next?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const items = menuRef.current?.querySelectorAll<HTMLElement>('[data-dropdown-item]');
          if (!items) return;
          const current = e.currentTarget as HTMLElement;
          const idx = Array.from(items).indexOf(current);
          const prev = items[idx - 1];
          if (prev) {
            prev.focus();
          } else {
            triggerRef.current?.focus();
          }
        }
      },
      [handleSelect]
    );

    // Expose show/hide via ref
    React.useImperativeHandle(
      ref,
      () => ({
        show: showMenu,
        hide: hideMenu,
      }),
      [showMenu, hideMenu]
    );

    // Click outside to close
    useEffect(() => {
      if (!visible) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [visible]);

    // Resize scroll listener
    useEffect(() => {
      if (!visible) return;
      const handleUpdate = () => updateMenuPosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }, [visible, updateMenuPosition]);

    // Manual trigger
    useEffect(() => {
      if (trigger === 'manual') {
        setVisible(false);
      }
    }, [trigger]);

    const dropdownClasses = [
      styles.dropdown,
      visible ? styles.visible : '',
      disabled ? styles.disabled : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    const menuContent = (
      <DropdownMenu
        ref={menuRef}
        id={menuId}
        placement={placement}
        align={align}
        style={menuStyle}
        visible={visible}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
      >
        {menu.map((item) => (
          <DropdownItem
            key={item.key}
            itemKey={item.key}
            disabled={item.disabled}
            divided={item.divided}
            hasSubMenu={!!item.children?.length}
            onSelect={handleSelect}
            onKeyDown={(e) => handleItemKeyDown(e, item.key, !!item.children?.length)}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    );

    const triggerContent = triggerElement ? (
      <div
        ref={triggerRef}
        className={styles.triggerWrapper}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={visible}
        aria-disabled={disabled}
        id={triggerId}
      >
        {triggerElement}
      </div>
    ) : (
      <div
        ref={triggerRef}
        className={styles.triggerWrapper}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={visible}
        aria-disabled={disabled}
        id={triggerId}
      >
        {children}
      </div>
    );

    return (
      <div
        ref={containerRef}
        className={dropdownClasses}
        style={style}
      >
        {triggerContent}
        {visible &&
          ReactDOM.createPortal(
            <div
              className={styles.portal}
              style={menuStyle}
            >
              {menuContent}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
