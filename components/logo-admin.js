import styles from './logo.module.css'
import { text } from '../lib/data'

const LogoAdmin = () => (
    <span className={styles.span}>
        <span>{text.logoAdmin.dashboard}</span>
    </span>
);

export default LogoAdmin;