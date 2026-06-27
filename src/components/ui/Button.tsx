import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    let variantClasses = '';
    let sizeClasses = '';

    switch (variant) {
      case 'primary':
        variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 focus-visible:ring-primary';
        break;
      case 'secondary':
        variantClasses = 'bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-ring';
        break;
      case 'success':
        variantClasses = 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md shadow-secondary/20 focus-visible:ring-secondary';
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
        sizeClasses = 'h-8 px-3 text-xs rounded-md';
        break;
      case 'md':
        sizeClasses = 'h-10 px-4 py-2 text-sm rounded-lg';
        break;
      case 'lg':
        sizeClasses = 'h-12 px-6 text-base rounded-xl';
        break;
      case 'icon':
        sizeClasses = 'h-10 w-10 flex items-center justify-center rounded-lg';
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
