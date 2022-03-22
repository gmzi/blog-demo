import { useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Date from '../components/date'
import Logo from '../components/logo'
import Footer from '../components/Footer'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { connectToDatabase } from '../lib/mongodb'
import { data, text } from '../lib/data'

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const URL = process.env.NEXT_PUBLIC_URL;

export default function Home({ posts }) {


  return (
    <Layout home>
      <Head>
        {/* OpenGraph */}
        <meta property="og:type" content="index" />

        <title>{data.title}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {!posts.length ? (
          <p>No posts yet...</p>
        ) : (
          <ul className={utilStyles.list}>
            {posts.map(({ _id, fileName, title, author, date }) => (
              <li className={utilStyles.listItem} key={_id}>
                <Link href={`/posts/${fileName}`}>
                  {/* <a><span>{title}</span><span className={utilStyles.lightText}> {text.index.by} {author}</span></a> */}
                  <a><span className={utilStyles.lightText}> <Date dateString={date} /></span> <span>{title}</span></a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const { db } = await connectToDatabase();

  const query = {}
  const sort = { date: -1, fileName: 1 }

  const posts = await db
    .collection(MONGODB_COLLECTION)
    .find(query)
    .sort(sort)
    .toArray();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts))
    }
  }
}