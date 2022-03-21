import { connectToDatabase } from '../../lib/mongodb';

const SAVE_TOKEN = process.env.SAVE_TOKEN;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
const USER_TOKEN = process.env.USER_TOKEN;

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

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ msg: "bad token" })
        }

        if (!req.body.password) {
            return res.status(403).json({ msg: "password missing" })
        }


        if (req.body.password !== LOGIN_PASSWORD) {
            return res.status(403).json({ msg: "bad password" })
        }

        const user_token = JSON.stringify(USER_TOKEN);

        return res.status(200).json(user_token)

    } catch (e) {
        // return res.redirect(e.statusCode, '/_error')

        if (!('toJSON' in Error.prototype))
            Object.defineProperty(Error.prototype, 'toJSON', {
                value: function () {
                    var alt = {};

                    Object.getOwnPropertyNames(this).forEach(function (key) {
                        alt[key] = this[key];
                    }, this);

                    return alt;
                },
                configurable: true,
                writable: true
            });
        const error = new Error(e);

        res.status(500).json({ error: JSON.stringify(e) })
    }
}

