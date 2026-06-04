import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// TELA DE CHAT INTERATIVO — MVP DO IDOSO (VERSÃO FINAL UNIFICADA)
// ─────────────────────────────────────────────────────────────
export default function TelaChat({ onFinalizar }) {
  const [mensagens, setMensagens] = useState([]);
  const [opcoesAtuais, setOpcoesAtuais] = useState([]);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [digitando, setDigitando] = useState(false);
  
  const mensagensFimRef = useRef(null);

  // Rolagem automática da tela para acompanhar o diálogo
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, opcoesAtuais, digitando]);

  // ⚡ MENSAGEM INICIAL DE ACORDAMENTO DO BOT
  useEffect(() => {
    setDigitando(true);
    const timer = setTimeout(() => {
      setDigitando(false);
      setMensagens([{ remetente: 'bot', texto: 'Olá! Sou o Assistente de Saúde Municipal de Franca. Como posso ajudar o senhor(a) hoje?' }]);
      setOpcoesAtuais([
        { id: 'btn_agendar', label: 'Agendar Consulta (Postinho)', disponivel: true },
        { id: 'btn_urgencia', label: 'Informações de Urgência (PS)', disponivel: true }
      ]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 📅 MOTOR DE GERAÇÃO DO CALENDÁRIO DINÂMICO REALÍSTICO
  const gerarCalendarioDinamico = () => {
    const dias = [];
    const dataAtual = new Date(); // Captura a data real do sistema
    let diasAdicionados = 0;

    // Varre os próximos dias buscando os 4 primeiros dias úteis válidos
    while (diasAdicionados < 4) {
      dataAtual.setDate(dataAtual.getDate() + 1);
      
      // Filtra finais de semana (0 = Domingo, 6 = Sábado)
      if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
        
        // Simulação Estatística: 60% de chance de vaga livre, 40% de lotação na UBS
        const temVaga = Math.random() > 0.4; 
        
        // Formata o texto amigável (Ex: "ter., 16/06")
        const diaFormatado = dataAtual.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        
        dias.push({
          id: `data_${diasAdicionados}`,
          label: temVaga ? `🗓️ ${diaFormatado}` : `🚫 ${diaFormatado} (Esgotado)`,
          disponivel: temVaga,
          dataLimpa: diaFormatado // Texto puro para impressão no balão do usuário
        });
        diasAdicionados++;
      }
    }
    return dias;
  };

  // 🌲 ÁRVORE DE DECISÃO LOGÍSTICA E RASTREAMENTO DE TELEMETRIA
  const handleCliqueBotao = (botao) => {
    // Cláusula de barreira: impede cliques em botões desabilitados (dias esgotados)
    if (!botao.disponivel) return;

    // Preserva e atualiza o estado de eventos para a telemetria (evita concorrência assíncrona)
    const novoEvento = { evento: 'click_botao', nome_botao: botao.label, timestamp: Date.now() };
    const novosEventos = [...sessionEvents, novoEvento];
    setSessionEvents(novosEventos);
    
    // Formata o texto de exibição no chat
    const textoMensagem = botao.dataLimpa ? botao.dataLimpa : (botao.label.replace('🗓️ ', ''));
    setMensagens(prev => [...prev, { remetente: 'usuario', texto: textoMensagem }]);
    
    setOpcoesAtuais([]);
    setDigitando(true);

    // Latência intencional para emular o tempo de resposta humana do robô
    setTimeout(() => {
      setDigitando(false);

      // PASSO 1: Seleção de Agendamento Eletivo
      if (botao.id === 'btn_agendar') {
        setMensagens(prev => [...prev, { remetente: 'bot', texto: 'Qual é o motivo principal da consulta?' }]);
        setOpcoesAtuais([
          { id: 'sint_rotina', label: 'Consulta de Rotina / Receita', disponivel: true },
          { id: 'sint_dor', label: 'Dor ou Mal-estar leve', disponivel: true },
          { id: 'sint_cronico', label: 'Acompanhamento (Pressão)', disponivel: true }
        ]);
      } 
      // PASSO 2: Seleção de Sintomas -> Encaminha para UBSs locais
      else if (botao.id.startsWith('sint_')) {
        setMensagens(prev => [...prev, { remetente: 'bot', texto: 'Certo. Para qual Unidade (UBS) mais próxima deseja o agendamento?' }]);
        setOpcoesAtuais([
          { id: 'ubs_leporace', label: 'UBS Parque Vicente Leporace', disponivel: true },
          { id: 'ubs_aeroporto', label: 'UBS Jardim Aeroporto', disponivel: true },
          { id: 'ubs_estacao', label: 'UBS Estação', disponivel: true }
        ]);
      }
      // PASSO 3: Seleção da UBS -> Dispara a montagem do calendário dinâmico
      else if (botao.id.startsWith('ubs_')) {
        setMensagens(prev => [...prev, { remetente: 'bot', texto: 'Aqui estão os próximos dias úteis. Alguns dias já não têm vagas. Por favor, selecione uma data disponível:' }]);
        const diasCalendario = gerarCalendarioDinamico();
        setOpcoesAtuais(diasCalendario);
      }
      // PASSO 4: Seleção da Data Válida -> Pergunta o turno
      else if (botao.id.startsWith('data_')) {
        setMensagens(prev => [...prev, { remetente: 'bot', texto: 'Excelente. Qual período do dia é melhor para o senhor(a)?' }]);
        setOpcoesAtuais([
          { id: 'hora_manha', label: 'Manhã (08:00 às 11:00)', disponivel: true },
          { id: 'hora_tarde', label: 'Tarde (13:00 às 16:00)', disponivel: true }
        ]);
      }
      // PASSO INTERMEDIÁRIO DE URGÊNCIA: Lista os Prontos-Socorros
      else if (botao.id === 'btn_urgencia') {
        setMensagens(prev => [...prev, { remetente: 'bot', texto: '⚠️ Atenção: Casos de urgência não são agendados. Escolha a unidade para ver o endereço:' }]);
        setOpcoesAtuais([
          { id: 'ps_azzuz', label: 'Pronto Socorro Álvaro Azzuz', disponivel: true },
          { id: 'ps_infantil', label: 'Pronto Socorro Infantil (PSI)', disponivel: true }
        ]);
      }
      
      // 🚨 DESFECHO A: Fluxo de Urgência Adulto (Exibe endereço físico mapeado)
      else if (botao.id === 'ps_azzuz') {
        setMensagens(prev => [
          ...prev, 
          { remetente: 'bot', texto: `📍 *Pronto Socorro Álvaro Azzuz (Adulto)*\n\nEndereço: Av. Chico Júlio, 5125 - Vila Imperador\nAtendimento: 24 horas.` },
          { remetente: 'bot', texto: `Dirija-se imediatamente à unidade. O teste terminou. Muito obrigado pela sua ajuda!` }
        ]);
        setTimeout(() => { onFinalizar(novosEventos); }, 4000);
      }
      // 🚨 DESFECHO B: Fluxo de Urgência Infantil (Exibe endereço físico mapeado)
      else if (botao.id === 'ps_infantil') {
        setMensagens(prev => [
          ...prev, 
          { remetente: 'bot', texto: `📍 *Pronto Socorro Infantil (PSI)*\n\nEndereço: R. Aluísio Pachêco Ferreira, 4010 - Jardim Maria Gabriela\nAtendimento: 24 horas.` },
          { remetente: 'bot', texto: `Dirija-se imediatamente à unidade com a criança. O teste terminou. Muito obrigado pela sua ajuda!` }
        ]);
        setTimeout(() => { onFinalizar(novosEventos); }, 4000);
      }
      
      // 🏁 DESFECHO C: Fluxo de Agendamento Concluído (Gera Token / Protocolo)
      else if (botao.id.startsWith('hora_')) {
        const protocolo = Math.floor(10000000 + Math.random() * 90000000);
        setMensagens(prev => [
          ...prev, 
          { remetente: 'bot', texto: `Tudo certo! A sua solicitação foi registrada com sucesso no sistema da Prefeitura.` },
          { remetente: 'bot', texto: `📌 O seu número de protocolo é: *${protocolo}*.\n\nO teste terminou. Muito obrigado pela sua ajuda!` }
        ]);
        setTimeout(() => { onFinalizar(novosEventos); }, 4000);
      }
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#E5DDD5', fontFamily: "'Segoe UI', Helvetica, sans-serif" }}>
      
      {/* ── HEADER IDENTITÁRIO (WHATSAPP BUSINESS MOCKUP) ── */}
      <div style={{ backgroundColor: '#075E54', padding: '10px 15px', display: 'flex', alignItems: 'center', color: 'white', zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{ width: 40, height: 40, backgroundColor: '#fff', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>🏥</span>
          </div>
          <div>
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              Assistente de Saúde
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.4-1.4 2.7 2.7 6.5-6.5 1.4 1.4-8.1 8z"/></svg>
            </h2>
            <p style={{ fontSize: 12, margin: 0, color: 'rgba(255,255,255,0.8)' }}>Franca - SP</p>
          </div>
        </div>
      </div>

      {/* ── ESTILIZAÇÃO DO CONTEXTO DE CONVERSA ── */}
      <div style={{ flex: 1, padding: '20px 15px', overflowY: 'auto', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
        
        {mensagens.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.remetente === 'bot' ? 'flex-start' : 'flex-end', marginBottom: 12 }}>
            <div style={{
              maxWidth: '85%', padding: '8px 12px', borderRadius: 8, fontSize: 15, lineHeight: '1.4', position: 'relative',
              backgroundColor: msg.remetente === 'bot' ? '#FFFFFF' : '#DCF8C6',
              color: '#303030',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              borderTopLeftRadius: msg.remetente === 'bot' ? 0 : 8,
              borderTopRightRadius: msg.remetente === 'usuario' ? 0 : 8,
              whiteSpace: 'pre-line'
            }}>
              {msg.texto}
              <div style={{ fontSize: 10, color: '#999', textAlign: 'right', marginTop: 4, float: 'right', marginLeft: 15 }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {digitando && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 15px', borderRadius: 8, borderTopLeftRadius: 0, boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
              <span style={{ fontStyle: 'italic', color: '#128C7E', fontSize: 14 }}>A digitar...</span>
            </div>
          </div>
        )}

        {/* ── BOTÕES ACESSÍVEIS (MÓDULO WORKFLOWS COM CONTROLE DE SINALIZAÇÃO) ── */}
        {!digitando && opcoesAtuais.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 5, maxWidth: '85%' }}>
            {opcoesAtuais.map(opcao => (
              <button
                key={opcao.id}
                onClick={() => handleCliqueBotao(opcao)}
                disabled={!opcao.disponivel}
                style={{
                  backgroundColor: opcao.disponivel ? '#00A884' : '#E5E7EB',
                  color: opcao.disponivel ? 'white' : '#6B7280',
                  border: opcao.disponivel ? 'none' : '1px solid #D1D5DB',
                  padding: '12px 15px', borderRadius: 8,
                  fontSize: 15, fontWeight: 'bold', 
                  cursor: opcao.disponivel ? 'pointer' : 'not-allowed', 
                  textAlign: 'center', 
                  boxShadow: opcao.disponivel ? '0 2px 5px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        )}
        <div ref={mensagensFimRef} />
      </div>

      {/* ── RODAPÉ ESTATÍSTICO DE ANCORAGEM MENTAL ── */}
      <div style={{ backgroundColor: '#F0F0F0', padding: '10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: '10px 15px', color: '#999', fontSize: 15 }}>
          Selecione uma opção acima...
        </div>
        <div style={{ width: 40, height: 40, backgroundColor: '#00A884', opacity: 0.5, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </div>
      </div>
    </div>
  );
}