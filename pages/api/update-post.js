import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";
import { parseMdToHtml } from '../../lib/posts';

const BASE_URL = process.env.BASE_URL;
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;
const SAVE_TOKEN = process.env.SAVE_TOKEN;

export default async function handler(req, res) {
    if (req.method !== 'POST' || !req.body.id || !req.body.newText || !req.body.fileName) {
        return res.status(400).json({ error: "bad request" })
    }
    try {

        if (!req.headers.authorization) {
            return res.status(400).json({ error: "auth missing" })
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ error: "bad token" })
        }

        if (typeof req.body.newText !== 'string') {
            return res.status(400).json({ error: "wrong data type" })
        }

        // Make the new HTML.
        const newContentHtml = await parseMdToHtml(req.body.newText)

        const updateDateObj = new Date();
        const updateDate = updateDateObj.toISOString();

        const { db } = await connectToDatabase();

        const filter = { _id: ObjectId(req.body.id) }

        const updateDocument = {
            $set: {
                contentHtml: newContentHtml,
                body: req.body.newText,
                author: req.body.newAuthorName,
                description: req.body.newDescription,
                lastMod: updateDate
            }
        }

        const update = await db
            .collection(`${process.env.MONGODB_COLLECTION}`)
            .updateOne(filter, updateDocument)

        if (update.acknowledged) {
            const path = req.body.fileName
            // REVALIDATE ON-DEMAND
            const revalidatePost = await fetch(`${BASE_URL}/api/revalidate-post?secret=${REVALIDATE_TOKEN}&path=${path}`)
            const revalidateIndex = await fetch(`${BASE_URL}/api/revalidate-index?secret=${REVALIDATE_TOKEN}`)
            if (revalidatePost.ok && revalidateIndex.ok) {
                res.status(200).json({ message: 'success' })
            } else {
                res.status(500).json({ error: "failed revalidating" })
            }
        } else {
            res.status(502).json({ error: "not acknowledged in db" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}

