export default function LoadingSkeleton() {
  return (
    <div className="divide-y divide-slate-200">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse py-7"
        >
          <div className="grid gap-6 md:grid-cols-[70px_1fr_auto]">
            <div className="hidden h-4 w-6 bg-slate-200 md:block" />

            <div>
              <div className="mb-4 flex gap-3">
                <div className="h-9 w-9 bg-slate-200" />

                <div className="flex-1">
                  <div className="h-6 w-2/3 bg-slate-200" />
                  <div className="mt-2 h-4 w-1/3 bg-slate-200" />
                </div>
              </div>

              <div className="h-4 w-full bg-slate-200" />
              <div className="mt-2 h-4 w-4/5 bg-slate-200" />

              <div className="mt-5 flex gap-6">
                <div className="h-4 w-24 bg-slate-200" />
                <div className="h-4 w-32 bg-slate-200" />
                <div className="h-4 w-28 bg-slate-200" />
              </div>
            </div>

            <div className="flex justify-between md:flex-col md:items-end md:justify-start">
              <div className="h-5 w-16 bg-slate-200" />
              <div className="h-5 w-24 bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}