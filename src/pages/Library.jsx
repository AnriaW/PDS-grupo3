import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { apostilaAPI } from '../services/api';
import CriarApostila from '../components/NewApostilaButton';

const Library = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [apostilasDb, setApostilasDb] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchApostilas();
    
    // Limpa qualquer intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configura refresh automático a cada 5 segundos
    intervalRef.current = setInterval(() => {
      refreshGeneratingApostilas();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Monitora mudanças nas apostilas para ajustar o intervalo
  useEffect(() => {
    const hasGenerating = apostilasDb.some(a => a.is_generating);
    
    // Se não há apostilas gerando, pode aumentar o intervalo
    if (!hasGenerating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        refreshGeneratingApostilas();
      }, 30000); // 30 segundos quando não há apostilas gerando
    } else if (hasGenerating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        refreshGeneratingApostilas();
      }, 5000); // 5 segundos quando há apostilas gerando
    }
  }, [apostilasDb]);

  const fetchApostilas = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("userData");
      const rawEmail = JSON.parse(userData)?.email;
      const email = rawEmail ? decodeURIComponent(rawEmail) : 'apostilabic@gmail.com';

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApostilasDb(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar apostilas:', err);
      setApostilasDb([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshGeneratingApostilas = async () => {
    // Verifica se há apostilas em geração
    const generatingApostilas = apostilasDb.filter(apostila => apostila.is_generating);
    
    if (generatingApostilas.length > 0) {
      try {
        const userData = localStorage.getItem("userData");
        const rawEmail = JSON.parse(userData)?.email;
        const email = rawEmail ? decodeURIComponent(rawEmail) : 'apostilabic@gmail.com';

        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('email', email)
          .in('id', generatingApostilas.map(a => a.id));

        if (!error && data) {
          // Atualiza as apostilas que mudaram
          setApostilasDb(prevApostilas => {
            const updated = prevApostilas.map(apostila => {
              const updatedApostila = data.find(a => a.id === apostila.id);
              if (updatedApostila) {
                // Verifica se houve mudança real no status
                if (apostila.is_generating && !updatedApostila.is_generating) {
                  console.log(`Apostila "${updatedApostila.titulo}" está pronta!`);
                }
                return { ...apostila, ...updatedApostila };
              }
              return apostila;
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('Erro ao atualizar status das apostilas:', err);
      }
    } else {
      // Se não há apostilas gerando, faz uma verificação completa periodicamente
      // para capturar novas apostilas criadas
      try {
        const userData = localStorage.getItem("userData");
        const rawEmail = JSON.parse(userData)?.email;
        const email = rawEmail ? decodeURIComponent(rawEmail) : 'apostilabic@gmail.com';

        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Verifica se há novas apostilas
          const currentIds = apostilasDb.map(a => a.id);
          const newApostilas = data.filter(a => !currentIds.includes(a.id));
          
          if (newApostilas.length > 0 || data.length !== apostilasDb.length) {
            setApostilasDb(data);
            console.log('Biblioteca atualizada com novas apostilas');
          }
        }
      } catch (err) {
        console.error('Erro na verificação periódica:', err);
      }
    }
  };

  const toggleDropdown = (apostilaId) => {
    setOpenDropdown(openDropdown === apostilaId ? null : apostilaId);
  };

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleViewApostila = async (apostila) => {
    if (apostila.is_generating) return;
    setOpenDropdown(null);

    try {
      var { data, error } = await apostilaAPI.getEditedApostila(apostila.id);
      console.log(data.file.length);
      if (data.file.length === 0) {
        var { data, error } = await supabase
          .from('files')
          .select('file')
          .eq('id', apostila.id)
          .single();
        console.log('Fallback to Supabase file fetch');
      }

      if (error) throw error;
      navigate('/apostila', {
        state: { htmlText: data.file }
      });
    } catch (err) {
      console.error('Erro ao carregar apostila:', err);
    }
  };

  const handleEditApostila = async (apostila) => {
    if (apostila.is_generating) return;
    setOpenDropdown(null);

    try {
      var { data, error } = await apostilaAPI.getEditedApostila(apostila.id);

      if (data.file.length === 0) {
        var { data, error } = await supabase
          .from('files')
          .select('file')
          .eq('id', apostila.id)
          .single();
        console.log('Fallback to Supabase file fetch');
      }

      if (error) throw error;
      navigate('/edit', {
        state: { htmlText: data.file, id: apostila.id }
      });
    } catch (err) {
      console.error('Erro ao carregar apostila:', err);
    }
  }

  const handlePdfGeneration = async (apostila) => {
    if (apostila.is_generating) return;
    setOpenDropdown(null);
    setDownloadingPdf(apostila.id);

    try {
      // Simula o tempo de download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      var { data, error } = await apostilaAPI.getEditedApostila(apostila.id);
      console.log(data.file.length);
      if (data.file.length === 0) {
        var { data, error } = await supabase
          .from('files')
          .select('file')
          .eq('id', apostila.id)
          .single();
        console.log('Fallback to Supabase file fetch');
      }

      const response = await apostilaAPI.generatePdf(data.file);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      console.log(response.data.length);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${apostila.titulo || 'apostila'}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Erro ao gerar ou baixar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleDeleteApostila = async (apostila) => {
    if (apostila.is_generating) return;
    setOpenDropdown(null);

    if (!window.confirm(`Tem certeza que deseja excluir a apostila "${apostila.titulo || 'Sem título'}"?`)) {
      return;
    }

    try {
      // Adicionar a função para deletar no backend
      // await apostilaAPI.deleteApostila(apostila.id);
      
      // Por enquanto, vamos apenas remover do estado local
      setApostilasDb(apostilasDb.filter(a => a.id !== apostila.id));
      
      console.log('Apostila excluída:', apostila.id);
    } catch (err) {
      console.error('Erro ao excluir apostila:', err);
    }
  };

  const getApostilaStatus = (apostila) => {
    if (downloadingPdf === apostila.id) {
      return { text: 'Baixando...', color: 'text-blue-600' };
    }
    if (apostila.is_generating) {
      return { text: 'Gerando...', color: 'text-yellow-600' };
    }
    return { text: 'Pronto', color: 'text-green-700' };
  };

  const filteredApostilas = apostilasDb.filter(apostila => {
    const title = (apostila.titulo || apostila.file?.title || '').toLowerCase();
    const desc = (apostila.file?.descricao || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || desc.includes(term);
  });

  const sortedApostilas = [...filteredApostilas].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      const at = (a.titulo || a.file?.title || '').toString();
      const bt = (b.titulo || b.file?.title || '').toString();
      return at.localeCompare(bt);
    }
  });

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
            const disabled = !!apostila.is_generating || downloadingPdf === apostila.id;
            const status = getApostilaStatus(apostila);
            
            return (
              <div key={apostila.id} className={`bg-white rounded-lg border border-gray-200 p-6 transition-shadow ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}`}>
                {/* Cabeçalho com título e menu dropdown */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">{title}</h3>
                  
                  {/* Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(apostila.id);
                      }}
                      disabled={disabled}
                      className="p-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === apostila.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditApostila(apostila);
                            }}
                            disabled={disabled}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Editar
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePdfGeneration(apostila);
                            }}
                            disabled={disabled}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            Gerar PDF
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApostila(apostila);
                            }}
                            disabled={disabled}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações da apostila */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">{new Date(apostila.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{descricao}</p>
                
                {/* Botão principal - Ver Apostila Completa */}
                <button
                  className={`w-full rounded py-2 px-4 transition ${disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                  disabled={disabled}
                  onClick={() => handleViewApostila(apostila)}
                >
                  {disabled ? 'Aguarde...' : 'Ver Apostila Completa'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mensagem se não houver apostilas */}
        {!loading && sortedApostilas.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma apostila encontrada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira apostila para começar</p>
              <div className="my-6"><CriarApostila /></div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;