import './index.scss';
import logo from '@/assets/img/logo-hori.png';
import { Link, useLocation } from 'react-router-dom';
import { useWalletContext } from '@/context/WalletContext';
import cmsAPI from '@/api/cms';

const Navbar = () => {
  const { onConnect, connectors, disconnect, isConnected } = useWalletContext();
  const loc = useLocation().pathname.split('/')[1];

  const handleLogout = async () => {
    try {
      await cmsAPI.logout();
      // localStorage.removeItem('account-admin');
      disconnect();
      window.location.reload();
    } catch (error) {
      console.log('error while logging out');
    }
  };
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
