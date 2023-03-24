import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import AddProduct from './pages/add-product';
import AllAdmin from './pages/admin';
import DetailCollection from './pages/collection/detail';
import Login from './pages/login';
import OurShop from './pages/shop';
import DetailShop from './pages/shop/detail';
import AuthContextProvider from './providers/AuthProviders';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<OurShop />} />
          <Route path="/collection" element={<OurShop />} />
          <Route path="/collection/detail/:id" element={<DetailCollection />} />
          <Route path="/detail/:id" element={<DetailShop />} />
          <Route path="/edit/:id" element={<DetailShop />} />
          <Route path="/add-nft" element={<AddProduct />} />
          <Route path="/admin" element={<AllAdmin />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
