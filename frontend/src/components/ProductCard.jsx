import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import { formatPkr } from '../utils/format.js';

export function ProductCard({ car }) {
  const dispatch = useDispatch();

  return (
    <article className="product-card">
      <img src={car.imageUrl} alt={car.name} loading="lazy" />
      <div className="card-body">
        <h3>{car.name}</h3>
        <p>{car.summary}</p>
        <strong>{formatPkr(car.pricePkr)}</strong>
        <div className="card-actions">
          <button type="button" onClick={() => dispatch(addToCart(car))}>Add to cart</button>
          <Link to={`/cars/${car._id}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}
