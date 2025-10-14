import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import Header from '../components/Header';
//import { Link } from 'react-router-dom';

export default function CreateApostila() {
  const [formData, setFormData] = useState({
    email: 'seunome@ic.ufal.br',
    topico: 'Logaritmo',
    componente: 'Matemática',
    serie: '',
    dificuldade: '',
    exerciciosGuiados: 0,
    exercicios: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    // Lógica para criar a apostila aqui
  };

  return (

    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/*<Header />*/}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste - crie um capítulo de apostila digital</h1>
          <p className="text-gray-600">Preencha os detalhes abaixo para gerar sua apostila personalizada</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">

          {/* Campo Tópico */}
          <div className="mb-6">
            <label htmlFor="topico" className="block text-sm font-medium text-gray-700 mb-1">
              Tópico *
            </label>
            <input
              type="text"
              id="topico"
              name="topico"
              value={formData.topico}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Campo Componente */}
          <div className="mb-6">
            <label htmlFor="componente" className="block text-sm font-medium text-gray-700 mb-1">
              Componente *
            </label>
            <input
              type="text"
              id="componente"
              name="componente"
              value={formData.componente}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Campo Série */}
          <div className="mb-6">
            <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-1">
              Série *
            </label>
            <select
              id="serie"
              name="serie"
              value={formData.serie}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an option ...</option>
              <option value="1">1ª Série</option>
              <option value="2">2ª Série</option>
              <option value="3">3ª Série</option>
              <option value="4">4ª Série</option>
            </select>
          </div>

          {/* Campo Dificuldade */}
          <div className="mb-6">
            <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 mb-1">
              Dificuldade *
            </label>
            <select
              id="dificuldade"
              name="dificuldade"
              value={formData.dificuldade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              <option value="0">0 (muito fácil)</option>
              <option value="1">1 (fácil)</option>
              <option value="2">2 (média)</option>
              <option value="3">3 (difícil)</option>
            </select>
          </div>

          {/* Campo Exercícios Guiados */}
          <div className="mb-6">
            <label htmlFor="exerciciosGuiados" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Exercícios Guiados *
              <span className="text-gray-500 text-xs ml-1">(número entre 0 e 10)</span>
            </label>
            <input
              type="number"
              id="exerciciosGuiados"
              name="exerciciosGuiados"
              min="0"
              max="10"
              value={formData.exerciciosGuiados}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Campo Exercícios */}
          <div className="mb-8">
            <label htmlFor="exercicios" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Exercícios *
              <span className="text-gray-500 text-xs ml-1">(número entre 0 e 10)</span>
            </label>
            <input
              type="number"
              id="exercicios"
              name="exercicios"
              min="0"
              max="10"
              value={formData.exercicios}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Botão de Submit */}
          <div className="text-center">
            <Link to ="/loading">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Gerar Apostila
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}