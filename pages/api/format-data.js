import { connectToDatabase } from '../../lib/mongodb';
import { parseMdToHtml } from '../../lib/posts';

const SAVE_TOKEN = process.env.SAVE_TOKEN;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "request verb" })
    }
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ msg: "auth missing" })
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        // res.locals.user = jwt.verify(token, SECRET_KEY);

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ msg: "bad token" })
        }

        // Read incoming file
        const fileContent = req.body.fileContent;

        // spread file into storable object
        const mainHeader = fileContent.split(/\r?\n/).filter((line) => {
            if (line.includes('# ')) {
                return line
            }
        })

        // CHECK FOR NO POST TITLE
        if (!mainHeader.length) {
            return res.status(409).json({ title: "missing" });
        }

        const cleanTitle = mainHeader[0].replace(/[#*]/g, '').trim()
        const textTitle = cleanTitle;
        const fileName = `${cleanTitle.replace(/\s/g, '-')}`
        const date = new Date();
        const authorName = req.body.authorName.trim()
        const description = req.body.description.trim()
        const fileBody = fileContent.split('\n').slice(1).join('\n')

        // CHECK FOR EMPTY BODY 
        if (!fileBody.length) {
            return res.status(409).json({ title: "body" });
        }

        const contentHtml = await parseMdToHtml(fileBody)


        // CHECK IF POST TITLE IS REPEATED, except for sample-file, that 
        // will format without checking DB.
        if (!req.body.formatOnly) {
            const { db } = await connectToDatabase()
            const repeatedTitle = await db
                .collection(`${process.env.MONGODB_COLLECTION}`)
                .findOne({ title: textTitle })
            if (repeatedTitle) {
                return res.status(409).json({ title: "duplicated" });
            }
        }

        const newPost = {
            "title": textTitle,
            "date": date,
            "author": authorName,
            "description": description,
            "fileName": fileName,
            "body": fileBody,
            "contentHtml": contentHtml,
            "lastMod": date
        }

        const result = JSON.stringify({ newPost: newPost })

        return res.status(200).json(result)

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: JSON.stringify(e) })
    }
}

