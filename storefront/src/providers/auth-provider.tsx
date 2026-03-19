"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

type AuthContextType = {
  customer: HttpTypes.StoreCustomer | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (first_name: string, last_name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshCustomer: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    sdk.store.customer
      .retrieve()
      .then(({ customer }) => setCustomer(customer))
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    await sdk.auth.login("customer", "emailpass", { email, password })
    const { customer } = await sdk.store.customer.retrieve()
    setCustomer(customer)
  }

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => {
    // Step 1: create the auth identity — SDK stores the registration token internally
    await sdk.auth.register("customer", "emailpass", { email, password })

    // Step 2: create the customer profile — SDK automatically sends the stored registration token
    await sdk.store.customer.create({ first_name, last_name, email })

    // Step 3: log in to exchange the registration token for a session token
    await login(email, password)
  }

  const logout = async () => {
    await sdk.auth.logout()
    setCustomer(null)
  }

  const refreshCustomer = async () => {
    const { customer } = await sdk.store.customer.retrieve()
    setCustomer(customer)
  }

  return (
    <AuthContext.Provider value={{ customer, isLoading, login, register, logout, refreshCustomer }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
