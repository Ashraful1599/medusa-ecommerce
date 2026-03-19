import Link from "next/link"
import { Container } from "./Container"
import { NewsletterForm } from "./NewsletterForm"
import { Logo } from "@/components/ui/Logo"

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo variant="light" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop shop for fashion, health, electronics, home goods, and sports.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              {[
                { href: "/shop/fashion", label: "Fashion" },
                { href: "/shop/medicine", label: "Medicine" },
                { href: "/shop/electronics", label: "Electronics" },
                { href: "/shop/home-living", label: "Home & Living" },
                { href: "/shop/sports", label: "Sports" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Help</h3>
            <ul className="space-y-2">
              {[
                { href: "/help", label: "Help Center" },
                { href: "/help#shipping", label: "Shipping & Returns" },
                { href: "/contact", label: "Contact Us" },
                { href: "/about", label: "About Us" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-3">Get deals and new arrivals in your inbox.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Nexly. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
