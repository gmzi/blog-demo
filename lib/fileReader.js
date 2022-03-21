import fs from 'fs'
import path from 'path'


async function getSampleData() {
    const postsDirectory = path.join(process.cwd(), '/lib/assets')
    const fullPath = path.join(postsDirectory, 'sample-file.md')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return new Promise((resolve, reject) => {
        return resolve(fileContents)
    });
}

export const fileBody = getSampleData()