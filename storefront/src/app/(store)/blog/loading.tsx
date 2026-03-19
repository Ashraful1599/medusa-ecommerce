import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/Skeleton"

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col border border-[#E5E5E5] rounded-lg overflow-hidden">
      <div className="flex flex-col flex-1 p-6 space-y-3">
        {/* Category + read time */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        {/* Title */}
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-2/3" />
        {/* Excerpt */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export default function BlogLoading() {
  return (
    <div className="py-12">
      <Container>
        {/* Header skeleton */}
        <div className="mb-10 border-b border-[#E5E5E5] pb-8 space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  )
}
