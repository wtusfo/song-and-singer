"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "../elements";
import { useAuthStatus } from "@/hooks/swr";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, mutate } = useAuthStatus();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.email || "User";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });

      if (response.ok) {
        await mutate(null, false);
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate/20 bg-cream/80 backdrop-blur-sm dark:border-cream/20 dark:bg-navy/80">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-navy transition-colors hover:text-teal dark:text-cream dark:hover:text-gold"
        >
          Song and Singer
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-slate/10 dark:text-cream dark:hover:bg-cream/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-medium text-cream dark:bg-gold dark:text-navy">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <svg
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate/20 bg-cream py-1 shadow-lg dark:border-cream/20 dark:bg-navy">
                  <div className="border-b border-slate/20 px-4 py-2 dark:border-cream/20">
                    <p className="text-sm font-medium text-navy dark:text-cream">
                      {userName}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate transition-colors hover:bg-slate/10 dark:text-cream dark:hover:bg-cream/10 disabled:opacity-50"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-slate/10 dark:text-cream dark:hover:bg-cream/10"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-teal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-teal/90 dark:bg-gold dark:text-navy dark:hover:bg-gold/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
