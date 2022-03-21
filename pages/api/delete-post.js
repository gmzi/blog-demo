import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

const BASE_URL = process.env.BASE_URL;
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export default async function handler(req, res) {
    if (req.method !== 'POST' || !req.body.id) {
        res.status(400).json({ error: "bad request" })
    }
    try {
        const { db } = await connectToDatabase();

        const query = { _id: ObjectId(req.body.id) }

        const path = req.body.name

        const result = await db
            .collection(`${process.env.MONGODB_COLLECTION}`)
            .deleteOne(query)

        if (result.deletedCount === 1) {

            // REVALIDATE ON-DEMAND
            const revalidateIndex = await fetch(`${BASE_URL}/api/revalidate-index?secret=${REVALIDATE_TOKEN}`)
            const revalidatePost = await fetch(`${BASE_URL}/api/revalidate-post?secret=${REVALIDATE_TOKEN}&path=${path}`)

            res.status(200).json({ msg: 'success' })
        } else {
            res.status(502).json({ msg: "failed deleting/revalidating" })
        }
    } catch (e) {
        res.status(500)
    }
}

