import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";

const Profile = () => {
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    photo: null,
    level: 'Intermediário',
    memberSince: '2024-01-01'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempEmail, setTempEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar dados do localStorage quando o componente montar
  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setTempName(userData.name);
        setTempEmail(userData.email);
      }
    };

    loadUserData();

    // Também ouvir eventos de atualização (caso outra aba/componente atualize)
    window.addEventListener('userDataUpdated', loadUserData);

    return () => {
      window.removeEventListener('userDataUpdated', loadUserData);
    };
  }, []);

  const handleSave = () => {
    setIsLoading(true);
    
    // Simula uma requisição API
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: tempName,
        email: tempEmail,
        photo: user.photo
      };
      
      setUser(updatedUser);
      setEditMode(false);
      setIsLoading(false);
      
      // Salva no localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Dispara um evento customizado para atualizar o Header e outros componentes
      window.dispatchEvent(new Event('userDataUpdated'));
    }, 1000);
  };

  const handleCancel = () => {
    // Restaura os valores originais do usuário atual
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

  const stats = [
    { label: 'Apostilas Criadas', value: '12' },
    { label: 'Tempo na Plataforma', value: '3 meses' },
    { label: 'Nível', value: user.level }
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
                  user.name.charAt(0)
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
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Membro desde {new Date(user.memberSince).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
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

            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <p className="font-medium text-gray-700">Alterar Senha</p>
              <p className="text-sm text-gray-500">Atualize sua senha de acesso</p>
            </button>

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