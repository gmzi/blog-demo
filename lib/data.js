const BASE_URL = process.env.NEXT_PUBLIC_URL;
import languages from './languages.json'

export const data = {
    // Current languages support: 'EN' for english, 'ES' for spanish.
    language: 'EN',
    name: "blog demo",
    title: "blog demo",
    description: "A blog platform with a dashboard and a text editor that regenerates on-demand. Posts are saved in MongoDB",
    ogImage: `${BASE_URL}/og-image.png`,
    social: [
        { name: "github", url: "https://github.com/gmzi/blog-demo2" },
        { name: "instagram", url: "https://www.instagram.com" },
        { name: "youtube", url: "https://www.youtube.com" },
        { name: "facebook", url: "https://www.facebook.com" },
        { name: "twitter", url: "https://www.twitter.com" }
    ],
    contactUrl: "https://discord.gg/m45mkvYTgG"
}

export const text = languages[data.language] || languages.EN;
