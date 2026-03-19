import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react"
import { Container } from "@/components/layout/Container"

const ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $50",
  },
  {
    icon: RefreshCcw,
    title: "30-Day Returns",
    desc: "Hassle-free return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "256-bit SSL encryption",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're here to help anytime",
  },
]

export function TrustBar() {
  return (
    <div className="border-y border-[#E5E5E5] bg-white">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E5E5E5]">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-4 py-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F5F5] shrink-0">
                <Icon className="h-5 w-5 text-[#111111]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">{title}</p>
                <p className="text-xs text-[#999999]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
