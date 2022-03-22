import React, { useEffect, useState, useSWR } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link'
import Alert from '../../components/alert';
import Layout from '../../components/layout';
import { data } from '../../lib/data';
import utilStyles from '../../styles/utils.module.css'
import styles from '../../styles/dashboard.module.css'
import { connectToDatabase } from '../../lib/mongodb'
import Header from '../../components/header'
import { useSession, getSession } from 'next-auth/react';
import Restricted from '../../components/restricted';
import { text } from '../../lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Dashboard({ posts }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [alert, setAlert] = useState()
    const [isRefreshing, setIsRefreshing] = useState();

    const refreshData = () => {
        router.replace(router.asPath)
        setIsRefreshing(true)
    }

    useEffect(() => {
        setIsRefreshing(false)
    }, [posts])

    const handleDelete = async (e) => {
        e.preventDefault()
        setAlert({ alert: 'deletionAlert', id: e.target.id, name: e.target.name })
        return;
    }

    const handleReset = async (e) => {
        e.preventDefault();
        setAlert({ alert: 'resetAlert', id: e.target.id })
        return;
    }

    async function deletePost(id, name) {
        setAlert({ alert: "messageAlert", message: `${text.dashboard.deletingPost}` })
        const data = {
            id: id,
            name: name
        }
        const response = await fetch(`${BASE_URL}/delete-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        if (response.ok) {
            setAlert(null)
            refreshData();
        } else {
            setAlert({ alert: "messageAlert", message: `${text.dashboard.failedToDelete}` })
        }
        return;
    }

    const handleDownload = async (e, id) => {
        let id_data
        if (!e) {
            id_data = {
                id: id
            }
        } else {
            id_data = {
                id: e.target.id
            }
        }
        const element = document.createElement("a");
        const response = await fetch(`${BASE_URL}/download-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(id_data)
        })
        if (!response.ok) {
            setAlert("post not found")
            return;
        }
        const postData = await response.json();
        const text = `# ${postData.title}
        ${postData.body}`
        const file = new Blob([text],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${postData.fileName}.md`;
        document.body.appendChild(element);
        element.click();
    }

    const handleEdit = (e, id) => {
        let id_data
        if (!e) {
            id_data = {
                id: id
            }
        } else {
            id_data = {
                id: e.target.id
            }
        }
        router.push(`/admin/edit-post?id=${id_data.id}`)
    }

    function cancelAction() {
        setAlert(null)
    }

    const resetCounter = async (id) => {
        const data = {
            id: id
        }
        const response = await fetch(`${BASE_URL}/reset-counter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        if (response.ok) {
            setAlert(null)
            refreshData();
        } else {
            setAlert({ alert: "messageAlert", message: `${text.dashboard.failedToReset}` })
        }
        return;
    }

    if (session) {
        return (
            <Layout dashboard home>
                <Header />
                <Head>
                    <title>{data.title}-{text.dashboard.dashboard}</title>
                </Head>
                <h1>{text.dashboard.dashboard}</h1>
                {
                    isRefreshing ? (
                        <p>{text.dashboard.updatingData}</p>
                    ) : (
                        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

                            <ul className={`${styles.list}`}>
                                <h3>{text.dashboard.newPost}</h3>
                                <li className={styles.actionItem}>
                                    <Link href="/admin/write-post">
                                        <a>{text.dashboard.writeInEditor}</a>
                                    </Link>
                                </li>
                                <li className={styles.actionItem}>
                                    <Link href="/admin/create-post">
                                        <a >{text.dashboard.uploadFile}</a>
                                    </Link>
                                </li>
                            </ul>
                            <ul className={`${styles.list} ${styles.parent}`}>
                                {alert ? (
                                    <Alert data={alert} cancelAction={cancelAction} downloadFile={handleDownload} deletePost={deletePost} resetCounter={resetCounter} />
                                ) : null}
                                <h3>{text.dashboard.previousPosts}</h3>
                                {!posts.length &&
                                    <p>{text.dashboard.noPosts}</p>}
                                {posts.map(({ _id, fileName, title, author, visits }) => (
                                    <li className={styles.listItem} key={_id}>
                                        <div>
                                            <Link href={`/posts/${fileName}`}>
                                                <a>
                                                    <span className={styles.titleSpan}>{title}</span>
                                                    <span className={utilStyles.lightText}> {text.dashboard.by} {author}</span>
                                                </a>
                                            </Link>
                                        </div>
                                        <div className={styles.btnContainer}>
                                            <button className={`${styles.button} ${styles.buttonCounter}`} onClick={handleReset} id={_id}>{text.dashboard.visits} {visits}</button>
                                            <button className={styles.button} onClick={handleDownload} id={_id}>{text.dashboard.download}</button>
                                            <button className={styles.button} onClick={handleEdit} id={_id}>{text.dashboard.edit}</button>
                                            <button className={`${styles.button} ${styles.buttonDelete}`} id={_id} name={fileName} onClick={handleDelete}>{text.dashboard.delete}</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )
                }
            </Layout >
        )
    }
    return (
        <Restricted />
    )
}

export async function getServerSideProps({ req }) {

    const session = await getSession({ req })

    if (session) {
        const { db } = await connectToDatabase();

        const query = {}
        const sort = { date: -1, fileName: 1 }

        const posts = await db
            .collection(`${process.env.MONGODB_COLLECTION}`)
            .find(query)
            .sort(sort)
            .toArray();

        return {
            props: {
                posts: JSON.parse(JSON.stringify(posts))
            }
        }
    } else {
        return {
            props: {
                posts: null
            }
        }
    }
}
