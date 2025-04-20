import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname
      const isLoggedIn = !!auth?.user

      const isPublic =
        pathname === '/' ||
        pathname === '/home' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/reset-password') ||
        pathname.startsWith('/forgot-password') ||
        pathname === '/api/auth/send-reset-email' ||
        pathname === '/api/auth/reset-password'

      const isProtected =
        pathname.startsWith('/chat') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/support') ||
        pathname.startsWith('/pricing')

      if (isPublic) return true

      if (isProtected && !isLoggedIn) return false

      return true
    },
  },
} satisfies NextAuthConfig
