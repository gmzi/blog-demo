import themes from '../styles/themes.module.css'


export default function PostComponent({ post }) {
    return (
        <article>
            <h1 className={themes.postHeadingLg}>{post.title}</h1>
            <div className={themes.postContent} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
    )
}