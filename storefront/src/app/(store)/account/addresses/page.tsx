"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MapPin, Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { toast } from "sonner"
import { sdk } from "@/lib/medusa"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import type { HttpTypes } from "@medusajs/types"

// ── Types ────────────────────────────────────────────────────────────────────

type AddressFormData = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

const EMPTY_FORM: AddressFormData = {
  first_name: "", last_name: "", company: "",
  address_1: "", address_2: "", city: "",
  province: "", postal_code: "", country_code: "us", phone: "",
}

// ── Address form ─────────────────────────────────────────────────────────────

function AddressForm({
  initial = EMPTY_FORM,
  onSubmit,
  onCancel,
  isPending,
}: {
  initial?: AddressFormData
  onSubmit: (data: AddressFormData) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [form, setForm] = useState<AddressFormData>(initial)
  const set = (field: keyof AddressFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const inputClass = "w-full border border-[#E5E5E5] rounded-sm px-3 py-2 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F0C040] focus:border-transparent"
  const labelClass = "block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1"

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form) }}
      className="space-y-4 border border-[#E5E5E5] rounded-sm p-5 bg-gray-50"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>First Name *</label>
          <input required className={inputClass} value={form.first_name} onChange={set("first_name")} placeholder="John" />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input required className={inputClass} value={form.last_name} onChange={set("last_name")} placeholder="Doe" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Company</label>
        <input className={inputClass} value={form.company} onChange={set("company")} placeholder="Acme Inc. (optional)" />
      </div>

      <div>
        <label className={labelClass}>Address *</label>
        <input required className={inputClass} value={form.address_1} onChange={set("address_1")} placeholder="123 Main St" />
      </div>

      <div>
        <label className={labelClass}>Apartment, suite, etc.</label>
        <input className={inputClass} value={form.address_2} onChange={set("address_2")} placeholder="Apt 4B (optional)" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>City *</label>
          <input required className={inputClass} value={form.city} onChange={set("city")} placeholder="New York" />
        </div>
        <div>
          <label className={labelClass}>State / Province</label>
          <input className={inputClass} value={form.province} onChange={set("province")} placeholder="NY" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Postal Code *</label>
          <input required className={inputClass} value={form.postal_code} onChange={set("postal_code")} placeholder="10001" />
        </div>
        <div>
          <label className={labelClass}>Country *</label>
          <select required className={inputClass} value={form.country_code} onChange={set("country_code")}>
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="bd">Bangladesh</option>
            <option value="in">India</option>
            <option value="sg">Singapore</option>
            <option value="ae">UAE</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input className={inputClass} type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="primary" size="sm" isLoading={isPending} className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" /> Save Address
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-1.5">
          <X className="h-3.5 w-3.5" /> Cancel
        </Button>
      </div>
    </form>
  )
}

// ── Address card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
  onDelete,
  isDeleting,
}: {
  address: HttpTypes.StoreCustomerAddress
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(address.country_code?.toUpperCase() ?? "") ?? address.country_code

  return (
    <div className="border border-[#E5E5E5] rounded-sm p-4 flex flex-col gap-3">
      <div className="flex-1 text-sm text-[#111111] space-y-0.5">
        <p className="font-semibold">{address.first_name} {address.last_name}</p>
        {address.company && <p className="text-[#999999]">{address.company}</p>}
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>{address.city}{address.province ? `, ${address.province}` : ""} {address.postal_code}</p>
        <p>{countryName}</p>
        {address.phone && <p className="text-[#999999]">{address.phone}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-[#111111] border border-[#E5E5E5] rounded-sm px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-sm px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> {isDeleting ? "Removing…" : "Remove"}
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const { customer } = useAuth()
  const queryClient = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["addresses", customer?.id],
    queryFn: () => sdk.store.customer.listAddress(),
    enabled: !!customer?.id,
  })

  const addresses = data?.addresses ?? []

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses", customer?.id] })

  const addMutation = useMutation({
    mutationFn: (body: AddressFormData) => sdk.store.customer.createAddress(body),
    onSuccess: () => { toast.success("Address added."); setShowAdd(false); invalidate() },
    onError: () => toast.error("Failed to add address."),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddressFormData }) =>
      sdk.store.customer.updateAddress(id, body),
    onSuccess: () => { toast.success("Address updated."); setEditingId(null); invalidate() },
    onError: () => toast.error("Failed to update address."),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sdk.store.customer.deleteAddress(id),
    onSuccess: () => { toast.success("Address removed."); setDeletingId(null); invalidate() },
    onError: () => { toast.error("Failed to remove address."); setDeletingId(null) },
  })

  function handleDelete(id: string) {
    setDeletingId(id)
    deleteMutation.mutate(id)
  }

  function addressToForm(a: HttpTypes.StoreCustomerAddress): AddressFormData {
    return {
      first_name: a.first_name ?? "",
      last_name: a.last_name ?? "",
      company: a.company ?? "",
      address_1: a.address_1 ?? "",
      address_2: a.address_2 ?? "",
      city: a.city ?? "",
      province: a.province ?? "",
      postal_code: a.postal_code ?? "",
      country_code: a.country_code ?? "us",
      phone: a.phone ?? "",
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#111111]" />
          <h1 className="text-xl font-bold text-[#111111]">Address Book</h1>
        </div>
        {!showAdd && (
          <Button variant="ghost" size="sm" onClick={() => { setShowAdd(true); setEditingId(null) }} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#111111] mb-3">New Address</p>
          <AddressForm
            onSubmit={data => addMutation.mutate(data)}
            onCancel={() => setShowAdd(false)}
            isPending={addMutation.isPending}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-[#E5E5E5] rounded-sm p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && addresses.length === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[#E5E5E5] rounded-sm">
          <MapPin className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-[#111111] font-semibold mb-1">No saved addresses</p>
          <p className="text-sm text-[#999999]">Add an address to speed up checkout.</p>
        </div>
      )}

      {/* Address list */}
      {!isLoading && addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div key={address.id}>
              {editingId === address.id ? (
                <AddressForm
                  initial={addressToForm(address)}
                  onSubmit={body => editMutation.mutate({ id: address.id!, body })}
                  onCancel={() => setEditingId(null)}
                  isPending={editMutation.isPending}
                />
              ) : (
                <AddressCard
                  address={address}
                  onEdit={() => { setEditingId(address.id!); setShowAdd(false) }}
                  onDelete={() => handleDelete(address.id!)}
                  isDeleting={deletingId === address.id}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
