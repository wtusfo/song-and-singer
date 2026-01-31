import { InputHTMLAttributes, forwardRef } from "react";

type InputSize = "large" | "default" | "small";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  large: "h-10 px-4 text-base",
  default: "h-8 px-3 text-sm",
  small: "h-7 px-3 text-sm",
};

const labelSizeClasses: Record<InputSize, string> = {
  large: "text-base",
  default: "text-sm",
  small: "text-sm",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = "default", className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`font-medium text-navy dark:text-cream ${labelSizeClasses[size]}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border border-slate/30 bg-white
            text-navy placeholder:text-slate/50
            transition-colors
            focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20
            dark:border-cream/30 dark:bg-navy/50 dark:text-cream dark:placeholder:text-cream/50
            dark:focus:border-gold dark:focus:ring-gold/20
            ${sizeClasses[size]}
            ${error ? "border-red focus:border-red focus:ring-red/20" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
