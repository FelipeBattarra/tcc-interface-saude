import { useState } from 'react';

// ─────────────────────────────────────────────────────────────
// TELA DE SETUP — Módulo do Pesquisador
//
// Props:
//   onIniciar(dadosDoFormulario) → chamada pelo App.jsx ao clicar
//                                  "Iniciar Teste". Recebe o objeto:
//   {
//     idade:         number,   // 18–120
//     genero:        string,   // 'M' | 'F' | 'NB' | 'NI'
//     escolaridade:  string,   // 'fund_inc' | 'medio_comp' | etc.
//     familiaridade: number,   // 1–5
//   }
// ─────────────────────────────────────────────────────────────
export default function TelaSetup({ onIniciar }) {
  const [form,  setForm]  = useState({ idade: '', genero: '', escolaridade: '', familiaridade: 0 });
  const [erros, setErros] = useState({});

  // ── Validação antes de liberar o teste ──
  const validar = () => {
    const e = {};
    if (!form.idade || Number(form.idade) < 18 || Number(form.idade) > 120)
      e.idade = 'Informe uma idade válida (18–120).';
    if (!form.genero)        e.genero        = 'Selecione o gênero.';
    if (!form.escolaridade)  e.escolaridade  = 'Selecione a escolaridade.';
    if (!form.familiaridade) e.familiaridade = 'Selecione a familiaridade.';
    return e;
  };

  const handleIniciar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErros(e); return; }
    // Passa o formulário para o App.jsx (que adiciona timestamp_inicio)
    onIniciar({ ...form, idade: Number(form.idade) });
  };

  const famLabels = { 1: 'Nunca usa', 2: 'Raramente', 3: 'Às vezes', 4: 'Frequentemente', 5: 'Todo dia' };

  const inputBase = (chave) => ({
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    border: `1.5px solid ${erros[chave] ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: 9, fontSize: 15, color: '#1E293B',
    background: '#F8FAFC', outline: 'none', appearance: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.15s',
  });

  return (
    <div style={{
      minHeight: '100%', background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5 50%, #F0F9FF)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 440, background: 'white', borderRadius: 20,
        boxShadow: '0 8px 40px rgba(7,94,84,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>

        {/* ── Header verde ── */}
        <div style={{
          background: 'linear-gradient(135deg, #075E54, #128C7E)',
          padding: '24px 26px 20px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Círculos decorativos */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80,  height: 80,  borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, position: 'relative' }}>
            <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M12 16h.01"
                  stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', margin: 0 }}>
                MÓDULO DO PESQUISADOR
              </p>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>Cadastro do Participante</p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, margin: 0, lineHeight: 1.55, position: 'relative' }}>
            Preencha antes de entregar o dispositivo. O timestamp é capturado automaticamente.
          </p>
        </div>

        {/* ── Formulário ── */}
        <div style={{ padding: '26px 26px 22px' }}>

          {/* Idade */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Idade (anos)
            </label>
            <input
              type="number" min={18} max={120} placeholder="Ex: 68"
              value={form.idade}
              onChange={e => { setForm({ ...form, idade: e.target.value }); setErros({ ...erros, idade: null }); }}
              style={inputBase('idade')}
            />
            {erros.idade && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>⚠ {erros.idade}</p>}
          </div>

          {/* Gênero */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Gênero
            </label>
            <select
              value={form.genero}
              onChange={e => { setForm({ ...form, genero: e.target.value }); setErros({ ...erros, genero: null }); }}
              style={inputBase('genero')}
            >
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="NB">Não-binário</option>
              <option value="NI">Prefiro não informar</option>
            </select>
            {erros.genero && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>⚠ {erros.genero}</p>}
          </div>

          {/* Escolaridade */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Escolaridade
            </label>
            <select
              value={form.escolaridade}
              onChange={e => { setForm({ ...form, escolaridade: e.target.value }); setErros({ ...erros, escolaridade: null }); }}
              style={inputBase('escolaridade')}
            >
              <option value="">Selecione...</option>
              <option value="sem_formal">Sem escolaridade formal</option>
              <option value="fund_inc">Ensino Fundamental Incompleto</option>
              <option value="fund_comp">Ensino Fundamental Completo</option>
              <option value="medio_inc">Ensino Médio Incompleto</option>
              <option value="medio_comp">Ensino Médio Completo</option>
              <option value="sup_inc">Ensino Superior Incompleto</option>
              <option value="sup_comp">Ensino Superior Completo</option>
            </select>
            {erros.escolaridade && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>⚠ {erros.escolaridade}</p>}
          </div>

          {/* Familiaridade com WhatsApp */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Familiaridade com WhatsApp
            </label>
            <div style={{ display: 'flex', gap: 7 }}>
              {[1, 2, 3, 4, 5].map(n => {
                const sel = form.familiaridade === n;
                return (
                  <button
                    key={n}
                    onClick={() => { setForm({ ...form, familiaridade: n }); setErros({ ...erros, familiaridade: null }); }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 9,
                      fontSize: 15, fontWeight: 700, cursor: 'pointer',
                      border: `2px solid ${sel ? '#075E54' : '#E2E8F0'}`,
                      background: sel ? '#075E54' : 'white',
                      color: sel ? 'white' : '#94A3B8',
                      transform: sel ? 'scale(1.06)' : 'scale(1)',
                      transition: 'all 0.14s',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 5 }}>
              {form.familiaridade ? `${form.familiaridade} — ${famLabels[form.familiaridade]}` : '1 = Nunca usa · 5 = Todo dia'}
            </p>
            {erros.familiaridade && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 2 }}>⚠ {erros.familiaridade}</p>}
          </div>

          {/* ── Botão Iniciar Teste ── */}
          <button
            onClick={handleIniciar}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 12,
              background: 'linear-gradient(135deg, #25D366, #1aac52)',
              color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.35)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M10 8l6 4-6 4V8z" fill="white" />
            </svg>
            Iniciar Teste
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#CBD5E1', marginTop: 12 }}>
            Dados anonimizados · LGPD art. 7º, inciso II
          </p>
        </div>
      </div>
    </div>
  );
}
