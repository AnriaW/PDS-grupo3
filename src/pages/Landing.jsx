import React from "react";
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-stretch w-screen overflow-x-hidden">
      {/* Cabeçalho - agora com container interno para limitar o conteúdo */}
      <header className="w-full border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">MeuApp</h1>
          </div>
          <nav className="space-x-4">
            <nav className="space-x-4">
              <Link to="#sobre" className="text-blue-600 hover:underline">
                Sobre
              </Link>
              <Link to="#recursos" className="text-blue-600 hover:underline">
                Recursos
              </Link>
              <Link to="#contato" className="text-blue-600 hover:underline">
                Contato
              </Link>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Registrar
              </Link>
            </nav>
          </nav>
        </div>
      </header>

      {/* Hero Section - conteúdo centralizado mas com fundo de largura total */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4">
            Crie <span className="text-blue-600">Apostilas</span> incríveis com
            Inteligência Artificial
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Transforme suas ideias em conteúdo profissional em poucos segundos,
            sem precisar de conhecimento técnico.
          </p>
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-500 transition">
            <Link to="/register">
              Começar agora
            </Link>
          </button>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
            <div className="bg-gray-200 h-64 w-full flex items-center justify-center rounded-lg">
              <span className="text-gray-500">[Imagem para chamar a atenção]</span>
            </div>
          </div>
        </div>
      </main>

      <main className="flex-1 w-full">
        {/* Seção de Estatística */}
        <section className="bg-blue-50 py-12 w-full">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-600 mb-2">Já somos</p>
            <p className="text-5xl font-bold text-blue-600 mb-2">123.456.789</p>
            <p className="text-gray-600">criadores</p>
          </div>
        </section>

        {/* Seção Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Sua apostila de estudos incríveis em <span className="text-blue-600">3,2,1</span>
          </h2>

          {/* Passos */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Escolha um tipo de conteúdo e questões</h3>
              <p className="text-gray-600">Insira o assunto da sua apostila</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Confie em nossa IA</h3>
              <p className="text-gray-600">Nossa IA faz o resto</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Transforme qualquer ideia</h3>
              <p className="text-gray-600">Instantâneamente</p>
            </div>
          </div>
        </section>

        {/* Seção de Chamada para Ação */}
        <section className="bg-gray-50 py-16 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Você só precisa saber o nome do conteúdo e nada mais
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Criar sua apostila é muito fácil: insira o conteúdo e a IA faz o resto pra você.
              </p>
            </div>
          </div>
        </section>
      </main>


      {/* Rodapé */}
      <footer className="w-full border-t border-gray-300 py-6 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} MeuApp — Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}