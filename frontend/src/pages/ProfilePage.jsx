import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api.js';
import { updateProfile } from '../features/auth/authSlice.js';

export function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: ''
  });
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: user.name,
      email: user.email,
      address: user.address || ''
    }));
  }, [user]);

  const submitProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    setIsSuccess(false);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address
      };

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const response = await api.put('/users/me', payload);
      dispatch(updateProfile(response.data));
      setStatus('Profile updated successfully.');
      setIsSuccess(true);
      setForm((current) => ({ ...current, currentPassword: '', newPassword: '' }));
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update profile.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Account settings</h2>
      <form onSubmit={submitProfile} className="form-grid">
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
        <textarea
          placeholder="Delivery address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Current password (required to change password)"
          value={form.currentPassword}
          onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
        />
        <input
          type="password"
          placeholder="New password"
          value={form.newPassword}
          onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
        />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</button>
      </form>
      {status && <p className={`status ${isSuccess ? '' : 'error'}`}>{status}</p>}
    </section>
  );
}
