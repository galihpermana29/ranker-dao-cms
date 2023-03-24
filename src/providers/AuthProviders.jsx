import cmsAPI from '@/api/cms';
import { createContext } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const handleLogin = async (payload) => {
    console.log(payload, 'function');
    try {
      const data = await cmsAPI.login(payload);
      console.log(data, 'data from login');
    } catch (error) {
      window.onerror = function (err, file, line) {
        logError(
          'The following error occurred: ' +
            err +
            '\nIn file: ' +
            file +
            '\nOn line: ' +
            line
        );
        return true;
      };
    }
  };
  return (
    <AuthContext.Provider value={{ handleLogin }}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
