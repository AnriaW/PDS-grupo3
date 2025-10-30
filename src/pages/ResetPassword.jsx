import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { supabase } from '../supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sessionChecked, setSessionChecked] = useState(false);

  // Verificar se há uma sessão de recuperação ativa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setMessage({ 
            type: 'error', 
            text: 'Link inválido ou expirado. Solicite um novo link de recuperação.' 
          });
        }
        
        setSessionChecked(true);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setMessage({ 
          type: 'error', 
          text: 'Erro ao verificar sessão. Tente novamente.' 
        });
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validações
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      setIsLoading(false);
      return;
    }

    try {
      // Atualizar a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Senha redefinida com sucesso! Redirecionando para o login...' 
      });

      // Limpar a sessão de recuperação
      await supabase.auth.signOut();

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' 
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      
      let errorMessage = 'Erro ao redefinir senha. Tente novamente.';
      if (error.message.includes('Auth session missing')) {
        errorMessage = 'Sessão expirada. Solicite um novo link de recuperação.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-6 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nova Senha</h1>
          <p className="text-gray-600 mt-2">Crie uma nova senha para sua conta</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nova senha
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use pelo menos 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nova senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redefinindo...
                </span>
              ) : (
                'Redefinir Senha'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/recover-account')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Solicitar novo link
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;