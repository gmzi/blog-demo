import styles from './postComponent.module.css'


export default function PostComponent({ post }) {
    return (
        <article className={styles.article}>
            <h1 className={styles.headingLg}>{post.title}</h1>
            <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
    )
}