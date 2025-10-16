import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { getCookie } from '../hooks/cookies';

const Library = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [apostilasDb, setApostilasDb] = useState([]);

  useEffect(() => {
    const fetchApostilas = async () => {
      setLoading(true);
      try {
        const rawEmail = getCookie('user_email');
        const email = rawEmail ? decodeURIComponent(rawEmail) : 'apostilabic@gmail.com';
        console.log(email);

        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log(data);
        setApostilasDb(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar apostilas:', err);
        setApostilasDb([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApostilas();
  }, []);

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

  const filteredApostilas = apostilasDb.filter(apostila => {
    const title = (apostila.file?.title || '').toLowerCase();
    const desc = (apostila.file?.descricao || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || desc.includes(term);
  });

  const sortedApostilas = [...filteredApostilas].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      const at = (a.file?.title || '').toString();
      const bt = (b.file?.title || '').toString();
      return at.localeCompare(bt);
    }
  });

  // View principal da biblioteca
  return (
    <div className="min-h-screen bg-white">
        <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Biblioteca</h1>
          <p className="text-gray-600">Gerencie e acesse todas as suas apostilas criadas</p>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Campo de pesquisa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar apostilas
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título, autor ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Mais Recente</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de apostilas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading && (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-5 w-2/3 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="h-4 w-16 bg-gray-200 rounded"></span>
                    <span className="h-4 w-24 bg-gray-200 rounded"></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="h-4 w-16 bg-gray-200 rounded"></span>
                    <span className="h-4 w-20 bg-gray-200 rounded"></span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-11/12 bg-gray-200 rounded"></div>
                  <div className="h-3 w-10/12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-9 w-full bg-gray-200 rounded"></div>
              </div>
            ))
          )}
          {!loading && sortedApostilas.map((apostila) => {
            const title = apostila.titulo || 'Capítulo';
            const descricao = apostila.file?.descricao || '';
            const disabled = !!apostila.is_generating;
            return (
              <div key={apostila.id} className={`bg-white rounded-lg border border-gray-200 p-6 transition-shadow ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">{new Date(apostila.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${disabled ? 'text-yellow-600' : 'text-green-700'}`}>{disabled ? 'Gerando...' : 'Pronto'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{descricao}</p>
                <button 
                  className={`w-full rounded py-2 px-4 transition ${disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`} 
                  disabled={disabled}
                  onClick={() => handleViewApostila(apostila)}
                >
                  Ver Apostila Completa
                </button>
              </div>
            );
          })}
        </div>

        {/* Mensagem se não houver apostilas */}
        {sortedApostilas.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma apostila encontrada</h3>
              <p className="text-gray-600">Crie sua primeira apostila para começar</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;