import { createContext } from 'react';

import cmsAPI from '@/api/cms';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const handleLogin = async (payload) => {
    const {
      data: { data },
    } = await cmsAPI.login(payload);

    localStorage.setItem('role', JSON.stringify(data.role));
    localStorage.setItem(
      'walletAdresses',
      JSON.stringify(data.walletAddresses)
    );
  };
  return (
    <AuthContext.Provider value={{ handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
