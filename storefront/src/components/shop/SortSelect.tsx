"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "created_at_desc", label: "Newest" },
  { value: "title_asc", label: "Name A-Z" },
]

export function SortSelect({ value }: { value?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set("sort", e.target.value)
    } else {
      params.delete("sort")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={handleChange}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E5E5] rounded-sm bg-white text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
    </div>
  )
}
