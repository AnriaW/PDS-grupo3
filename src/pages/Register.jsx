import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

// TODO: sleep centralizado utilizando boas práticas
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [_registerErr, setRegisterErr] = useState('');
  const [_success, setSuccess] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterErr('');
    setIsLoading(true);

    await sleep(500);

    try {
      const response = await authAPI.register({
        name: name,
        email: email,
        password: password
      });

      localStorage.setItem('authToken', response.data.token);
      setSuccess(true);
      await sleep(3000);
      navigate('/home'); // Redireciona para a tela de login

    } catch (error) {
      console.error('Erro de registro: ', error)

      if (error.response?.data?.error) {
        setRegisterErr(error.response.data.error);
      } else if (error.response?.status === 400) {
        setRegisterErr('Este email já está cadastrado');
      } else {
        setRegisterErr('Registro falhou. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-stretch w-screen overflow-x-hidden">
      <header className="w-full border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-15 h-15" />
              <h1 className="text-2xl font-bold">Apostilab</h1>
            </a>
          </div>
          <nav className="space-x-4">
            <nav className="space-x-4">
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              {/* <Link to="/register" className="text-blue-600 hover:underline">
              Registrar-se
            </Link> */}
            </nav>
          </nav>
        </div>
      </header>
      <div className="sm:mx-auto sm:w-full sm:max-w-md pt-12">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar nova conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Faça login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {(_registerErr != '') && (
          <div
            id="error-message"
            className="max-w-md mx-auto my-6 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm animate-fade-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M5.07 19h13.86c.9 0 1.63-.73 1.63-1.63V6.63C20.56 5.73 19.83 5 18.93 5H5.07C4.17 5 3.44 5.73 3.44 6.63v10.74C3.44 18.27 4.17 19 5.07 19z"
              />
            </svg>
            <span>{_registerErr}</span>
          </div>
        )}
        {_success && (
          <div
            id="register-confirmation"
            className="max-w-md mx-auto my-6 flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm animate-fade-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Parabéns! Sua conta foi criada com sucesso! Redirecionando para a página de login...
            </span>
          </div>
        )}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {_isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
