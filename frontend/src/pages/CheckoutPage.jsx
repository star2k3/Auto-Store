import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice.js';
import { api } from '../api.js';
import { formatPkr } from '../utils/format.js';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const total = items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || '', email: user.email || '', address: user.address || '' });
  }, [user]);

  const submitCheckout = async (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setStatus('Add at least one car before checkout.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const response = await api.post('/checkout', {
        customer: form,
        items: items.map((item) => ({ productId: item._id, quantity: item.quantity }))
      });

      dispatch(clearCart());
      setStatus(`Order confirmed. Total charged: ${formatPkr(response.data.totalPkr)}`);
      setForm({ name: '', email: '', address: '' });
    } catch {
      setStatus('Checkout failed. Please verify your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Checkout</h2>
      <p>Total payable: <strong>{formatPkr(total)}</strong></p>
      {!user && (
        <p className="helper-text">
          Have an account? <Link to="/login">Sign in</Link> to save this order to your history.
        </p>
      )}
      <form onSubmit={submitCheckout} className="checkout-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <textarea
          placeholder="Address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Place order'}</button>
      </form>
      {status && <p className="status">{status}</p>}
    </section>
  );
}
