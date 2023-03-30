import { Route, Routes } from 'react-router-dom';
import AuthenticatedGuardRoute from '@/components/guard-route/authenticated';
import NotauthenticatedGuardRoute from '@/components/guard-route/notauthenticated';
import AddProduct from '@/pages/add-product';
import AllAdmin from '@/pages/admin';
import DetailCollection from '@/pages/collection/detail';
import Login from '@/pages/login';
import OurShop from '@/pages/shop';
import DetailShop from '@/pages/shop/detail';

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        exact
        path="/login"
        element={
          <NotauthenticatedGuardRoute>
            <Login />
          </NotauthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/product"
        element={
          <AuthenticatedGuardRoute>
            <OurShop />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/collection"
        element={
          <AuthenticatedGuardRoute>
            <OurShop />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/collection/detail/:id"
        element={
          <AuthenticatedGuardRoute>
            <DetailCollection />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/detail/:id"
        element={
          <AuthenticatedGuardRoute>
            <DetailShop />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/edit/:id"
        element={
          <AuthenticatedGuardRoute>
            <DetailShop />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/add-nft"
        element={
          <AuthenticatedGuardRoute>
            <AddProduct />
          </AuthenticatedGuardRoute>
        }
      />
      <Route
        exact
        path="/admin"
        element={
          <AuthenticatedGuardRoute>
            <AllAdmin />
          </AuthenticatedGuardRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
