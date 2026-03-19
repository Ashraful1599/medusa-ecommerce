"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface DropdownItem {
  label: string
  href: string
  icon?: LucideIcon
  description?: string
  badge?: string
}

interface NavDropdownProps {
  label: string
  items: DropdownItem[]
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    if (open) document.addEventListener("mousedown", onClickOutside)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
    >
      {/* Trigger */}
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        style={{ transition: "opacity 150ms ease, transform 150ms ease" }}
        className={`absolute left-0 top-full mt-3 w-56 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 overflow-hidden ${
          visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Top accent line */}
        <div className="h-0.5 bg-[#F0C040]" />

        <ul className="py-1.5">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <li key={i}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  {Icon && (
                    <span className="mt-0.5 shrink-0 text-[#999999] group-hover:text-[#111111] transition-colors">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#111111]">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-[#F0C040] text-[#111111] px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    {item.description && (
                      <span className="block text-xs text-[#999999] mt-0.5 leading-snug">
                        {item.description}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
