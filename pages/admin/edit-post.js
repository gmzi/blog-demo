import React, { useState, useEffect } from 'react';
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { useSession } from 'next-auth/react';
import Restricted from "../../components/restricted";
import Editor from "../../components/editor";
import Layout from "../../components/layout";
import Head from "next/head";
import Header from "../../components/header";
import { data, text } from "../../lib/data";
import Alert from "../../components/alert";
import Link from 'next/link';
import styles from '../../styles/dashboard.module.css'

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function EditPost({ post }) {
    const { data: session } = useSession()
    const [status, setStatus] = useState()

    function cancelAction() {
        setStatus(null)
    }

    const updatePost = async (newText, newAuthorName, newDescription) => {
        if (newText === post.body && newAuthorName === post.authorName && newDescription === post.description) {
            setStatus({ alert: "bodyAlert", message: `${text.editPost.noModifications}` })
            return
        }

        setStatus({ alert: "messageAlert", message: `${text.editPost.savingChanges}` })

        const newData = {
            id: post.id,
            fileName: post.fileName,
            newText: newText,
            newAuthorName: newAuthorName,
            newDescription: newDescription
        }

        const response = await fetch(`${BASE_URL}/update-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newData)
        })
        if (response.ok) {
            // localStorage.removeItem(`blogText-${post.id}`)
            setStatus({ alert: "messageAlert", message: `${text.editPost.changesHaveBeenSaved}` })
        } else {
            const errorMsg = await response.json();
            setStatus({ alert: "bodyAlert", message: errorMsg.error })
        }
        return;
    }

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.editPost.editPost} </title>
                </Head>
                <Header />
                <section>
                    {status ? (
                        <>
                            <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
                            <div className={styles.btnContainer}>
                                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                <a href="/"> {text.editPost.refreshIndex} </a>
                            </div>
                        </>
                    ) : (
                        // <Editor body={post.body} id={post.id} authorName={post.authorName} description={post.description} updatePost={updatePost} />
                        <Editor postBody={post.body} postAuthorName={post.authorName} postDescription={post.description} updatePost={updatePost} />
                    )
                    }
                </section>
                <div>
                    <Link href='/admin/dashboard'>
                        <a>← {text.addPostForm.goDashboard}</a>
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Restricted />
    )
}


export async function getServerSideProps({ query }) {

    const { db } = await connectToDatabase()

    const dbQuery = { _id: ObjectId(query.id) }
    const post = await db
        .collection(MONGODB_COLLECTION)
        .findOne(dbQuery)

    if (!post) {
        return {
            props: {
                post: false,
            }
        }
    }

    const result = {
        authorName: post.author,
        date: post.date,
        title: post.title,
        id: post._id,
        contentHtml: post.contentHtml,
        body: post.body,
        fileName: post.fileName,
        visits: post.visits,
        description: post.description
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(result))
        }
    }
}