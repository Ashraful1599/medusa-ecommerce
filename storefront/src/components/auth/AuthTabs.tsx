"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

type Tab = "login" | "register"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("login")
  const { customer, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && customer) {
      router.replace("/account/orders")
    }
  }, [customer, isLoading, router])

  if (isLoading || customer) return null

  return (
    <div>
      <div role="tablist" aria-label="Authentication" className="flex border-b border-[#E5E5E5] mb-6">
        <button
          role="tab"
          aria-selected={activeTab === "login"}
          aria-controls="auth-panel"
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "login"
              ? "border-b-2 border-[#111111] text-[#111111]"
              : "text-gray-400 hover:text-[#111111]"
          }`}
        >
          Sign In
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "register"}
          aria-controls="auth-panel"
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "register"
              ? "border-b-2 border-[#111111] text-[#111111]"
              : "text-gray-400 hover:text-[#111111]"
          }`}
        >
          Create Account
        </button>
      </div>
      <div role="tabpanel" id="auth-panel">
        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
