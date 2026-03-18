import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-gray-500", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-[#111111] transition-colors">{item.label}</Link>
          ) : (
            <span className={i === items.length - 1 ? "text-[#111111] font-medium" : ""}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
