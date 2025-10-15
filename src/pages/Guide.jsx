import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Guide = () => {
  const [activeSection, setActiveSection] = useState('criar');

  const sections = {
    criar: {
      title: '📝 Criando Apostilas',
      steps: [
        {
          step: 1,
          title: 'Acesse "Nova Apostila"',
          description: 'No menu principal, clique em "Nova Apostila" para começar',
          icon: '🆕'
        },
        {
          step: 2,
          title: 'Preencha os detalhes',
          description: 'Informe o assunto, componente curricular, série, dificuldade e quantidade de exercícios',
          icon: '📋'
        },
        {
          step: 3,
          title: 'Clique em "Gerar Apostila"',
          description: 'Nossa IA criará conteúdo personalizado em aproximadamente 3 minutos',
          icon: '🚀'
        },
        {
          step: 4,
          title: 'Aguarde o processamento',
          description: 'Você será redirecionado para uma tela de loading com barra de progresso',
          icon: '⏳'
        }
      ]
    },
    biblioteca: {
      title: '📚 Gerenciando sua Biblioteca',
      steps: [
        {
          step: 1,
          title: 'Acesse "Biblioteca"',
          description: 'Veja todas as suas apostilas criadas organizadas por data',
          icon: '📁'
        },
        {
          step: 2,
          title: 'Use a busca',
          description: 'Encontre apostilas específicas pelo título, assunto ou conteúdo',
          icon: '🔍'
        },
        {
          step: 3,
          title: 'Filtre e ordene',
          description: 'Organize por data de criação ou ordem alfabética',
          icon: '↕️'
        },
        {
          step: 4,
          title: 'Visualize e edite',
          description: 'Clique em qualquer apostila para ver o conteúdo completo',
          icon: '👀'
        }
      ]
    },
    perfil: {
      title: '👤 Personalizando seu Perfil',
      steps: [
        {
          step: 1,
          title: 'Acesse seu perfil',
          description: 'Clique na sua foto no canto superior direito e selecione "Meu Perfil"',
          icon: '🖼️'
        },
        {
          step: 2,
          title: 'Altere sua foto',
          description: 'Clique no ícone da câmera sobre sua foto para fazer upload',
          icon: '📸'
        },
        {
          step: 3,
          title: 'Edite suas informações',
          description: 'Clique em "Editar Perfil" para alterar nome e email',
          icon: '✏️'
        },
        {
          step: 4,
          title: 'Configure notificações',
          description: 'Ative/desative notificações por email conforme sua preferência',
          icon: '🔔'
        }
      ]
    },
    dicas: {
      title: '💡 Dicas para Melhores Resultados',
      steps: [
        {
          step: 1,
          title: 'Seja específico nos tópicos',
          description: 'Em vez de "Matemática", use "Equações do 2º Grau" para conteúdo mais focado',
          icon: '🎯'
        },
        {
          step: 2,
          title: 'Ajuste a dificuldade',
          description: 'Considere o nível dos estudantes ao definir a dificuldade (0=muito fácil, 3=difícil)',
          icon: '📊'
        },
        {
          step: 3,
          title: 'Use exercícios guiados',
          description: 'Inclua exercícios com passo a passo para melhor compreensão',
          icon: '🔄'
        },
        {
          step: 4,
          title: 'Revise e personalize',
          description: 'Após gerar, você pode editar o conteúdo para ajustar ao seu estilo',
          icon: '✅'
        }
      ]
    }
  };

  const faqs = [
    {
      question: 'Quanto tempo leva para gerar uma apostila?',
      answer: 'O processo leva aproximadamente 3 minutos. Você pode acompanhar o progresso pela barra de carregamento.'
    },
    {
      question: 'Posso editar uma apostila após gerá-la?',
      answer: 'Sim! Após a geração, você pode visualizar o conteúdo completo e fazer ajustes manuais se necessário.'
    },
    {
      question: 'Quantas apostilas posso criar?',
      answer: 'Não há limites! Você pode criar quantas apostilas precisar para seus estudos ou aulas.'
    },
    {
      question: 'Preciso de conexão com internet para usar?',
      answer: 'Sim, é necessária conexão com internet para gerar novas apostilas, mas você pode acessar as já criadas offline.'
    },
    {
      question: 'Posso baixar minhas apostilas?',
      answer: 'Sim! Na visualização da apostila, você encontra a opção de exportar em PDF.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📖 Guia do Usuário
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprenda a usar todas as funcionalidades do MeuApp para criar apostilas incríveis
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Menu Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Conteúdo do Guia</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('criar')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeSection === 'criar' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📝 Criando Apostilas
                </button>
                <button
                  onClick={() => setActiveSection('biblioteca')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeSection === 'biblioteca' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📚 Gerenciando Biblioteca
                </button>
                <button
                  onClick={() => setActiveSection('perfil')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeSection === 'perfil' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Personalizando Perfil
                </button>
                <button
                  onClick={() => setActiveSection('dicas')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeSection === 'dicas' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  💡 Dicas e Melhores Práticas
                </button>
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Ações Rápidas</h4>
                <div className="space-y-2">
                  <Link
                    to="/create-new"
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition font-medium"
                  >
                    🚀 Criar Apostila
                  </Link>
                  <Link
                    to="/library"
                    className="block w-full text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    📚 Ver Biblioteca
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            
            {/* Seção Ativa */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {sections[activeSection].title}
              </h2>

              <div className="space-y-6">
                {sections[activeSection].steps.map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded">
                          Passo {item.step}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ Perguntas Frequentes</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Pronto para começar?
                </h3>
                <p className="text-blue-700 mb-6">
                  Crie sua primeira apostila agora mesmo e experimente o poder da IA na educação!
                </p>
                <Link
                  to="/create-new"
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-500 transition shadow-md"
                >
                  🚀 Criar Minha Primeira Apostila
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Guide;