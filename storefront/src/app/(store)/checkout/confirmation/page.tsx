import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Package, CheckCircle } from "lucide-react"

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order_id?: string }
}) {
  const orderId = searchParams.order_id

  return (
    <Container className="py-12 max-w-lg text-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-[#111111]">Order Placed!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderId && (
          <div className="bg-gray-50 rounded-lg px-6 py-4 border border-[#E5E5E5] w-full">
            <p className="text-xs text-[#999999] mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold text-[#111111] break-all">{orderId}</p>
          </div>
        )}
        <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 w-full text-left">
          <Package className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#111111]">What happens next?</p>
            <p className="text-sm text-gray-600 mt-0.5">
              You will receive an email confirmation shortly. Your order will be processed within 1-2 business days.
            </p>
          </div>
        </div>
        <Link href="/shop" className="w-full">
          <Button variant="primary" size="lg" className="w-full">Continue Shopping</Button>
        </Link>
        <Link href="/account/orders" className="text-sm text-[#999999] hover:text-[#111111] transition-colors">
          View My Orders
        </Link>
      </div>
    </Container>
  )
}
