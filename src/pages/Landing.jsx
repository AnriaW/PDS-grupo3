import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from '../components/Header';
import { MdMoneyOff } from "react-icons/md";
import { HiPrinter } from 'react-icons/hi2';
import { AiFillPushpin, AiFillSound } from 'react-icons/ai';
import { BiSolidPencil } from 'react-icons/bi';
import { FiMonitor } from 'react-icons/fi';

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

      {/* Seção Chamada */}
      <main className="w-full md:h-200 bg-cover bg-position-[center_top] 
        bg-[linear-gradient(to_bottom,transparent_40%,white_80%,white_90%),url(/por-favor-diga-nos-uma-resposta-correta.jpg)]">
        <div className="max-w-7xl mx-auto px-6 pt-130 text-center flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4">
            Sem tempo de preparar <span className="text-blue-600">material de apoio</span>?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            O Apostilab gera automaticamente apostilas com exercícios corrigidos e propostas de pesquisa, 
            para os níveis Fundamental e Médio,
            em conformidade com a <a className="text-blue-600 underline"
              href="https://basenacionalcomum.mec.gov.br/abase">
              Base Nacional Comum Curricular</a>. É rapidinho!
          </p>
          <button className="bg-blue-600 text-white text-xl font-bold py-3 px-6 my-6 rounded hover:bg-blue-500 transition">
            <Link to="/register">
              Comece agora
            </Link>
          </button>
        </div>
      </main>

      <section className="bg-blue-50 py-1 my-5 w-full"/> {/* Separador */}


      <main className="flex-1 w-full">

        {/* Seção Vantagens */}
      <section className="max-w-7xl mx-auto px-6 py-8 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Por que usar o <span className="text-blue-600">Apostilab</span>?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Diferente de outras ferramentas, o Apostilab é pensado para a sala de aula brasileira.<br/>
          Nossa Inteligência Artificial é treinada para gerar conteúdo no escopo da grade curricular do Ministério da Educação.
        </p>
        <h2 className="text-xl font-bold m-6">
          Além disto, o <span className="text-blue-600">Apostilab</span>...
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <MdMoneyOff className="text-blue-600 text-2xl flex-none" />
              É 100% gratuito
            </h3>
            <p className="text-gray-600">Sem compras, sem mensalidade, e todo o conteúdo gerado é de licença aberta</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <AiFillPushpin className="text-blue-600 text-xl flex-none" />
              Possui indexação à BNCC
            </h3>
            <p className="text-gray-600">Todo o conteúdo gerado referencia os índices da BNCC, acelerando o preparo do material.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <AiFillSound className="text-blue-600 text-xl flex-none" />
              Oferece opções de acessibilidade
            </h3>
            <p className="text-gray-600">Tema escuro, ajuste de tamanho de fonte, e audiodescrição para pessoas com baixa visão.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <BiSolidPencil className="text-blue-600 text-xl flex-none" />
              É editável
            </h3>
            <p className="text-gray-600">Caso o conteúdo da apostila não seja de seu agrado, é possível editar seu texto pela plataforma.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <HiPrinter className="text-blue-600 text-xl flex-none" />
              Pode ser impresso
            </h3>
            <p className="text-gray-600">Gere um PDF de sua apostila e a imprima para distribuição em sala de aula.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 inline-flex items-center justify-center gap-2 w-full">
              <FiMonitor className="text-blue-600 text-xl flex-none" />
              Pode ser visto pela internet
            </h3>
            <p className="text-gray-600">É possível compartilhar as apostilas por URL, para seus alunos a acessarem pelo computador ou celular.</p>
          </div>
        </div>
      </section>

        {/* Seção de Chamada para Ação */}
        <section className="bg-gray-50 py-16 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Apostilas em apenas 3 minutos
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Criar seu material didático é fácil: insira o conteúdo e a IA faz o resto para você.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
