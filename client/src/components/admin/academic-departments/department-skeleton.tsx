import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DepartmentSkeleton() {
  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Back Button Skeleton */}
      <Skeleton className="w-40 h-10" />

      {/* Header Section Skeleton */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div className="space-y-3">
          <Skeleton className="w-64 h-8" /> {/* Title */}
          <Skeleton className="w-96 h-4" /> {/* Description */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-32 h-10" /> {/* Button */}
          <Skeleton className="w-40 h-10" /> {/* Button */}
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Programs Section Skeleton */}
      <div className="grid gap-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Academic Programs Skeleton */}
          <Card className="col-span-1 h-fit">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-24 h-9" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <Skeleton className="w-48 h-5" />
                      <Skeleton className="w-32 h-4" />
                    </div>
                    <Skeleton className="w-20 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Featured Banner Program Skeleton */}
          <Card className="col-span-2 p-8">
            <div className="space-y-4">
              <Skeleton className="w-32 h-6" />
              <div className="space-y-3">
                <Skeleton className="w-72 h-8" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Activities Section Skeleton */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-9" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <Card key={index}>
              <div className="p-6 space-y-6">
                <Skeleton className="w-40 h-6" />
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="w-48 h-5" />
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <Skeleton className="w-24 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-full h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
