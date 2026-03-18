import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/Skeleton"

export default function ProductLoading() {
  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-7 w-24" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-14" />
              <Skeleton className="h-9 w-14" />
              <Skeleton className="h-9 w-14" />
            </div>
          </div>
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    </Container>
  )
}
