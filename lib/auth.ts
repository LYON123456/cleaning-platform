import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/cleaner/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Mock authentication for MVP - replace with real DB lookup
        const mockUsers = [
          {
            id: 'cleaner-1',
            email: 'cleaner@demo.com',
            password: 'demo1234',
            name: '王小明',
            role: 'CLEANER',
          },
          {
            id: 'admin-1',
            email: 'admin@demo.com',
            password: 'admin1234',
            name: '系統管理員',
            role: 'ADMIN',
          },
        ]

        const user = mockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.sub
        ;(session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    },
  },
}
