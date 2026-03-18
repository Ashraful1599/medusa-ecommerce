"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { StepIndicator } from "@/components/checkout/StepIndicator"
import { ShippingForm } from "@/components/checkout/ShippingForm"
import { PaymentForm } from "@/components/checkout/PaymentForm"
import { OrderReview } from "@/components/checkout/OrderReview"
import { useCart } from "@/providers/cart-provider"
import { sdk } from "@/lib/medusa"
import { toast } from "sonner"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/Button"

type Step = 1 | 2 | 3

export default function CheckoutPage() {
  const { cart, itemCount } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [shippingData, setShippingData] = useState<any>(null)
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string>("")
  const [selectedShippingName, setSelectedShippingName] = useState<string>("")

  if (!cart || itemCount === 0) {
    return (
      <Container className="py-12">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-[#111111] mb-2">Your cart is empty</h1>
          <Link href="/shop"><Button variant="primary">Browse Products</Button></Link>
        </div>
      </Container>
    )
  }

  const handleShippingComplete = async (data: any, shippingOptionId: string) => {
    try {
      // Update cart with shipping address
      await sdk.store.cart.update(cart.id, {
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          address_1: data.address_1,
          city: data.city,
          postal_code: data.postal_code,
          country_code: data.country_code,
        },
        email: data.email,
      })
      // Add shipping method
      await sdk.store.cart.addShippingMethod(cart.id, { option_id: shippingOptionId })
      setShippingData(data)
      setSelectedShippingOptionId(shippingOptionId)
      setStep(2)
    } catch {
      toast.error("Failed to save shipping info")
    }
  }

  const handlePaymentComplete = () => {
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!cart?.id) return
    setPlacingOrder(true)
    try {
      const result = await (sdk.store.cart.complete as any)(cart.id)
      if (result?.type === "order" && result?.order?.id) {
        // Clear cart
        localStorage.removeItem("cart_id")
        router.push(`/checkout/confirmation?order_id=${result.order.id}`)
      } else {
        toast.error("Order could not be placed. Please try again.")
      }
    } catch {
      toast.error("Failed to place order")
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <Container className="py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111111] mb-6 text-center">Checkout</h1>
      <StepIndicator currentStep={step} />

      <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 sm:p-8">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-[#111111] mb-6">Shipping Information</h2>
            <ShippingForm cartId={cart.id} onComplete={handleShippingComplete} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold text-[#111111] mb-6">Payment</h2>
            <PaymentForm
              cartId={cart.id}
              onComplete={handlePaymentComplete}
              onBack={() => setStep(1)}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold text-[#111111] mb-6">Review Your Order</h2>
            <OrderReview
              cart={cart}
              shippingOptionName={selectedShippingName}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setStep(2)}
              loading={placingOrder}
            />
          </>
        )}
      </div>
    </Container>
  )
}
