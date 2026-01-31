interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate/20 bg-white p-4 shadow-sm md:p-8 dark:border-cream/20 dark:bg-navy/50">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-semibold text-navy dark:text-cream">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate dark:text-cream/70">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
