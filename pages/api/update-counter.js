import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

export default async function handler(req, res) {
    if (req.method !== 'POST' || !req.body.id) {
        res.status(400).json({ error: "bad request" })
    }
    try {
        const { db } = await connectToDatabase();

        const query = { _id: ObjectId(req.body.id) }

        const update = await db
            .collection(MONGODB_COLLECTION)
            .updateOne(query,
                { $inc: { visits: 1 } }
            )

        if (update.matchedCount) {
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(502).json({ msg: "failed adding to counter" })
        }
    } catch (e) {
        res.status(500)
    }
}

