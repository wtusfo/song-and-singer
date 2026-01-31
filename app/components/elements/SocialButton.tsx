import { ButtonHTMLAttributes } from "react";
import { GoogleIcon, MetaIcon, TwitterIcon } from "@/app/icons";

type SocialButtonSize = "large" | "default" | "small";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "meta" | "twitter";
  size?: SocialButtonSize;
}

const sizeClasses: Record<SocialButtonSize, string> = {
  large: "h-10 px-4 text-base",
  default: "h-8 px-4 text-sm",
  small: "h-7 px-3 text-sm",
};

const iconSizes: Record<SocialButtonSize, number> = {
  large: 20,
  default: 18,
  small: 16,
};

const providerConfig = (size: SocialButtonSize) => ({
  google: {
    label: "Continue with Google",
    icon: <GoogleIcon size={iconSizes[size]} />,
  },
  meta: {
    label: "Continue with Meta",
    icon: <MetaIcon size={iconSizes[size]} />,
  },
  twitter: {
    label: "Continue with X",
    icon: <TwitterIcon size={iconSizes[size]} />,
  },
});

export function SocialButton({ provider, size = "default", className = "", ...props }: SocialButtonProps) {
  const config = providerConfig(size)[provider];

  return (
    <button
      type="button"
      className={`
        flex w-full items-center justify-center gap-3 rounded-lg border border-slate/30
        bg-white font-medium text-navy
        transition-colors hover:bg-slate/5
        dark:border-cream/30 dark:bg-navy/50 dark:text-cream dark:hover:bg-cream/10
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {config.icon}
      {config.label}
    </button>
  );
}
