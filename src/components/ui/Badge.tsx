import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    let variantClasses = '';

    switch (variant) {
      case 'primary':
        variantClasses = 'bg-primary/10 text-primary border border-primary/20';
        break;
      case 'secondary':
        variantClasses = 'bg-muted text-muted-foreground border border-border';
        break;
      case 'success':
        variantClasses = 'bg-secondary/10 text-secondary border border-secondary/20';
        break;
      case 'warning':
        variantClasses = 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
        break;
      case 'destructive':
        variantClasses = 'bg-destructive/10 text-destructive border border-destructive/20';
        break;
      case 'info':
        variantClasses = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        break;
      case 'outline':
        variantClasses = 'bg-transparent text-foreground border border-border';
        break;
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none ${variantClasses} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
