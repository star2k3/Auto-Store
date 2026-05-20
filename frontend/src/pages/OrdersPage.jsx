import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { formatPkr } from '../utils/format.js';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setStatus('');

    api
      .get('/orders')
      .then((response) => {
        if (active) setOrders(response.data.items);
      })
      .catch((error) => {
        if (active) setStatus(error.response?.data?.message || 'Unable to load orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="status">Loading orders...</p>;
  if (status) return <p className="status error">{status}</p>;
  if (orders.length === 0) {
    return (
      <section className="status">
        <p>No orders yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Your orders</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <article key={order._id || order.orderId} className="order-card">
            <h3>Order #{order._id || order.orderId}</h3>
            <p>Total: <strong>{formatPkr(order.totalPkr)}</strong></p>
            <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <ul>
              {order.items.map((item) => (
                <li key={`${order._id || order.orderId}-${String(item.carId)}`}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
