import NextAuth from 'next-auth'

import { authConfig } from '@/app/(auth)/auth.config'

export default NextAuth(authConfig).auth

export const config = {
  // matcher: ['/((?!home|_next|favicon.ico|public).*)'],
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register', '/reset-password', '/forgot-password', '/home'],
}
