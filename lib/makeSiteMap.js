const BASE_URL = process.env.BASE_URL;
const {parseISO, format} = require('date-fns');
const {eng} = require('date-fns/locale')
const fs = require('fs');

function makeSiteMap(posts){
    const urlTags = posts.map((post) => {
        const date = post.lastMod || post.date;
        const dateFormatted = format(parseISO(date), 'yyyy-MM-dd', { locale: eng });
        const url = `${BASE_URL}/posts/${post.fileName}`;
        const urlTag = `<url><loc>${url}</loc><lastmod>${dateFormatted}</lastmod></url>`
        return urlTag;
    })

    const content = [
        '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.google.com/schemas/sitemap/0.84 https://www.google.com/schemas/sitemap/0.84/sitemap.xsd">',
        ...urlTags,
        '</urlset>',
    ].join('')

    fs.writeFileSync('./public/sitemap.xml', content, (err) => {
        if (err) throw err;
        return;
    });
    return;
}

module.exports = makeSiteMap