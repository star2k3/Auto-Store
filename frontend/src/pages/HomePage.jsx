import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { buildCompanyList } from '../utils/filterProducts.js';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const params = {};
    if (search.trim()) params.search = search.trim();
    if (company !== 'All') params.company = company;

    api
      .get('/products', { params })
      .then((response) => {
        if (active) setProducts(response.data.items);
      })
      .catch(() => {
        if (active) setError('Unable to load car catalog right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, company]);

  const companies = useMemo(() => buildCompanyList(products), [products]);

  return (
    <section>
      <div className="hero">
        <h1>3D Car E-Commerce Store</h1>
        <p>Browse 100 premium vehicles from 10 companies with real PKR pricing and detailed specs.</p>
      </div>

      <div className="filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by company or model"
          aria-label="Search cars"
        />
        <select value={company} onChange={(event) => setCompany(event.target.value)} aria-label="Filter by company">
          {companies.map((entry) => (
            <option key={entry} value={entry}>{entry}</option>
          ))}
        </select>
      </div>

      {loading && <p className="status">Loading cars...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && (
        <div className="products-grid">
          {products.map((car) => (
            <ProductCard car={car} key={car._id} />
          ))}
        </div>
      )}
    </section>
  );
}
