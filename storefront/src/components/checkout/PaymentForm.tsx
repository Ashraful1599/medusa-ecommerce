"use client"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/Button"
import { sdk } from "@/lib/medusa"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? "")

interface PaymentFormProps {
  cartId: string
  onComplete: () => void
  onBack: () => void
}

function CardForm({ cartId, onComplete, onBack }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Stripe payment session
    ;(async () => {
      try {
        const { cart } = await sdk.store.cart.retrieve(cartId, { fields: "+payment_collection.payment_sessions" } as any)
        const paymentSession = (cart as any)?.payment_collection?.payment_sessions?.[0]
        if (paymentSession?.data?.client_secret) {
          setClientSecret(paymentSession.data.client_secret)
        } else {
          // Create payment session
          await (sdk.store.payment as any).initiatePaymentSession(cart, { provider_id: "pp_stripe_stripe" })
          const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId, { fields: "+payment_collection.payment_sessions" } as any)
          const session = (updatedCart as any)?.payment_collection?.payment_sessions?.[0]
          if (session?.data?.client_secret) setClientSecret(session.data.client_secret)
        }
      } catch (err) {
        console.error("Failed to initialize payment session:", err)
      }
    })()
  }, [cartId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setLoading(true)
    try {
      const card = elements.getElement(CardElement)
      if (!card) return
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      })
      if (error) {
        toast.error(error.message ?? "Payment failed")
      } else {
        onComplete()
      }
    } catch {
      toast.error("Payment processing failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-[#111111] mb-2">Card Details</label>
        <div className="px-4 py-3 border border-[#E5E5E5] rounded-sm focus-within:border-[#111111] transition-colors">
          <CardElement options={{ style: { base: { fontSize: "14px", color: "#111111" } } }} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1" isLoading={loading} disabled={!stripe || !clientSecret}>
          Continue to Review
        </Button>
      </div>
    </form>
  )
}

export function PaymentForm({ cartId, onComplete, onBack }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm cartId={cartId} onComplete={onComplete} onBack={onBack} />
    </Elements>
  )
}
