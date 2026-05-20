import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { formatPkr } from '../utils/format.js';

export function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [pendingDelete, setPendingDelete] = useState('');

  const loadCars = () => {
    setLoading(true);
    setStatus('');
    api
      .get('/products')
      .then((response) => setCars(response.data.items))
      .catch((error) => setStatus(error.response?.data?.message || 'Unable to load cars.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, []);

  const removeCar = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setPendingDelete('');
      loadCars();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete car.');
    }
  };

  if (loading) return <p className="status">Loading catalog...</p>;

  return (
    <section>
      <div className="section-header">
        <h2>Admin catalog</h2>
        <Link to="/admin/cars/new" className="primary-link">Add car</Link>
      </div>
      {status && <p className="status error">{status}</p>}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>
                  <strong>{car.name}</strong>
                  <div className="muted">{car.company} • {car.model}</div>
                </td>
                <td>{car.category}</td>
                <td>{formatPkr(car.pricePkr)}</td>
                <td>{car.stock}</td>
                <td className="row-actions">
                  {pendingDelete === car._id ? (
                    <>
                      <button type="button" className="link-button" onClick={() => removeCar(car._id)}>Confirm</button>
                      <button type="button" className="link-button" onClick={() => setPendingDelete('')}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <Link to={`/admin/cars/${car._id}`} className="primary-link">Edit</Link>
                      <button type="button" className="link-button" onClick={() => setPendingDelete(car._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
