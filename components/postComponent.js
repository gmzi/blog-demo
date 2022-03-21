import utilStyles from '../styles/utils.module.css'
import styles from './postComponent.module.css'


export default function PostComponent({ post }) {
    return (
        <article className={styles.article}>
            <h1 className={utilStyles.headingLg}>{post.title}</h1>
            <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
    )
}