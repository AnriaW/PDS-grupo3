import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { supabase } from '../supabase';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpa mensagens quando o usuário começa a digitar
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Todos os campos são obrigatórios' });
      return false;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres' });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'A nova senha deve ser diferente da atual' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      // Atualiza a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Senha alterada com sucesso!' 
      });

      // Limpa o formulário
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      let errorMessage = 'Erro ao alterar senha. Tente novamente.';
      
      if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.message.includes('Auth session missing')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o Perfil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Alterar Senha</h1>
          <p className="text-gray-600 mt-2">Atualize sua senha de acesso</p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensagens */}
            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'error' 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Senha Atual */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Digite sua senha atual"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>

            {/* Nova Senha */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Digite a nova senha (mín. 6 caracteres)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme a nova senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>

            {/* Botões */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Alterando...
                  </span>
                ) : (
                  'Alterar Senha'
                )}
              </button>
              
              <Link
                to="/profile"
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition font-medium text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Informações de Segurança */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">💡 Dicas de Segurança</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use uma senha com pelo menos 8 caracteres</li>
            <li>• Combine letras, números e símbolos</li>
            <li>• Não use senhas que você usa em outros sites</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChangePassword;