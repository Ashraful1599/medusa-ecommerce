import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Package, RefreshCcw, CreditCard, Truck, User, ShieldCheck, ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about orders, shipping, returns, and more.",
}

const CATEGORIES = [
  { icon: Package,    label: "Orders",           href: "#orders" },
  { icon: Truck,      label: "Shipping",          href: "#shipping" },
  { icon: RefreshCcw, label: "Returns & Refunds", href: "#returns" },
  { icon: CreditCard, label: "Payments",          href: "#payments" },
  { icon: User,       label: "Account",           href: "#account" },
  { icon: ShieldCheck, label: "Privacy & Security", href: "#privacy" },
]

const FAQS: { section: string; id: string; items: { q: string; a: string }[] }[] = [
  {
    section: "Orders",
    id: "orders",
    items: [
      { q: "How do I track my order?", a: "Once your order ships, you'll receive a confirmation email with a tracking link. You can also track your order from your account under 'Orders'." },
      { q: "Can I change or cancel my order?", a: "Orders can be changed or cancelled within 1 hour of placing them. After that, they enter our fulfillment process and can no longer be modified. Please contact support immediately if you need to make a change." },
      { q: "What if I receive the wrong item?", a: "We're sorry! Contact us within 7 days of delivery with a photo of the wrong item and we'll arrange a replacement or full refund." },
    ],
  },
  {
    section: "Shipping",
    id: "shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3–7 business days. Express shipping (1–2 business days) is available at checkout for an additional fee." },
      { q: "Do you offer free shipping?", a: "Yes! All orders over $50 qualify for free standard shipping. Orders under $50 have a flat shipping fee of $4.99." },
      { q: "Do you ship internationally?", a: "We ship to 30+ countries. International shipping typically takes 7–14 business days. Import duties may apply depending on your country." },
    ],
  },
  {
    section: "Returns & Refunds",
    id: "returns",
    items: [
      { q: "What is your return policy?", a: "We offer free 30-day returns on all items in their original condition. Simply log into your account, go to your order, and initiate a return." },
      { q: "How long does a refund take?", a: "Once we receive your return, refunds are processed within 2–3 business days. It may take an additional 3–5 days to appear on your statement depending on your bank." },
      { q: "What items cannot be returned?", a: "For hygiene reasons, underwear, swimwear, and opened personal care items cannot be returned. Sale items marked as 'Final Sale' are also non-returnable." },
    ],
  },
  {
    section: "Payments",
    id: "payments",
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal and Apple Pay." },
      { q: "Is my payment information secure?", a: "Yes. All transactions are encrypted with 256-bit SSL. We never store your full card details on our servers." },
      { q: "Can I use a promo code?", a: "Yes! Enter your promo code at checkout in the 'Promo Code' field. Only one code can be applied per order." },
    ],
  },
  {
    section: "Account",
    id: "account",
    items: [
      { q: "How do I create an account?", a: "Click 'Account' in the top navigation and select 'Register'. You'll need your name, email, and a password." },
      { q: "I forgot my password. What do I do?", a: "Click 'Forgot password' on the login page and enter your email. You'll receive a reset link within a few minutes." },
      { q: "Can I shop without an account?", a: "Yes, guest checkout is available. However, creating an account lets you track orders, save addresses, and manage your wishlist." },
    ],
  },
  {
    section: "Privacy & Security",
    id: "privacy",
    items: [
      { q: "How is my personal data used?", a: "We use your data only to process orders and improve your shopping experience. We never sell your data to third parties. See our Privacy Policy for full details." },
      { q: "How do I delete my account?", a: "Contact our support team at support@nexly.com to request account deletion. We'll process it within 7 business days." },
    ],
  },
]

export default function HelpPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-[#111111] py-14 text-center">
        <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-3">Support</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">How can we help?</h1>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          Browse common questions below or{" "}
          <Link href="/contact" className="text-[#F0C040] hover:underline">contact our team</Link>
          {" "}directly.
        </p>
      </div>

      <Container className="py-12">

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          {CATEGORIES.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E5E5E5] hover:border-[#F0C040] hover:shadow-sm transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] group-hover:bg-[#F0C040] flex items-center justify-center transition-colors">
                <Icon className="h-5 w-5 text-[#111111]" />
              </div>
              <span className="text-xs font-semibold text-[#111111] leading-tight">{label}</span>
            </a>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="space-y-12">
          {FAQS.map(({ section, id, items }) => (
            <div key={id} id={id} className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#111111] mb-5 pb-3 border-b border-[#E5E5E5]">
                {section}
              </h2>
              <div className="space-y-3">
                {items.map(({ q, a }) => (
                  <details key={q} className="group border border-[#E5E5E5] rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-sm text-[#111111] hover:bg-gray-50 transition-colors">
                      {q}
                      <ChevronDown className="h-4 w-4 text-[#999999] shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 pt-1 text-sm text-[#666666] leading-relaxed border-t border-[#F0F0F0]">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 bg-[#F5F5F5] rounded-2xl p-8 text-center">
          <h3 className="font-bold text-[#111111] mb-2">Still need help?</h3>
          <p className="text-sm text-[#999999] mb-5">Our support team is available Monday to Friday, 9am–6pm EST.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Contact Support
          </Link>
        </div>

      </Container>
    </>
  )
}
