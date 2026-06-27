import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    let variantClasses = '';
    let sizeClasses = '';

    switch (variant) {
      case 'primary':
        variantClasses = 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus-visible:ring-gray-900';
        break;
      case 'cta':
        variantClasses = 'bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-widest font-semibold focus-visible:ring-gray-900';
        break;
      case 'secondary':
        variantClasses = 'bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-ring';
        break;
      case 'success':
        variantClasses = 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary';
        break;
      case 'outline':
        variantClasses = 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring';
        break;
      case 'destructive':
        variantClasses = 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive';
        break;
    }

    switch (size) {
      case 'sm':
        sizeClasses = 'h-8 px-4 text-xs rounded-full';
        break;
      case 'md':
        sizeClasses = 'h-10 px-5 text-sm rounded-full';
        break;
      case 'lg':
        sizeClasses = 'h-12 px-8 text-sm rounded-full';
        break;
      case 'icon':
        sizeClasses = 'h-10 w-10 flex items-center justify-center rounded-full';
        break;
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
