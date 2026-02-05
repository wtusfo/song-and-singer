"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-3">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { ThemeProvider, useTheme } from "./ThemeProvider";