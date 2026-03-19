import Link from "next/link"
import { Tag, Truck, RefreshCcw, Package } from "lucide-react"

export function TopBar() {
  return (
    <div className="bg-[#111111] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-xs">

          {/* Left: promo code */}
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-[#F0C040] shrink-0" />
            <span className="text-[#CCCCCC]">
              New customers: use{" "}
              <span className="font-bold text-[#F0C040] tracking-wide">WELCOME20</span>
              {" "}for 20% off
            </span>
          </div>

          {/* Center: shipping + returns (hidden on small screens) */}
          <div className="hidden sm:flex items-center gap-6 text-[#AAAAAA]">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Free shipping over $50
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5" />
              Free 30-day returns
            </span>
          </div>

          {/* Right: Track Order */}
          <Link
            href="/account/orders"
            className="flex items-center gap-1.5 text-[#AAAAAA] hover:text-white transition-colors whitespace-nowrap"
          >
            <Package className="h-3.5 w-3.5" />
            Track Order
          </Link>

        </div>
      </div>
    </div>
  )
}
