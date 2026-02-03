import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: object;
  variant?: 'modern' | 'glass';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  style = {},
  variant = 'modern',
  hover = true,
  onClick 
}) => {
  const variants = {
    modern: 'card-modern',
    glass: 'card-glass',
  };
  
  const hoverEffect = hover ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${variants[variant]} ${hoverEffect} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};