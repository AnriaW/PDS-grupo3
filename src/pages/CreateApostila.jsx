import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Header from '../components/Header';


export default function CreateApostila() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topico: '',
    componente: '',
    ano: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = localStorage.getItem("userData");
    const id = uuid();

    const payload = {
      id,
      email: JSON.parse(userData)?.email || 'apostilabic@gmail.com',
      topico: String(formData.topico || '').trim(),
      componente: String(formData.componente || '').trim(),
      ano: String(formData.ano || '').trim(),
      dificuldade: Number(formData.dificuldade),
      guiados: Number(formData.exerciciosGuiados),
      exercicios: Number(formData.exercicios)
    };

    try {
      localStorage.setItem('lastGeneratedId', id);

      await fetch('https://primary-production-6beb.up.railway.app/webhook/criar-apostila', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Erro ao criar apostila:', error);
    } finally {
      navigate('/loading');
    }
  };

  return (

    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crie um capítulo de apostila digital</h1>
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
              placeholder="Ex: Logaritmo"
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
              placeholder="Ex: Matemática"
              value={formData.componente}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Campo Ano */}
          <div className="mb-6">
            <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
              Ano *
            </label>
            <select
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an option ...</option>
              <option value="1">6º ano do ensino fundamental</option>
              <option value="2">7º ano do ensino fundamental</option>
              <option value="3">8º ano do ensino fundamental</option>
              <option value="4">9º ano do ensino fundamental</option>
              <option value="5">1º ano do ensino médio</option>
              <option value="6">2º ano do ensino médio</option>
              <option value="7">3º ano do ensino médio</option>
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
              <option value="0">Trivial</option>
              <option value="1">Fácil</option>
              <option value="2">Médio</option>
              <option value="3">Difícil</option>
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
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Gerar Apostila
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
