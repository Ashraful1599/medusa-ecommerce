"use client"
import { useState, useEffect } from "react"
import { sdk } from "@/lib/medusa"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { BangladeshLocationSelector, type BangladeshLocation } from "./BangladeshLocationSelector"

interface ShippingData {
  first_name:   string
  last_name:    string
  email:        string
  address_1:    string
  city:         string
  postal_code:  string
  country_code: string
  phone?:       string
}

interface ShippingFormProps {
  cartId:     string
  onComplete: (data: ShippingData, shippingOptionId: string) => void
}

export function ShippingForm({ cartId, onComplete }: ShippingFormProps) {
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ShippingData>({
    first_name: "", last_name: "", email: "",
    address_1: "", city: "", postal_code: "", country_code: "bd",
  })
  const [location, setLocation] = useState<BangladeshLocation | null>(null)
  const [village, setVillage]   = useState({ en: "", bn: "" })
  const [holding, setHolding]   = useState({ en: "", bn: "" })
  const [road,    setRoad]      = useState({ en: "", bn: "" })

  useEffect(() => {
    sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
      .then(({ shipping_options }) => {
        setShippingOptions(shipping_options ?? [])
        if (shipping_options?.[0]) setSelectedOptionId(shipping_options[0].id)
      })
      .catch(() => {})
  }, [cartId])

  const set = (k: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleLocationChange = (loc: BangladeshLocation) => {
    setLocation(loc)
    // Map to Medusa address fields
    setForm(prev => ({
      ...prev,
      city:         loc.districtName || prev.city,
      postal_code:  loc.postOfficeCode || prev.postal_code,
      country_code: "bd",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOptionId) return
    setLoading(true)
    try {
      // Build address_1 from village + holding + road (EN)
      const parts = [village.en, holding.en, road.en].filter(Boolean)
      const fullAddress = parts.length > 0 ? parts.join(", ") : form.address_1
      onComplete({ ...form, address_1: fullAddress }, selectedOptionId)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-sm focus:outline-none focus:border-[#111111]"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">First Name *</label>
          <input required className={inputClass} value={form.first_name} onChange={set("first_name")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">Last Name *</label>
          <input required className={inputClass} value={form.last_name} onChange={set("last_name")} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#111111] mb-1">Email *</label>
        <input type="email" required className={inputClass} value={form.email} onChange={set("email")} />
      </div>

      {/* Village / House */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">গ্রাম / বাড়ী (English) *</label>
          <input required className={inputClass} placeholder="Village / House (EN)"
            value={village.en} onChange={e => setVillage(v => ({ ...v, en: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">গ্রাম / বাড়ী (বাংলায়) *</label>
          <input required className={inputClass} placeholder="গ্রাম / বাড়ী"
            value={village.bn} onChange={e => setVillage(v => ({ ...v, bn: e.target.value }))} />
        </div>
      </div>

      {/* Holding number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">হোল্ডিং নম্বর (English)</label>
          <input className={inputClass} placeholder="Holding No. (EN)"
            value={holding.en} onChange={e => setHolding(v => ({ ...v, en: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">হোল্ডিং নম্বর (বাংলায়)</label>
          <input className={inputClass} placeholder="হোল্ডিং নম্বর"
            value={holding.bn} onChange={e => setHolding(v => ({ ...v, bn: e.target.value }))} />
        </div>
      </div>

      {/* Road */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">রাস্তা / রুক / শাখা (English)</label>
          <input className={inputClass} placeholder="Road / Block (EN)"
            value={road.en} onChange={e => setRoad(v => ({ ...v, en: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1">রাস্তা / রুক / শাখা (বাংলায়)</label>
          <input className={inputClass} placeholder="রাস্তা / রুক / শাখা"
            value={road.bn} onChange={e => setRoad(v => ({ ...v, bn: e.target.value }))} />
        </div>
      </div>

      {/* Bangladesh cascading location dropdowns */}
      <BangladeshLocationSelector onChange={handleLocationChange} />

      {/* Shipping options - fetched from API */}
      {shippingOptions.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-2">Shipping Method *</label>
          <div className="space-y-2">
            {shippingOptions.map((opt: any) => (
              <label key={opt.id} className="flex items-center justify-between p-3 border border-[#E5E5E5] rounded-sm cursor-pointer hover:border-[#111111] transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={selectedOptionId === opt.id}
                    onChange={() => setSelectedOptionId(opt.id)}
                    className="accent-[#111111]"
                  />
                  <span className="text-sm font-medium">{opt.name}</span>
                </div>
                <span className="text-sm font-bold">
                  {opt.amount === 0 ? "Free" : formatPrice(opt.amount ?? 0, opt.currency_code ?? "usd")}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
        Continue to Payment
      </Button>
    </form>
  )
}
