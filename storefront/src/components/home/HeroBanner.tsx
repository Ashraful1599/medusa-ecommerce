import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"

export function HeroBanner() {
  return (
    <Container fullWidth>
      <div className="relative bg-[#111111] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F0C040] blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#F0C040] blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-[#F0C040] text-sm font-semibold uppercase tracking-widest mb-4">New Season Arrivals</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Shop Everything<br />You Love
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              Fashion, medicine, electronics, home goods, and more. Free shipping on orders over $50.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <Button variant="secondary" size="lg">Shop Now</Button>
              </Link>
              <Link href="/shop/fashion">
                <Button variant="ghost" size="lg" className="border-white/30 text-white hover:bg-white/10">Browse Fashion</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
