import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import { text } from '../lib/data'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

export default function Header() {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <header>
            <div className={styles.signedInStatus}>
                <p
                    className={`nojs-show ${!session && loading ? styles.loading : styles.loaded
                        }`}
                >
                    {!session && (
                        <>
                            <span className={styles.notSignedInText}>
                                {text.header.signInAs}
                            </span>
                            <a
                                href={`/api/auth/signin`}
                                className={styles.buttonPrimary}
                                onClick={(e) => {
                                    e.preventDefault()
                                    signIn()
                                }}
                            >
                                {text.header.signIn}
                            </a>
                        </>
                    )}
                    {session?.user && (
                        <>
                            <span className={styles.signedInText}>
                                <small>{text.header.signedInAs} <strong>{text.header.editor}</strong></small>
                            </span>
                            <a
                                href={`/api/auth/signout`}
                                className={styles.button}
                                onClick={(e) => {
                                    e.preventDefault()
                                    signOut()
                                }}
                            >
                                {text.header.signOut}
                            </a>
                        </>
                    )}
                </p>
            </div>
        </header>
    )
}