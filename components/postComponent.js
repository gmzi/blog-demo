export default function PostComponent({ post }) {
    return (
        <article>
            <h1 className="postHeading">{post.title}</h1>
            <div className="postContent" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
    )
}