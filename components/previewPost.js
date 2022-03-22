import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Layout, { siteTitle } from "./layout";
import styles from './previewPost.module.css'
import utilStyles from '../styles/utils.module.css'
import dashboardStyles from '../styles/dashboard.module.css'
import Alert from './alert';
import PostComponent from './postComponent';
import { text } from '../lib/data'

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
                    <a href="/">{text.previewPost.refreshIndex}</a>
                </Layout>
            </>
        )
    }

    return (
        <section className={styles.section}>
            <Layout dashboard home>
                <Head>
                    <title>{text.previewPost.preview} {post.title}</title>
                </Head>
                <div className={styles.container}>
                    <h3>{text.previewPost.thisIs}:</h3>
                    <div className={styles.articleContainer}>
                        <PostComponent post={post} />
                    </div>
                </div>
                <ul className={styles.list}>
                    <li className={utilStyles.headingSm}>{text.previewPost.indexEntry}</li>
                    <li className={styles.listItem}><span>{post.title}</span><span className={styles.lightText}> {text.previewPost.by} {post.author}</span></li>
                    {post.description &&
                        <>
                            <li className={utilStyles.headingSm}>{text.previewPost.description}: </li>
                            <li className={styles.listItem}><span>{post.description}</span></li>
                        </>
                    }
                </ul>
                <div className={styles.btnContainer}>
                    <label htmlFor="btn-publish">{text.previewPost.promptPublish}</label>
                    <button className={`${dashboardStyles.button} ${dashboardStyles.buttonPublish}`} onClick={handlePublish} name="btn-publish">{text.previewPost.publish}</button>
                    <label htmlFor="btn-restart">{text.previewPost.promptStartOver}</label>
                    <button className={`${dashboardStyles.button} ${dashboardStyles.buttonStartOver}`} onClick={handleRestart} name="btn-restart">{text.previewPost.startOver}</button>
                </div>
                {/* <div className={styles.articleContainer}>
                    <PostComponent post={post} />
                </div> */}
            </Layout >
        </section>
    )
}

