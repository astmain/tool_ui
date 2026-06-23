import React, {
  cloneElement,
  FC,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './Tooltip.module.css';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export interface TooltipProps {
  /** 提示内容 */
  content?: ReactNode;
  /** 弹出位置，默认 'top' */
  placement?: TooltipPlacement;
  /** 触发方式，默认 'hover' */
  trigger?: TooltipTrigger;
  /** 是否禁用 */
  disabled?: boolean;
  /** 受控显隐 */
  open?: boolean;
  /** 非受控初始状态 */
  defaultOpen?: boolean;
  /** 鼠标是否可进入浮层，默认 true */
  enterable?: boolean;
  /** 过渡动画类名 */
  transition?: string;
  /** 显隐变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 额外类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children: ReactNode;
}

interface TooltipPosition {
  top: number;
  left: number;
}

const TOOLTIP_OFFSET = 8;

export const Tooltip: FC<TooltipProps> = ({
  content,
  placement = 'top',
  trigger = 'hover',
  disabled = false,
  open,
  defaultOpen = false,
  enterable = true,
  transition,
  onOpenChange,
  className,
  style,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEnteringTooltip = useRef(false);

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : isOpen;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) {
      setPosition({ top: -9999, left: -9999 });
      return;
    }

    const tooltipRect = tooltipEl.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - TOOLTIP_OFFSET;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top + scrollY - tooltipRect.height - TOOLTIP_OFFSET;
        left = triggerRect.left + scrollX;
        break;
      case 'top-end':
        top = triggerRect.top + scrollY - tooltipRect.height - TOOLTIP_OFFSET;
        left = triggerRect.right + scrollX - tooltipRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + TOOLTIP_OFFSET;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + scrollY + TOOLTIP_OFFSET;
        left = triggerRect.left + scrollX;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + scrollY + TOOLTIP_OFFSET;
        left = triggerRect.right + scrollX - tooltipRect.width;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case 'left-start':
        top = triggerRect.top + scrollY;
        left = triggerRect.left + scrollX - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case 'left-end':
        top = triggerRect.bottom + scrollY - tooltipRect.height;
        left = triggerRect.left + scrollX - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollX + TOOLTIP_OFFSET;
        break;
      case 'right-start':
        top = triggerRect.top + scrollY;
        left = triggerRect.right + scrollX + TOOLTIP_OFFSET;
        break;
      case 'right-end':
        top = triggerRect.bottom + scrollY - tooltipRect.height;
        left = triggerRect.right + scrollX + TOOLTIP_OFFSET;
        break;
      default:
        top = triggerRect.top + scrollY - tooltipRect.height - TOOLTIP_OFFSET;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
    }

    setPosition({ top, left });
  }, [placement]);

  const showTooltip = useCallback(() => {
    if (disabled) return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    showTimerRef.current = setTimeout(() => {
      if (!isControlled) {
        setIsOpen(true);
      }
      onOpenChange?.(true);
      setVisible(true);
    }, 100);
  }, [disabled, isControlled, onOpenChange]);

  const hideTooltip = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    hideTimerRef.current = setTimeout(() => {
      if (!isControlled) {
        setIsOpen(false);
      }
      onOpenChange?.(false);
      setVisible(false);
    }, 100);
  }, [isControlled, onOpenChange]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      showTooltip();
    }
  }, [trigger, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  }, [trigger, hideTooltip]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      if (currentOpen) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  }, [trigger, currentOpen, showTooltip, hideTooltip]);

  const handleFocus = useCallback(() => {
    if (trigger === 'focus') {
      showTooltip();
    }
  }, [trigger, showTooltip]);

  const handleBlur = useCallback(() => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  }, [trigger, hideTooltip]);

  const handleTooltipMouseEnter = useCallback(() => {
    if (enterable && trigger === 'hover') {
      isEnteringTooltip.current = true;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }
  }, [enterable, trigger]);

  const handleTooltipMouseLeave = useCallback(() => {
    if (enterable && trigger === 'hover') {
      isEnteringTooltip.current = false;
      hideTooltip();
    }
  }, [enterable, trigger, hideTooltip]);

  useEffect(() => {
    if (currentOpen) {
      updatePosition();
    }
  }, [currentOpen, updatePosition]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentOpen && trigger === 'manual') {
      updatePosition();
    }
  }, [currentOpen, trigger, updatePosition]);

  const triggerEventHandlers: Record<string, React.EventHandler<any>> = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const tooltipClasses = [
    styles.tooltip,
    transition,
    visible ? styles.tooltipEnterActive : styles.tooltipEnter,
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={enterable && trigger === 'hover' ? styles.popper : undefined}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      <div
        data-placement={placement}
        className={tooltipClasses}
        style={{
          top: position.top,
          left: position.left,
        }}
        role="tooltip"
      >
        {content}
        <span className={styles.tooltipArrow} />
      </div>
    </div>
  );

  const childElement = useMemo(
    () =>
      isValidElement(children)
        ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            ...triggerEventHandlers,
            ref: triggerRef,
          })
        : children,
    [children, triggerEventHandlers, triggerRef]
  );

  return (
    <>
      <span className={`${styles.tooltipWrapper} ${className || ''}`} style={style}>
        {childElement}
      </span>
      {ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
