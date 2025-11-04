import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';

export default function SharedApostila() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apostilaRef = useRef(null);

  useEffect(() => {
    const fetchApostila = async () => {
      try {
        setLoading(true);
        
        // Buscar apostila por ID no Supabase
        const { data, error } = await supabase
          .from('files')
          .select('file')
          .eq('id', id)
          .eq('is_shareable', true)
          .single();

        if (error) {
          console.error('Erro ao buscar apostila:', error);
          setError('Apostila não encontrada');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!data) {
          setError('Apostila não encontrada');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        setHtml(data.file || '');
      } catch (err) {
        console.error('Erro ao carregar apostila:', err);
        setError('Erro ao carregar apostila');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApostila();
    } else {
      setError('ID da apostila não fornecido');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [id, navigate]);

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
      }
    }
  }, [html]);

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

    return () => {
      container.removeEventListener('click', onClick, true);
      container.removeEventListener('keydown', onKeyDown, true);
      container.removeEventListener('touchstart', onTouch, true);
    };
  }, [html]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando apostila...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Apostila não encontrada</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecionando para a página inicial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full">
        {html ? (
          <div ref={apostilaRef} />
        ) : (
          <div className="text-center text-gray-600">
            Nenhum conteúdo de apostila fornecido.
          </div>
        )}
      </div>
    </div>
  );
}