import './index.scss';
import logo from '@/assets/img/logo-hori.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const loc = useLocation().pathname.split('/')[1];
  return (
    <div className="navbar-wrapper">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        {loc !== 'login' && (
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
        )}
      </div>
      {loc !== 'login' && (
        <div className="right">
          <Link to={'/admin'} className="link">
            CONNECT WALLET
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
