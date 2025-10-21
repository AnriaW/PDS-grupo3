import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from '../components/Header';

export default function Landing() {
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setIsUserLoggedIn(true);
    };
  }, []);

  const header = isUserLoggedIn ? <Header /> : (
    < header className="w-full border-b border-gray-300" >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-15 h-15" />
          <h1 className="text-2xl font-bold">Apostilab</h1>
        </div>
        <nav className="space-x-4">
          <nav className="space-x-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrar-se
            </Link>
          </nav>
        </nav>
      </div>
    </header >
  );

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-stretch w-screen overflow-x-hidden">
      {/* Cabeçalho - agora com container interno para limitar o conteúdo */}

      {header}

      {/* Hero Section - conteúdo centralizado mas com fundo de largura total */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4">
            Ganhe tempo com <span className="text-blue-600">Apostilas</span> de
            Inteligência Artificial
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Gere automaticamente material de apoio didático,
            em conformidade com a <a className="text-blue-600 underline"
              href="https://basenacionalcomum.mec.gov.br/abase">
              BNCC</a>,
            em instantes.
          </p>
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-500 transition">
            <Link to="/register">
              Comece agora
            </Link>
          </button>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner1.png" alt="banner1" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner2.png" alt="banner2" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner3.png" alt="banner3" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner4.png" alt="banner4" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner5.png" alt="banner5" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <img src="/banner6.png" alt="banner6" className="h-64 w-full object-cover rounded-lg" />
          </div>

        </div>
      </main>

      <main className="flex-1 w-full">
        {/* Seção de Estatística */}
        <section className="bg-blue-50 py-6 w-full">
        </section>

        {/* Seção Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">
            A apostila que seus alunos merecem, em <span className="text-blue-600">três</span> simples passos
          </h2>

          {/* Passos */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Escolha a disciplina e o conteúdo</h3>
              <p className="text-gray-600">Insira o tópico de estudos da apostila</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Espere alguns minutos</h3>
              <p className="text-gray-600">Nossa IA gera uma apostila com exercícios</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Avalie o material gerado</h3>
              <p className="text-gray-600">Leia, edite, distribua, imprima</p>
            </div>
          </div>
        </section>

        {/* Seção de Chamada para Ação */}
        <section className="bg-gray-50 py-16 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Você só precisa escolher o conteúdo e nada mais
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Criar sua apostila é muito fácil: insira o conteúdo e a IA faz o resto para você.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
