import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </header>

      <section className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-border/40 bg-card">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
