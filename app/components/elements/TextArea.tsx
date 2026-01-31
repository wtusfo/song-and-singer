"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

type TextAreaSize = "large" | "default" | "small";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  size?: TextAreaSize;
}

const sizeClasses: Record<TextAreaSize, string> = {
  large: "p-4 text-base",
  default: "p-3 text-sm",
  small: "p-2 text-sm",
};

const labelSizeClasses: Record<TextAreaSize, string> = {
  large: "text-base",
  default: "text-sm",
  small: "text-sm",
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, size = "default", className = "", id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={`font-medium text-navy dark:text-cream ${labelSizeClasses[size]}`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full rounded-lg border border-slate/30 bg-white
            text-navy placeholder:text-slate/50
            transition-colors resize-none
            focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20
            dark:border-cream/30 dark:bg-navy/50 dark:text-cream dark:placeholder:text-cream/50
            dark:focus:border-gold dark:focus:ring-gold/20
            ${sizeClasses[size]}
            ${error ? "border-red focus:border-red focus:ring-red/20" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
