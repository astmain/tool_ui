import React from 'react';
import type { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /** 卡片标题 */
  title?: ReactNode;
  /** 副标题 */
  subtitle?: ReactNode;
  /** 封面图片 */
  cover?: ReactNode;
  /** 操作区域（底部） */
  actions?: ReactNode;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 阴影时机 */
  shadow?: 'always' | 'hover' | 'never';
  /** hover 时是否可抬起（transform + shadow） */
  hoverable?: boolean;
  /** 额外类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 卡片内容 */
  children?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  cover,
  actions,
  bordered = true,
  shadow = 'hover',
  hoverable = true,
  className,
  style,
  children,
}) => {
  const cardClasses = [
    styles.card,
    bordered ? styles.bordered : styles.borderless,
    styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`],
    hoverable ? styles.hoverable : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = title !== undefined || subtitle !== undefined;

  return (
    <div className={cardClasses} style={style}>
      {cover && <div className={styles.cover}>{cover}</div>}
      {hasHeader && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}
      {children && <div className={styles.body}>{children}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

Card.displayName = 'Card';

export default Card;
