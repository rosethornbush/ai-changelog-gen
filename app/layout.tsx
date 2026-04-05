import { Geist_Mono, Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { QueryClient } from "@/components/query-client"
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
        <ThemeProvider>
          <QueryClient>
            <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-12 py-8 font-sans">
              {children}
            </main>
            <Toaster />
          </QueryClient>
        </ThemeProvider>
      </body>
    </html>
  )
}
