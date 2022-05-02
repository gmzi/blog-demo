import { signIn, signOut, useSession } from "next-auth/react"
import themes from '../styles/themes.module.css'
import { text } from '../lib/data'

export default function Header() {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <header>
            <div className={themes.sessionStatus}>
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
            </div>
        </header>
    )
}

// return (
    //     <header>
    //         <div className={themes.sessionStatus}>
    //             <div
    //                 className={`nojs-show ${!session && loading ? styles.loading : styles.loaded
    //                 }`}
    //             >
    //                 {!session && (
    //                     <>
    //                         <span className={styles.notSignedInText}>
    //                             {text.header.signInAs}
    //                         </span>
    //                         <a
    //                             href={`/api/auth/signin`}
    //                             className={themes.buttonPrimary}
    //                             onClick={(e) => {
    //                                 e.preventDefault()
    //                                 signIn()
    //                             }}
    //                         >
    //                             {text.header.signIn}
    //                         </a>
    //                     </>
    //                 )}
    //                 {session?.user && (
    //                     <>
    //                         <span className={styles.signedInText}>
    //                             <small>{text.header.signedInAs} <strong>{text.header.editor}</strong></small>
    //                         </span>
    //                         <a
    //                             href={`/api/auth/signout`}
    //                             className={styles.button}
    //                             onClick={(e) => {
    //                                 e.preventDefault()
    //                                 signOut()
    //                             }}
    //                         >
    //                             {text.header.signOut}
    //                         </a>
    //                     </>
    //                 )}
    //             </div>
    //         </div>
    //     </header>
    // )