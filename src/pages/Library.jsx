import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';

const Library = () => {


  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApostila, setSelectedApostila] = useState(null);

  // Dados de exemplo - apostilas como conteúdo único
  const apostilas = [
    {
      id: 1,
      title: 'Conjuntos Numéricos',
      author: 'Tú',
      date: '2024-01-15',
      nivel: 'Intermediário',
      descricao: 'Estudo completo sobre conjuntos numéricos incluindo naturais, inteiros, racionais e irracionais.'
    },
    {
      id: 2,
      title: 'Álgebra Básica',
      author: 'Tai',
      date: '2024-01-10', 
      nivel: 'Iniciante',
      descricao: 'Introdução à álgebra com exercícios práticos e exemplos do cotidiano.'
    },
    {
      id: 3,
      title: 'Geometria Plana',
      author: 'Você',
      date: '2024-01-05',
      nivel: 'Avançado',
      descricao: 'Conceitos fundamentais de geometria plana com aplicações práticas.'
    }
  ];

  const filteredApostilas = apostilas.filter(apostila =>
    apostila.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apostila.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apostila.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedApostilas = [...filteredApostilas].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const handleViewApostila = (apostila) => {
    setSelectedApostila(apostila);
  };

  const handleBackToList = () => {
    setSelectedApostila(null);
  };

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
          {sortedApostilas.map((apostila) => (
            <div key={apostila.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => handleViewApostila(apostila)}>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{apostila.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Autor:</span>
                  <span className="font-medium">{apostila.author}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="font-medium">{new Date(apostila.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nível:</span>
                  <span className="font-medium">{apostila.nivel}</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{apostila.descricao}</p>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition">
                {/*<Link to={`/apostila/${apostila.id}`}>*/}
                <Link to = '/capitulo.html'>
                Ver Apostila Completa
                </Link>
              </button>
            </div>
          ))}
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