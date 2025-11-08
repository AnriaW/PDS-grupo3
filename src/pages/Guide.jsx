import { useState } from 'react';
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
          description: 'No Dashboard ou Biblioteca, clique em "Nova Apostila" para começar',
          icon: '🆕'
        },
        {
          step: 2,
          title: 'Preencha os detalhes',
          description: 'Informe o assunto, componente curricular, ano, dificuldade e quantidade de exercícios',
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
          description: 'Acompanhe o status "Gerando..." na sua biblioteca',
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
          description: 'Veja suas apostilas e as compartilhadas com você, organizadas por data ou nome',
          icon: '📁'
        },
        {
          step: 2,
          title: 'Use a busca e filtros',
          description: 'Encontre apostilas por título, matéria, descrição ou proprietário',
          icon: '🔍'
        },
        {
          step: 3,
          title: 'Menu de ações (⋯)',
          description: 'Clique nos três pontos para editar, gerar PDF, compartilhar ou excluir',
          icon: '⋯'
        },
        {
          step: 4,
          title: 'Status em tempo real',
          description: 'Acompanhe: "Gerando...", "Baixando..." ou "Pronto"',
          icon: '🔄'
        },
        {
          step: 5,
          title: 'Apostilas compartilhadas',
          description: 'Identifique apostilas de outros usuários pelo indicador "👥 Compartilhada"',
          icon: '👥'
        }
      ]
    },
    editar: {
      title: '✏️ Editando Apostilas',
      steps: [
        {
          step: 1,
          title: 'Acesse a apostila',
          description: 'Clique em "Ver Apostila Completa" na apostila que deseja editar',
          icon: '📖'
        },
        {
          step: 2,
          title: 'Modifique o conteúdo',
          description: 'Dentro da visualização da apostila, edite diretamente o texto e exercícios',
          icon: '🔧'
        },
        {
          step: 3,
          title: 'Use recursos de edição',
          description: 'Formatação, adição de texto e modificação de exercícios diretamente no conteúdo',
          icon: '🎨'
        },
        {
          step: 4,
          title: 'Salve as alterações',
          description: 'As modificações são salvas automaticamente enquanto você edita',
          icon: '💾'
        }
      ]
    },
    pdf: {
      title: '📄 Gerando PDFs',
      steps: [
        {
          step: 1,
          title: 'Acesse o menu da apostila',
          description: 'Na biblioteca, clique nos três pontos (⋯) da apostila desejada',
          icon: '📚'
        },
        {
          step: 2,
          title: 'Selecione "Gerar PDF"',
          description: 'Escolha a opção no menu dropdown para iniciar a conversão',
          icon: '📄'
        },
        {
          step: 3,
          title: 'Aguarde a conversão',
          description: 'O sistema converte automaticamente o conteúdo para PDF (status: "📥 Baixando...")',
          icon: '⏳'
        },
        {
          step: 4,
          title: 'Download automático',
          description: 'O PDF é baixado automaticamente para seu dispositivo com o nome da apostila',
          icon: '⬇️'
        },
        {
          step: 5,
          title: 'Conteúdo atualizado',
          description: 'O PDF gerado contém todas as edições e modificações mais recentes da apostila',
          icon: '🔄'
        },
        {
          step: 6,
          title: 'Formatação preservada',
          description: 'Texto, questões, formatação e estrutura são mantidas fielmente no PDF gerado',
          icon: '🎨'
        }
      ]
    },
    compartilhar: {
      title: '👥 Compartilhando Apostilas',
      steps: [
        {
          step: 1,
          title: 'Acesse a apostila',
          description: 'Clique em "Ver Apostila Completa" para abrir a apostila desejada',
          icon: '📖'
        },
        {
          step: 2,
          title: 'Localize o botão Compartilhar',
          description: 'Encontre o botão "Compartilhar" no canto superior direito da apostila',
          icon: '🔍'
        },
        {
          step: 3,
          title: 'Clique para compartilhar',
          description: 'O botão abre um modal com o link único da apostila',
          icon: '👆'
        },
        {
          step: 4,
          title: 'Link copiado automaticamente',
          description: 'O link é gerado e copiado para sua área de transferência',
          icon: '📋'
        },
        {
          step: 5,
          title: 'Compartilhe onde quiser',
          description: 'Cole o link em emails, mensagens ou onde desejar compartilhar',
          icon: '📤'
        },
        {
          step: 6,
          title: 'Acesso imediato',
          description: 'Quem receber o link pode acessar a apostila sem fazer login',
          icon: '🚀'
        }
      ]
    },
    acessibilidade: {
      title: '♿ Recursos de Acessibilidade',
      steps: [
        {
          step: 1,
          title: 'Leitura por áudio',
          description: 'Use o botão "🎧 Ouvir" para ter o conteúdo lido em voz alta',
          icon: '🎧'
        },
        {
          step: 2,
          title: 'Aumentar fonte',
          description: 'Clique em "A+" para aumentar o tamanho do texto para melhor leitura',
          icon: '🔍'
        },
        {
          step: 3,
          title: 'Diminuir fonte',
          description: 'Use "A-" para reduzir o tamanho do texto conforme sua preferência',
          icon: '📐'
        },
        {
          step: 4,
          title: 'Compartilhando Apostilas',
          description: 'Na visualização da apostila, use o botão "Compartilhar',
          icon: '👥'
        }
      ]
    },
    perfil: {
      title: '👤 Gerenciando sua Conta',
      steps: [
        {
          step: 1,
          title: 'Acesse seu perfil',
          description: 'Clique na sua foto no canto superior direito → "Meu Perfil"',
          icon: '🖼️'
        },
        {
          step: 2,
          title: 'Estatísticas automáticas',
          description: 'Veja número de apostilas criadas, tempo na plataforma e seu nível',
          icon: '📊'
        },
        {
          step: 3,
          title: 'Altere sua foto',
          description: 'Clique no ícone da câmera sobre sua foto para fazer upload',
          icon: '📸'
        },
        {
          step: 4,
          title: 'Edite informações',
          description: 'Clique em "Editar Perfil" para alterar nome (email não pode ser alterado)',
          icon: '✏️'
        },
        {
          step: 5,
          title: 'Alterar senha - Funcionalidade Futura',
          description: 'Vá para "Alterar Senha" para atualizar sua senha de acesso',
          icon: '🔒'
        },
        {
          step: 6,
          title: 'Excluir conta - Funcionalidade Futura',
          description: 'Na página dedicada, confirme a exclusão permanente da conta',
          icon: '🗑️'
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
          title: 'Use acessibilidade',
          description: 'Aproveite os recursos de áudio e tamanho de fonte para diferentes necessidades',
          icon: '♿'
        },
        {
          step: 3,
          title: 'Compartilhe colaborativamente',
          description: 'Trabalhe em equipe compartilhando apostilas com colegas professores',
          icon: '👥'
        },
        {
          step: 4,
          title: 'Combine recursos',
          description: 'Edite, use PDF para impressão e compartilhamento com alunos',
          icon: '📤'
        }
      ]
    }
  };

  const faqs = [
    {
      question: 'Quanto tempo leva para gerar uma apostila?',
      answer: 'O processo leva aproximadamente 3 minutos. Você pode acompanhar o status "Gerando..." na biblioteca.'
    },
    {
      question: 'Como edito uma apostila?',
      answer: 'Acesse a apostila completa e edite diretamente no conteúdo. As alterações são salvas automaticamente.'
    },
    {
      question: 'Posso compartilhar apostilas com outros usuários?',
      answer: 'Sim! Use a função "Compartilhar" dentro da apostila ou pelo menu da biblioteca. A apostila aparecerá na biblioteca do usuário compartilhado.'
    },
    {
      question: 'Quais recursos de acessibilidade estão disponíveis?',
      answer: 'Leitura por áudio, aumento/diminuição de fonte'
    },
    {
      question: 'Como faço para baixar em PDF?',
      answer: 'No menu dropdown da apostila, clique em "Gerar PDF". O status mudará para "Baixando..." e o download começará automaticamente.'
    },
    {
      question: 'Posso excluir apostilas compartilhadas comigo?',
      answer: 'Não, você pode apenas visualizar apostilas compartilhadas. Apenas o proprietário pode excluí-las.'
    },

    {
      question: 'Posso editar uma apostila que foi compartilhada comigo?',
      answer: 'Não, as apostilhas compartilhadas só podem ser editadas pelo proprietário da apostila.'
    },
    {
      question: 'O sistema atualiza automaticamente?',
      answer: 'Sim! Apostilas em geração são verificadas automaticamente para atualizar o status.'
    }
  ];

  const userLevels = [
    { nivel: 'Iniciante', apostilas: '0', descricao: 'Começando na plataforma' },
    { nivel: 'Explorador', apostilas: '1-5', descricao: 'Criando suas primeiras apostilas' },
    { nivel: 'Criador', apostilas: '6-15', descricao: 'Produtivo e consistente' },
    { nivel: 'Mestre', apostilas: '16-30', descricao: 'Experiente na criação' },
    { nivel: 'Lenda', apostilas: '31+', descricao: 'Referência na plataforma' }
  ];

  const accessibilityFeatures = [
    { feature: 'Leitura por Áudio', icon: '🎧', description: 'Texto convertido para voz' },
    { feature: 'Tamanho da Fonte', icon: '🔠', description: 'A+/A-/Reset' },
    { feature: 'Alto Contraste', icon: '🌓', description: 'Melhor visibilidade' },
    { feature: 'Navegação por Teclado', icon: '⌨️', description: 'Acessibilidade total' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📖 Guia Completo do Apostilab
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Domine todas as funcionalidades: criação, edição, acessibilidade e compartilhamento colaborativo
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Menu Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Conteúdo do Guia</h3>
              <nav className="space-y-2">
                {Object.entries(sections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${activeSection === key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Sistema de Níveis */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">🎯 Sistema de Níveis</h4>
                <div className="space-y-2 text-sm">
                  {userLevels.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{level.nivel}</span>
                      <span className="text-gray-600 text-xs">{level.apostilas}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Ações Rápidas</h4>
                <div className="space-y-2">
                  <Link
                    to="/"
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
                  <div key={item.step} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition">
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition">
                    <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <div className="bg-blue-500 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Pronto para colaborar?
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Crie, edite, compartilhe e acesse com todos os recursos que desenvolvemos!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition shadow-md"
                  >
                    🚀 Criar Apostila
                  </Link>
                  <Link
                    to="/library"
                    className="inline-block bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
                  >
                    📚 Explorar Biblioteca
                  </Link>
                </div>
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