import styles from './logo.module.css'
import { data } from '../lib/data'

const Logo = () => (
  <div className={styles.container}>
    <span className={styles.title}>
      <span className={styles.name}>{data.site_name}</span>
    </span>
  </div>
);

export default Logo;
