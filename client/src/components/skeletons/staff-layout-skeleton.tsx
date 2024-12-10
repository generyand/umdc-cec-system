export function StaffLayoutSkeleton() {
  return (
    <div className="flex overflow-hidden w-full h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="border-r bg-background w-[240px] max-md:hidden">
        <div className="flex items-center px-4 my-2 h-14">
          <div className="w-24 h-6 rounded animate-pulse bg-muted" />
        </div>
        <nav className="px-2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex gap-3 items-center px-3 h-10 rounded-md"
            >
              <div className="w-4 h-4 rounded animate-pulse bg-muted" />
              <div className="w-24 h-4 rounded animate-pulse bg-muted" />
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Skeleton */}
      <main className="overflow-auto flex-1">
        <div className="p-6 space-y-4">
          <div className="w-48 h-8 rounded animate-pulse bg-muted" />
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 space-y-4 rounded-lg border bg-card">
                <div className="w-1/4 h-6 rounded animate-pulse bg-muted" />
                <div className="space-y-2">
                  <div className="w-full h-4 rounded animate-pulse bg-muted" />
                  <div className="w-3/4 h-4 rounded animate-pulse bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
