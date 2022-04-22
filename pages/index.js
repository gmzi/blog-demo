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
  const makeSiteMap = require('../lib/makeSiteMap');  
  const fs = require('fs');
  const BASE_URL = process.env.BASE_URL;
  const {parseISO, format} = require('date-fns');
  const {eng} = require('date-fns/locale')

  const query = {}
  const sort = { date: -1, fileName: 1 }

  const posts = await db
    .collection(MONGODB_COLLECTION)
    .find(query)
    .sort(sort)
    .toArray();

  // generate sitemap.xml
  // await makeSiteMap(posts)
  // CALL ROBOTS.TXT GENERATION FUNCTION HERE, SAVE FILE TO ./PUBLIC/robots.txt,

  const urlTags = posts.map((post) => {
    const date = post.lastMod || post.date;
    const dateFormatted = format(parseISO(date), 'yyyy-MM-dd', { locale: eng });
    const url = `${BASE_URL}/posts/${post.fileName}`;
    const urlTag = `<url><loc>${url}</loc><lastmod>${dateFormatted}</lastmod></url>`
    return urlTag;
})

const content = [
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.google.com/schemas/sitemap/0.84 https://www.google.com/schemas/sitemap/0.84/sitemap.xsd">',
    ...urlTags,
    '</urlset>',
].join('')

fs.writeFileSync('./public/sitemap.xml', content, (err) => {
    if (err) throw err;
    return;
});

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts))
    }
  }
}