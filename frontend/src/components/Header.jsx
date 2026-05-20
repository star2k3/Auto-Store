import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../features/auth/authSlice.js';

export function Header() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  return (
    <header className="topbar">
      <Link className="brand" to="/">Auto-Store 3D</Link>
      <nav>
        <NavLink to="/" end>Cars</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        {user && <NavLink to="/orders">Orders</NavLink>}
        {isAdmin && <NavLink to="/admin/cars">Admin</NavLink>}
        <NavLink to="/cart">Cart ({count})</NavLink>
        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
        {user && <NavLink to="/profile">Account</NavLink>}
        {user && (
          <button type="button" className="link-button" onClick={() => dispatch(clearAuth())}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
