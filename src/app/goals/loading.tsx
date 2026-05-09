import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </header>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border/30 rounded-[2.5rem] p-8">
            <div className="flex justify-between mb-6">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
