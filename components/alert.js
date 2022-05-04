// import { da } from "date-fns/locale"
import Link from "next/link"
import styles from "./alert.module.css"
import dashboardStyles from '../styles/dashboard.module.css'
import themes from '../styles/themes.module.css'
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
                <div className={themes.alertContainer}>
                    <h4>{text.alert.resetCounter}</h4>
                    <p>{text.alert.thisAction}</p>
                    <div className={styles.btnContainer}>
                        <button className={themes.button} onClick={handleCancel}>{text.alert.cancel}</button>
                        <button className={`${themes.button} ${themes.buttonDelete}`} onClick={handleReset}>{text.alert.reset}</button>
                    </div>
                </div>
            </div>
        )
    }


    if (data.alert === "deletionAlert") {
        return (
            <div className={styles.alert}>
                <div className={themes.alertContainer}>
                    <h4>{text.alert.deleteCannot}</h4>
                    <p>{text.alert.youMight}</p>
                    <div className={styles.btnContainer}>
                        <button className={themes.button} onClick={handleCancel}>{text.alert.cancel}</button>
                        <button className={themes.button} onClick={handleDownload}>{text.alert.downloadPost}</button>
                        <button className={`${themes.button} ${themes.buttonDelete}`} onClick={handleDelete}>{text.alert.deletePost}</button>
                    </div>
                </div>
            </div>
        )
    }

    if (data.alert === 'titleAlert') {
        return (
            <div className={themes.alertContainer}>
                <p>{data.message}</p>
                <Link href="/admin/upload-post">
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
            <div className={themes.alertContainer}>
                <p>{data.message}</p>
            </div>
        )
    }
}