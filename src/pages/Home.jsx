import React from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-stretch w-screen overflow-x-hidden">
      <Header />
      
{/* Hero Section - conteúdo centralizado mas com fundo de largura total */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4">
            Crie <span className="text-blue-600">Apostilas</span> incríveis com
            Inteligência Artificial
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Transforme suas ideias em auxílio educacional em poucos segundos,
            em conformidade com a <a className="text-blue-600 underline"
              href="https://portal.mec.gov.br/conselho-nacional-de-educacao/base-nacional-comum-curricular-bncc">
              BNCC</a>,
            sem precisar de conhecimento prévio.
          </p>
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-500 transition">
            <Link to="/create-new">
              Começar agora
            </Link>
          </button>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
                      {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
              <img src="/banner4.png" alt="banner1" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
              <img src="/banner3.png" alt="banner2" className="h-64 w-full object-cover rounded-lg" />
          </div>

          {/* Imagem/Vídeo com largura total */}
          <div className="mt-10 w-full">
              <img src="/banner2.png" alt="banner3" className="h-64 w-full object-cover rounded-lg" />
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
            Sua apostila de estudos incríveis em <span className="text-blue-600">3, 2, 1</span>
          </h2>

          {/* Passos */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Escolha um tipo de conteúdo e questões</h3>
              <p className="text-gray-600">Insira o tópico de estudos da apostila</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Confie em nossa IA</h3>
              <p className="text-gray-600">Nossa IA gera uma apostila com exercícios</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Eduque-se em qualquer tópico</h3>
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