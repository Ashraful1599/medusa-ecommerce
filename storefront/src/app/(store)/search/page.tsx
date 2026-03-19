import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchPageContent } from "@/components/search/SearchPageContent"
import SearchLoading from "./loading"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPageContent />
    </Suspense>
  )
}
