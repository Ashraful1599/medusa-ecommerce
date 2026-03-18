import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Tag } from "lucide-react"

export function PromoBanner() {
  return (
    <Container fullWidth>
      <div className="bg-[#F0C040]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[#111111]">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 shrink-0" />
              <p className="text-sm font-semibold">
                New customers: use code <span className="font-black bg-white px-2 py-0.5 rounded mx-1">WELCOME20</span> for 20% off your first order
              </p>
            </div>
            <Link href="/shop" className="text-sm font-bold underline underline-offset-2 whitespace-nowrap hover:no-underline">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
