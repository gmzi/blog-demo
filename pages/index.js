import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import themes from '../styles/themes.module.css'
import { connectToDatabase } from '../lib/mongodb'
import { data } from '../lib/data'

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

export default function Home({ posts }) {

  return (
    <Layout home>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 style={{display: "none"}}>{data.title}</h1>
        {!posts.length ? (
          <p>No posts yet...</p>
        ) : (
          <ul className={utilStyles.list}>
            {posts.map(({ _id, fileName, title, author, date }) => (
              <li className={utilStyles.listItem} key={_id}>
                <Link href={`/posts/${fileName}`}>
                  {/* <a><span>{title}</span><span className={utilStyles.lightText}> {text.index.by} {author}</span></a> */}
                  <a><span className={themes.lightText}> <Date dateString={date} /></span> <span className={utilStyles.postTitle}>{title}</span></a>
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