import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { base44 } from '@/api/base44Client'
import { usersAPI, auditoresAPI } from '@/api/ouvidoriaApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Search, X, Edit, Save, AlertCircle, CheckCircle, XCircle,
  RefreshCw, Menu, ArrowLeft, Loader2, LogOut, Eye, Shield,
  Users, Clock, FileText, MessageSquare, Filter, ChevronDown,
  UserPlus, Trash2, Mail, Bell, BellOff, CheckCircle2, AlertTriangle,
  Paperclip, Download, Send,
} from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'
const API_BASE = import.meta.env.VITE_API_URL || 'https://heineken-backend-api-fuc5.onrender.com'
const MAX_AUDITORES = 4

const STATUS_OPTIONS = [
  { value: 'ABERTA',     label: 'Aberta',     color: 'bg-blue-500/20 text-blue-500',    icon: AlertCircle },
  { value: 'EM_ANALISE', label: 'Em Análise', color: 'bg-yellow-500/20 text-yellow-500', icon: RefreshCw },
  { value: 'RESPONDIDA', label: 'Respondida', color: 'bg-green-500/20 text-green-500',  icon: CheckCircle },
]

export default function AdminOuvidoria() {
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUser,    setLoginUser]    = useState('')
  const [loginPass,    setLoginPass]    = useState('')
  const [loginError,   setLoginError]   = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [accessCount,    setAccessCount]    = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab,      setActiveTab]      = useState('manifestacoes')

  const [manifestacoes,           setManifestacoes]           = useState([])
  const [loadingManifestacoes,    setLoadingManifestacoes]    = useState(true)
  const [filtroStatus,            setFiltroStatus]            = useState('TODAS')
  const [busca,                   setBusca]                   = useState('')
  const [showFilters,             setShowFilters]             = useState(false)
  const [modalAberto,             setModalAberto]             = useState(false)
  const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null)
  const [salvando,                setSalvando]                = useState(false)
  const [formEdicao,              setFormEdicao]              = useState({ status: '', resposta: '' })

  const [auditores,        setAuditores]        = useState([])
  const [loadingAuditores, setLoadingAuditores] = useState(false)
  const [novoEmail,        setNovoEmail]        = useState('')
  const [novoNome,         setNovoNome]         = useState('')
  const [addingAuditor,    setAddingAuditor]    = useState(false)
  const [removingId,       setRemovingId]       = useState(null)
  const [auditorFeedback,  setAuditorFeedback]  = useState(null)

  useEffect(() => {
    const checkLogin = async () => {
      try { await usersAPI.testAuth(); setIsAuthenticated(true) } catch { setIsAuthenticated(false) }
    }
    checkLogin()
  }, [])

  useEffect(() => {
    const count = parseInt(localStorage.getItem('ouvidoriaAdminAccessCount') || '0') + 1
    setAccessCount(count)
    localStorage.setItem('ouvidoriaAdminAccessCount', count.toString())
  }, [])

  useEffect(() => {
    if (isAuthenticated) { carregarManifestacoes(); carregarAuditores() }
  }, [isAuthenticated])

  async function carregarManifestacoes() {
    setLoadingManifestacoes(true)
    try { const data = await base44.entities.Manifestacoes.list(); setManifestacoes(data || []) }
    catch (err) { console.error('Erro ao carregar manifestações:', err) }
    finally { setLoadingManifestacoes(false) }
  }

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError(''); setLoginLoading(true)
    try { await usersAPI.login({ email: loginUser, password: loginPass }); setIsAuthenticated(true) }
    catch (err) { setLoginError(err.response?.data?.message || 'Usuário ou senha inválidos') }
    finally { setLoginLoading(false) }
  }

  const handleLogout = async () => {
    try { await usersAPI.logout() } catch {}
    setIsAuthenticated(false); setLoginUser(''); setLoginPass(''); navigate('/ouvidoria')
  }

  function abrirModal(manifestacao) {
    setManifestacaoSelecionada(manifestacao)
    setFormEdicao({
      status: manifestacao.status || 'ABERTA',
      resposta: manifestacao.resposta || '',
    })
    setModalAberto(true)
  }

  function fecharModal() { setModalAberto(false); setManifestacaoSelecionada(null) }

  async function salvarAlteracoes() {
    if (!manifestacaoSelecionada) return
    if (formEdicao.status === 'RESPONDIDA' && !formEdicao.resposta.trim()) {
      alert('Por favor, preencha a resposta antes de marcar como Respondida.')
      return
    }
    setSalvando(true)
    try {
      const protocolo = manifestacaoSelecionada.protocolo
      if (!protocolo) throw new Error('Protocolo não encontrado')
      await base44.entities.Manifestacoes.atualizarStatus(protocolo, formEdicao.status, formEdicao.resposta.trim() || undefined)
      fecharModal(); carregarManifestacoes()
    } catch (err) { alert('Erro: ' + err.message) }
    finally { setSalvando(false) }
  }

  const manifestacoesFiltradas = manifestacoes.filter((m) => {
    const matchStatus = filtroStatus === 'TODAS' || m.status === filtroStatus
    const matchBusca = m.protocolo?.toLowerCase().includes(busca.toLowerCase())
      || m.nome?.toLowerCase().includes(busca.toLowerCase())
      || m.email?.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  function formatarData(dataString) {
    if (!dataString) return ''
    return new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function formatarTipo(tipo) {
    const tipos = { RECLAMACAO: 'Reclamação', DENUNCIA: 'Denúncia', SUGESTAO: 'Sugestão', ELOGIO: 'Elogio', SOLICITACAO: 'Solicitação' }
    return tipos[tipo?.toUpperCase()] || tipo || 'Não informado'
  }

  const stats = {
    total: manifestacoes.length,
    abertas: manifestacoes.filter((m) => m.status === 'ABERTA').length,
    emAnalise: manifestacoes.filter((m) => m.status === 'EM_ANALISE').length,
    respondidas: manifestacoes.filter((m) => m.status === 'RESPONDIDA').length,
  }

  async function carregarAuditores() {
    setLoadingAuditores(true)
    try { const data = await auditoresAPI.list(); setAuditores(data || []) }
    catch (err) { console.error('Erro ao carregar auditores:', err) }
    finally { setLoadingAuditores(false) }
  }

  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }

  function showFeedback(type, msg) {
    setAuditorFeedback({ type, msg })
    setTimeout(() => setAuditorFeedback(null), 3500)
  }

  async function handleAddAuditor(e) {
    e.preventDefault()
    if (!isValidEmail(novoEmail)) { showFeedback('error', 'E-mail inválido.'); return }
    if (auditores.length >= MAX_AUDITORES) { showFeedback('error', `Limite de ${MAX_AUDITORES} auditores atingido.`); return }
    setAddingAuditor(true)
    try {
      await auditoresAPI.add({ nome: novoNome.trim() || undefined, email: novoEmail.trim().toLowerCase() })
      setNovoEmail(''); setNovoNome('')
      showFeedback('success', 'Auditor adicionado com sucesso.')
      await carregarAuditores()
    } catch (err) { showFeedback('error', err.response?.data?.erro || 'Erro ao adicionar auditor.') }
    finally { setAddingAuditor(false) }
  }

  async function handleRemoveAuditor(id) {
    setRemovingId(id)
    try { await auditoresAPI.remove(id); showFeedback('success', 'Auditor removido.'); await carregarAuditores() }
    catch { showFeedback('error', 'Erro ao remover auditor.') }
    finally { setRemovingId(null) }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // TELA DE LOGIN
  // ══════════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#111111] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <Shield className="w-10 h-10 text-black" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Ouvidoria</h1>
              <p className="text-white/50">Área Administrativa — Premium Bebidas</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5"><Shield className="w-3 h-3 mr-1" />Acesso Restrito</Badge>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">E-mail</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="email" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all" placeholder="seu@email.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all" placeholder="••••••••" required />
                </div>
              </div>
              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-500 text-sm text-center flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" />{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button type="submit" disabled={loginLoading} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 disabled:opacity-50">
                {loginLoading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Acessando...</span> : <span className="flex items-center gap-2"><Shield className="w-4 h-4" />Acessar Painel</span>}
              </Button>
            </form>
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link to="/ouvidoria" className="text-white/50 hover:text-white text-sm flex items-center justify-center gap-2 group transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Voltar ao site institucional
              </Link>
              <p className="text-xs text-white/30 mt-4">© {new Date().getFullYear()} Premium Bebidas</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PAINEL ADMINISTRATIVO
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ouvidoria" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
              <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
            </Link>
            <img src={LOGO_URL} alt="Logo" className="h-12" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Ouvidoria</h1>
              <p className="text-xs text-white/40">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Eye className="w-4 h-4 text-green-500" /><span className="text-sm text-white/70">{accessCount} acessos</span>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 rounded-xl"><LogOut className="w-4 h-4 mr-2" />Sair</Button>
          </div>
          <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col gap-3 py-3">
              <Link to="/ouvidoria" className="text-white/70 hover:text-white py-2">Home</Link>
              <Link to="/ouvidoria/consultar" className="text-white/70 hover:text-white py-2">Consultar</Link>
              <Button onClick={handleLogout} variant="outline" className="border-white/20 text-white mt-2" size="sm"><LogOut className="w-4 h-4 mr-2" />Sair</Button>
            </div>
          </motion.div>
        )}
      </header>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gerenciar Manifestações</h1>
            <p className="text-gray-600">Logado como: <span className="font-semibold text-[#00482B]">{loginUser}</span></p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total',       value: stats.total,       sub: 'manifestações', cls: 'bg-white border-gray-100 text-gray-900' },
              { label: 'Abertas',     value: stats.abertas,     sub: 'aguardando',    cls: 'bg-blue-50 border-blue-100 text-blue-700' },
              { label: 'Em Análise',  value: stats.emAnalise,   sub: 'em andamento',  cls: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
              { label: 'Respondidas', value: stats.respondidas, sub: 'finalizadas',   cls: 'bg-green-50 border-green-100 text-green-700' },
            ].map(({ label, value, sub, cls }) => (
              <div key={label} className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all ${cls}`}>
                <p className="text-sm mb-1 opacity-80">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs mt-2 opacity-60">{sub}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 w-fit">
            <button onClick={() => setActiveTab('manifestacoes')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'manifestacoes' ? 'bg-gradient-to-r from-[#00482B] to-[#00703C] text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              <MessageSquare className="w-4 h-4" />Manifestações
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'manifestacoes' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{manifestacoes.length}</span>
            </button>
            <button onClick={() => setActiveTab('auditores')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'auditores' ? 'bg-gradient-to-r from-[#00482B] to-[#00703C] text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              <Shield className="w-4 h-4" />Auditores
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'auditores' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{auditores.length}/{MAX_AUDITORES}</span>
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'manifestacoes' && (
              <motion.div key="manifestacoes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Filter className="w-5 h-5 text-[#00482B]" />Filtros</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="text-gray-600 hover:text-[#00482B]">
                      {showFilters ? 'Ocultar' : 'Mostrar'}<ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="Buscar por protocolo, nome ou email..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none transition-all" value={busca} onChange={(e) => setBusca(e.target.value)} />
                    </div>
                    <div className="md:w-64">
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                        <option value="TODAS">Todos os Status</option>
                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {loadingManifestacoes ? (
                  <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00703C] mb-4" />
                    <p className="text-gray-600 text-lg">Carregando manifestações...</p>
                  </div>
                ) : manifestacoesFiltradas.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare className="w-10 h-10 text-gray-400" /></div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma manifestação encontrada</h3>
                    <p className="text-gray-500">Ajuste os filtros ou aguarde novas manifestações</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {manifestacoesFiltradas.map((manifestacao, index) => {
                      const jaRespondida = manifestacao.status === 'RESPONDIDA' || !!manifestacao.resposta
                      const statusOption = STATUS_OPTIONS.find((s) => s.value === manifestacao.status) || STATUS_OPTIONS[0]
                      const StatusIcon = statusOption.icon
                      return (
                        <motion.div key={manifestacao.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -2 }}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${statusOption.color} bg-opacity-20`}><StatusIcon className="w-6 h-6" /></div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">Protocolo</p>
                                    {manifestacao.possuiAnexo && (
                                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] px-1.5 py-0">
                                        <Paperclip className="w-3 h-3 mr-0.5" />Anexo
                                      </Badge>
                                    )}
                                    {manifestacao.resposta && (
                                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 py-0">
                                        <CheckCircle className="w-3 h-3 mr-0.5" />Respondida
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-2xl font-mono font-bold text-[#00482B] tracking-wider">{manifestacao.protocolo}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={statusOption.color}>{statusOption.label}</Badge>
                                <Button
                                  onClick={() => abrirModal(manifestacao)}
                                  className={`rounded-full px-6 shadow-lg transition-all ${
                                    jaRespondida
                                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                                      : 'bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white hover:shadow-xl'
                                  }`}
                                >
                                  {jaRespondida
                                    ? <><Eye className="w-4 h-4 mr-2" />Ver Resposta</>
                                    : <><Edit className="w-4 h-4 mr-2" />Editar Status</>
                                  }
                                </Button>
                              </div>
                            </div>

                            <Separator className="my-4 bg-gray-200" />

                            <div className="grid md:grid-cols-4 gap-4 text-sm">
                              {[
                                { label: 'Tipo',        icon: FileText,      value: formatarTipo(manifestacao.tipo) },
                                { label: 'Data',        icon: Clock,         value: formatarData(manifestacao.datacriacao) },
                                { label: 'Solicitante', icon: Users,         value: manifestacao.anonima ? <span className="text-[#00703C]">ANÔNIMO</span> : (manifestacao.nome || 'Não informado') },
                                { label: 'Contato',     icon: MessageSquare, value: manifestacao.anonima ? '---' : (manifestacao.email || 'Não informado') },
                              ].map(({ label, icon: Icon, value }) => (
                                <div key={label} className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Icon className="w-3 h-3" />{label}</p>
                                  <p className="font-semibold text-gray-900 truncate">{value}</p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-2 font-medium">Descrição:</p>
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-gray-700 leading-relaxed">{manifestacao.descricao}</p>
                              </div>
                            </div>

                            {manifestacao.resposta && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2">
                                  <Send className="w-3.5 h-3.5 text-[#00703C]" />Resposta enviada:
                                </p>
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                  <p className="text-green-800 leading-relaxed text-sm">{manifestacao.resposta}</p>
                                </div>
                              </div>
                            )}

                            {manifestacao.possuiAnexo && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 border border-orange-200/50">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-orange-200 shadow-sm flex items-center justify-center flex-shrink-0">
                                      <Paperclip className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs text-gray-500 font-medium">Documento Anexado</p>
                                      <p className="text-sm font-semibold text-gray-800 truncate">{manifestacao.anexoNome}</p>
                                    </div>
                                  </div>
                                  <a href={`${API_BASE}/manifestacoes/anexo/${manifestacao.anexoId}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#00482B] text-white text-xs font-medium rounded-lg hover:bg-[#00703C] transition-colors flex-shrink-0">
                                    <Download className="w-3.5 h-3.5" />Baixar
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'auditores' && (
              <motion.div key="auditores" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl">
                <AnimatePresence>
                  {auditorFeedback && (
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={`mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm font-medium shadow-lg ${auditorFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      {auditorFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />}
                      {auditorFeedback.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-gradient-to-r from-[#00482B]/10 to-[#00703C]/5 border border-[#00482B]/20 rounded-2xl p-5 mb-8 flex gap-4">
                  <div className="p-3 bg-[#00482B]/10 rounded-xl shrink-0"><Bell className="w-6 h-6 text-[#00482B]" /></div>
                  <div>
                    <h3 className="font-semibold text-[#00482B] mb-1">Como funciona?</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">Auditores cadastrados recebem uma <strong>cópia automática por e-mail</strong> de todas as manifestações enviadas ao sistema. Você pode adicionar até <strong>{MAX_AUDITORES} auditores</strong>.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#00482B]" />Adicionar Auditor
                    <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${auditores.length >= MAX_AUDITORES ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{auditores.length}/{MAX_AUDITORES} slots</span>
                  </h2>
                  <form onSubmit={handleAddAuditor} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Nome <span className="text-gray-400">(opcional)</span></Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex: João Silva" className="pl-10 h-11 border-gray-300 focus:border-[#00703C] focus:ring-[#00703C]/20" disabled={auditores.length >= MAX_AUDITORES || addingAuditor} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="auditor@empresa.com" className="pl-10 h-11 border-gray-300 focus:border-[#00703C] focus:ring-[#00703C]/20" disabled={auditores.length >= MAX_AUDITORES || addingAuditor} required />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={auditores.length >= MAX_AUDITORES || addingAuditor || !novoEmail} className="w-full bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white h-11 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                      {addingAuditor ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Adicionando...</span> : <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" />Adicionar Auditor</span>}
                    </Button>
                    {auditores.length >= MAX_AUDITORES && (
                      <p className="text-xs text-center text-red-500 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" />Limite máximo atingido. Remova um auditor para adicionar outro.</p>
                    )}
                  </form>
                </div>

                {loadingAuditores ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00703C] mb-3" /><p className="text-gray-500">Carregando auditores...</p>
                  </div>
                ) : auditores.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><BellOff className="w-8 h-8 text-gray-400" /></div>
                    <h3 className="font-semibold text-gray-700 mb-1">Nenhum auditor cadastrado</h3>
                    <p className="text-sm text-gray-500">Adicione um e-mail acima para começar a receber cópias das manifestações.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditores.map((auditor, i) => (
                      <motion.div key={auditor.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex items-center gap-4 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00482B] to-[#00703C] flex items-center justify-center shrink-0 shadow-md shadow-green-900/20">
                          <span className="text-white font-bold text-lg">{auditor.nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{auditor.nome}</p>
                          <p className="text-sm text-gray-500 truncate flex items-center gap-1"><Mail className="w-3 h-3 shrink-0" />{auditor.email}</p>
                          {auditor.adicionadoEm && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3 shrink-0" />Adicionado em {formatarData(auditor.adicionadoEm)}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs"><Bell className="w-3 h-3 mr-1" />Ativo</Badge>
                          <button onClick={() => handleRemoveAuditor(auditor.id)} disabled={removingId === auditor.id} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50" title="Remover auditor">
                            {removingId === auditor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {modalAberto && manifestacaoSelecionada && (() => {
          const jaRespondida = manifestacaoSelecionada.status === 'RESPONDIDA' || !!manifestacaoSelecionada.resposta
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={fecharModal}>
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">

                <div className="bg-gradient-to-r from-[#00482B] to-[#00703C] px-6 py-5 flex items-center justify-between sticky top-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {jaRespondida ? <Eye className="w-5 h-5 text-white" /> : <Edit className="w-5 h-5 text-white" />}
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {jaRespondida ? 'Visualizar Manifestação' : 'Alterar Status da Manifestação'}
                    </h2>
                  </div>
                  <button onClick={fecharModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-white" /></button>
                </div>

                <div className="p-6 space-y-6">

                  {/* Banner somente leitura */}
                  {jaRespondida && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-sm text-amber-800 font-medium">
                        Esta manifestação já foi respondida e não pode mais ser alterada.
                      </p>
                    </div>
                  )}

                  {/* Dados gerais */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: 'Protocolo',       icon: FileText, value: <span className="font-mono font-bold text-[#00482B] text-lg">{manifestacaoSelecionada.protocolo}</span> },
                        { label: 'Tipo',            icon: FileText, value: formatarTipo(manifestacaoSelecionada.tipo) },
                        { label: 'Data de Criação', icon: Clock,    value: formatarData(manifestacaoSelecionada.datacriacao) },
                        { label: 'Solicitante',     icon: Users,    value: manifestacaoSelecionada.anonima ? 'ANÔNIMO' : manifestacaoSelecionada.nome },
                      ].map(({ label, icon: Icon, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <div className="p-2 bg-[#00482B]/10 rounded-lg"><Icon className="w-4 h-4 text-[#00482B]" /></div>
                          <div><p className="text-xs text-gray-500">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Anexo */}
                  {manifestacaoSelecionada.possuiAnexo && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 border border-orange-200/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-white rounded-lg border border-orange-200 shadow-sm flex items-center justify-center flex-shrink-0">
                          <Paperclip className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Documento Anexado</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">{manifestacaoSelecionada.anexoNome}</p>
                        </div>
                      </div>
                      <a href={`${API_BASE}/manifestacoes/anexo/${manifestacaoSelecionada.anexoId}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#00482B] text-white text-xs font-medium rounded-lg hover:bg-[#00703C] transition-colors flex-shrink-0">
                        <Download className="w-3.5 h-3.5" />Baixar
                      </a>
                    </div>
                  )}

                  {/* Seletor de status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[#00482B]" />Status da Manifestação</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                      value={formEdicao.status}
                      onChange={(e) => setFormEdicao({ ...formEdicao, status: e.target.value })}
                      disabled={salvando || jaRespondida}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  {/* Caixa de resposta */}
                  <AnimatePresence>
                    {(formEdicao.status === 'RESPONDIDA' || jaRespondida) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5">
                          <label className="block text-sm font-semibold text-green-800 flex items-center gap-2">
                            <Send className="w-4 h-4 text-green-700" />
                            {jaRespondida ? 'Resposta Enviada' : 'Resposta ao Solicitante'}
                            {!jaRespondida && <span className="text-red-500 font-normal text-xs ml-1">(obrigatório)</span>}
                          </label>
                          {!jaRespondida && (
                            <p className="text-xs text-green-700 mb-3">
                              Esta resposta ficará visível ao solicitante ao consultar o protocolo.
                              {!manifestacaoSelecionada.anonima && manifestacaoSelecionada.email && (
                                <span className="block mt-1">Será enviada para: <strong>{manifestacaoSelecionada.email}</strong></span>
                              )}
                            </p>
                          )}
                          <textarea
                            rows={5}
                            placeholder="Digite aqui a resposta oficial para o solicitante..."
                            className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none bg-white transition-all disabled:bg-green-50 disabled:cursor-default disabled:border-green-200"
                            value={formEdicao.resposta}
                            onChange={(e) => setFormEdicao({ ...formEdicao, resposta: e.target.value })}
                            disabled={salvando || jaRespondida}
                          />
                          {!jaRespondida && <p className="text-xs text-green-600 text-right">{formEdicao.resposta.length} caracteres</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Descrição original */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#00482B]" />Descrição Original</label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{manifestacaoSelecionada.descricao}</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="flex gap-3 pt-2">
                    <Button onClick={fecharModal} variant="outline" className="flex-1 rounded-xl h-12 border-2 hover:bg-gray-50 transition-all" disabled={salvando}>
                      <X className="w-4 h-4 mr-2" />{jaRespondida ? 'Fechar' : 'Cancelar'}
                    </Button>
                    {!jaRespondida && (
                      <Button
                        onClick={salvarAlteracoes}
                        className={`flex-1 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 ${
                          formEdicao.status === 'RESPONDIDA'
                            ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                            : 'bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A]'
                        }`}
                        disabled={salvando || (formEdicao.status === 'RESPONDIDA' && !formEdicao.resposta.trim())}
                      >
                        {salvando
                          ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Salvando...</span>
                          : formEdicao.status === 'RESPONDIDA'
                            ? <span className="flex items-center gap-2"><Send className="w-4 h-4" />Enviar Resposta</span>
                            : <span className="flex items-center gap-2"><Save className="w-4 h-4" />Salvar Alterações</span>
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      <footer className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-white/90">© {new Date().getFullYear()} Premium Bebidas — Sistema de Ouvidoria</p>
          <p className="text-xs text-white/70 mt-2">Área Administrativa — Acesso Restrito</p>
        </div>
      </footer>
    </div>
  )
}
