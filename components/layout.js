import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'
import Logo from '../components/logo'
import LogoAdmin from '../components/logo-admin'
import Footer from './Footer'
import { data, text } from '../lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export default function Layout({ children, home, post, dashboard }) {

    let url;
    let type;

    if (post) {
        url = `${BASE_URL}/posts/${post.fileName}`
        type = 'article'
    } else {
        url =  BASE_URL
        type = 'website'
    }


    const render = {
        // static fields:
        url: url,
        language: data.language,
        site_name: data.site_name,
        author_name: data.author_name,
        ogImage: data.ogImage,
        twitterProfile: data.profiles.twitter,
        // dynamic fields:
        title: data.title,
        description: data.description,
        type: type,
        author: null,
        fileName: '',
        date: '',
        lastMod: '',
        ...post
    }

    return (
        <>
            <Head>
                {/* Base meta tags */}
                <title>{render.title}{render.author ? ` - ${render.author}` : null}</title>
                <meta name="robots" content="follow, index" />
                <meta content={render.description} name="description"/>
                <meta property="og:url" content={render.url} />
                <link rel="canonical" href={`${BASE_URL}/`} />

                {/* OpenGraph */}
                {post ? (
                    <>
                    <meta property="og:type" content="article" />
                    <meta property="article:author" content={[...render.author]}/>
                    <meta property="article:published_time" content={render.date} />
                    <meta property="article:modified_time" content={render.lastMod} />
                    </>
                ): (
                    <meta property="og:type" content="website" />
                )}
                <meta property="og:site_name" content={render.site_name} />
                <meta property="og:description" content={render.description} />
                <meta property="og:title" content={render.title} />
                <meta property="og:image" content={render.ogImage} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                {render.twitterProfile &&
                    <meta name="twitter:site" content={render.twitterProfile}/>
                }
                <meta name="twitter:title" content={render.title} />
                <meta name="twitter:description" content={render.description} />
                <meta name="twitter:image" content={render.ogImage} />
                {/*Other meta tags  */}
                <meta httpEquiv='Content-Language' content={render.language} />
                <link rel="icon" href="/favicon.ico" />
                <meta name="title" content={render.title} />
                <meta name="theme-color" content="#317EFB"/>
            </Head>

            <nav className={styles.nav}>
                {dashboard ? (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages
                    <a href="/"><Logo /></a>
                ) : (
                    <Link href="/">
                        <a>
                            <Logo />
                        </a>
                    </Link>
                )}

                <Link href={`${data.contactUrl}`}>
                    <a className={styles.chat} target="_blank" rel="no-referrer">
                        {text.layout.comment}
                    </a>
                </Link>
                <Link href="/admin/dashboard">
                    <a>
                        <LogoAdmin />
                    </a>
                </Link>
            </nav>
            
            <div className={styles.container}>
                <main className={styles.main}>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href='/'>
                            <a>← {text.layout.home}</a>
                        </Link>
                    </div>
                )}
                {home &&
                    !dashboard &&
                    <footer className={styles.footer}>
                        {data.social.map((s, i) => (
                            < a href={s.url} target="_blank" rel="noopener noreferrer" key={`${i}-${s.name}`} >{s.name}</a >
                        ))}
                    </footer>
                }
            </div>
        </>
    )

}