import './index.scss';
import { useCookies } from 'react-cookie';
import { Link, useLocation } from 'react-router-dom';

import cmsAPI from '@/api/cms';
import logo from '@/assets/img/logo-hori.png';
import { useWalletContext } from '@/context/WalletContext';

const Navbar = () => {
  const { onConnect, connectors, disconnect, isConnected, address } =
    useWalletContext();

  console.log(connectors, address);
  const loc = useLocation().pathname.split('/')[1];
  console.log(loc, 'loc');
  const [cookie, setCookie, removeCookie] = useCookies();

  const handleLogout = async () => {
    try {
      await cmsAPI.logout();
      removeCookie('XSRF-LOCAL-TOKEN');
      disconnect();
      window.location.reload();
    } catch (error) {
      console.log(error, 'erro');
      console.log('error while logging out');
    }
  };
  return (
    <div className="navbar-wrapper">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        {loc !== 'login' && (
          <div className="link-wrapper">
            <Link
              to="/collection"
              className={`link ${loc === 'collection' ? 'active' : ''}`}>
              COLLECTION
            </Link>
            <Link
              to={'/product'}
              className={`link ${loc === 'product' ? 'active' : ''}`}>
              PRODUCT
            </Link>
            <Link
              to={'/admin'}
              className={`link ${loc === 'admin' ? 'active' : ''}`}>
              ADMIN
            </Link>
          </div>
        )}
      </div>

      {loc !== 'login' && (
        <div className="right">
          <div className="address">
            {address && address.substring(0, 20) + '...'}
          </div>
          <div>
            {connectors.map((connector) => (
              <div
                onClick={
                  isConnected ? handleLogout : () => onConnect({ connector })
                }
                className="link connect">
                {isConnected ? 'LOGOUT' : 'CONNECT WALLET'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
