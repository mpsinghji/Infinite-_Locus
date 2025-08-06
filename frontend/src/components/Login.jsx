import React, { useState } from 'react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        // Optionally fetch user role here or decode from token if available
        window.location.href = '/'; // Redirect to dashboard
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Login error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="block w-full mb-2 p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="block w-full mb-2 p-2 border rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => window.location.href = '/signup'}>Register</button>
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </form>
  );
};

export default Login;