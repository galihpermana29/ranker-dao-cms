import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar';

import AuthContextProvider from './providers/AuthProviders';
import MainRoutes from './routes';

function App() {
  const loc = window.location.pathname;

  useEffect(() => {
    if (loc === '/') window.location.replace('/login');
  }, []);
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/*" element={<MainRoutes />} />
          <Route
            path="*"
            element={<div> Not Found or You do not have permission.</div>}
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
