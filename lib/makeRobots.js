const fs = require('fs');

const BASE_URL = process.env.BASE_URL

fs.writeFile('./public/robots.txt', `User-agent: * \nSitemap: ${BASE_URL}/sitemap.xml`, (err) => {
    if (err) throw err;
})

