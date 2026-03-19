"use client"

import { BookOpen, Newspaper, HelpCircle, Phone } from "lucide-react"
import { NavDropdown } from "./NavDropdown"

const PAGES_ITEMS = [
  { label: "Blog",        href: "/blog",    icon: BookOpen,   description: "Tips, news & inspiration" },
  { label: "About Us",    href: "/about",   icon: Newspaper },
  { label: "Help Center", href: "/help",    icon: HelpCircle, description: "FAQs and guides" },
  { label: "Contact Us",  href: "/contact", icon: Phone },
]

export function PagesDropdown() {
  return <NavDropdown label="Pages" items={PAGES_ITEMS} />
}
