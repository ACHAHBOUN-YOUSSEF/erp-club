"use client"

import { ToastContainer } from "react-toastify"
import ReduxProvider from "@/providers/ReduxProvider" // ton provider Redux
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="*:selection:bg-red-600 *:selection:text-white">
        <ReduxProvider>
          {children}

          <ToastContainer
            position="top-center"
            autoClose={4000}
            closeOnClick
            pauseOnHover
          />
        </ReduxProvider>
      </body>
    </html>
  )
}