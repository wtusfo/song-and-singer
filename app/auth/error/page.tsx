"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "../register/components/AuthCard";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "An error occurred during authentication";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard title="Authentication Error">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-danger-light rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-slate dark:text-gray-300">{message}</p>
          <div className="pt-4 space-y-2">
            <Link
              href="/auth/signin"
              className="block w-full py-2 px-4 bg-coral text-white rounded-lg hover:bg-coral/90 transition-colors text-center"
            >
              Try Sign In
            </Link>
            <Link
              href="/auth/register"
              className="block w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
