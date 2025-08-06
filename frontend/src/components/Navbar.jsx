import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-40 w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg rounded-b-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">🎉 Event Dashboard</span>
      </div>
      <button onClick={handleLogout} className="bg-red-500 px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition-all">Logout</button>
    </nav>
  );
};

export default Navbar;