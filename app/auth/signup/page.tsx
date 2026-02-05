"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Input, PasswordInput, Button } from "@/app/components/elements";
import { AuthCard, AuthSocialSection } from "../components";

export default function Signup() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: value.email,
            password: value.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.error || "Something went wrong");
          return;
        }

        setSuccessMessage(data.message);
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } catch {
        setServerError("An unexpected error occurred");
      }
    },
  });

  return (
    <AuthCard title="Create an account">
      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold text-sm">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-danger-light text-danger text-sm">
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
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              return undefined;
            },
            onChange: ({ value, fieldApi }) => {
              if (!fieldApi.state.meta.isValidating && fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0) {
                if (!value) return "Password is required";
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }
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

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onSubmit: ({ value, fieldApi }) => {
              if (!value) return "Please confirm your password";
              if (value !== fieldApi.form.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
            onChange: ({ value, fieldApi }) => {
              if (!fieldApi.state.meta.isValidating && fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0) {
                if (!value) return "Please confirm your password";
                if (value !== fieldApi.form.getFieldValue("password")) {
                  return "Passwords do not match";
                }
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <PasswordInput
              label="Confirm Password"
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

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="mt-2 w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <AuthSocialSection context="signup" />
    </AuthCard>
  );
}