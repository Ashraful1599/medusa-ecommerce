"use client"

import { useState } from "react"
import { Container } from "@/components/layout/Container"
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react"

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@nexly.com",
    desc: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (555) 000-1234",
    desc: "Mon–Fri, 9am–6pm EST",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "123 Commerce St, New York, NY 10001",
    desc: "Not open for walk-ins",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri: 9am–6pm EST",
    desc: "Weekend: Email only",
  },
]

export default function ContactPage() {
  const [form, setForm]         = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: wire to backend
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 800)
  }

  const inputClass = "w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#F0C040] focus:border-transparent"

  return (
    <>
      {/* Header */}
      <div className="bg-[#111111] py-14 text-center">
        <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Contact Us</h1>
        <p className="text-white/60 mt-3 max-w-md mx-auto text-sm">
          Have a question, concern, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <Container className="py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left: contact info */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#111111]">Contact Information</h2>
            {CONTACT_INFO.map(({ icon: Icon, label, value, desc }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-[#111111]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#999999] uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#111111]">{value}</p>
                  <p className="text-xs text-[#999999]">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-[#E5E5E5] rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">Message Sent!</h3>
                <p className="text-sm text-[#999999]">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1.5">Full Name *</label>
                    <input required className={inputClass} value={form.name} onChange={set("name")} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1.5">Email *</label>
                    <input required type="email" className={inputClass} value={form.email} onChange={set("email")} placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1.5">Subject *</label>
                  <select required className={inputClass} value={form.subject} onChange={set("subject")}>
                    <option value="">Select a topic...</option>
                    <option value="order">Order Issue</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={6}
                    className={inputClass}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#111111] hover:bg-gray-800 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  {loading ? "Sending…" : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>

        </div>
      </Container>
    </>
  )
}
