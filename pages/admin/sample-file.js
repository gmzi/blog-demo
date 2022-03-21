import Head from "next/head";
import Layout from "../../components/layout";
import Header from "../../components/header";
import utilStyles from '../../styles/utils.module.css'
import PostComponent from "../../components/postComponent";
import Restricted from "../../components/restricted";
import { useSession, getSession } from 'next-auth/react';
// import { fileBody } from "../../lib/fileReader";

const URL = process.env.NEXT_PUBLIC_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function SampleFile({ post }) {
    const { data: session } = useSession()

    if (session) {
        return (
            <Layout dashboard home>
                <Header />
                <Head>
                    {/* Base meta tags */}
                    <meta name="title" content={post.title} />
                    <meta name="author" content={post.author} />
                    {/* OpenGraph */}
                    <meta property="og:title" content={post.title} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={`${URL}/admin/${post.fileName}`} />
                    {/* Twitter */}
                    <meta name="twitter:title" content={post.title} />

                    <title>{post.title}</title>
                </Head>
                <PostComponent post={post} />
            </Layout>
        )
    }

    return (
        <Restricted />
    )
}

export async function getServerSideProps({ req }) {

    const session = await getSession({ req })

    if (session) {
        const response = await fetch(`${BASE_URL}/sample-file`, {})
        const sample = await response.json()

        return {
            props: {
                post: sample,
            }
        }

    } else {
        return {
            props: {
                post: null
            }
        }
    }
}


