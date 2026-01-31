export function Footer() {
  return (
    <footer className="border-t border-slate/20 bg-cream dark:border-cream/20 dark:bg-navy">
      <div className="mx-auto max-w-[1200px] px-3 py-6">
        <p className="text-center text-sm text-slate dark:text-cream/70">
          © {new Date().getFullYear()} Song and Singer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
