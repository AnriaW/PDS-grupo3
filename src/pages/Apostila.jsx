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

  // Verificação nativa: se tem apostilaId no state, o usuário é o criador
  // (veio da biblioteca que já filtra por email do usuário)
  const isCreator = !!apostilaId;

  // Buscar HTML atualizado do Supabase sempre que a página carregar
  useEffect(() => {
    const fetchHtmlFromSupabase = async () => {
      if (apostilaId) {
        console.log('Buscando HTML atualizado do Supabase para ID:', apostilaId);
        try {
          const { data, error } = await supabase
            .from('files')
            .select('file')
            .eq('id', apostilaId)
            .single();
          
          if (error) {
            console.error('Erro ao buscar do Supabase:', error);
            // Se falhar, usa o HTML do location.state como fallback
            if (location.state?.htmlText) {
              setHtml(location.state.htmlText);
            } else if (htmlText) {
              setHtml(htmlText);
            }
          } else if (data?.file) {
            console.log('HTML carregado do Supabase com sucesso! Tamanho:', data.file.length);
            setHtml(data.file);
          }
        } catch (err) {
          console.error('Erro ao buscar HTML:', err);
          // Fallback para location.state
          if (location.state?.htmlText) {
            setHtml(location.state.htmlText);
          } else if (htmlText) {
            setHtml(htmlText);
          }
        }
      } else {
        // Se não tem ID (apostila compartilhada), usa o HTML passado por props
        if (htmlText) {
          setHtml(htmlText);
        } else if (location.state?.htmlText) {
          setHtml(location.state.htmlText);
        }
      }
    };
    
    fetchHtmlFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apostilaId]); // Intencionalmente só depende do apostilaId para sempre buscar do Supabase

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
        
        // Adicionar botões de edição se o usuário for o criador
        if (isCreator) {
          const ouvirButtons = apostilaRef.current.querySelectorAll('button.ouvir');
          ouvirButtons.forEach((btn) => {
            // Verificar se o botão de edição já existe
            if (btn.parentElement?.classList.contains('buttons-wrapper')) return;
            
            const sectionId = btn.getAttribute('data-section');
            
            // Criar wrapper para os botões
            const wrapper = document.createElement('div');
            wrapper.className = 'buttons-wrapper';
            
            // Mover o botão ouvir para dentro do wrapper
            const parent = btn.parentNode;
            const nextSibling = btn.nextSibling;
            wrapper.appendChild(btn);
            
            // Criar botão de editar com tamanho idêntico ao botão de som
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
            
            // Inserir o wrapper no lugar do botão original
            parent.insertBefore(wrapper, nextSibling);
          });
        }
        
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
  }, [html, isCreator]);

  const currentLink = `${window.location.origin}/apostila/${apostilaId}`;

  // Função para extrair texto puro de HTML (sem tags) preservando quebras de linha
  const extractPlainText = (htmlContent) => {
    // Substituir tags que representam quebras de linha
    let text = htmlContent
      .replace(/<br\s*\/?>/gi, '\n')           // <br> vira \n
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')   // Entre parágrafos: dupla quebra
      .replace(/<p[^>]*>/gi, '')                // Remove abertura de <p>
      .replace(/<\/p>/gi, '')                   // Remove fechamento de <p>
      .replace(/<\/div>\s*<div[^>]*>/gi, '\n\n') // Entre divs: dupla quebra
      .replace(/<div[^>]*>/gi, '')              // Remove <div>
      .replace(/<\/div>/gi, '');                // Remove </div>
    
    // Remover outras tags HTML
    const div = document.createElement('div');
    div.innerHTML = text;
    text = div.textContent || div.innerText || '';
    
    // Normalizar múltiplas quebras de linha seguidas
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços extras no início e fim de cada linha
    text = text.split('\n').map(line => line.trim()).join('\n');
    
    // Remover espaços no início e fim do texto completo
    return text.trim();
  };

  // Função para abrir o modal de edição
  const openEditModal = useCallback((sectionId) => {
    if (!apostilaRef.current) return;
    
    const section = apostilaRef.current.querySelector(`#${sectionId}`);
    if (!section) return;
    
    // Extrair texto puro do HTML
    const plainText = extractPlainText(section.innerHTML);
    
    setEditingSectionId(sectionId);
    setEditingText(plainText);
    setShowEditModal(true);
  }, []);

  // Função para salvar as alterações
  const saveEdit = async () => {
    if (!editingSectionId || !apostilaRef.current) return;
    
    setIsSaving(true);
    try {
      // Encontrar a seção no DOM
      const section = apostilaRef.current.querySelector(`#${editingSectionId}`);
      if (!section) {
        alert('Seção não encontrada.');
        return;
      }

      // Converter o texto simples de volta para HTML preservando quebras de linha
      // Dividir em parágrafos (dupla quebra de linha ou mais)
      const paragraphs = editingText
        .split(/\n\s*\n/)
        .filter(para => para.trim() !== '')
        .map(para => {
          // Dentro de cada parágrafo, converter quebras de linha simples em <br>
          const lines = para.trim().split('\n').map(line => line.trim()).join('<br>');
          return `<p>${lines}</p>`;
        })
        .join('\n');

      // Atualizar o DOM localmente primeiro
      section.innerHTML = paragraphs;

      // Atualizar o HTML original usando replace em string para preservar exatamente a estrutura
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sectionInDoc = doc.querySelector(`#${editingSectionId}`);
      
      if (!sectionInDoc) {
        console.error('Seção não encontrada no HTML original!');
        alert('Erro: Seção não encontrada no HTML original.');
        return;
      }
      
      const oldContent = sectionInDoc.innerHTML;
      
      // Substituir o conteúdo antigo pelo novo no HTML string
      let updatedHtml = html.replace(oldContent, paragraphs);

      // Salvar no Supabase (na coluna 'file')
      const { error, data } = await supabase
        .from('files')
        .update({ 
          file: updatedHtml
        })
        .eq('id', apostilaId)
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        alert('Erro ao salvar as alterações. Tente novamente.');
        return;
      }
      
      if (!data || data.length === 0) {
        console.error('Nenhum dado retornado do Supabase');
        alert('Erro: A apostila não foi encontrada ou você não tem permissão para editá-la.');
        return;
      }
      
      console.log('Salvo com sucesso no Supabase!');

      // Atualizar o state local do HTML para que próximas edições funcionem
      setHtml(updatedHtml);

      // Fechar modal
      setShowEditModal(false);
      setEditingSectionId(null);
      setEditingText('');
      
      alert('Alterações salvas com sucesso!');
      
      // Recarregar a página para buscar o HTML atualizado do Supabase
      window.location.reload();
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
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
                  
                  <div className="mb-4 text-sm text-gray-600">
                    Edite o texto da seção abaixo. Use <strong>Enter</strong> para quebras de linha e <strong>Enter duplo</strong> para separar parágrafos.
                  </div>

                  <div className="flex-1 overflow-y-auto mb-4">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full h-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
                      placeholder="Digite o texto da seção aqui...&#10;&#10;Use Enter para quebrar linhas&#10;Use Enter duplo para separar parágrafos"
                      disabled={isSaving}
                    />
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

