import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-xl shadow-card p-6',
        'transition hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
