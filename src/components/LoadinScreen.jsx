import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const totalTime = 3 * 60 * 1000; // 3 minutos em milissegundos
  const updateInterval = 100; // Atualizar a cada 100ms

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / totalTime) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [onComplete, totalTime]);

  // Formatador de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.ceil(((100 - progress) / 100) * (totalTime / 1000));

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Spinner animado */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
        
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Gerando sua apostila...
        </h2>
        
        {/* Descrição */}
        <p className="text-gray-600 mb-6">
          Nossa IA está criando conteúdo personalizado para você. 
          Isso pode levar alguns minutos.
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
          <span>{progress.toFixed(0)}% concluído</span>
          <span>Tempo restante: {formatTime(remainingTime)}</span>
        </div>

        {/* Mensagem de status */}
        <div className="text-sm text-gray-500 italic">
          {progress < 25 && "Inicializando IA..."}
          {progress >= 25 && progress < 50 && "Gerando conteúdo..."}
          {progress >= 50 && progress < 75 && "Formatando apostila..."}
          {progress >= 75 && progress < 100 && "Finalizando..."}
          {progress >= 100 && "Pronto!"}
        </div>

        {/* Botão de cancelar (opcional) */}
        {progress < 100 && (
          <button className="mt-8 text-gray-500 hover:text-gray-700 text-sm underline">
            Cancelar processo
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;