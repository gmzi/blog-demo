import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { text } from '../../../lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'password',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                password: { label: `${text.auth.password}`, type: "password", placeholder: "demo", value: "demo" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${SAVE_TOKEN}`
                    }
                })
                const userToken = await res.json()

                // If no error and we have user data, return it
                if (res.ok && userToken) {
                    return userToken
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
})