import { connectToDatabase } from '../../lib/mongodb'

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

export const fetchDbData = async () => {
    const { db } = await connectToDatabase()

    const query = {}
    const sort = { date: -1, fileName: 1 }

    const data = await db
    .collection(MONGODB_COLLECTION)
    .find(query)
    .sort(sort)
    .toArray();

    return JSON.parse(JSON.stringify(data))
}

export default async function handler (req, res) {
    const data = await fetchDbData()
    res.status(200).json(data)
}