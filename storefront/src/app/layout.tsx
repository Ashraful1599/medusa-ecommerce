import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { CartProvider } from "@/providers/cart-provider"
import { WishlistProvider } from "@/providers/wishlist-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHOPX - Shop Everything",
  description: "Fashion, medicine, electronics, home goods and more.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster position="bottom-right" />
            </WishlistProvider>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
