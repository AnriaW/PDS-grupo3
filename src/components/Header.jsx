import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState();
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log('Usuário deslogado');
    navigate('/');
  };

  // Buscar dados do usuário do localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsUserLoggedIn(true);
      } else {
        navigate('/');
      }
    };

    // Carregar dados inicialmente
    loadUserData();

    // Ouvir evento de atualização do Profile
    window.addEventListener('userDataUpdated', loadUserData);

    return () => {
      window.removeEventListener('userDataUpdated', loadUserData);
    };
  }, []);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };


  const handleProfileClick = () => {
    navigate('/profile');
    setUserMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/home');
    setUserMenuOpen(false);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed w-full border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">

        {/* Logo e Nome do App - Lado Esquerdo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Apostilab</h1>
          </Link>
        </div>

        
        {/* Menu de Navegação - Centro */}
        {isUserLoggedIn ? (
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/create-new"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Nova Apostila
            </Link>
            <Link
              to="/library"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Biblioteca
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Registrar-se
            </Link>
          </nav>
        )}

        {/* Menu do Usuário - Lado Direito */}
        {isUserLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Nomes à DIREITA da foto */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Olá, {user.name.split(' ')[0]}</p>
              </div>

              {/* Foto do usuário */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold border-2 border-blue-200">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Foto do usuário"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>

              {/* Ícone de dropdown */}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">

                {/* Informações do usuário no dropdown */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Link para dashboard/área do usuário */}
                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Início
                </button>
                {/* Link para perfil */}
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Meu Perfil
                </button>

                {/* Divisor */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Botão Sair */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : null}
          
      </div>

      {/* Menu Mobile */}
      <div className="md:hidden border-t border-gray-200 px-6 py-2">
        {isUserLoggedIn ? (
          <nav className="flex justify-around">
            <Link to="/create-new" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Criar
            </Link>
            <Link to="/library" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Biblioteca
            </Link>
          </nav>
          ) : (
          <nav className="flex justify-around">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Registrar-se
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
