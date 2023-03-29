import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const AuthenticatedGuardRoute = ({ children }) => {
  const [cookie] = useCookies(['XSRF-LOCAL-TOKEN']);
  return JSON.stringify(cookie) !== '{}' ? children : <Navigate to="/login" />;
};

export default AuthenticatedGuardRoute;
