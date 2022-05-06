import Layout from "./layout";
import { data } from "../lib/data";
import Head from "next/head";
import Header from "./header";

export default function Restricted() {
    return (
        <>
            <Layout>
                <Head>
                    <title>{data.title} - login</title>
                </Head>
                <Header />
            </Layout>
        </>
    )
}