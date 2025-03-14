"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export const SessionProvider = ({ children, session }) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}