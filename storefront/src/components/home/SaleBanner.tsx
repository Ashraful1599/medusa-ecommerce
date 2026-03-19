"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Tag } from "lucide-react"

// Set your sale end date here
const SALE_END = new Date("2026-04-01T23:59:59")

function getTimeLeft() {
  const diff = SALE_END.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins:    Math.floor((diff / (1000 * 60)) % 60),
    secs:    Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function SaleBanner() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (time.expired) return null

  const units = [
    { value: pad(time.days),  label: "Days"  },
    { value: pad(time.hours), label: "Hours" },
    { value: pad(time.mins),  label: "Mins"  },
    { value: pad(time.secs),  label: "Secs"  },
  ]

  return (
    <div className="relative w-full overflow-hidden bg-[#111111] min-h-[220px] sm:min-h-[280px]">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
        alt="Sale banner"
        fill
        className="object-cover object-center opacity-20"
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F0C040] text-[#111111] text-xs font-black px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5" />
              Limited Time Offer
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              Summer Sale
            </h2>
            <p className="text-white/60 text-base sm:text-lg">
              Up to <span className="text-[#F0C040] font-bold">50% off</span> across all categories
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
            <div className="flex gap-2 sm:gap-3 text-center">
              {units.map(({ value, label }, i) => (
                <div key={label}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 min-w-[56px] sm:min-w-[64px]">
                      <p className="text-2xl font-black text-white tabular-nums">{value}</p>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider">{label}</p>
                    </div>
                    {i < units.length - 1 && (
                      <span className="text-white/40 font-bold text-xl mb-3">:</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#F0C040] hover:bg-yellow-400 text-[#111111] text-sm font-black px-6 py-3 rounded-lg transition-colors"
            >
              Shop the Sale <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
