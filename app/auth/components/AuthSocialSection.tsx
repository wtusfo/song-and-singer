import Link from "next/link";
import { SocialButton } from "@/app/components/elements";
import { AuthDivider } from "./AuthDivider";

interface AuthSocialSectionProps {
  context: "signin" | "signup";
}

const contextConfig = {
  signin: {
    prompt: "Don't have an account?",
    linkText: "Sign up",
    linkHref: "/auth/signup",
  },
  signup: {
    prompt: "Already have an account?",
    linkText: "Sign in",
    linkHref: "/auth/signin",
  },
};

export function AuthSocialSection({ context }: AuthSocialSectionProps) {
  const config = contextConfig[context];

  return (
    <>
      <AuthDivider />

      <div className="space-y-3">
        <SocialButton provider="google" size="large" />
        <SocialButton provider="meta" size="large" />
        <SocialButton provider="twitter" size="large" />
      </div>

      <p className="mt-6 text-center text-sm text-slate dark:text-cream/70">
        {config.prompt}{" "}
        <Link
          href={config.linkHref}
          className="font-medium text-teal hover:underline dark:text-gold"
        >
          {config.linkText}
        </Link>
      </p>
    </>
  );
}
