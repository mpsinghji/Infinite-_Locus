import React, { useState } from 'react';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Signup successful! Please login.');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      setMessage('Signup error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Sign Up</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mb-2">Sign Up</button>
        <div className="text-center text-sm text-gray-600 mb-2">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></div>
        {message && <div className="mt-2 text-red-600 text-center">{message}</div>}
      </form>
    </div>
  );
};

export default Signup;
