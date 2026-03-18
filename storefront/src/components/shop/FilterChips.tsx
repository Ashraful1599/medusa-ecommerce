"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

export function FilterChips() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const chips: { key: string; label: string }[] = []
  const sort = searchParams.get("sort")
  const priceMax = searchParams.get("price_max")
  const q = searchParams.get("q")

  if (sort) chips.push({ key: "sort", label: `Sort: ${sort.replace("_", " ")}` })
  if (priceMax) chips.push({ key: "price_max", label: `Under $${priceMax}` })
  if (q) chips.push({ key: "q", label: `"${q}"` })

  if (chips.length === 0) return null

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(chip => (
        <span key={chip.key} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-[#111111]">
          {chip.label}
          <button onClick={() => remove(chip.key)} className="hover:text-red-500" aria-label={`Remove ${chip.label} filter`}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
