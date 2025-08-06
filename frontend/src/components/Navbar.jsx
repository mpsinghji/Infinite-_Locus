import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.clear();
    // Try to use react-router-dom navigation, fallback to window.location
    try {
      window.location.href = '/login';
    } catch {
      // fallback
      window.location = '/login';
    }
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-blue-700 text-white mb-4">
      <div className="font-bold text-xl">Event Dashboard</div>
      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
    </nav>
  );
};

export default Navbar;