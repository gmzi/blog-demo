import { useEffect, useState } from 'react'
import Head from "next/head";
import Header from './header';
import Layout, { siteTitle } from "./layout";
import styles from './previewPost.module.css'
import utilStyles from '../styles/utils.module.css'
import dashboardStyles from '../styles/dashboard.module.css'
import Alert from './alert';
import PostComponent from './postComponent';
import { text } from '../lib/data'

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
            <Layout home dashboard>
                <Head>
                    <title>{text.previewPost.preview}: {post.title}</title>
                </Head>
                <Header/>
                    <h2>{text.previewPost.preview}</h2>
                    <div className={styles.container}>
                        <h3 className={styles.boxHeading}>{text.previewPost.thisIs}</h3>
                        <div className={styles.articleContainer}>
                            <PostComponent post={post} />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <h3 className={styles.boxHeading}>{text.previewPost.thisIsMeta}:</h3>
                        <div className={styles.metadataContainer}>
                            <ul className={utilStyles.list}>
                                <li className={utilStyles.listItem}>
                                    <div className={utilStyles.dateContainer}>
                                        <span className="postDate">{text.previewPost.indexEntry}: </span>
                                    </div>
                                    <div className={utilStyles.titleContainer}>
                                        <a><span>{post.title}</span></a>
                                    </div>
                                </li>
                                <li className={utilStyles.listItem}>
                                    <div className={utilStyles.dateContainer}>
                                        <span className="postDate">{text.previewPost.description}: </span>
                                    </div>
                                    <div className={utilStyles.titleContainer}>
                                        <a><span>{post.description}</span></a>
                                    </div>
                                </li>
                                <li className={utilStyles.listItem}>
                                    <div className={utilStyles.dateContainer}>
                                        <span className="postDate">{text.previewPost.author}: </span>
                                    </div>
                                    <div className={utilStyles.titleContainer}>
                                        <a><span>{post.author}</span></a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={dashboardStyles.btnContainer}>
                        <button className="btnPublish" onClick={handlePublish} name="btn-publish">{text.previewPost.publish}</button>
                        <button className="btnDelete" onClick={handleRestart} name="btn-restart">{text.previewPost.startOver}</button>
                    </div>
            </Layout>
        </section>
    )
}

