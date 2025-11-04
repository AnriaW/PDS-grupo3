import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';

export default function Apostila({ htmlText }) {
  const location = useLocation();
  const apostilaId = location.state?.id ?? null;
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isUpdatingShare, setIsUpdatingShare] = useState(false);
  const html = htmlText ?? location.state?.htmlText ?? '';
  const apostilaRef = useRef(null);

  useEffect(() => {
    if (html) {
      // Extrair e aplicar estilos CSS do HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const styles = doc.querySelectorAll('style');
      
      // Aplicar estilos ao head (modificando para funcionar com container)
      styles.forEach((style, index) => {
        const styleId = `apostila-style-${index}`;
        if (!document.getElementById(styleId)) {
          const newStyle = document.createElement('style');
          newStyle.id = styleId;
          // Modificar CSS para aplicar no container em vez do body
          let cssText = style.textContent;
          
          // 1. Substituir 'body {' por seletor que funcione com container
          cssText = cssText.replace(/body\s*{/g, 'body, [data-apostila-container] {');
          
          // 2. Substituir '.dark' para funcionar quando aplicado ao container
          cssText = cssText.replace(/\.dark\s+/g, '.dark, [data-apostila-container].dark ');
          
          // 3. Modificar .capa para ocupar toda largura com altura fixa de 100px
          cssText = cssText.replace(/\.capa\s*{([^}]*)}/g, '.capa { width: 100% !important; max-width: 100% !important; min-width: 100% !important; height: 25vh !important; max-height: 25vh !important; margin: 0 !important; display: block !important; object-fit: cover !important; }');
          
          console.log(`CSS modificado (style ${index}):`, cssText.substring(0, 300));
          newStyle.textContent = cssText;
          document.head.appendChild(newStyle);
        }
      });

      // Extrair apenas o conteúdo do body
      const bodyContent = doc.body ? doc.body.innerHTML : html;
      
      // Atualizar o conteúdo
      if (apostilaRef.current) {
        // Marcar container com atributo especial para CSS funcionar
        apostilaRef.current.setAttribute('data-apostila-container', 'true');
        apostilaRef.current.innerHTML = bodyContent;
        
        // MODIFICAÇÕES EM TEMPO REAL NO DOM (APÓS INSERÇÃO)
        // 1. Imagem já é centralizada via CSS modificado
        const capaImg = apostilaRef.current.querySelector('.capa');
        console.log('Imagem capa encontrada?', !!capaImg, capaImg);

        // 2. Modificar botão de tema para funcionar corretamente
        const toggleThemeBtn = apostilaRef.current.querySelector('#toggle-theme');
        if (toggleThemeBtn) {
          toggleThemeBtn.style.display = 'inline-flex';
          toggleThemeBtn.style.alignItems = 'center';
          toggleThemeBtn.style.gap = '0.25rem';
          toggleThemeBtn.style.background = '#e5e7eb';
          toggleThemeBtn.style.color = '#111827';
          toggleThemeBtn.style.border = '1px solid #d1d5db';
          toggleThemeBtn.style.padding = '0.25rem 0.5rem';
          toggleThemeBtn.style.borderRadius = '6px';
          toggleThemeBtn.style.cursor = 'pointer';
        }

        // 3. Definir --font-size inicial no container (não no root)
        apostilaRef.current.style.setProperty('--font-size', '1rem');
        console.log('Font-size inicial definido:', apostilaRef.current.style.getPropertyValue('--font-size'));
        // garantir que container pode posicionar elementos absolutos (botão)
        if (!apostilaRef.current.style.position) apostilaRef.current.style.position = 'relative';
      }
    }
  }, [html]);

  const currentLink = `${window.location.origin}/apostila/${apostilaId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const onShareClick = async () => {
    if (!apostilaId) {
      alert('ID da apostila não disponível para compartilhamento.');
      return;
    }
    if (isUpdatingShare) return;
    setIsUpdatingShare(true);
    try {
      const res = await supabase
        .from('files')
        .update({ is_shareable: true })
        .eq('id', apostilaId)
        .select()
        .single();

      if (res.error) {
        console.error('Erro ao atualizar share flag:', res.error);
        alert('Erro ao marcar como compartilhável.');
        return;
      }

      setShowShareModal(true);
    } catch (err) {
      console.error('Erro no share:', err);
      alert('Erro ao compartilhar. Tente novamente.');
    } finally {
      setIsUpdatingShare(false);
    }
  };

  useLayoutEffect(() => {
    if (!apostilaRef.current) return;

    console.log('Configurando eventos da apostila (delegação)...');
    const container = apostilaRef.current;

    // CSS mínimo para botões e font-size dinâmico
    if (!document.getElementById('apostila-runtime-styles')) {
      const style = document.createElement('style');
      style.id = 'apostila-runtime-styles';
      style.textContent = `
        .controls button, button.ouvir { 
          display: inline-flex; align-items: center; gap: 0.25rem;
          background: #e5e7eb; color: #111827; border: 1px solid #d1d5db; 
          padding: 0.25rem 0.5rem; border-radius: 6px; cursor: pointer;
        }
        .controls button:hover, button.ouvir:hover { background: #dbe0e6; }
        
        /* Garantir que font-size funcione no container */
        [data-apostila-container] {
          font-size: var(--font-size, 1rem) !important;
        }
      `;
      document.head.appendChild(style);
    }

    const toggleSection = (h2) => {
      const content = h2.nextElementSibling && h2.nextElementSibling.nextElementSibling;
      const expanded = h2.getAttribute('aria-expanded') === 'true';
      h2.setAttribute('aria-expanded', !expanded);
      if (content) content.hidden = expanded ? true : false;
    };

    const onClick = (e) => {
      const target = e.target;

      // Toggle de seções via H2
      const h2 = target.closest && target.closest('h2[role="button"]');
      if (h2 && container.contains(h2)) {
        e.preventDefault();
        e.stopPropagation();
        toggleSection(h2);
        return;
      }

      // Tema claro/escuro
      const toggleBtn = target.closest && target.closest('#toggle-theme');
      if (toggleBtn && container.contains(toggleBtn)) {
        e.preventDefault();
        console.log('Toggle tema clicado!');
        // Aplicar tema escuro no container da apostila
        container.classList.toggle('dark');
        console.log('Container tem classe dark?', container.classList.contains('dark'));
        return;
      }

      // Fonte A+ / A-
      const incBtn = target.closest && target.closest('#font-increase');
      const decBtn = target.closest && target.closest('#font-decrease');
      if ((incBtn || decBtn) && container.contains(incBtn || decBtn)) {
        e.preventDefault();
        console.log('Botão de fonte clicado:', incBtn ? 'A+' : 'A-');
        // Aplicar --font-size no container da apostila, não no root (para não afetar navbar)
        const currentFontSize = container.style.getPropertyValue('--font-size');
        console.log('Font-size atual (style):', currentFontSize);
        const fs = parseFloat(currentFontSize) || 1;
        const newFs = fs + (incBtn ? 0.1 : -0.1);
        container.style.setProperty('--font-size', newFs + 'rem');
        console.log('Font-size alterado para:', container.style.getPropertyValue('--font-size'));
        return;
      }

      // Leitura em voz alta
      const ouvirBtn = target.closest && target.closest('button.ouvir');
      if (ouvirBtn && container.contains(ouvirBtn)) {
        e.preventDefault();
        if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
        const id = ouvirBtn.getAttribute('data-section');
        const section = container.querySelector(`#${id}`);
        const text = section ? section.textContent : '';
        if (text) {
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = 'pt-BR';
          speechSynthesis.speak(utter);
        }
        return;
      }
    };

    const onKeyDown = (e) => {
      const h2 = e.target.closest && e.target.closest('h2[role="button"]');
      if (!h2 || !container.contains(h2)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleSection(h2);
      }
    };

    const onTouch = (e) => {
      const h2 = e.target.closest && e.target.closest('h2[role="button"]');
      if (!h2 || !container.contains(h2)) return;
      e.preventDefault();
      e.stopPropagation();
      toggleSection(h2);
    };

    container.addEventListener('click', onClick, true);
    container.addEventListener('keydown', onKeyDown, true);
    container.addEventListener('touchstart', onTouch, true);

    // Removidos listeners diretos; tudo via delegação em onClick

    return () => {
      container.removeEventListener('click', onClick, true);
      container.removeEventListener('keydown', onKeyDown, true);
      container.removeEventListener('touchstart', onTouch, true);
    };
  }, [html]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full">
        {html ? (
          <div className="relative">
            <div ref={apostilaRef} />

            {/* Botão de compartilhar sobre a capa (aparece se tivermos id) */}
            {apostilaId && (
              <button
                onClick={onShareClick}
                disabled={isUpdatingShare}
                aria-label="Compartilhar apostila"
                className={`absolute top-4 right-4 z-50 bg-white/90 text-gray-800 px-3 py-2 rounded-md shadow-md hover:bg-white flex items-center gap-2 ${isUpdatingShare ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                  <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Compartilhar
              </button>
            )}

            {/* Modal simples de compartilhamento */}
            {showShareModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowShareModal(false)}>
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Compartilhar Apostila</h3>
                    <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link da apostila</label>
                    <div className="flex">
                      <input type="text" value={currentLink} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 text-sm" />
                      <button onClick={copyToClipboard} className={`px-4 py-2 rounded-r-md ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                        {copySuccess ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Compartilhe esse link com quem desejar.</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Nenhum conteúdo de apostila fornecido.
          </div>
        )}
      </div>
    </div>
  );
}


