import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Select.module.css';
import SelectOption from './SelectOption';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string | string[];
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  options?: SelectOption[];
  onChange?: (value: string | string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  value,
  multiple = false,
  placeholder = '请选择',
  disabled = false,
  clearable = false,
  filterable = false,
  options = [],
  onChange,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [triggerPosition, setTriggerPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const instanceId = useId();

  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return value ? [value as string] : [];
  }, [value, multiple]);

  const selectedLabels = useMemo(() => {
    return selectedValues
      .map((v) => options.find((opt) => opt.value === v)?.label)
      .filter(Boolean);
  }, [selectedValues, options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const selectableOptions = useMemo(() => {
    return filteredOptions.filter((opt) => !opt.disabled);
  }, [filteredOptions]);

  const updateTriggerPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTriggerPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    updateTriggerPosition();
    setIsOpen(true);
    setFocusedIndex(-1);
    if (filterable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [disabled, filterable, updateTriggerPosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, openDropdown, closeDropdown]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        closeDropdown();
      }
    },
    [multiple, selectedValues, onChange, closeDropdown]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        onChange?.([]);
      } else {
        onChange?.('');
      }
    },
    [multiple, onChange]
  );

  const handleRemoveTag = useCallback(
    (e: React.MouseEvent, optionValue: string) => {
      e.stopPropagation();
      const newValues = selectedValues.filter((v) => v !== optionValue);
      onChange?.(newValues);
    },
    [selectedValues, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!isOpen) {
            openDropdown();
          } else if (focusedIndex >= 0 && selectableOptions[focusedIndex]) {
            handleSelect(selectableOptions[focusedIndex].value);
            if (!multiple) closeDropdown();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            openDropdown();
          } else {
            setFocusedIndex((prev) =>
              prev < selectableOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : selectableOptions.length - 1
            );
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
        case 'Tab':
          closeDropdown();
          break;
      }
    },
    [disabled, isOpen, focusedIndex, selectableOptions, multiple, openDropdown, handleSelect, closeDropdown]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.querySelector(
        `[data-value="${selectableOptions[focusedIndex]?.value}"]`
      );
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, focusedIndex, selectableOptions]);

  const renderTags = () => {
    return selectedLabels.map((label, idx) => {
      const tagValue = selectedValues[idx];
      return (
        <span key={tagValue} className={styles.tag}>
          <span className={styles.tagText}>{label}</span>
          <button
            type="button"
            className={styles.tagClose}
            onClick={(e) => handleRemoveTag(e, tagValue)}
            aria-label={`移除 ${label}`}
          >
            ×
          </button>
        </span>
      );
    });
  };

  const showClearButton = clearable && !disabled && selectedValues.length > 0;

  const triggerClassNames = [
    styles.selectTrigger,
    isOpen && styles.focused,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const dropdownContent = isOpen && (
    <div
      className={styles.dropdownPortal}
      style={{
        position: 'fixed',
        top: triggerPosition.top,
        left: triggerPosition.left,
        width: triggerPosition.width,
      }}
    >
      <div
        ref={dropdownRef}
        className={styles.dropdown}
        role="listbox"
        aria-multiselectable={multiple}
        id={`select-dropdown-${instanceId}`}
      >
        {filterable && (
          <div className={styles.searchWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="搜索选项"
            />
          </div>
        )}
        <div className={styles.optionsList}>
          {filteredOptions.length === 0 ? (
            <div className={styles.noOptions}>无匹配选项</div>
          ) : (
            filteredOptions.map((option) => (
              <SelectOption
                key={option.value}
                label={option.label}
                value={option.value}
                disabled={option.disabled}
                selected={selectedValues.includes(option.value)}
                focused={selectableOptions.indexOf(option) === focusedIndex}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(selectableOptions.indexOf(option))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={styles.selectWrapper}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <div
        className={triggerClassNames}
        onClick={toggleDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        aria-controls={`select-dropdown-${instanceId}`}
        tabIndex={disabled ? -1 : 0}
      >
        {multiple && selectedValues.length > 0 ? (
          <div className={styles.selectValueMultiple}>{renderTags()}</div>
        ) : selectedValues.length > 0 ? (
          <span className={styles.selectValue}>{selectedLabels[0]}</span>
        ) : (
          <span className={styles.selectPlaceholder}>{placeholder}</span>
        )}
        <div className={styles.icons}>
          {showClearButton && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="清除选择"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10.5 3.5l-7 7M3.5 3.5l7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <span className={`${styles.arrowIcon} ${isOpen ? styles.open : ''}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      {createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default Select;
