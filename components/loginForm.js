import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Layout from './layout';
import { data } from '../lib/data';
import Head from "next/head";
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css'
import styles from './form.module.css'
import Alert from './alert';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function LoginForm() {
    const initialState = {
        password: '',
    };

    const router = useRouter()
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        setAlert(null)
        const { name, value } = e.target;

        setFormData((data) => ({
            ...data,
            [name]: value,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault()
        // send password and token to server
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            setAlert("wrong password, please try again")
            return;
        }

        // TODO: RECEIVE COOKIE AND STORE IT.
        // CHECK FOR COOKIE IN DASHBOARD AND ALL ADMIN COMPONENTS

        // THIS WON'T WORK BECAUSE DASHBOARD USES SERVERSIDEPROPS
        const userToken = await response.json()
        window.localStorage.setItem("rem_token", `${userToken}`)
        router.push('/admin/dashboard')
    }

    return (
        <Layout>
            <Head>
                <title>{data.title} - login</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h1>This is a restricted area</h1>
                <p className={styles.p}>Please login to continue</p>
                {/* <form className={styles.form} action={server_url} method="post" encType="multipart/form-data"> */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {alert &&
                        <div>
                            <p>{alert}</p>
                        </div>}
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" placeholder="enter your password" value={formData.password} onChange={handleChange} />
                    <input type="submit"></input>
                </form>
            </section>
        </Layout >
    )
}

/*
<form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                id="username"
                type="text"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary btn-block mt-4">Login</button>
          </form>
*/