import { fileBody } from "../../lib/fileReader"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default async function handler(req, res) {

    const fileContent = await fileBody;

    const rawData = {
        authorName: "Sample Author",
        description: "sample description",
        fileContent: fileContent,
        formatOnly: true,
    }

    const response = await fetch(`${BASE_URL}/format-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SAVE_TOKEN}`
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(rawData)
    })
    const postData = await response.json();

    const sampleRaw = postData.newPost;

    const sample = JSON.stringify(sampleRaw)

    res.status(200).json(sample)
}