import { useEffect } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from '../../styles/utils.module.css'
import { connectToDatabase } from "../../lib/mongodb";
import PostComponent from "../../components/postComponent"
import { data } from "../../lib/data";

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_URL;

export default function Post({ post }) {
    useEffect(() => {
        async function updateVisits() {
            const data = {
                id: post.id
            }
            const res = await fetch(`${API_URL}/update-counter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            })
        }
        updateVisits()
    }, [])

    if (!post) {
        return (
            <Layout>
                <Head>
                    <title>{data.title}</title>
                </Head>
                <article>
                    <h4>Sorry, that&#x27;s not found</h4>
                </article>
            </Layout>
        )
    }

    return (
        <Layout post={post}>
            <PostComponent post={post} />
        </Layout>
    )
}


export async function getStaticProps({ params }) {
    const { db } = await connectToDatabase()
    const post = await db
        .collection(MONGODB_COLLECTION)
        .findOne({ fileName: params.id })

    if (!post) {
        return {
            props: {
                post: false,
            }
        }
    }

    const result = {
        author: post.author,
        date: post.date,
        lastMod: post.lastMod,
        title: post.title,
        description: post.description,
        id: post._id,
        contentHtml: post.contentHtml,
        fileName: post.fileName,
        visits: post.visits
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(result))
        }
    }
}

export async function getStaticPaths() {
    const { db } = await connectToDatabase()

    const query = {}
    const options = {
        projection: { fileName: 1 }
    }
    const cursor = db.collection(MONGODB_COLLECTION).find(query, options)
    const fileNames = []
    await cursor.forEach((c) => {
        fileNames.push(c.fileName)
    })

    const paths = fileNames.map((name) => ({
        params: { id: name }
    }))

    return { paths, fallback: 'blocking' }
}