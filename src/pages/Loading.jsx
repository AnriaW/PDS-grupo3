import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const totalTime = 30 * 1000;
    const updateInterval = 100; 

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / totalTime) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/library');
        }, 1000);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* Spinner animado */}
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
        
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Gerando sua apostila...
        </h1>
        
        {/* Descrição */}
        <p className="text-gray-600 mb-8 text-lg">
          Nossa IA está criando conteúdo personalizado para você.
          Isso leva aproximadamente 3 minutos. Mas, ocasionalmente, pode levar um pouco mais.
        </p>

        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Informações de progresso */}
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{Math.round(progress)}% concluído</span>
          <span>
            {Math.ceil((30) * ((100 - progress) / 100))}s restantes
          </span>
        </div>

        {/* Mensagem de status */}
        <div className="text-sm text-gray-500 italic">
          {progress < 25 && "Inicializando IA..."}
          {progress >= 25 && progress < 50 && "Gerando conteúdo..."}
          {progress >= 50 && progress < 75 && "Formatando apostila..."}
          {progress >= 75 && progress < 100 && "Finalizando..."}
          {progress >= 100 && "Redirecionando..."}
        </div>
      </div>
    </div>
  );
};

export default Loading;