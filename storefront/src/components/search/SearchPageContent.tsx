"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SearchX } from "lucide-react"
import { meili } from "@/lib/meilisearch"
import { SearchResults, type MeilisearchProductHit } from "@/components/search/SearchResults"

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border border-[#E5E5E5] rounded-lg overflow-hidden">
          <div className="aspect-square bg-gray-200 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(initialQuery)
  const [hits, setHits] = useState<MeilisearchProductHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // autoFocus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounced search + URL sync
  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = query.trim()

      // Update URL
      const params = new URLSearchParams()
      if (trimmed) params.set("q", trimmed)
      router.replace(`/search${trimmed ? `?${params.toString()}` : ""}`, { scroll: false })

      if (trimmed) {
        setIsSearching(true)
        try {
          const index = meili.index("products")
          const result = await index.search<MeilisearchProductHit>(trimmed, {
            limit: 24,
          })
          setHits(result.hits)
          setSearched(true)
        } catch (err) {
          console.error("[Search] Meilisearch error:", err)
          setHits([])
          // Don't set searched=true on error so we don't show misleading "No results"
        } finally {
          setIsSearching(false)
        }
      } else {
        setHits([])
        setSearched(false)
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- router from useRouter() is a stable reference in Next.js App Router
  }, [query])

  const trimmedQuery = query.trim()

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-[#111111] mb-6">Search</h1>

      {/* Search input */}
      <div className="relative w-full max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-12 pl-12 pr-4 border border-[#E5E5E5] rounded-lg text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F0C040] focus:border-transparent bg-white"
          aria-label="Search products"
        />
      </div>

      {/* Content area */}
      {isSearching ? (
        <SearchSkeleton />
      ) : !trimmedQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-base">Start typing to search...</p>
        </div>
      ) : searched && hits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <SearchX className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-base">
            No results for <span className="font-semibold text-[#111111]">&ldquo;{trimmedQuery}&rdquo;</span>
          </p>
          <p className="text-sm mt-2">Try different keywords or browse our shop.</p>
        </div>
      ) : hits.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {hits.length} result{hits.length !== 1 ? "s" : ""} for{" "}
            <span className="font-medium text-[#111111]">&ldquo;{trimmedQuery}&rdquo;</span>
          </p>
          <SearchResults hits={hits} />
        </>
      ) : null}
    </div>
  )
}
