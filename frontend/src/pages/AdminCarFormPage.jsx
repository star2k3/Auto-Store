import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const defaultForm = {
  productCode: '',
  company: '',
  model: '',
  name: '',
  category: 'Sedan',
  pricePkr: '',
  year: '',
  stock: '',
  imageUrl: '',
  summary: '',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  horsepower: '',
  topSpeedKph: '',
  colors: ''
};

export function AdminCarFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((response) => {
        if (!active) return;
        const car = response.data;
        setForm({
          productCode: car.productCode,
          company: car.company,
          model: car.model,
          name: car.name,
          category: car.category,
          pricePkr: car.pricePkr,
          year: car.year,
          stock: car.stock,
          imageUrl: car.imageUrl,
          summary: car.summary,
          fuelType: car.fuelType,
          transmission: car.transmission,
          horsepower: car.horsepower,
          topSpeedKph: car.topSpeedKph,
          colors: car.colors.join(', ')
        });
      })
      .catch((error) => {
        if (active) setStatus(error.response?.data?.message || 'Unable to load car.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    const payload = {
      ...form,
      name: form.name || `${form.company} ${form.model}`,
      colors: form.colors.split(',').map((color) => color.trim()).filter(Boolean)
    };

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin/cars');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save car.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditing) return <p className="status">Loading car details...</p>;

  return (
    <section className="panel panel--wide">
      <h2>{isEditing ? 'Edit car' : 'Add a new car'}</h2>
      <form onSubmit={submitForm} className="form-grid form-grid--wide">
        <input
          placeholder="Product code"
          value={form.productCode}
          onChange={(event) => setForm((current) => ({ ...current, productCode: event.target.value }))}
          required
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
          required
        />
        <input
          placeholder="Model"
          value={form.model}
          onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
          required
        />
        <input
          placeholder="Display name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          required
        />
        <input
          placeholder="Price (PKR)"
          type="number"
          min="1"
          value={form.pricePkr}
          onChange={(event) => setForm((current) => ({ ...current, pricePkr: event.target.value }))}
          required
        />
        <input
          placeholder="Year"
          type="number"
          min="1990"
          value={form.year}
          onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
          required
        />
        <input
          placeholder="Stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
          required
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
          required
        />
        <textarea
          placeholder="Summary"
          value={form.summary}
          onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
          required
        />
        <input
          placeholder="Fuel type"
          value={form.fuelType}
          onChange={(event) => setForm((current) => ({ ...current, fuelType: event.target.value }))}
          required
        />
        <input
          placeholder="Transmission"
          value={form.transmission}
          onChange={(event) => setForm((current) => ({ ...current, transmission: event.target.value }))}
          required
        />
        <input
          placeholder="Horsepower"
          type="number"
          min="1"
          value={form.horsepower}
          onChange={(event) => setForm((current) => ({ ...current, horsepower: event.target.value }))}
          required
        />
        <input
          placeholder="Top speed (kph)"
          type="number"
          min="1"
          value={form.topSpeedKph}
          onChange={(event) => setForm((current) => ({ ...current, topSpeedKph: event.target.value }))}
          required
        />
        <input
          placeholder="Colors (comma-separated)"
          value={form.colors}
          onChange={(event) => setForm((current) => ({ ...current, colors: event.target.value }))}
          required
        />
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save car'}</button>
      </form>
      {status && <p className="status error">{status}</p>}
    </section>
  );
}
