import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { CartProvider } from "@/providers/cart-provider"
import { WishlistProvider } from "@/providers/wishlist-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Nexly",
    template: "%s | Nexly",
  },
  description: "Fashion, medicine, electronics, home goods and more — all at Nexly.",
  openGraph: {
    siteName: "Nexly",
    type: "website",
    description: "Fashion, medicine, electronics, home goods and more — all at Nexly.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nexly" }],
  },
  twitter: {
    card: "summary_large_image",
  },
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
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster position="bottom-right" />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
