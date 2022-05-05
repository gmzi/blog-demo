import { signIn, signOut, useSession } from "next-auth/react"
import { text } from '../lib/data'

export default function Header() {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <header>
            {!session &&
            <span>
                <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                    e.preventDefault()
                    signIn()
                }}>{text.header.signIn}</a> {text.header.editor}
            </span>
            }
            {session?.user &&
            <span>
                <a href={`/api/auth/signout`}
                 onClick={(e) => {
                     e.preventDefault()
                     signOut()
                 }}
                >{text.header.signOut}</a> {text.header.editor}
            </span>
            }
        </header>
    )
}