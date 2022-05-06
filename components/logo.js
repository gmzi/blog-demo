import { data } from '../lib/data'

const Logo = () => (
  <div className="logoContainer">
    <span className="logoTitle">
      <span className="logoName">{data.site_name}</span>
    </span>
  </div>
);

export default Logo;
