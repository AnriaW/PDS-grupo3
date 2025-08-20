import React from 'react';
import { Link } from 'react-router-dom'; 

const Header = () => {
  return (
    <header className="w-full border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
        {/* Logo e Nome do App */}
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">MeuApp</h1>
          </Link>
        </div>

        {/* Menu de Navegação */}
        <nav className="space-x-4">
          <Link 
            to="/create-new" 
            className="text-blue-600 hover:underline transition-colors duration-200"
          >
            Nova Apostila
          </Link>
          <Link 
            to="/biblioteca" 
            className="text-blue-600 hover:underline transition-colors duration-200"
          >
            Biblioteca
          </Link>
          <Link 
            to="/" 
            className="text-blue-600 hover:underline transition-colors duration-200"
          >
            Log out
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;