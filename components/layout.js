import Head from 'next/head'
import styles from './layout.module.css'
import dashboardStyles from '../styles/dashboard.module.css'
import themes from '../styles/themes.module.css'
import Link from 'next/link'
import Logo from '../components/logo'
import LogoAdmin from '../components/logo-admin'
import { useTheme } from 'next-themes'
import Footer from './Footer'
import { data, text } from '../lib/data'
import { useState, useEffect } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export default function Layout({ children, home, post, dashboard }) {

    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => setMounted(true), []);

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
        <div className={styles.mainContainer}> 
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
                <meta charSet='utf-8' />
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
                
                {mounted && (
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    {/* {theme === 'light' ? <span>&#x263E;</span> : <span>&#x2600;</span>} */}
                    {/* {theme === 'light' ? `${text.theme.dark}` : `${text.theme.light}`} */}
                    {theme === 'light' ? (
                        <svg
                        height="100%" 
                        width="100%"  
                        viewBox="0 0 50 50"
                        fill="none"
                        fillRule="evenodd" 
                        opacity="1"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 38C29.941 38 38 29.941 38 20C38 12.143 33.019 5.456 26 3C37.714 
                        3.492 47 13.165 47 25C47 37.15 37.15 47 25 47C13.165 47 3.492 37.714 3 26C5.456 33.019 12.143 38 20 38Z" 
                        />
                        </svg>
                    ): (
                        <svg 
                        height="100%" 
                        width="100%" 
                        viewBox="0 0 50 50" 
                        fill="none"
                        fillRule="evenodd"
                        opacity="1" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 15.3791C30.4143 15.3791 34.8184 19.6957 34.8184 25C34.8184 30.3054 
                        30.4143 34.6209 25 34.6209C19.5868 34.6209 15.1816 30.3054 15.1816 25C15.1816 
                        19.6957 19.5868 15.3791 25 15.3791M25 46.3797L25 39.9658M25 10.0342L25 3.62028M3.1814 
                        25L9.72698 25M40.273 25L46.8186 25M9.57207 40.1187L14.2009 35.583M35.7991 14.4192L40.429 
                        9.8824M9.57207 9.8824L14.2009 14.4192M35.7991 35.583L40.429 40.1187" 
                        />
                        </svg>
                    )}
                </button>
                )}

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
            
        </div>
    )

}