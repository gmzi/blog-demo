const BASE_URL = process.env.NEXT_PUBLIC_URL;
import languages from './languages.json'

export const data = {
    // Current languages support: 'EN' for english, 'ES' for spanish.
    language: '',
    site_name: "",
    author_name: "",
    title: "",
    description: "",
    ogImage: `${BASE_URL}/og-image.png`,
    social: [
        { name: "github", url: "https://github.com" },
        { name: "instagram", url: "https://www.instagram.com" },
        { name: "youtube", url: "https://www.youtube.com" },
        { name: "facebook", url: "https://www.facebook.com" },
        { name: "twitter", url: "https://www.twitter.com" }
    ],
    profiles: {
        twitter: "",
    },
    contactUrl: "https://discord.com"
}

export const text = languages[data.language] || languages.EN;
