import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const NotauthenticatedGuardRoute = ({ children }) => {
  const [cookie] = useCookies(['XSRF-LOCAL-TOKEN']);
  //check if cookie is empty then guard
  return JSON.stringify(cookie) !== '{}' ? (
    <Navigate to={'/collection'} />
  ) : (
    children
  );
};

export default NotauthenticatedGuardRoute;
