import React, { useState, useCallback, type ReactNode } from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | number;
  shape?: 'circle' | 'square';
  fallback?: ReactNode;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  shape = 'circle',
  fallback,
  icon,
  className,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getSizeClass = () => {
    if (typeof size === 'number') return undefined;
    return styles[size];
  };

  const getSizeStyle = (): React.CSSProperties => {
    if (typeof size === 'number') {
      return { width: size, height: size, fontSize: size * 0.4 };
    }
    return {};
  };

  const getInitials = () => {
    if (!alt) return '?';
    const words = alt.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const showImage = src && !imageError;

  return (
    <div
      className={`${styles.avatar} ${styles[shape]} ${getSizeClass() || ''} ${className || ''}`}
      style={{ ...getSizeStyle(), ...style }}
      role="img"
      aria-label={showImage ? alt : alt || 'Avatar'}
    >
      {showImage && (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          onError={handleImageError}
        />
      )}
      {!showImage && fallback}
      {!showImage && !fallback && icon}
      {!showImage && !fallback && !icon && (
        <span className={styles.initials}>{getInitials()}</span>
      )}
    </div>
  );
};

export default Avatar;
