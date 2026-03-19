import { Container } from "@/components/layout/Container"
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton"

export default function WishlistLoading() {
  return (
    <Container className="py-8">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-4 w-32 mb-6" />
      <ProductGridSkeleton count={8} />
    </Container>
  )
}
