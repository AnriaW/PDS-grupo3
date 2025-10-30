import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { supabase } from '../supabase';

const RecoverAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailSent, setEmailSent] = useState(false);

  const handleRecoveryRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Email de recuperação enviado! Verifique sua caixa de entrada e spam.' 
      });
      setEmailSent(true);
      
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      
      let errorMessage = 'Erro ao enviar email. Tente novamente.';
      if (error.message.includes('Email not found')) {
        errorMessage = 'Email não encontrado. Verifique o endereço digitado.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
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
            to="/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o Login
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2">
            {emailSent 
              ? 'Verifique seu email para continuar' 
              : 'Digite seu email para recuperar o acesso'
            }
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          
          {/* Mensagens */}
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          {!emailSent ? (
            // Formulário de solicitação
            <form onSubmit={handleRecoveryRequest} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email da conta
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enviaremos um link para redefinir sua senha
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>
          ) : (
            // Mensagem de sucesso após envio
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Enviado!</h3>
              <p className="text-gray-600 mb-4">
                Enviamos um link de recuperação para <strong>{email}</strong>
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setMessage({ type: '', text: '' });
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition font-medium"
                >
                  Enviar para outro email
                </button>
                
                <button
                  onClick={handleRecoveryRequest}
                  className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Reenviar email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informações de Ajuda */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">💡 Dicas importantes:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Verifique sua pasta de spam se não encontrar o email</li>
            <li>• O link de recuperação expira em 1 hora</li>
            <li>• Clique no link recebido para redefinir sua senha</li>
            <li>• Entre em contato conosco se continuar com problemas</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecoverAccount;