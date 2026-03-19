"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { sdk } from "@/lib/medusa"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/Button"

export default function ProfilePage() {
  const { customer, refreshCustomer } = useAuth()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name ?? "")
      setLastName(customer.last_name ?? "")
      setPhone(customer.phone ?? "")
    }
  }, [customer])

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sdk.store.customer.update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      }),
    onSuccess: async () => {
      await refreshCustomer()
      toast.success("Profile updated successfully.")
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  const inputClass =
    "w-full border border-[#E5E5E5] rounded-sm px-3 py-2 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F0C040] focus:border-transparent transition"

  return (
    <div>
      <h1 className="text-xl font-bold text-[#111111] mb-6">Profile</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        {/* Email — read-only */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={customer?.email ?? ""}
            disabled
            className="w-full border border-[#E5E5E5] rounded-sm px-3 py-2 text-sm text-[#999999] bg-gray-50 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* First name */}
        <div>
          <label htmlFor="first_name" className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
            placeholder="First name"
          />
        </div>

        {/* Last name */}
        <div>
          <label htmlFor="last_name" className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
            placeholder="Last name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+1 555 000 0000"
          />
        </div>

        <Button type="submit" variant="primary" isLoading={isPending} className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
