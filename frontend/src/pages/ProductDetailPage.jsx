import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import { addToCart } from '../features/cart/cartSlice.js';
import { formatPkr } from '../utils/format.js';

export function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api
      .get(`/products/${id}`)
      .then((response) => {
        if (active) setCar(response.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p className="status">Loading details...</p>;
  if (!car) return <p className="status error">Car not found.</p>;

  return (
    <section className="detail-card">
      <img src={car.imageUrl} alt={car.name} />
      <div>
        <h2>{car.name}</h2>
        <p>{car.summary}</p>
        <p><strong>Price:</strong> {formatPkr(car.pricePkr)}</p>
        <p><strong>Specs:</strong> {car.horsepower} HP • {car.topSpeedKph} km/h • {car.transmission} • {car.fuelType}</p>
        <p><strong>Year:</strong> {car.year} | <strong>Stock:</strong> {car.stock}</p>
        <p><strong>Colors:</strong> {car.colors.join(', ')}</p>
        <button type="button" onClick={() => dispatch(addToCart(car))}>Add to cart</button>
      </div>
    </section>
  );
}
