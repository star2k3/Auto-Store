import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { setCredentials } from '../features/auth/authSlice.js';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await api.post('/auth/login', form);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Welcome back</h2>
      <form onSubmit={submitLogin} className="form-grid">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      {status && <p className="status error">{status}</p>}
      <p className="helper-text">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
