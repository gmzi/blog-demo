import React from 'react';
import { parseISO, format } from "date-fns";
import { eng } from 'date-fns/locale'

const BASE_URL = process.env.BASE_URL;

class Sitemap extends React.Component {
    static async getInitialProps({res}){
        const request = await fetch(`${BASE_URL}/api/retrieve-posts`);

        const posts = await request.json();
        
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

        res.setHeader('Content-Type', 'text/xml');
        res.write(content)
        res.end()
    }   
}

export default Sitemap;