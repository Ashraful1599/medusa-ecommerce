import { Container } from "@/components/layout/Container"
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton"

export default function CategoryLoading() {
  return (
    <Container className="py-8">
      <div className="flex flex-col sm:flex-row gap-2 justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block w-56 shrink-0 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </Container>
  )
}
