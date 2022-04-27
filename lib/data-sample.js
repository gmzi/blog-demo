const BASE_URL = process.env.BASE_URL;
// const languages = require('/lib/languages.json');

const data = {
    // Current supported languages: 'EN' for english, 'ES' for spanish.
    language: 'EN',
    site_name: "template site",
    author_name: "",
    // Reccomended to use site name and author name in title tag:
    title: "template site",
    description: "template",
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

// const text = languages[data.language] || languages.EN;

module.exports = data;