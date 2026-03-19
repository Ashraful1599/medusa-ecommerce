import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "dark" | "light"
  href?: string
}

export function Logo({ className, variant = "dark", href = "/" }: LogoProps) {
  const text    = variant === "light" ? "#FFFFFF" : "#111111"
  const accent  = "#F0C040"
  const bg      = variant === "light" ? "#FFFFFF" : "#111111"

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>

      {/* ── Icon mark: lightning bolt inside rounded square ── */}
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Rounded square background */}
        <rect width="34" height="34" rx="8" fill={bg === "#111111" ? "#111111" : "#111111"} />
        {/* Lightning bolt */}
        <path
          d="M20 4 L11 19 H17 L14 30 L23 15 H17 L20 4Z"
          fill={accent}
        />
      </svg>

      {/* ── Wordmark: Nexly ── */}
      <svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nexly">
        {/* N */}
        <path d="M1 18V2L10 18V2" stroke={text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* e */}
        <path d="M14 12 H21 C21 12 21 8 17.5 8 C14 8 14 12 14 12 C14 12 14 16 17.5 16 C19.5 16 21 15 21 15" stroke={text} strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* x */}
        <path d="M25 8 L32 16 M32 8 L25 16" stroke={accent} strokeWidth="2" strokeLinecap="round"/>

        {/* l */}
        <path d="M36 2 L36 16" stroke={text} strokeWidth="2" strokeLinecap="round"/>

        {/* y */}
        <path d="M41 8 L45 15 M49 8 L45 15 L44 19" stroke={text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

    </span>
  )

  if (!href) return content

  return (
    <Link href={href} aria-label="Nexly — Home">
      {content}
    </Link>
  )
}
