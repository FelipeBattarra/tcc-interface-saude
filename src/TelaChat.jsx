import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// TELA DE CHAT — O MVP interativo para o Idoso
// ─────────────────────────────────────────────────────────────
export default function TelaChat({ onFinalizar }) {
  const [mensagens, setMensagens] = useState([]);
  const [opcoesAtuais, setOpcoesAtuais] = useState([]);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [digitando, setDigitando] = useState(false);
  const mensagensFimRef = useRef(null);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, opcoesAtuais, digitando]);

  // Mensagem Inicial
  useEffect(() => {
    setDigitando(true);
    const timer = setTimeout(() => {
      setDigitando(false);
      setMensagens([{ remetente: 'bot', texto: 'Olá! Sou o Assistente de Saúde Municipal de Franca. Como posso ajudar o senhor(a) hoje?' }]);
      setOpcoesAtuais([
        { id: 'btn_agendar', label: 'Agendar Consulta (Postinho)' },
        { id: 'btn_urgencia', label: 'Informações de Urgência (PS)' }
      ]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCliqueBotao = (botao) => {
    // 1. Grava Telemetria
    const novoEvento = { evento: 'click_botao', nome_botao: botao.label, timestamp: Date.now() };
    const novosEventos = [...sessionEvents, novoEvento];
    setSessionEvents(novosEventos);

    // 2. Atualiza a tela (Idoso falando)
    setMensagens((prev) => [...prev, { remetente: 'usuario', texto: botao.label }]);
    setOpcoesAtuais([]);
    setDigitando(true);

    // 3. Árvore de Decisão
    setTimeout(() => {
      setDigitando(false);

      if (botao.id === 'btn_agendar') {
        setMensagens((prev) => [...prev, { remetente: 'bot', texto: 'Qual é o motivo principal da consulta?' }]);
        setOpcoesAtuais([
          { id: 'sint_rotina', label: 'Consulta de Rotina / Receita' },
          { id: 'sint_dor', label: 'Dor ou Mal-estar leve' },
          { id: 'sint_cronico', label: 'Acompanhamento (Pressão/Diabetes)' }
        ]);
      } 
      else if (botao.id.startsWith('sint_')) {
        setMensagens((prev) => [...prev, { remetente: 'bot', texto: 'Certo. Para qual Unidade (UBS) mais próxima o senhor(a) deseja o agendamento?' }]);
        setOpcoesAtuais([
          { id: 'ubs_leporace', label: 'UBS Parque Vicente Leporace' },
          { id: 'ubs_aeroporto', label: 'UBS Jardim Aeroporto' },
          { id: 'ubs_estacao', label: 'UBS Estação' }
        ]);
      }
      else if (botao.id.startsWith('ubs_')) {
        setMensagens((prev) => [...prev, { remetente: 'bot', texto: 'Temos vagas para a próxima semana. Qual período é melhor para o senhor(a)?' }]);
        setOpcoesAtuais([
          { id: 'hora_manha', label: 'Manhã (08:00 às 11:00)' },
          { id: 'hora_tarde', label: 'Tarde (13:00 às 16:00)' }
        ]);
      }
      else if (botao.id === 'btn_urgencia') {
        setMensagens((prev) => [...prev, { remetente: 'bot', texto: 'Casos de urgência não são agendados. Escolha a unidade para ver o endereço e funcionamento:' }]);
        setOpcoesAtuais([
          { id: 'ps_azzuz', label: 'Pronto Socorro Álvaro Azzuz (Adulto)' },
          { id: 'ps_infantil', label: 'Pronto Socorro Infantil (PSI)' }
        ]);
      }
      else if (botao.id.startsWith('hora_') || botao.id.startsWith('ps_')) {
        setMensagens((prev) => [...prev, { remetente: 'bot', texto: 'Tudo certo! Sua solicitação foi registrada no sistema. O teste terminou, muito obrigado pela ajuda!' }]);
        
        // Dá um pequeno tempo para o idoso ler a última mensagem e chama o App.jsx para salvar
        setTimeout(() => {
          onFinalizar(novosEventos);
        }, 3500);
      }
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#E5DDD5', fontFamily: "'Segoe UI', Helvetica, sans-serif" }}>
      
      {/* ── HEADER TIPO WHATSAPP ── */}
      <div style={{ backgroundColor: '#075E54', padding: '10px 15px', display: 'flex', alignItems: 'center', color: 'white', zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{ width: 40, height: 40, backgroundColor: '#ccc', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 600 }}>Assistente de Saúde - Franca</h2>
            <p style={{ fontSize: 13, margin: 0, color: '#rgba(255,255,255,0.8)' }}>Conta Oficial</p>
          </div>
        </div>
      </div>

      {/* ── ÁREA DE MENSAGENS ── */}
      <div style={{ flex: 1, padding: '20px 15px', overflowY: 'auto', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
        
        {/* Aviso de Segurança */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ backgroundColor: '#FFF3C2', color: '#66572D', fontSize: 12, padding: '5px 12px', borderRadius: 10, display: 'inline-block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
            As mensagens são protegidas. Este é um ambiente seguro do SUS.
          </span>
        </div>

        {mensagens.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.remetente === 'bot' ? 'flex-start' : 'flex-end', marginBottom: 12 }}>
            <div style={{
              maxWidth: '85%', padding: '8px 12px', borderRadius: 8, fontSize: 15, lineHeight: '1.4', position: 'relative',
              backgroundColor: msg.remetente === 'bot' ? '#FFFFFF' : '#DCF8C6',
              color: '#303030',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              borderTopLeftRadius: msg.remetente === 'bot' ? 0 : 8,
              borderTopRightRadius: msg.remetente === 'usuario' ? 0 : 8,
            }}>
              {msg.texto}
              <div style={{ fontSize: 10, color: '#999', textAlign: 'right', marginTop: 4, float: 'right', marginLeft: 15 }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de Digitação */}
        {digitando && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 15px', borderRadius: 8, borderTopLeftRadius: 0, boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
              <span style={{ fontStyle: 'italic', color: '#128C7E', fontSize: 14 }}>Digitando...</span>
            </div>
          </div>
        )}

        {/* ── BOTÕES DO WORKFLOW (Aparecem embaixo da mensagem do bot) ── */}
        {!digitando && opcoesAtuais.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 5, maxWidth: '85%' }}>
            {opcoesAtuais.map(opcao => (
              <button
                key={opcao.id}
                onClick={() => handleCliqueBotao(opcao)}
                style={{
                  backgroundColor: '#00A884', color: 'white', border: 'none', padding: '12px 15px', borderRadius: 8,
                  fontSize: 15, fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#018A6D'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00A884'}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        )}
        <div ref={mensagensFimRef} />
      </div>

      {/* ── BARRA INFERIOR FALSA (Apenas estética para manter a familiaridade) ── */}
      <div style={{ backgroundColor: '#F0F0F0', padding: '10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: '10px 15px', color: '#999', fontSize: 15 }}>
          Toque nos botões acima...
        </div>
        <div style={{ width: 40, height: 40, backgroundColor: '#00A884', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </div>
      </div>
    </div>
  );
}