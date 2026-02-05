import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream/40 dark:bg-navy/95">
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
        <section className="relative overflow-hidden rounded-3xl border border-slate/10 dark:border-cream/10 bg-white/90 dark:bg-navy/70 p-8 sm:p-12 shadow-xl shadow-teal/10 dark:shadow-gold/10">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-teal/20 blur-3xl dark:bg-gold/20" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-navy/10 blur-3xl dark:bg-cream/10" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal dark:bg-gold/10 dark:text-gold">
                Song &amp; Singer
              </p>
              <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-navy dark:text-cream">
                Translate, share, and celebrate lyrics across languages.
              </h1>
              <p className="mt-5 text-lg text-slate dark:text-cream/70">
                A home for lyric translations that feels effortless for fans and
                powerful for editors. Publish beautiful, line-by-line translations
                and make every verse accessible.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/lyrics"
                  className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/30 hover:bg-teal/90"
                >
                  Explore lyrics
                </Link>
                <Link
                  href="/admin/songs"
                  className="inline-flex items-center justify-center rounded-full border border-teal/30 px-6 py-3 text-sm font-semibold text-teal hover:bg-teal/10 dark:border-gold/30 dark:text-gold dark:hover:bg-gold/10"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate/10 dark:border-cream/10 bg-white/80 dark:bg-navy/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-cream">
                      Create translations
                    </p>
                    <p className="text-xs text-slate dark:text-cream/60">
                      Add original and translated lyrics line by line.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate/10 dark:border-cream/10 bg-white/80 dark:bg-navy/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-cream">
                      Curated quality
                    </p>
                    <p className="text-xs text-slate dark:text-cream/60">
                      Trusted releases keep the library polished and consistent.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate/10 dark:border-cream/10 bg-white/80 dark:bg-navy/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-cream">
                      Read anywhere
                    </p>
                    <p className="text-xs text-slate dark:text-cream/60">
                      Beautiful, public lyric pages for every song.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Dual-language layout",
              description:
                "Side-by-side verses keep originals and translations aligned.",
            },
            {
              title: "Curated quality",
              description:
                "Admin workflows ensure every lyric is polished before release.",
            },
            {
              title: "Global discovery",
              description:
                "Explore genres, languages, and artists from one elegant hub.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate/10 dark:border-cream/10 bg-white dark:bg-navy/70 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-navy dark:text-cream">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate dark:text-cream/70">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-slate/10 dark:border-cream/10 bg-gradient-to-r from-teal/10 via-white to-cream/40 dark:from-gold/10 dark:via-navy/70 dark:to-navy/90 p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-cream">
                Ready to dive into new languages?
              </h2>
              <p className="mt-3 text-sm text-slate dark:text-cream/70">
                Browse the library or jump straight into your workspace.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/lyrics"
                className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream hover:bg-navy/90 dark:bg-cream dark:text-navy"
              >
                View all lyrics
              </Link>
              <Link
                href="/admin/songs"
                className="inline-flex items-center justify-center rounded-full border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/10 dark:border-cream/30 dark:text-cream dark:hover:bg-cream/10"
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
