import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email === 'data@rgfstaffing.be' && credentials?.password === 'RGF2026!') {
          return { id: '1', name: 'Data Stratégiste', email: 'data@rgfstaffing.be', role: 'Data Stratégiste' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { id: string; name?: string | null; email?: string | null; role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { name?: string | null; email?: string | null; role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
