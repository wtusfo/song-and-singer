"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userName?: string;
}

export function Layout({
  children,
  isAuthenticated = false,
  userName = "User",
}: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isAuthenticated={isAuthenticated} userName={userName} />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-3">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { ThemeProvider, useTheme } from "./ThemeProvider";