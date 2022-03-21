import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST' || !req.body.id) {
        res.status(400).json({ error: "bad request" })
    }
    try {
        const { db } = await connectToDatabase();

        const query = { _id: ObjectId(req.body.id) }

        const post = await db
            .collection(`${process.env.MONGODB_COLLECTION}`)
            .findOne(query)

        if (!post) {
            res.status(502).json({ msg: "post not found in db" })
        }

        const result = JSON.stringify(post)
        res.status(200).json(result)
    } catch (e) {
        res.status(500)
    }
}

