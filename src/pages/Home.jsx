import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import CriarApostila from "../components/NewApostilaButton"

const Dashboard = () => {
  const [userName, setUserName] = React.useState('Usuário');

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setUserName(JSON.parse(savedUser).name);
    };
  }, []);

  const apostilasRecentes = [
    {
      id: 1,
      title: 'Conjuntos Numéricos',
      materia: 'Matemática',
      data: '15/01/2024'
    },
    {
      id: 2,
      title: 'Fotossíntese',
      materia: 'Biologia',
      data: '14/01/2024'
    },
    {
      id: 3,
      title: 'Revolução Industrial',
      materia: 'História',
      data: '10/01/2024'
    }
  ];

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

          <div className="space-y-3">
            {apostilasRecentes.map((apostila) => (
              <Link
                key={apostila.id}
                to={`/apostila/${apostila.id}`}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{apostila.title}</h3>
                  <p className="text-sm text-gray-500">{apostila.materia}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{apostila.data}</span>
                  <div className="text-blue-600 text-sm font-medium mt-1">
                    Abrir →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Link para ver todas */}
          <div className="text-center mt-6">
            <Link
              to="/library"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas as apostilas
            </Link>
          </div>
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

export default Dashboard;
