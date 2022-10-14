import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

import { dbUser } from "database"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'corre@gmail.com' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' }
            },
            async authorize(credentials) {
                // return { name: 'Cesar', email: 'cesar2gmail.com', role: 'admin' }

                return await dbUser.checkUserEmaiPassword(credentials?.email!, credentials?.password!);
            },
        })
    ],

    // Custonm pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    session: {
        maxAge: 2592000, // igual a 30 dias la duracionn deltoken
        strategy: 'jwt',

        // only use database session
        // updateAge: 86400, // igual a cada dia
    },
    /// callbacks
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;

                switch (account.type) {
                    case 'oauth':
                        token.user = await dbUser.oAuthToDbUser(user?.email || '', user?.name || '')
                        break

                    case "credentials":
                        token.user = user;
                        break
                }
            }
            // console.log({ token, account, user });
            return token;
        },
        async session({ session, token, user }) {
            // console.log({ session, token, user })
            session.accessToken = token.accessToken;
            session.user = token.user as any;
            return session;
        }
    }
}

export default NextAuth(authOptions)