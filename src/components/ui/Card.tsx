import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'modern' | 'glass';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
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
      onClick={onClick}
    >
      {children}
    </div>
  );
};