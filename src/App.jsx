import React, { useState } from 'react';
// Importe as telas que o Claude já gerou para você
import TelaSetup from './TelaSetup';
import TelaChat from './TelaChat';

// ─────────────────────────────────────────────────────────────
// Configuração do Banco de Dados (Supabase)
// Substitua pelas suas chaves após criar o projeto no Supabase
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://uhipqfberzrpcgvpfjvr.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaXBxZmJlcnpycGNndnBmanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MzUzNzgsImV4cCI6MjA5NjExMTM3OH0.5OHhe-oEBm3smqQqCD2rKHKsxVv3-s9Yk0mnDiMYy3E';

export default function App() {
  // Estado para controlar qual tela aparece ('setup' ou 'chat')
  const [telaAtual, setTelaAtual] = useState('setup');

  // Estado para guardar os dados demográficos do idoso
  const [dadosPesquisa, setDadosPesquisa] = useState(null);

  // ── Função chamada quando você clica em "Iniciar Teste" na Tela de Setup ──
  const handleIniciarTeste = (dadosDoFormulario) => {
    // Grava a hora exata que o teste começou
    const dadosComTempo = {
      ...dadosDoFormulario,
      timestamp_inicio: Date.now(),
    };
    setDadosPesquisa(dadosComTempo);
    setTelaAtual('chat'); // Muda para a tela do WhatsApp

    // Log de início para o pesquisador acompanhar no console
    console.groupCollapsed('[APP] ══ TESTE INICIADO ══');
    console.table(dadosComTempo);
    console.groupEnd();
  };

  // ── Função chamada quando o chat termina (na última mensagem do bot) ──
  const handleFinalizarTeste = async (eventosDoChat) => {
    // Monta o pacote final de dados para o TCC
    const payloadFinal = {
      idade: dadosPesquisa.idade,
      genero: dadosPesquisa.genero,
      escolaridade: dadosPesquisa.escolaridade,
      familiaridade_whatsapp: dadosPesquisa.familiaridade,
      timestamp_inicio: dadosPesquisa.timestamp_inicio,
      timestamp_fim: Date.now(),
      // Calcula a duração da sessão em segundos
      duracao_segundos: Math.round(
        (Date.now() - dadosPesquisa.timestamp_inicio) / 1000
      ),
      // Total de cliques registrados pela telemetria
      total_cliques: eventosDoChat.length,
      // Array completo de eventos serializado como JSON
      eventos_json: eventosDoChat,
    };

    console.log('[APP] Salvando no banco de dados...', payloadFinal);

    // ── Envia para o Supabase via API REST nativa (sem bibliotecas extras) ──
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/telemetria_sessoes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            // Retorna o registro criado (útil para confirmar o ID gerado)
            Prefer: 'return=representation',
          },
          body: JSON.stringify(payloadFinal),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const registrado = await response.json();
      console.log('[APP] ✅ Salvo com sucesso! ID:', registrado?.[0]?.id);
      alert(
        '✅ Sucesso! Telemetria salva.\nO celular já pode ir para o próximo participante.'
      );

      // Volta para a tela inicial limpa, pronto para o próximo participante
      setTelaAtual('setup');
      setDadosPesquisa(null);
    } catch (error) {
      console.error('[APP] ❌ Erro ao salvar:', error);
      alert(
        '❌ Erro ao salvar no banco.\n\n' +
          'Verifique:\n' +
          '1. Conexão com a internet\n' +
          '2. SUPABASE_URL e SUPABASE_KEY corretos\n' +
          '3. Tabela "telemetria_sessoes" criada no Supabase\n\n' +
          'Os dados foram mantidos no console (F12 → Console).'
      );
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md h-full bg-white shadow-xl overflow-hidden relative">
        {/* Renderiza a tela correta baseada no estado */}
        {telaAtual === 'setup' && <TelaSetup onIniciar={handleIniciarTeste} />}
        {telaAtual === 'chat' && dadosPesquisa && (
          <TelaChat onFinalizar={handleFinalizarTeste} />
        )}
      </div>
    </div>
  );
}
