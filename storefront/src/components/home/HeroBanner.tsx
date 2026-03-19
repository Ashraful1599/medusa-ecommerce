"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

// ── Slide data ─────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    image:     "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    alt:       "Modern shopping store interior",
    label:     "New Season Arrivals",
    headline:  ["Shop Everything", "You Love"],
    body:      "Fashion, electronics, home goods, and more. Free shipping on orders over $50.",
    cta:       { label: "Shop Now",       href: "/shop" },
    secondary: { label: "Browse Fashion", href: "/shop/fashion" },
  },
  {
    image:     "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80",
    alt:       "Electronics and tech gadgets",
    label:     "Tech & Electronics",
    headline:  ["Power Up", "Your World"],
    body:      "The latest phones, laptops, audio gear and smart home devices — all in one place.",
    cta:       { label: "Shop Electronics", href: "/shop/electronics" },
    secondary: { label: "View Deals",       href: "/shop/electronics" },
  },
  {
    image:     "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
    alt:       "Beautiful home living space",
    label:     "Home & Living",
    headline:  ["Make Your Space", "Beautiful"],
    body:      "Furniture, decor, kitchen essentials — everything you need to feel at home.",
    cta:       { label: "Shop Home",     href: "/shop/home-living" },
    secondary: { label: "Explore Decor", href: "/shop/home-living" },
  },
]

const INTERVAL = 5000

// ── Component ──────────────────────────────────────────────────────────────────

export function HeroBanner() {
  const [active, setActive]   = useState(0)
  const [paused, setPaused]   = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }, [])

  const next = useCallback(() => go(active + 1), [active, go])
  const prev = useCallback(() => go(active - 1), [active, go])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(next, INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, next])

  // Progress bar ticker (updates every 50ms)
  useEffect(() => {
    if (paused) return
    setProgress(0)
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (50 / INTERVAL) * 100, 100))
    }, 50)
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [active, paused])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  return (
    <div
      className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[700px] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── Slides ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Left-to-right gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Content (animates per active slide) ── */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 sm:py-28 lg:py-36">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute max-w-xl transition-all duration-700",
              i === active
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-4">
              {slide.label}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white mb-5">
              {slide.headline[0]}<br />{slide.headline[1]}
            </h1>
            <p className="text-white/70 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
              {slide.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={slide.cta.href}>
                <Button variant="secondary" size="lg">{slide.cta.label}</Button>
              </Link>
              <Link href={slide.secondary.href}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  {slide.secondary.label}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Bottom controls: dots + progress ── */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-3">

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === active
                  ? "w-6 h-2 bg-[#F0C040]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-24 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F0C040] rounded-full transition-none"
            style={{ width: `${paused ? progress : progress}%` }}
          />
        </div>

      </div>

    </div>
  )
}

// ── Static version (commented out for reference) ──────────────────────────────
/*
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"

export function HeroBanner() {
  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[700px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
        alt="Hero banner — shopping"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 sm:py-28 lg:py-36">
        <div className="max-w-xl">
          <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-4">
            New Season Arrivals
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white mb-5">
            Shop Everything<br />You Love
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            Fashion, electronics, home goods, and more. Free shipping on orders over $50.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button variant="secondary" size="lg">Shop Now</Button>
            </Link>
            <Link href="/shop/fashion">
              <Button variant="ghost" size="lg" className="border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                Browse Fashion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
*/
