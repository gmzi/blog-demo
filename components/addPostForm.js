import React, { useState, useEffect } from 'react'
import Layout from './layout'
import { data, text } from '../lib/data';
import { useRouter } from 'next/router';
import Head from "next/head";
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css'
import styles from './addPostForm.module.css'
import dashboardStyles from '../styles/dashboard.module.css'
import PreviewPost from './previewPost';
import Header from './header';
import { grabText } from '../lib/grabText'
import { useSession } from 'next-auth/react';
import Restricted from './restricted';
import Alert from './alert';


const server_url = process.env.NEXT_PUBLIC_NEW_POST_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function AddPostForm() {

    console.log(text.addPostForm.fillAuthorName)
    const router = useRouter()

    const { data: session } = useSession()
    const [newPost, setNewPost] = useState()
    const [preview, setPreview] = useState()
    const [publishStatus, setPublishStatus] = useState()
    const [alert, setAlert] = useState()
    const [emptyField, setEmptyField] = useState()

    const refreshData = () => {
        router.replace(router.asPath)
        return;
    }

    const handleChange = (e) => {
        setEmptyField(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const authorName = e.target.author.value.trim();
        const description = e.target.description.value.trim();

        if (!authorName) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.fillAuthorName}` })
            return;
        }

        if (description.length > 255) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.longDescription}` })
            return;
        }

        if (!e.target.myFile.files.length) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.attach}` })
            return;
        }

        const fileContent = await grabText(e.target.myFile.files[0])

        const rawData = {
            authorName: authorName,
            description: description,
            fileContent: fileContent
        }

        const response = await fetch(`${BASE_URL}/format-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(rawData)
        })

        if (!response.ok) {
            if (response.status === 409) {
                setAlert({ alert: "titleAlert", message: `${text.addPostForm.titleDuplicate}` })
                return;
            }
            setAlert({ alert: "titleAlert", message: `${text.addPostForm.errorFormatting}` })
            return;
        }

        const postData = await response.json();
        const newData = postData.newPost
        setNewPost(newData)
        setPreview(true)
    }

    async function publish() {
        setPublishStatus("publishing...")
        const response = await fetch(`${BASE_URL}/save-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newPost)
        })
        if (response.ok) {
            setPublishStatus(`${text.addPostForm.postPublished}`)
            refreshData();
        } else {
            setPublishStatus(`${text.addPostForm.failedPublishing}`)
        }
        return;
    }

    function restart() {
        setPreview(null)
        setNewPost(null)
        return;
    }

    async function handleDownload() {
        const element = document.createElement("a");

        const response = await fetch(`${BASE_URL}/sample-file`, {})
        const postData = await response.json()

        const text = `# ${postData.title}
        ${postData.body}`
        const file = new Blob([text],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${postData.fileName}.md`;
        document.body.appendChild(element);
        element.click();
    }

    if (preview) {
        return (
            <PreviewPost post={newPost} publish={publish} restart={restart} publishStatus={publishStatus} />
        )
    }

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.addPostForm.addPost}</title>
                </Head>
                <Header />
                <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                    <h1>{text.addPostForm.createNew}</h1>
                    <div className={styles.guidelines}>{text.addPostForm.guidelinesTitle}
                        <ul className={styles.ul}>
                            <li>{text.addPostForm.li1}
                                <ul className={styles.codeContainer}>
                                    <li className={styles.codeTitle}><code className={styles.code}>
                                        # My Post Title</code></li>
                                    <li className={styles.codeBody}><code className={styles.code}>
                                        Lorem ipsum dolor sit amet...</code></li>
                                </ul>
                            </li>
                            <li>{text.addPostForm.li2}</li>
                            <li><strong>{text.addPostForm.iamge}</strong> {text.addPostForm.template}
                                <ul className={styles.codeContainer}>
                                    <li className={styles.codeBody}><code className={styles.code}>
                                        ![{text.addPostForm.myImage}](https://{text.addPostForm.myImage}-url.jpg)</code></li>
                                </ul>
                            </li>
                            <li><strong>Video</strong> {text.addPostForm.template}
                                <ul className={styles.codeContainer}>
                                    <li className={styles.codeBody}><code className={styles.code}>
                                        [![{text.addPostForm.myVideo}](https://{text.addPostForm.myImage}-url.jpg)](https://video-url)</code></li>
                                </ul>
                            </li>
                            <li>
                                <Link href="https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet#blockquotes">
                                    <a target="_blank">{text.addPostForm.cheatSheet}</a>
                                </Link>
                            </li>
                            <li>
                                <button className={`${dashboardStyles.button} ${dashboardStyles.buttonDownload}`} onClick={handleDownload}>{text.addPostForm.downloadSample}</button>
                            </li>
                        </ul>
                    </div>
                    {emptyField &&
                        <Alert data={emptyField} />
                    }
                    {alert ? (
                        <div className={styles.alertWrapper}>
                            <Alert data={alert} cancelDeletion={refreshData} downloadFile={null} deletePost={null} />
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit} onChange={handleChange} method="post" encType="multipart/form-data">
                            <label htmlFor="author">{text.addPostForm.authorName}</label>
                            <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} />
                            <label htmlFor="description">{text.addPostForm.description}</label>
                            <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} />
                            <label className={styles.uploadBtn} htmlFor="myFile">{text.addPostForm.file}</label>
                            <input className={dashboardStyles.button} type="file" name="myFile" accept=".md" />
                            <div className={styles.buttonPreviewContainer}>
                                <button className={`${dashboardStyles.button} ${styles.buttonPreview}`} type="submit">{text.addPostForm.preview}</button>
                            </div>
                        </form>
                    )}
                </section>
                <div>
                    <Link href='/admin/dashboard'>
                        <a>← {text.addPostForm.goDashboard}</a>
                    </Link>
                </div>
            </Layout >
        )
    }

    return (
        <Restricted />
    )
}