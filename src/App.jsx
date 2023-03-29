import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthenticatedGuardRoute from './components/guard-route/authenticated';
import NotauthenticatedGuardRoute from './components/guard-route/notauthenticated';
import Navbar from './components/navbar';
import AddProduct from './pages/add-product';
import AllAdmin from './pages/admin';
import DetailCollection from './pages/collection/detail';
import Login from './pages/login';
import OurShop from './pages/shop';
import DetailShop from './pages/shop/detail';
import AuthContextProvider from './providers/AuthProviders';

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
          <Route
            path="/login"
            element={
              <NotauthenticatedGuardRoute>
                <Login />
              </NotauthenticatedGuardRoute>
            }
          />
          <Route
            path="/product"
            element={
              <AuthenticatedGuardRoute>
                <OurShop />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/collection"
            element={
              <AuthenticatedGuardRoute>
                <OurShop />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/collection/detail/:id"
            element={
              <AuthenticatedGuardRoute>
                <DetailCollection />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <AuthenticatedGuardRoute>
                <DetailShop />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <AuthenticatedGuardRoute>
                <DetailShop />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/add-nft"
            element={
              <AuthenticatedGuardRoute>
                <AddProduct />
              </AuthenticatedGuardRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthenticatedGuardRoute>
                <AllAdmin />
              </AuthenticatedGuardRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
