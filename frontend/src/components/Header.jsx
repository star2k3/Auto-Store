import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function Header() {
  const count = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="topbar">
      <Link className="brand" to="/">Auto-Store 3D</Link>
      <nav>
        <NavLink to="/" end>Cars</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>
      </nav>
    </header>
  );
}
