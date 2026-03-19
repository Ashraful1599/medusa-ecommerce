"use client"

import { useState } from "react"
import { Mail, ArrowRight, Check } from "lucide-react"

export function NewsletterBlock() {
  const [email, setEmail]       = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // TODO: wire to backend
    setSubmitted(true)
  }

  return (
    <div className="bg-[#F5F5F5] border-y border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="max-w-xl mx-auto text-center">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0C040] mb-5">
            <Mail className="h-5 w-5 text-[#111111]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mb-3">
            Get Deals Before Anyone Else
          </h2>
          <p className="text-[#999999] text-sm sm:text-base mb-8 leading-relaxed">
            Join 10,000+ shoppers who get exclusive deals, new arrivals, and early access to sales — straight to their inbox.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-6 py-3 text-sm font-semibold">
              <Check className="h-4 w-4" />
              You&apos;re in! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-sm border border-[#E5E5E5] rounded-lg text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#F0C040] focus:border-transparent bg-white"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-gray-800 text-white text-sm font-bold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-[#AAAAAA] mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
