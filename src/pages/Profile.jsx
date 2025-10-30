import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";
import { supabase } from '../supabase';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    photo: null,
    created_at: new Date().toISOString()
  });

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    apostilasCriadas: 0,
    tempoPlataforma: '',
    nivel: 'Iniciante'
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Buscar dados do usuário e estatísticas
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setTempName(userData.name);
          setTempEmail(userData.email);
          
          // Buscar estatísticas do usuário
          await fetchUserStats(userData.email);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
    window.addEventListener('userDataUpdated', loadUserData);

    return () => {
      window.removeEventListener('userDataUpdated', loadUserData);
    };
  }, []);

  const fetchUserStats = async (userEmail) => {
    setLoadingStats(true);
    try {
      // Buscar número de apostilas criadas
      const { data: apostilasData, error: apostilasError } = await supabase
        .from('files')
        .select('id, created_at')
        .eq('email', userEmail);

      if (apostilasError) throw apostilasError;

      // Calcular tempo na plataforma
      const tempoPlataforma = calcularTempoPlataforma(user.created_at);
      
      // Calcular nível baseado no número de apostilas
      const nivel = calcularNivel(apostilasData?.length || 0);

      setStats({
        apostilasCriadas: apostilasData?.length || 0,
        tempoPlataforma,
        nivel
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setStats({
        apostilasCriadas: 0,
        tempoPlataforma: 'Recém-chegado',
        nivel: 'Iniciante'
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const calcularTempoPlataforma = (dataCriacao) => {
    const criacao = new Date(dataCriacao);
    const agora = new Date();
    const diffMeses = (agora.getFullYear() - criacao.getFullYear()) * 12 + 
                     (agora.getMonth() - criacao.getMonth());
    
    if (diffMeses === 0) {
      const diffDias = Math.floor((agora - criacao) / (1000 * 60 * 60 * 24));
      return diffDias <= 1 ? 'Hoje' : `${diffDias} dias`;
    } else if (diffMeses === 1) {
      return '1 mês';
    } else if (diffMeses < 12) {
      return `${diffMeses} meses`;
    } else {
      const anos = Math.floor(diffMeses / 12);
      return anos === 1 ? '1 ano' : `${anos} anos`;
    }
  };

  const calcularNivel = (numeroApostilas) => {
    if (numeroApostilas === 0) return 'Iniciante';
    if (numeroApostilas <= 5) return 'Explorador';
    if (numeroApostilas <= 15) return 'Criador';
    if (numeroApostilas <= 30) return 'Mestre';
    return 'Lenda';
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Atualizar no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: { name: tempName }
      });

      if (authError) throw authError;

      const updatedUser = {
        ...user,
        name: tempName,
        email: tempEmail,
        photo: user.photo
      };

      setUser(updatedUser);
      setEditMode(false);

      // Salva no localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event('userDataUpdated'));

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempName(user.name);
    setTempEmail(user.email);
    setEditMode(false);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedUser = {
          ...user,
          photo: e.target.result
        };
        setUser(updatedUser);

        // Salva no localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userDataUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const estatisticas = [
    { label: 'Apostilas Criadas', value: loadingStats ? '...' : stats.apostilasCriadas.toString() },
    { label: 'Tempo na Plataforma', value: loadingStats ? '...' : stats.tempoPlataforma },
    { label: 'Nível', value: loadingStats ? '...' : stats.nivel }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          {/* Foto e Nome */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Foto do usuário"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>

              {/* Botão para alterar foto */}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </label>
            </div>

            <div className="flex-1">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                    placeholder="Seu nome"
                  />
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu email"
                    disabled // Email geralmente não pode ser alterado facilmente
                  />
                  <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {user.name || 'Usuário'}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {estatisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {loadingStats ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-12"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition font-medium"
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Configurações Adicionais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurações</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Notificações por email</p>
                <p className="text-sm text-gray-500">Receba atualizações sobre suas apostilas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <Link 
              to="/change-password"
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition block"
            >
              <p className="font-medium text-gray-700">Alterar Senha</p>
              <p className="text-sm text-gray-500">Atualize sua senha de acesso</p>
            </Link>

            <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition">
              <p className="font-medium text-red-500">Excluir conta</p>
              <p className="text-sm text-red-600">Excluir conta permanentemente</p>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;