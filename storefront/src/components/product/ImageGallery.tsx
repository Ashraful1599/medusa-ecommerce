"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
  jumpToIndex?: number
}

const THUMB_VISIBLE = 4

// ── Lightbox ───────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: string[]
  title: string
  startIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  // Keyboard navigation + close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, prev, next])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/60 text-sm tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Main image area */}
      <div
        className="relative flex-1 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-5xl mx-auto">
          <Image
            key={index}
            src={images[index]}
            alt={`${title} ${index + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 sm:left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 justify-center px-4 py-4 shrink-0 overflow-x-auto"
          onClick={e => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-colors",
                i === index ? "border-[#F0C040]" : "border-white/20 hover:border-white/50"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

// ── Gallery ────────────────────────────────────────────────────────────────────

export function ImageGallery({ images, title, jumpToIndex = 0 }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [thumbOffset, setThumbOffset]   = useState(0)
  const [zoom, setZoom]                 = useState(false)
  const [zoomPos, setZoomPos]           = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // When the image set changes (variant switch), jump to the variant-specific image.
  const imagesKey = images.join("|")
  useEffect(() => {
    const i = Math.max(0, Math.min(jumpToIndex, images.length - 1))
    setActiveIndex(i)
    // Scroll thumbnail window to keep the active thumb visible
    if (i < thumbOffset) setThumbOffset(i)
    else if (i >= thumbOffset + THUMB_VISIBLE) setThumbOffset(i - THUMB_VISIBLE + 1)
  }, [imagesKey, jumpToIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const needsSlider = images.length > THUMB_VISIBLE
  const maxOffset   = Math.max(0, images.length - THUMB_VISIBLE)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !zoom) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    })
  }

  function selectImage(i: number) {
    setActiveIndex(i)
    if (needsSlider) {
      if (i < thumbOffset) setThumbOffset(i)
      else if (i >= thumbOffset + THUMB_VISIBLE) setThumbOffset(i - THUMB_VISIBLE + 1)
    }
  }

  const mainImage = images[activeIndex]

  return (
    <>
      <div className="space-y-3">

        {/* Main image */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl bg-gray-50 cursor-zoom-in aspect-square"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          {mainImage ? (
            <>
              <Image
                src={mainImage}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  transform: zoom ? "scale(2.5)" : "scale(1)",
                  transformOrigin: zoom ? `${zoomPos.x}% ${zoomPos.y}%` : "center",
                  transition: "transform 0.15s ease-out",
                }}
              />
              {/* Expand hint — visible on hover, hidden while zoomed */}
              {!zoom && (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none select-none">
                  <ZoomIn className="h-3 w-3" />
                  Click to expand
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-300 text-sm">No image</span>
            </div>
          )}

          {/* Prev/Next arrows — stop propagation so they don't open lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); selectImage((activeIndex - 1 + images.length) % images.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-[#111111]" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); selectImage((activeIndex + 1) % images.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-[#111111]" />
              </button>
            </>
          )}

          {/* Image counter badge */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full tabular-nums">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2">

            {needsSlider && (
              <button
                onClick={() => setThumbOffset(o => Math.max(0, o - 1))}
                disabled={thumbOffset === 0}
                className="shrink-0 w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-30"
                aria-label="Previous thumbnails"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="flex gap-2 flex-1 overflow-hidden">
              {images.slice(thumbOffset, thumbOffset + (needsSlider ? THUMB_VISIBLE : images.length)).map((src, i) => {
                const realIndex = thumbOffset + i
                return (
                  <button
                    key={realIndex}
                    onClick={() => selectImage(realIndex)}
                    aria-label={`View image ${realIndex + 1}`}
                    className={cn(
                      "relative shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-colors",
                      realIndex === activeIndex ? "border-[#111111]" : "border-[#E5E5E5] hover:border-gray-400"
                    )}
                  >
                    <Image
                      src={src}
                      alt={`${title} ${realIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                )
              })}
            </div>

            {needsSlider && (
              <button
                onClick={() => setThumbOffset(o => Math.min(maxOffset, o + 1))}
                disabled={thumbOffset >= maxOffset}
                className="shrink-0 w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-30"
                aria-label="Next thumbnails"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}

          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          title={title}
          startIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
