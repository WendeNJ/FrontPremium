// ══════════════════════════════════════════════════════════════════════
// TRECHO 1 — Botão no card da lista (substitui o botão "Editar Status")
// ══════════════════════════════════════════════════════════════════════
// Dentro do .map de manifestacoesFiltradas, substitua o botão Editar Status:

/*
<Button
  onClick={() => abrirModal(manifestacao)}
  className={`rounded-full px-6 shadow-lg transition-all ${
    manifestacao.status === 'RESPONDIDA' || manifestacao.resposta
      ? 'bg-gray-200 text-gray-500 cursor-default hover:bg-gray-200'
      : 'bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white hover:shadow-xl'
  }`}
>
  {manifestacao.status === 'RESPONDIDA' || manifestacao.resposta
    ? <><Eye className="w-4 h-4 mr-2" />Ver Resposta</>
    : <><Edit className="w-4 h-4 mr-2" />Editar Status</>
  }
</Button>
*/

// ══════════════════════════════════════════════════════════════════════
// TRECHO 2 — Dentro do modal, logo após <div className="p-6 space-y-6">
// ══════════════════════════════════════════════════════════════════════
// Adicione esta constante ANTES do return do modal (fora do JSX):
// const jaRespondida = manifestacaoSelecionada?.status === 'RESPONDIDA' || !!manifestacaoSelecionada?.resposta

// Então dentro do modal, logo após abrir o div de conteúdo:
/*
{jaRespondida && (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
    <p className="text-sm text-amber-800 font-medium">
      Esta manifestação já foi respondida e não pode mais ser alterada.
    </p>
  </div>
)}
*/

// ══════════════════════════════════════════════════════════════════════
// TRECHO 3 — Select de status com bloqueio
// ══════════════════════════════════════════════════════════════════════
/*
<select
  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
  value={formEdicao.status}
  onChange={(e) => setFormEdicao({ ...formEdicao, status: e.target.value })}
  disabled={salvando || jaRespondida}
>
  {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
</select>
*/

// ══════════════════════════════════════════════════════════════════════
// TRECHO 4 — Botão Salvar com bloqueio
// ══════════════════════════════════════════════════════════════════════
/*
<Button
  onClick={salvarAlteracoes}
  className={`flex-1 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 ${
    formEdicao.status === 'RESPONDIDA'
      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
      : 'bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A]'
  }`}
  disabled={salvando || jaRespondida || (formEdicao.status === 'RESPONDIDA' && !formEdicao.resposta.trim())}
>
  {salvando
    ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Salvando...</span>
    : jaRespondida
      ? <span className="flex items-center gap-2"><Eye className="w-4 h-4" />Somente Leitura</span>
      : formEdicao.status === 'RESPONDIDA'
        ? <span className="flex items-center gap-2"><Send className="w-4 h-4" />Enviar Resposta</span>
        : <span className="flex items-center gap-2"><Save className="w-4 h-4" />Salvar Alterações</span>
  }
</Button>
*/
