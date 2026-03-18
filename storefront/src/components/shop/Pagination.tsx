import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

function buildUrl(basePath: string, page: number, params: Record<string, string> = {}) {
  const p = new URLSearchParams({ ...params, page: String(page) })
  return `${basePath}?${p.toString()}`
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const paramsWithoutPage = { ...searchParams }
  delete paramsWithoutPage.page

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (currentPage <= 4) return i + 1
    if (currentPage >= totalPages - 3) return totalPages - 6 + i
    return currentPage - 3 + i
  })

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-10">
      {currentPage > 1 && (
        <Link
          href={buildUrl(basePath, currentPage - 1, paramsWithoutPage)}
          className="p-2 rounded-sm border border-[#E5E5E5] hover:border-[#111111] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map(page => (
        <Link
          key={page}
          href={buildUrl(basePath, page, paramsWithoutPage)}
          className={cn(
            "h-9 w-9 flex items-center justify-center text-sm rounded-sm border transition-colors",
            page === currentPage
              ? "bg-[#111111] text-white border-[#111111]"
              : "border-[#E5E5E5] hover:border-[#111111] text-[#111111]"
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(basePath, currentPage + 1, paramsWithoutPage)}
          className="p-2 rounded-sm border border-[#E5E5E5] hover:border-[#111111] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  )
}
