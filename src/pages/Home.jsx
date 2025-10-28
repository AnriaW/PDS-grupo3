import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import CriarApostila from "../components/NewApostilaButton";
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userName, setUserName] = useState('Usuário');
  const [apostilasRecentes, setApostilasRecentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setUserName(JSON.parse(savedUser).name);
    };

    fetchApostilasRecentes();
  }, []);

  const fetchApostilasRecentes = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("userData");
      const rawEmail = JSON.parse(userData)?.email;
      const email = rawEmail ? decodeURIComponent(rawEmail) : 'apostilabic@gmail.com';

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(3); // Limita às 3 apostilas mais recentes

      if (error) throw error;
      setApostilasRecentes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar apostilas recentes:', err);
      setApostilasRecentes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApostila = async (apostila) => {
    if (apostila.is_generating) return;

    try {
      const { data, error } = await supabase
        .from('files')
        .select('file')
        .eq('id', apostila.id)
        .single();

      if (error) throw error;

      navigate('/apostila', {
        state: { htmlText: data.file }
      });
    } catch (err) {
      console.error('Erro ao carregar apostila:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Saudação Simples */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {userName.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            O que vamos criar hoje?
          </p>
        </div>

        {/* Botão Principal - Criar Nova Apostila */}
        <CriarApostila></CriarApostila>

        {/* Apostilas Recentes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Suas Apostilas Recentes
          </h2>

          {loading ? (
            // Loading skeleton
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg animate-pulse">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {apostilasRecentes.map((apostila) => {
                const title = apostila.titulo || 'Capítulo';
                const disabled = !!apostila.is_generating;
                
                return (
                  <div
                    key={apostila.id}
                    className={`flex justify-between items-center p-4 border border-gray-200 rounded-lg transition ${
                      disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={() => !disabled && handleViewApostila(apostila)}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{title}</h3>
                      <p className="text-sm text-gray-500">
                        {disabled ? 'Gerando...' : 'Pronto para visualizar'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {new Date(apostila.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <div className={`text-sm font-medium mt-1 ${
                        disabled ? 'text-gray-500' : 'text-blue-600'
                      }`}>
                        {disabled ? 'Processando...' : 'Abrir →'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mensagem quando não há apostilas */}
          {!loading && apostilasRecentes.length === 0 && (
            <div className="text-center py-6">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p className="text-gray-500 mb-4">Nenhuma apostila encontrada</p>
            </div>
          )}

          {/* Link para ver todas */}
          {apostilasRecentes.length > 0 && (
            <div className="text-center mt-6">
              <Link
                to="/library"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas as apostilas
              </Link>
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            to="/library"
            className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:bg-gray-50 transition"
          >
            <div className="text-2xl mb-2">📚</div>
            <span className="font-medium text-gray-700">Biblioteca</span>
          </Link>

          <Link
            to="/guide"
            className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:bg-gray-50 transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <span className="font-medium text-gray-700">Guia</span>
          </Link>
        </div>

        {/* Mensagem Motivacional */}
        <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <strong>💡 Dica:</strong> Comece com um tópico específico para melhores resultados!
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Home;