import './index.scss';
import logo from '@/assets/img/logo-hori.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar-wrapper">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        <div className="link-wrapper">
          <Link to="/collection" className="link">
            COLLECTION
          </Link>
          <Link to={'/product'} className="link">
            PRODUCT
          </Link>
          <Link to={'/admin'} className="link">
            ADMIN
          </Link>
        </div>
      </div>
      <div className="right">
        <Link to={'/admin'} className="link">
          CONNECT WALLET
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
