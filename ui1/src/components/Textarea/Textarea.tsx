import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './Textarea.module.css';

export interface TextareaAutosizeOption {
  minRows?: number;
  maxRows?: number;
}

export type TextareaAutosize = boolean | TextareaAutosizeOption;

export interface TextareaProps {
  /** 当前值 */
  value?: string;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 显示行数，默认 4 */
  rows?: number;
  /** 最大字符数 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 自适应高度 */
  autosize?: TextareaAutosize;
  /** 变化回调 */
  onChange?: (value: string) => void;
  /** 聚焦回调 */
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** 失焦回调 */
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 名称属性 */
  name?: string;
  /** id 属性 */
  id?: string;
}

export interface TextareaRef {
  /** 获取焦点 */
  focus: () => void;
  /** 失去焦点 */
  blur: () => void;
  /** 选中文本 */
  select: () => void;
  /** 获取 textarea 元素 */
  resizableTextArea: HTMLTextAreaElement | null;
}

const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  const {
    value: valueProp,
    placeholder,
    disabled = false,
    readonly = false,
    rows = 4,
    maxLength,
    showCount = false,
    autosize = false,
    onChange,
    onFocus,
    onBlur,
    className,
    style,
    name,
    id,
  } = props;

  const [internalValue, setInternalValue] = useState(valueProp ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLTextAreaElement>(null);
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);

  const value = valueProp ?? internalValue;
  const currentLength = value.length;

  const isAutosizeEnabled = Boolean(autosize);
  const autosizeOption: TextareaAutosizeOption =
    typeof autosize === 'object' ? autosize : {};

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    select: () => textareaRef.current?.select(),
    resizableTextArea: textareaRef.current,
  }));

  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;

    if (!textarea || !mirror) return;

    if (isAutosizeEnabled) {
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const borderTop = parseFloat(computedStyle.borderTopWidth);
      const borderBottom = parseFloat(computedStyle.borderBottomWidth);

      const minRows = autosizeOption.minRows ?? rows;
      const maxRows = autosizeOption.maxRows ?? Infinity;

      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

      mirror.style.width = `${textarea.offsetWidth}px`;
      mirror.value = value || textarea.placeholder;

      const mirrorHeight = mirror.scrollHeight;

      const newHeight = Math.min(Math.max(mirrorHeight, minHeight), maxHeight);

      textarea.style.height = `${newHeight}px`;

      if (mirrorHeight > maxHeight * lineHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    } else {
      textarea.style.height = 'auto';
      textarea.style.overflowY = 'hidden';
    }
  }, [isAutosizeEnabled, autosizeOption, rows, value]);

  useEffect(() => {
    updateTextareaHeight();
  }, [updateTextareaHeight]);

  useEffect(() => {
    if (valueProp !== undefined && valueProp !== internalValue) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }

      if (valueProp === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    },
    [maxLength, valueProp, onChange]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const textareaClasses = [
    styles.textarea,
    isFocused && !disabled && styles.textareaFocused,
    disabled && styles.textareaDisabled,
    readonly && styles.textareaReadonly,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showMaxLength = showCount && maxLength !== undefined;

  return (
    <div
      className={`${styles.wrapper} ${isAutosizeEnabled ? styles.autosize : ''}`}
    >
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        className={textareaClasses}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={placeholder}
        aria-disabled={disabled}
        aria-readonly={readonly}
        style={style}
      />
      {isAutosizeEnabled && (
        <textarea
          ref={mirrorRef}
          className={styles.mirror}
          aria-hidden="true"
          tabIndex={-1}
          readOnly
          rows={1}
        />
      )}
      {showMaxLength && (
        <div
          className={`${styles.count} ${
            currentLength >= maxLength ? styles.countMax : ''
          }`}
        >
          {currentLength}/{maxLength}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
