import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Layout, { siteTitle } from "./layout";
import styles from './previewPost.module.css'
import utilStyles from '../styles/utils.module.css'
import dashboardStyles from '../styles/dashboard.module.css'
import Alert from './alert';
import PostComponent from './postComponent';

// import { parseMdToHtml } from "../lib/posts";


export default function PreviewPost({ post, publish, restart, publishStatus }) {

    const [status, setStatus] = useState()

    useEffect(() => {
        setStatus(publishStatus)
    }, [publishStatus])

    const handlePublish = () => {
        publish()
        return;
    }

    const handleRestart = () => {
        restart()
        return;
    }

    if (status) {
        const alert = {
            alert: "messageAlert",
            message: status,
        }
        return (
            <>
                <Layout dashboard home>
                    <Alert data={alert} cancelDeletion={null} downloadFile={null} deletePost={null} />
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/">refresh index page</a>
                </Layout>
            </>
        )
    }

    return (
        <section className={styles.section}>
            <Layout dashboard home>
                <Head>
                    <title>PREVIEW: {post.title}</title>
                </Head>
                <div className={styles.container}>
                    <h3>This is a preview of your post</h3>
                    <div className={styles.btnContainer}>
                        <label htmlFor="btn-publish">Looking good?</label>
                        <button className={dashboardStyles.button} onClick={handlePublish} name="btn-publish">PUBLISH</button>
                        <label htmlFor="btn-restart">Need some edit?</label>
                        <button className={dashboardStyles.button} onClick={handleRestart} name="btn-restart">START OVER</button>
                    </div>
                </div>
                <ul className={styles.list}>
                    <li className={utilStyles.headingSm}>Index entry:</li>
                    <li className={styles.listItem}><span>{post.title}</span><span className={styles.lightText}> por {post.author}</span></li>
                    {post.description &&
                        <>
                            <li className={utilStyles.headingSm}>Description:</li>
                            <li className={styles.listItem}><span>{post.description}</span></li>
                        </>
                    }
                </ul>
                <div className={styles.articleContainer}>
                    <PostComponent post={post} />
                </div>
            </Layout >
        </section>
    )
}

