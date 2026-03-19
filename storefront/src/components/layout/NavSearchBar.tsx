"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, X, ArrowRight } from "lucide-react"
import { meili } from "@/lib/meilisearch"
import { formatPrice } from "@/lib/utils"
import type { MeilisearchProductHit } from "@/components/search/SearchResults"

const MAX_RESULTS = 6

export function NavSearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false) // controls CSS animation
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<MeilisearchProductHit[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Animate in
  useEffect(() => {
    if (open) {
      // Small delay so the portal renders before we trigger the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setVisible(false)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose()
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setHits([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const index = meili.index("products")
        const result = await index.search<MeilisearchProductHit>(query.trim(), { limit: MAX_RESULTS })
        setHits(result.hits)
      } catch {
        setHits([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function handleClose() {
    setVisible(false)
    setTimeout(() => {
      setOpen(false)
      setQuery("")
      setHits([])
    }, 250) // wait for fade-out animation
  }

  function handleResultClick() {
    handleClose()
  }

  function handleSeeAll() {
    const q = query.trim()
    handleClose()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const showResults = query.trim().length > 0

  const overlay = (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Search"
      style={{ transition: "opacity 250ms ease, backdrop-filter 250ms ease" }}
      className={`fixed inset-0 z-[999] flex flex-col items-center ${
        visible
          ? "opacity-100 backdrop-blur-sm bg-black/40"
          : "opacity-0 backdrop-blur-none bg-black/0 pointer-events-none"
      }`}
    >
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Search panel — slides down from top */}
      <div
        style={{ transition: "transform 250ms cubic-bezier(0.4,0,0.2,1), opacity 250ms ease" }}
        className={`relative w-full bg-white shadow-2xl ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Input row */}
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 h-10 text-base text-[#111111] placeholder:text-gray-400 bg-transparent outline-none"
              aria-label="Search products"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-gray-400 hover:text-[#111111] transition-colors shrink-0"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#111111] transition-colors shrink-0 ml-2"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Divider */}
          <div className="mt-4 border-t border-[#E5E5E5]" />

          {/* Results */}
          {showResults && (
            <div className="pt-4 pb-2">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-100 rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : hits.length > 0 ? (
                <>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mb-3">
                    {hits.map((hit) => (
                      <li key={hit.id}>
                        <Link
                          href={`/products/${hit.handle}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                            {hit.thumbnail ? (
                              <Image
                                src={hit.thumbnail}
                                alt={hit.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="56px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111111] truncate group-hover:text-[#F0C040] transition-colors">
                              {hit.title}
                            </p>
                            {hit.price != null && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                {formatPrice(hit.price, hit.currency_code ?? "usd")}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleSeeAll}
                    className="flex items-center gap-2 text-sm font-medium text-[#111111] hover:text-[#F0C040] transition-colors px-3 py-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    See all results for &ldquo;{query.trim()}&rdquo;
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No results for &ldquo;{query.trim()}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Hint when empty */}
          {!showResults && (
            <p className="text-xs text-gray-400 mt-3 pb-1">
              Start typing to search products...
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-600 hover:text-[#111111] transition-colors"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Portal — renders outside the sticky navbar so overlay covers everything */}
      {mounted && open && createPortal(overlay, document.body)}
    </>
  )
}
