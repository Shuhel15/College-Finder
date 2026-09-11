const shimmer = "animate-pulse rounded bg-slate-200";

function CollegeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <div className={`${shimmer} h-11 w-11 rounded-xl`} />
        <div className={`${shimmer} h-4 w-10 rounded-full`} />
      </div>

      <div className={`${shimmer} mt-6 h-6 w-4/5`} />
      <div className={`${shimmer} mt-3 h-4 w-2/5`} />

      <div className="mt-6 space-y-3">
        <div className={`${shimmer} h-3 w-full`} />
        <div className={`${shimmer} h-3 w-11/12`} />
        <div className={`${shimmer} h-3 w-2/3`} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
        {[1, 2].map((item) => (
          <div key={item}>
            <div className={`${shimmer} h-3 w-24`} />
            <div className={`${shimmer} mt-2 h-5 w-24`} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className={`${shimmer} h-3 w-28`} />
        <div className={`${shimmer} h-4 w-20`} />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className={`${shimmer} h-8 w-full`} />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className={`${shimmer} h-6 w-36`} />
          <div className="hidden gap-6 sm:flex">
            <div className={`${shimmer} h-4 w-16`} />
            <div className={`${shimmer} h-4 w-20`} />
            <div className={`${shimmer} h-4 w-14`} />
          </div>
          <div className={`${shimmer} h-9 w-20 rounded-lg sm:hidden`} />
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
          <div className={`${shimmer} h-4 w-44`} />
          <div className={`${shimmer} mt-5 h-12 w-full max-w-2xl sm:h-16`} />
          <div className={`${shimmer} mt-5 h-4 w-full max-w-xl`} />

          <div className="mt-9 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-slate-200 p-2 shadow-lg shadow-slate-200/60 sm:flex-row">
            <div className={`${shimmer} h-12 flex-1 rounded-xl`} />
            <div className={`${shimmer} h-12 rounded-xl sm:w-32`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${shimmer} h-9 w-9 rounded-xl`} />
              <div>
                <div className={`${shimmer} h-4 w-36`} />
                <div className={`${shimmer} mt-2 h-3 w-48`} />
              </div>
            </div>
            <div className={`${shimmer} h-8 w-16 rounded-lg`} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className={`${shimmer} mb-2 h-3 w-24`} />
                <div className={`${shimmer} h-11 w-full rounded-xl`} />
              </div>
            ))}
          </div>

          <div className={`${shimmer} mt-6 h-12 w-full rounded-xl sm:w-32`} />
        </div>

        <div className="mt-10 flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <div className={`${shimmer} h-3 w-24`} />
            <div className={`${shimmer} mt-3 h-8 w-56`} />
            <div className={`${shimmer} mt-3 h-3 w-28`} />
          </div>
          <div className={`${shimmer} hidden h-10 w-36 rounded-xl sm:block`} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <CollegeCardSkeleton key={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
