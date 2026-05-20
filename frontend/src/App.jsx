import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { ReviewsPage } from './pages/ReviewsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { AdminCarsPage } from './pages/AdminCarsPage.jsx';
import { AdminCarFormPage } from './pages/AdminCarFormPage.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/orders"
            element={(
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/cars"
            element={(
              <ProtectedRoute role="admin">
                <AdminCarsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/cars/new"
            element={(
              <ProtectedRoute role="admin">
                <AdminCarFormPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/cars/:id"
            element={(
              <ProtectedRoute role="admin">
                <AdminCarFormPage />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </main>
    </div>
  );
}
