"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Input, PasswordInput, Button } from "@/app/components/elements";
import { AuthCard, AuthSocialSection } from "../components";

export default function Signin() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.error || "Failed to sign in");
          return;
        }

        // Redirect to home page on success
        router.push("/");
        router.refresh();
      } catch {
        setServerError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthCard title="Welcome back">
      {serverError && (
        <div className="mb-4 p-3 bg-danger-light text-danger rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          validators={{
            onSubmit: ({ value }) => {
              if (!value) return "Email is required";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email";
              }
              return undefined;
            },
            onChange: ({ value, fieldApi }) => {
              if (!fieldApi.state.meta.isValidating && fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0) {
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return "Please enter a valid email";
                }
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Email"
              type="email"
              size="large"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="you@example.com"
              error={field.state.meta.errors?.[0]?.toString()}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onSubmit: ({ value }) => {
              if (!value) return "Password is required";
              return undefined;
            },
            onChange: ({ value, fieldApi }) => {
              if (!fieldApi.state.meta.isValidating && fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0) {
                if (!value) return "Password is required";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <PasswordInput
              label="Password"
              size="large"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              error={field.state.meta.errors?.[0]?.toString()}
            />
          )}
        </form.Field>

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-teal hover:underline dark:text-gold"
          >
            Forgot password?
          </Link>
        </div>

        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="mt-2 w-full"
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <AuthSocialSection context="signin" />
    </AuthCard>
  );
}