import { connectToDatabase } from '../../lib/mongodb';

const BASE_URL = process.env.BASE_URL;
const SAVE_TOKEN = process.env.SAVE_TOKEN;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "request verb" })
    }
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ error: "auth missing" })
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        // res.locals.user = jwt.verify(token, SECRET_KEY);

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ error: "bad token" })
        }

        const { title, date, author, description, fileName, body, contentHtml } = req.body;

        // CHECK TYPEOF DATA:
        for (let v in req.body) {
            if (typeof req.body[v] !== 'string') {
                return res.status(400).json({ error: "missing parts" })
            }
        }

        if (!title || !date || !author || !fileName || !body || !contentHtml) {
            res.status(400).json({ error: "your post is missing parts, please check and try again" })
            return;
        }

        const aptUrl = fileName.normalize("NFD").replace(/[\u0300-\u036f?=]/g, "")

        const newPost = {
            title: title,
            date: date,
            author: author,
            description: description,
            fileName: aptUrl,
            body: body,
            contentHtml: contentHtml,
            visits: 0,
        }

        // save object in db
        const { db } = await connectToDatabase()

        // TOP POST QTTY:
        // const query = {}
        // const sort = { date: -1, _id: 1 }

        // const allPosts = await db
        //     .collection(MONGODB_COLLECTION)
        //     .find(query)
        //     .sort(sort)
        //     .toArray();


        // if (allPosts.length) {
        //     const maxPosts = 15;
        //     if (allPosts.length >= maxPosts) {
        //         const postToDelete = { _id: allPosts[allPosts.length - 1]._id }
        //         const deletePost = await db
        //             .collection(MONGODB_COLLECTION)
        //             .deleteOne(postToDelete)
        //     }
        // }

        const insertPost = await db
            .collection(MONGODB_COLLECTION)
            .insertOne(newPost)

        if (insertPost) {

            // REVALIDATE ON-DEMAND
            const revalidateIndex = await fetch(`${BASE_URL}/api/revalidate-index?secret=${REVALIDATE_TOKEN}`)
            const revalidatePost = await fetch(`${BASE_URL}/api/revalidate-post?secret=${REVALIDATE_TOKEN}&path=${newPost.fileName}`)

            res.status(200).json({ error: "saved to db" })
            return;
        } else {
            const error = new Error('failed saving file')
            error.statusCode = 403;
            throw error
        }
    } catch (e) {
        // return res.redirect(e.statusCode, '/_error')

        if (!('toJSON' in Error.prototype))
            Object.defineProperty(Error.prototype, 'toJSON', {
                value: function () {
                    var alt = {};

                    Object.getOwnPropertyNames(this).forEach(function (key) {
                        alt[key] = this[key];
                    }, this);

                    return alt;
                },
                configurable: true,
                writable: true
            });
        const error = new Error(e);

        res.status(500).json({ error: JSON.stringify(e) })
    }
}

