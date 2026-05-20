import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { setCredentials } from '../features/auth/authSlice.js';

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submitRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await api.post('/auth/register', form);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Create account</h2>
      <form onSubmit={submitRegister} className="form-grid">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required
        />
        <textarea
          placeholder="Delivery address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      {status && <p className="status error">{status}</p>}
      <p className="helper-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
