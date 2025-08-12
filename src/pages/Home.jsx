// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          SeuLogo
        </div>
        <nav className="space-x-6">
          <Link to="/" className="text-[#0000EE] hover:underline">Início</Link>
          <Link to="/explore" className="text-[#0000EE] hover:underline">Explorar</Link>
          <Link to="/planos" className="text-[#0000EE] hover:underline">Planos</Link>
          <Link to="/login" className="text-[#0000EE] hover:underline">Entrar</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-16">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Crie e-books completos com <span className="text-[#0000EE]">Inteligência Artificial</span>
          </h1>
          <p className="text-gray-300 mb-6">
            Transforme suas ideias em livros digitais incríveis com apenas alguns cliques.
          </p>
          <button className="bg-[#0000EE] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Experimente Gratuitamente
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          {/* Aqui você coloca sua imagem/vídeo */}
          <div className="w-[400px] h-[250px] bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Imagem/Vídeo</span>
          </div>
        </div>
      </section>

      {/* ETAPAS */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold mb-10">Seu e-book incrível em 3 passos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-[#0000EE] text-5xl font-bold mb-4">1</div>
              <p className="text-gray-300">Escolha um tipo de conteúdo</p>
            </div>
            <div>
              <div className="text-[#0000EE] text-5xl font-bold mb-4">2</div>
              <p className="text-gray-300">Insira o título do seu e-book</p>
            </div>
            <div>
              <div className="text-[#0000EE] text-5xl font-bold mb-4">3</div>
              <p className="text-gray-300">Pronto! Nossa IA faz o resto</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section className="py-16 max-w-7xl mx-auto px-8 space-y-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            {/* Imagem */}
            <div className="w-full h-[250px] bg-gray-800 rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Você só precisa do título</h3>
            <p className="text-gray-300 mb-4">Crie seu projeto de forma fácil e rápida, basta informar o título do e-book e a IA faz o resto.</p>
            <button className="bg-[#0000EE] text-white px-6 py-3 rounded-lg font-semibold">Gerar e-book</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4 text-white">Escolha a quantidade de capítulos</h3>
            <p className="text-gray-300 mb-4">Defina o número de capítulos desejados e veja a mágica acontecer.</p>
            <button className="bg-[#0000EE] text-white px-6 py-3 rounded-lg font-semibold">Gerar e-book</button>
          </div>
          <div className="order-1 md:order-2">
            {/* Imagem */}
            <div className="w-full h-[250px] bg-gray-800 rounded-lg"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            {/* Imagem */}
            <div className="w-full h-[250px] bg-gray-800 rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Personalize do seu jeito</h3>
            <p className="text-gray-300 mb-4">Altere imagens, cores e textos para deixar o e-book com a sua cara.</p>
            <button className="bg-[#0000EE] text-white px-6 py-3 rounded-lg font-semibold">Gerar e-book</button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-900 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Pronto para criar seu e-book?</h2>
        <button className="bg-[#0000EE] text-white px-8 py-4 rounded-lg font-semibold text-lg">Começar Agora</button>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SeuNome. Todos os direitos reservados.
      </footer>
    </div>
  );
}
