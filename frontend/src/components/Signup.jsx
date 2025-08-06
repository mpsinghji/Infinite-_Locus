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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="block w-full mb-2 p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="block w-full mb-2 p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="block w-full mb-2 p-2 border rounded" />
      {/* <div className="mb-2">
        <label className="mr-2">Role:</label> */}
        {/* <select name="role" value={form.role} onChange={handleChange} className="p-1 border rounded">
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
        </select> */}
      {/* </div> */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => window.location.href = '/login'}>Sign Up</button>
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </form>
  );
};

export default Signup;
