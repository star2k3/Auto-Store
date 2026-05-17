import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, setQuantity } from '../features/cart/cartSlice.js';
import { formatPkr } from '../utils/format.js';

export function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="status">
        <p>Your cart is empty.</p>
        <Link to="/">Browse cars</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Cart</h2>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item._id}>
            <div>
              <strong>{item.name}</strong>
              <p>{formatPkr(item.pricePkr)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(event) =>
                dispatch(setQuantity({ id: item._id, quantity: Number(event.target.value) || 1 }))
              }
              aria-label={`Quantity for ${item.name}`}
            />
            <button type="button" onClick={() => dispatch(removeFromCart(item._id))}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: {formatPkr(total)}</h3>
      <Link to="/checkout" className="primary-link">Proceed to checkout</Link>
    </section>
  );
}
