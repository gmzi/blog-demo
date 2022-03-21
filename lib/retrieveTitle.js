import fs from 'fs'

export function retrieveTitle(file) {
    // Read all file content:
    const fileContent = fs.readFileSync(file, 'utf8')

    // Find main title:
    const mainHeader = fileContent.split(/\r?\n/).filter((line) => {
        if (line.includes('# ')) {
            return line
        }
    })

    // Clean special characters and spaces:
    const cleanTitle = mainHeader[0].replace(/[#*:,.]/g, '').trim()
    return cleanTitle
}