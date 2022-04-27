// import { da } from "date-fns/locale"
import Link from "next/link"
import styles from "./alert.module.css"
import dashboardStyles from '../styles/dashboard.module.css'
import { text } from "../lib/data"


export default function Alert({ data, cancelAction, downloadFile, deletePost, resetCounter }) {

    function handleCancel() {
        if (data.alert === "titleAlert") {
            refreshData()
            return;
        }
        cancelAction()
        return;
    }

    function handleReset() {
        resetCounter(data.id)
    }

    function handleDownload() {
        downloadFile(null, data.id)
    }

    function handleDelete() {
        deletePost(data.id, data.name)
    }

    if (data.alert === "resetAlert") {
        return (
            <div className={styles.alert}>
                <div className={styles.container}>
                    <h4>{text.alert.resetCounter}</h4>
                    <p>{text.alert.thisAction}</p>
                    <div className={styles.btnContainer}>
                        <button className={dashboardStyles.button} onClick={handleCancel}>{text.alert.cancel}</button>
                        <button className={`${dashboardStyles.button} ${dashboardStyles.buttonDelete}`} onClick={handleReset}>{text.alert.reset}</button>
                    </div>
                </div>
            </div>
        )
    }


    if (data.alert === "deletionAlert") {
        return (
            <div className={styles.alert}>
                <div className={styles.container}>
                    <h4>{text.alert.deleteCannot}</h4>
                    <p>{text.alert.youMight}</p>
                    <div className={styles.btnContainer}>
                        <button className={dashboardStyles.button} onClick={handleCancel}>{text.alert.cancel}</button>
                        <button className={dashboardStyles.button} onClick={handleDownload}>{text.alert.downloadPost}</button>
                        <button className={`${dashboardStyles.button} ${dashboardStyles.buttonDelete}`} onClick={handleDelete}>{text.alert.deletePost}</button>
                    </div>
                </div>
            </div>
        )
    }

    if (data.alert === 'titleAlert') {
        return (
            <div className={styles.container}>
                <p>{data.message}</p>
                <Link href="/admin/create-post">
                    <a onClick={handleCancel}>{text.alert.ok}</a>
                </Link>
            </div>
        )
    }

    if (data.alert === 'bodyAlert') {
        return (
            <div className={styles.container}>
                <p>{data.message}</p>
                {/* <Link href="/admin/write-post"> */}
                <a onClick={handleCancel}>{text.alert.ok}</a>
                {/* </Link> */}
            </div>
        )
    }

    if (data.alert === 'messageAlert') {
        return (
            <div className={styles.container}>
                <p>{data.message}</p>
            </div>
        )
    }
}