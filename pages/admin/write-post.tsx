import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Layout from "../../components/layout"
import Head from "next/head"
import Header from '../../components/header'
import Link from "next/link"
import { data } from "../../lib/data"
import Alert from '../../components/alert'
import Restricted from "../../components/restricted";
import { text } from '../../lib/data'
import styles from '../../styles/dashboard.module.css'
import Editor from "../../components/editor";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function WritePost() {

    const textGuides = {
        title: text.writePost.title,
        body: text.writePost.body
    }
    
    const { data: session } = useSession()
    const [value, setValue] = useState(`${textGuides.title} \n ${textGuides.body}`);
    const [authorName, setAuthorName] = useState()
    const [description, setDescription] = useState()
    const [status, setStatus] = useState();
    const [published, setPublished] = useState();


    useEffect(() => {
        if (JSON.parse(localStorage.getItem('postText'))) {
            setValue(JSON.parse(localStorage.getItem('postText')))
        }
        if (JSON.parse(localStorage.getItem('postAuthor'))) {
            setAuthorName(JSON.parse(localStorage.getItem('postAuthor')))
        }
        if (JSON.parse(localStorage.getItem('postDescription'))) {
            setDescription(JSON.parse(localStorage.getItem('postDescription')))
        }
    }, [])

    const handleData = (data) => {
        localStorage.setItem(
            'postText',
            JSON.stringify(data)
        );
        setValue(data)
    }

    const handleFormChange = (e) => {
        const authorName = e.target.form.author.value;
        const description = e.target.form.description.value;
        localStorage.setItem(
            'postAuthor',
            JSON.stringify(authorName)
        );
        localStorage.setItem(
            'postDescription',
            JSON.stringify(description)
        );
        setAuthorName(authorName)
        setDescription(description)
    }


    function cancelAction() {
        setStatus(null)
    }

    const handlePublish = async (e) => {
        e.preventDefault()

        const rawData = {
            fileContent: value,
            authorName: authorName || "Default",
            description: description || ""
        }

        const format = await fetch(`${BASE_URL}/format-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(rawData)
        })

        if (!format.ok) {
            if (format.status === 409) {
                const errorMsg = await format.json();
                if (errorMsg.title === "missing") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.missingTitle}` })
                    return
                }
                if (errorMsg.title === "duplicated") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.titleExists}` })
                    return;
                }
                if (errorMsg.title === "body") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.noText}` })
                    return;
                }
            }
            setStatus({ alert: "bodyAlert", message: `${text.writePost.errorFormatting}` })
            return;
        }

        const postData = await format.json()
        const newPost = postData.newPost

        setStatus({ alert: "messageAlert", message: `${text.writePost.publishing}` })

        const publish = await fetch(`${BASE_URL}/save-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newPost)
        })

        if (publish.ok) {
            localStorage.removeItem('postText')
            localStorage.removeItem('postAuthor')
            localStorage.removeItem('postDescription')
            setStatus({ alert: "messageAlert", message: `${text.writePost.postPublished}` })
            setPublished(true)
        } else {
            const errorMsg = await publish.json();
            setStatus({ alert: "bodyAlert", message: errorMsg.error })
        }
        return
    }

    if (session) {

        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.writePost.writePost}</title>
                </Head>
                <Header />
                <section>
                    <h2>{text.writePost.newPost}</h2>
                        {!published ? (
                            <div className={`${styles.parent}`}>
                                {status ? (
                                    <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
                                ) : null}
                                <div>
                                    
                                    <Editor postBody={value} handleData={handleData}/>

                                    <form onChange={handleFormChange} encType="multipart/form-data">
                                        <label htmlFor="author">{text.addPostForm.authorName}</label>
                                        <input type="text" name="author" placeholder={`(${text.addPostForm.optional})`} value={authorName} />
                                        <label htmlFor="description">{text.addPostForm.description}</label>
                                        <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} value={description} />
                                    </form>
                                </div>
                                <div className={styles.btnContainer}>
                                    <button className="btnPublish" onClick={handlePublish}>{text.writePost.publish}</button>
                                </div>
                            </div>
                        ) : (
                            <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
                        )}
                        <div className={styles.btnContainer}>
                            <Link href='/admin/dashboard'>
                                <a>← {text.writePost.goDashboard}</a>
                            </Link>
                        </div>
                </section >
            </Layout >
        )
    }

    return (
        <Restricted />
    )
}