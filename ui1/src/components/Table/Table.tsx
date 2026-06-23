import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from './Table.module.css';

export interface TableColumn {
  key: string;
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  render?: (value: any, row: any, index: number) => ReactNode;
}

export interface TableProps {
  columns?: TableColumn[];
  data?: any[];
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  emptyText?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Table: React.FC<TableProps> = ({
  columns = [],
  data = [],
  bordered = false,
  striped = false,
  hoverable = false,
  compact = false,
  emptyText = '暂无数据',
  className = '',
  style,
}) => {
  const tableClasses = [
    styles.table,
    bordered && styles.bordered,
    striped && styles.striped,
    hoverable && styles.hoverable,
    compact && styles.compact,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasFixedLeft = useMemo(
    () => columns.some((col) => col.fixed === 'left'),
    [columns]
  );

  const hasFixedRight = useMemo(
    () => columns.some((col) => col.fixed === 'right'),
    [columns]
  );

  const getColumnStyle = (col: TableColumn): React.CSSProperties => {
    const style: React.CSSProperties = {};
    if (col.width) {
      style.width = typeof col.width === 'number' ? `${col.width}px` : col.width;
    }
    if (col.align) {
      style.textAlign = col.align;
    }
    if (col.fixed) {
      style.position = 'sticky';
      if (col.fixed === 'left') {
        style.left = '0';
        style.zIndex = 2;
      } else if (col.fixed === 'right') {
        style.right = '0';
        style.zIndex = 2;
      }
    }
    return style;
  };

  const getFixedHeaderCellClass = (col: TableColumn): string => {
    const classes = [styles.th];
    if (col.fixed === 'left') {
      classes.push(styles.fixedLeft);
    } else if (col.fixed === 'right') {
      classes.push(styles.fixedRight);
    }
    return classes.join(' ');
  };

  const getFixedBodyCellClass = (col: TableColumn): string => {
    const classes = [styles.td];
    if (col.fixed === 'left') {
      classes.push(styles.fixedLeft);
    } else if (col.fixed === 'right') {
      classes.push(styles.fixedRight);
    }
    return classes.join(' ');
  };

  const renderCell = (col: TableColumn, row: any, rowIndex: number) => {
    const value = row[col.key];
    if (col.render) {
      return col.render(value, row, rowIndex);
    }
    return value ?? '';
  };

  const isEmpty = data.length === 0;

  return (
    <div className={styles.tableWrapper} style={style}>
      <table className={tableClasses}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={getFixedHeaderCellClass(col)}
                style={getColumnStyle(col)}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.emptyRow}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.row}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={getFixedBodyCellClass(col)}
                    style={getColumnStyle(col)}
                  >
                    {renderCell(col, row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
