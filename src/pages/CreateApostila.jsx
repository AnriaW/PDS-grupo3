import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Header from '../components/Header';
import { apostilaAPI } from '../services/api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSuccessMessage) return;

    // Inicia a animação da barra de progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20; // 100% em 5 segundos (20% por segundo)
      });
    }, 1000);

    // Inicia o countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Pequeno delay para garantir que a barra esteja em 100%
          setTimeout(() => {
            navigate('/library');
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, [showSuccessMessage, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setCountdown(5);
    setProgress(0);

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
      setShowSuccessMessage(true);

      await apostilaAPI.createApostila(id);
      await fetch('https://primary-production-6beb.up.railway.app/webhook/criar-apostila', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

    } catch (error) {
      console.error('Erro ao criar apostila:', error);
      setShowSuccessMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Pop-up de sucesso */}
        {showSuccessMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-auto transform transition-all">
              <div className="text-center">
                {/* Ícone */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-2 border-blue-100">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>

                {/* Texto principal */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Processo Iniciado!
                </h3>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-600">
                    <span className="font-semibold">Sua apostila está sendo criada</span> pela nossa IA
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ⏳ <span className="font-medium">Tempo estimado:</span> 3 minutos
                    </p>
                  </div>
                </div>

                {/* Barra de progresso do redirecionamento */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Redirecionando em:</span>
                    <span className="font-medium">
                      {countdown > 0 ? `${countdown} segundos` : 'Agora!'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <div className={`${showSuccessMessage ? 'blur-sm' : ''} transition-all duration-300`}>
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
                Componente Curricular *
              </label>
              <select
                id="componente"
                name="componente"
                value={formData.componente}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione um componente...</option>
                
                {/* Linguagens */}
                <optgroup label="Linguagens">
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Arte">Arte</option>
                  <option value="Educação Física">Educação Física</option>
                  <option value="Língua Inglesa">Língua Inglesa</option>
                  <option value="Língua Espanhola">Língua Espanhola</option>
                </optgroup>

                {/* Matemática */}
                <optgroup label="Matemática">
                  <option value="Matemática">Matemática</option>
                </optgroup>

                {/* Ciências da Natureza */}
                <optgroup label="Ciências da Natureza">
                  <option value="Ciências">Ciências</option>
                  <option value="Biologia">Biologia</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                </optgroup>

                {/* Ciências Humanas */}
                <optgroup label="Ciências Humanas">
                  <option value="História">História</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Filosofia">Filosofia</option>
                  <option value="Sociologia">Sociologia</option>
                </optgroup>

                {/* Ensino Religioso */}
                <optgroup label="Ensino Religioso">
                  <option value="Ensino Religioso">Ensino Religioso</option>
                </optgroup>

                {/* Itinerários Formativos (Ensino Médio) */}
                <optgroup label="Itinerários Formativos">
                  <option value="Projeto de Vida">Projeto de Vida</option>
                  <option value="Educação Financeira">Educação Financeira</option>
                  <option value="Empreendedorismo">Empreendedorismo</option>
                  <option value="Tecnologias Digitais">Tecnologias Digitais</option>
                </optgroup>
              </select>
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
                <option value="6o ano do fundamental">6º ano do ensino fundamental</option>
                <option value="7o ano do fundamental">7º ano do ensino fundamental</option>
                <option value="8o ano do fundamental">8º ano do ensino fundamental</option>
                <option value="9o ano do fundamental">9º ano do ensino fundamental</option>
                <option value="1o ano do medio">1º ano do ensino médio</option>
                <option value="2o ano do medio">2º ano do ensino médio</option>
                <option value="3o ano do medio">3º ano do ensino médio</option>
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
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Gerando...' : 'Gerar Apostila'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}