import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPost() {
  return (
    <div className="deva-border-b deva-border-gray-800 deva-p-4">
      <div className="deva-flex deva-gap-3">
        <Skeleton className="deva-h-10 deva-w-10 deva-rounded-full" />
        <div className="deva-flex-1">
          <div className="deva-flex deva-items-center deva-justify-between">
            <div className="deva-flex deva-items-center deva-gap-2">
              <Skeleton className="deva-h-4 deva-w-24" />
              <Skeleton className="deva-h-4 deva-w-20" />
            </div>
          </div>
          <div className="deva-mt-2 deva-space-y-2">
            <Skeleton className="deva-h-4 deva-w-[90%]" />
            <Skeleton className="deva-h-4 deva-w-[70%]" />
          </div>
          <div className="deva-mt-4 deva-flex deva-gap-8">
            <Skeleton className="deva-h-4 deva-w-16" />
            <Skeleton className="deva-h-4 deva-w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
