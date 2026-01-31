export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate/20 dark:bg-cream/20" />
      <span className="text-xs text-slate dark:text-cream/70">
        or continue with
      </span>
      <div className="h-px flex-1 bg-slate/20 dark:bg-cream/20" />
    </div>
  );
}
