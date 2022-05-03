import themes from '../styles/themes.module.css'
import { data } from '../lib/data'

const Logo = () => (
  <div className={themes.logoContainer}>
    <span className={themes.logoTitle}>
      <span className={themes.logoName}>{data.site_name}</span>
    </span>
  </div>
);

export default Logo;
