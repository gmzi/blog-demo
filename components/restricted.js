import Layout from "./layout";
import { data } from "../lib/data";
import Head from "next/head";
import Header from "./header";
import utilStyles from '/styles/utils.module.css'
import styles from '/styles/dashboard.module.css'

export default function Restricted() {
    return (
        <>
            <Layout>
                <Head>
                    <title>{data.title} - login</title>
                </Head>
                <Header />
                {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                    <h1>This is a restricted area</h1>
                    <p className={styles.p}>Please sign in to continue, or just go back home</p>
                </section> */}
            </Layout>
        </>
    )
}