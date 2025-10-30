import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { userAPI } from '../services/api';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);

    try {
      await userAPI.deleteAccount();
      
      // Limpar dados locais
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirecionar para home
      navigate('/');
      
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-6 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Excluir Conta</h1>
          <p className="text-gray-600 mt-2">Esta ação é permanente</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-4">Atenção!</h2>
          <p className="text-gray-600 mb-6">
            Sua conta e todos os dados serão excluídos permanentemente. 
            Esta ação não pode ser desfeita.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-500 transition font-medium disabled:opacity-50"
            >
              {isLoading ? 'Excluindo...' : 'Excluir Minha Conta'}
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeleteAccount;