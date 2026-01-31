import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonSize = "large" | "default" | "small";
type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeClasses: Record<ButtonSize, string> = {
  large: "h-10 px-6 text-base",
  default: "h-8 px-4 text-sm",
  small: "h-7 px-3 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal text-cream hover:bg-teal/90 dark:bg-gold dark:text-navy dark:hover:bg-gold/90",
  secondary:
    "bg-slate text-cream hover:bg-slate/90 dark:bg-cream dark:text-navy dark:hover:bg-cream/90",
  tertiary:
    "bg-transparent text-slate hover:bg-slate/10 dark:text-cream dark:hover:bg-cream/10",
  danger:
    "bg-danger text-white hover:bg-danger/90 dark:bg-danger dark:text-white dark:hover:bg-danger/90",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = "default", variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium cursor-pointer
          transition-colors focus:outline-none focus:ring-2 focus:ring-teal/50
          disabled:pointer-events-none disabled:opacity-50
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
