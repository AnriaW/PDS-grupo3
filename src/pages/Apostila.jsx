import React, { useEffect, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';

export default function Apostila({ htmlText }) {
  const location = useLocation();
  const apostilaId = location.state?.id ?? null;
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isUpdatingShare, setIsUpdatingShare] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [html, setHtml] = useState(htmlText ?? location.state?.htmlText ?? '');
  const apostilaRef = useRef(null);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const isCreator = !!apostilaId;

  useEffect(() => {
    const fetchHtmlFromSupabase = async () => {
      if (apostilaId) {
        try {
          const { data, error } = await supabase
            .from('files')
            .select('file')
            .eq('id', apostilaId)
            .single();
          
          if (error) {
            if (location.state?.htmlText) {
              setHtml(location.state.htmlText);
            } else if (htmlText) {
              setHtml(htmlText);
            }
          } else if (data?.file) {
            setHtml(data.file);
          }
        } catch {
          if (location.state?.htmlText) {
            setHtml(location.state.htmlText);
          } else if (htmlText) {
            setHtml(htmlText);
          }
        }
      } else {
        if (htmlText) {
          setHtml(htmlText);
        } else if (location.state?.htmlText) {
          setHtml(location.state.htmlText);
        }
      }
    };
    
    fetchHtmlFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apostilaId]);

  useEffect(() => {
    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const styles = doc.querySelectorAll('style');
      
      styles.forEach((style, index) => {
        const styleId = `apostila-style-${index}`;
        if (!document.getElementById(styleId)) {
          const newStyle = document.createElement('style');
          newStyle.id = styleId;
          let cssText = style.textContent;
          
          cssText = cssText.replace(/body\s*{/g, 'body, [data-apostila-container] {');
          cssText = cssText.replace(/\.dark\s+/g, '.dark, [data-apostila-container].dark ');
          cssText = cssText.replace(/\.capa\s*{([^}]*)}/g, '.capa { width: 100% !important; max-width: 100% !important; min-width: 100% !important; height: 25vh !important; max-height: 25vh !important; margin: 0 !important; display: block !important; object-fit: cover !important; }');
          
          newStyle.textContent = cssText;
          document.head.appendChild(newStyle);
        }
      });

      const bodyContent = doc.body ? doc.body.innerHTML : html;
      
      if (apostilaRef.current) {
        apostilaRef.current.setAttribute('data-apostila-container', 'true');
        apostilaRef.current.innerHTML = bodyContent;
        
        if (isCreator) {
          const ouvirButtons = apostilaRef.current.querySelectorAll('button.ouvir');
          ouvirButtons.forEach((btn) => {
            if (btn.parentElement?.classList.contains('buttons-wrapper')) return;
            
            const sectionId = btn.getAttribute('data-section');
            const wrapper = document.createElement('div');
            wrapper.className = 'buttons-wrapper';
            
            const parent = btn.parentNode;
            const nextSibling = btn.nextSibling;
            wrapper.appendChild(btn);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'editar';
            editBtn.setAttribute('data-section', sectionId);
            editBtn.setAttribute('aria-label', 'Editar seção');
            editBtn.innerHTML = `
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem; display: block;">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `;
            wrapper.appendChild(editBtn);
            parent.insertBefore(wrapper, nextSibling);
          });
        }
        
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

        apostilaRef.current.style.setProperty('--font-size', '1rem');
        if (!apostilaRef.current.style.position) apostilaRef.current.style.position = 'relative';
      }
    }
  }, [html, isCreator]);

  const currentLink = `${window.location.origin}/compartilhada/${apostilaId}`;

  const openEditModal = useCallback((sectionId) => {
    if (!apostilaRef.current) return;
    
    const section = apostilaRef.current.querySelector(`#${sectionId}`);
    if (!section) return;
    
    const htmlContent = section.innerHTML;
    const formattedHtml = htmlContent
      .replace(/></g, '>\n<')
      .replace(/\n\s*\n/g, '\n');
    
    setEditingSectionId(sectionId);
    setEditingText(formattedHtml);
    setShowEditModal(true);
  }, []);

  const saveEdit = async () => {
    if (!editingSectionId || !apostilaRef.current) return;
    
    setIsSaving(true);
    try {
      const section = apostilaRef.current.querySelector(`#${editingSectionId}`);
      if (!section) {
        alert('Seção não encontrada.');
        return;
      }

      const newHtmlContent = editingText.trim();
      section.innerHTML = newHtmlContent;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sectionInDoc = doc.querySelector(`#${editingSectionId}`);
      
      if (!sectionInDoc) {
        alert('Erro: Seção não encontrada no HTML original.');
        return;
      }
      
      const oldContent = sectionInDoc.innerHTML;
      let updatedHtml = html.replace(oldContent, newHtmlContent);
      
      if (updatedHtml === html) {
        sectionInDoc.innerHTML = newHtmlContent;
        updatedHtml = doc.documentElement.outerHTML;
      }

      const { error, data } = await supabase
        .from('files')
        .update({ file: updatedHtml })
        .eq('id', apostilaId)
        .select();

      if (error) {
        alert('Erro ao salvar as alterações. Tente novamente.');
        return;
      }
      
      if (!data || data.length === 0) {
        alert('Erro: A apostila não foi encontrada ou você não tem permissão para editá-la.');
        return;
      }

      setHtml(updatedHtml);
      setShowEditModal(false);
      setEditingSectionId(null);
      setEditingText('');
      
      alert('Alterações salvas com sucesso!');
      window.location.reload();
    } catch {
      alert('Erro ao salvar as alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

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
        .controls button, button.ouvir, button.editar { 
          display: inline-flex !important; 
          align-items: center !important; 
          justify-content: center !important; 
          gap: 0.25rem;
          background: #e5e7eb !important; 
          color: #111827; 
          border: 1px solid #d1d5db !important; 
          padding: 0.25rem 0.5rem !important; 
          border-radius: 6px !important; 
          cursor: pointer;
          vertical-align: middle !important;
          box-sizing: border-box !important;
        }
        .controls button:hover, button.ouvir:hover, button.editar:hover { 
          background: #dbe0e6 !important; 
        }
        
        button.ouvir img, button.editar svg {
          width: 1.5rem !important;
          height: 1.5rem !important;
          display: block !important;
        }
        
        /* Alinhamento do wrapper de botões com H2 */
        .buttons-wrapper {
          display: inline !important;
          vertical-align: middle !important;
          margin-left: 0.5rem !important;
        }
        
        /* Botões dentro do wrapper mantêm espaçamento */
        .buttons-wrapper button.ouvir {
          margin-left: 0 !important;
          margin-right: 0.5rem !important;
        }
        
        .buttons-wrapper button.editar {
          margin-left: 0 !important;
        }
        
        /* Garantir que font-size funcione no container */
        [data-apostila-container] {
          font-size: var(--font-size, 1rem) !important;
        }
        
        /* Garantir espaçamento entre parágrafos */
        [data-apostila-container] .content p {
          margin-bottom: 1rem !important;
        }
        
        [data-apostila-container] .content p:last-child {
          margin-bottom: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    const toggleSection = (h2) => {
      // O wrapper mantém a mesma estrutura: H2 -> nextEl -> conteúdo
      // Seja nextEl um button.ouvir direto ou um wrapper com botões dentro
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

      // Edição de seção
      const editarBtn = target.closest && target.closest('button.editar');
      if (editarBtn && container.contains(editarBtn)) {
        e.preventDefault();
        const sectionId = editarBtn.getAttribute('data-section');
        if (sectionId) {
          openEditModal(sectionId);
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
  }, [html, openEditModal]);

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

            {/* Modal de edição de seção */}
            {showEditModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEditModal(false)}>
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Editar Seção</h3>
                    <button 
                      onClick={() => setShowEditModal(false)} 
                      className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                      disabled={isSaving}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4 text-sm">
                    {/* Aviso de CUIDADO */}
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="text-gray-800">
                          <strong className="text-orange-900">⚠️ CUIDADO:</strong> Você está editando o HTML da seção.
                          <p className="mt-1 text-xs text-gray-700">
                            <strong>Mexa no HTML o MÍNIMO possível!</strong> Edite apenas o texto entre as tags, não as tags em si.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Guia de tags */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1 a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-gray-700">
                          <strong className="text-gray-900">📘 Guia rápido de tags HTML:</strong>
                          <ul className="mt-2 ml-4 text-xs space-y-1 font-mono">
                            <li><code className="bg-gray-200 px-1 rounded">&lt;p&gt;</code> = Parágrafo</li>
                            <li><code className="bg-gray-200 px-1 rounded">&lt;h1&gt;, &lt;h2&gt;</code> = Títulos</li>
                            <li><code className="bg-gray-200 px-1 rounded">&lt;bold&gt;</code> = Negrito</li>
                            <li><code className="bg-gray-200 px-1 rounded">&lt;em&gt;</code> = Itálico</li>
                            <li><code className="bg-gray-200 px-1 rounded">&lt;ul&gt;&lt;li&gt;</code> = Listas</li>
                            <li><code className="bg-gray-200 px-1 rounded">&lt;br&gt;</code> = Quebra de linha</li>
                            <li className="text-orange-700 font-bold mt-2">❌ NÃO delete ou modifique as tags!</li>
                            <li className="text-green-700 font-bold">✅ Edite APENAS o texto entre as tags</li>
                            <li className="text-blue-700 mt-2">💡 As tags aparecem com opacidade reduzida no editor</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 mb-4 min-h-0">
                    <style>{`
                      .code-input-container {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        min-height: 200px;
                        border: 1px solid #d1d5db;
                        border-radius: 0.375rem;
                        background: white;
                      }
                      
                      .code-input-container:focus-within {
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                      }
                      
                      .code-highlight, .code-input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        padding: 12px 16px;
                        margin: 0;
                        border: 0;
                        font-family: Consolas, Monaco, "Courier New", monospace;
                        font-size: 13px;
                        line-height: 1.6;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        box-sizing: border-box;
                      }
                      
                      .code-highlight {
                        color: #1a1a1a;
                        background: transparent;
                        pointer-events: none;
                        overflow: hidden;
                        z-index: 1;
                      }
                      
                      .code-input {
                        color: transparent;
                        background: transparent;
                        caret-color: #1a1a1a;
                        resize: none;
                        outline: none;
                        overflow: auto;
                        z-index: 2;
                      }
                      
                      .code-input::selection {
                        background-color: rgba(59, 130, 246, 0.3);
                      }
                      
                      .tag-opacity {
                        opacity: 0.3;
                      }
                    `}</style>
                    
                    <div className="code-input-container">
                      <pre
                        ref={highlightRef}
                        className="code-highlight"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{
                          __html: editingText
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/(&lt;[^&]*?&gt;)/g, '<span class="tag-opacity">$1</span>')
                        }}
                      />
                      
                      <textarea
                        ref={textareaRef}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onScroll={(e) => {
                          if (highlightRef.current) {
                            highlightRef.current.scrollTop = e.target.scrollTop;
                            highlightRef.current.scrollLeft = e.target.scrollLeft;
                          }
                        }}
                        className="code-input"
                        placeholder="<p>Edite o HTML aqui...</p>"
                        disabled={isSaving}
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </button>
                  </div>
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

