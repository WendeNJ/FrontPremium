import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  X,
  Edit,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Menu,
  ArrowLeft,
  Loader2,
  Settings,
  LogOut,
  Eye,
  Shield,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Filter,
  ChevronDown,
  Home
} from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

const STATUS_OPTIONS = [
  { value: 'ABERTA', label: 'Aberta', color: 'bg-blue-500/20 text-blue-500', icon: AlertCircle },
  { value: 'EM_ANALISE', label: 'Em Análise', color: 'bg-yellow-500/20 text-yellow-500', icon: RefreshCw },
  { value: 'RESPONDIDA', label: 'Respondida', color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
  { value: 'ENCERRADA', label: 'Encerrada', color: 'bg-gray-500/20 text-gray-500', icon: XCircle },
]

export default function AdminOuvidoria() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [accessCount, setAccessCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [manifestacoes, setManifestacoes] = useState([])
  const [loadingManifestacoes, setLoadingManifestacoes] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('TODAS')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [formEdicao, setFormEdicao] = useState({ status: '' })
  const [showFilters, setShowFilters] = useState(false)

  // Verifica se o usuário já está logado
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await fetch('http://localhost:8081/users/test', { 
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        })
        if (res.ok) {
          console.log('✅ Usuário já está logado')
          setIsAuthenticated(true)
        } else {
          console.log('ℹ️ Usuário não está logado')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.log('ℹ️ Não foi possível verificar login:', error)
        setIsAuthenticated(false)
      }
    }
    checkIfLoggedIn()
  }, [])

  useEffect(() => {
    const count = localStorage.getItem('ouvidoriaAdminAccessCount') || 0
    const newCount = parseInt(count) + 1
    setAccessCount(newCount)
    localStorage.setItem('ouvidoriaAdminAccessCount', newCount.toString())
  }, [])

  useEffect(() => {
    if (isAuthenticated) carregarManifestacoes()
  }, [isAuthenticated])

  async function carregarManifestacoes() {
    setLoadingManifestacoes(true)
    try {
      const data = await base44.entities.Manifestacoes.list()
      setManifestacoes(data || [])
      console.log('📦 Manifestações carregadas:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erro ao carregar manifestações:', err)
    } finally {
      setLoadingManifestacoes(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const loginRes = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginUser, password: loginPass }),
      })

      if (!loginRes.ok) {
        const errorText = await loginRes.text()
        throw new Error('Usuário ou senha inválidos')
      }

      setIsAuthenticated(true)
    } catch (err) {
      setLoginError(err.message || 'Erro ao autenticar')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8081/users/logout', { 
        method: 'POST', 
        credentials: 'include' 
      })
      setIsAuthenticated(false)
      setLoginUser('')
      setLoginPass('')
      navigate('/ouvidoria') // 🔥 Vai para a HOME
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  function abrirModal(manifestacao) {
    setManifestacaoSelecionada(manifestacao)
    setFormEdicao({ status: manifestacao.status || 'ABERTA' })
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setManifestacaoSelecionada(null)
  }

  async function salvarAlteracoes() {
    if (!manifestacaoSelecionada) return
    setSalvando(true)
    
    try {
      const protocolo = manifestacaoSelecionada.protocolo
      if (!protocolo) throw new Error('Protocolo não encontrado')

      await base44.entities.Manifestacoes.atualizarStatus(protocolo, formEdicao.status)
      
      fecharModal()
      carregarManifestacoes()
    } catch (err) {
      console.error('❌ Erro:', err)
      alert('❌ Erro: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  const manifestacoesFiltradas = manifestacoes.filter((m) => {
    const matchStatus = filtroStatus === 'TODAS' || m.status === filtroStatus
    const matchBusca =
      m.protocolo?.toLowerCase().includes(busca.toLowerCase()) ||
      m.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      m.email?.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  function formatarData(dataString) {
    if (!dataString) return ''
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  function formatarTipo(tipo) {
    const tipos = { 
      RECLAMACAO: 'Reclamação', 
      DENUNCIA: 'Denúncia', 
      SUGESTAO: 'Sugestão', 
      ELOGIO: 'Elogio', 
      SOLICITACAO: 'Solicitação' 
    }
    return tipos[tipo?.toUpperCase()] || tipo || 'Não informado'
  }

  const stats = {
    total: manifestacoes.length,
    abertas: manifestacoes.filter((m) => m.status === 'ABERTA').length,
    emAnalise: manifestacoes.filter((m) => m.status === 'EM_ANALISE').length,
    respondidas: manifestacoes.filter((m) => m.status === 'RESPONDIDA').length,
    encerradas: manifestacoes.filter((m) => m.status === 'ENCERRADA').length,
  }

  // ============================================
  // 📌 TELA DE LOGIN - VERSÃO PREMIUM
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#111111] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <Shield className="w-10 h-10 text-black" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Ouvidoria</h1>
              <p className="text-white/50">Área Administrativa - Premium Bebidas</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5">
                  <Shield className="w-3 h-3 mr-1" />
                  Acesso Restrito
                </Badge>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">E-mail</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                  >
                    <p className="text-red-500 text-sm text-center flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {loginError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 disabled:opacity-50"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Acessando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Acessar Painel
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link
                to="/ouvidoria"
                className="text-white/50 hover:text-white text-sm flex items-center justify-center gap-2 group transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao site institucional
              </Link>
              <p className="text-xs text-white/30 mt-4">
                © {new Date().getFullYear()} Premium Bebidas
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============================================
  // 📌 PAINEL ADMINISTRATIVO - VERSÃO PREMIUM
  // ============================================
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER PREMIUM */}
      <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/ouvidoria" 
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
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
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-sm text-white/70">{accessCount} acessos</span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          <button 
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800"
          >
            <div className="flex flex-col gap-3 py-3">
              <Link to="/ouvidoria" className="text-white/70 hover:text-white py-2">Home</Link>
              <Link to="/ouvidoria" className="text-white/70 hover:text-white py-2">Ouvidoria</Link>
              <Link to="/ouvidoria/consultar" className="text-white/70 hover:text-white py-2">Consultar</Link>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="border-white/20 text-white mt-2"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* TÍTULO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Gerenciar Manifestações
            </h1>
            <p className="text-gray-600">
              Logado como: <span className="font-semibold text-[#00482B]">{loginUser}</span>
            </p>
          </motion.div>

          {/* DASHBOARD STATS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-2">manifestações</p>
            </div>
            <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all">
              <p className="text-sm text-blue-600 mb-1">Abertas</p>
              <p className="text-3xl font-bold text-blue-700">{stats.abertas}</p>
              <p className="text-xs text-blue-500/70 mt-2">aguardando</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all">
              <p className="text-sm text-yellow-600 mb-1">Em Análise</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.emAnalise}</p>
              <p className="text-xs text-yellow-500/70 mt-2">em andamento</p>
            </div>
            <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all">
              <p className="text-sm text-green-600 mb-1">Respondidas</p>
              <p className="text-3xl font-bold text-green-700">{stats.respondidas}</p>
              <p className="text-xs text-green-500/70 mt-2">finalizadas</p>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
              <p className="text-sm text-gray-600 mb-1">Encerradas</p>
              <p className="text-3xl font-bold text-gray-700">{stats.encerradas}</p>
              <p className="text-xs text-gray-500/70 mt-2">arquivadas</p>
            </div>
          </motion.div>

          {/* FILTROS E BUSCA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#00482B]" />
                Filtros
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600 hover:text-[#00482B]"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar por protocolo, nome ou email..." 
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none transition-all" 
                          value={busca} 
                          onChange={(e) => setBusca(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:w-64">
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                        value={filtroStatus} 
                        onChange={(e) => setFiltroStatus(e.target.value)}
                      >
                        <option value="TODAS">Todos os Status</option>
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showFilters && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar por protocolo, nome ou email..." 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none transition-all" 
                      value={busca} 
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="TODAS">Todos os Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </motion.div>

          {/* LISTA DE MANIFESTAÇÕES */}
          {loadingManifestacoes ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00703C] mb-4" />
              <p className="text-gray-600 text-lg">Carregando manifestações...</p>
            </div>
          ) : manifestacoesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma manifestação encontrada</h3>
              <p className="text-gray-500">Ajuste os filtros ou aguarde novas manifestações</p>
            </div>
          ) : (
            <div className="space-y-4">
              {manifestacoesFiltradas.map((manifestacao, index) => {
                const statusOption = STATUS_OPTIONS.find(s => s.value === manifestacao.status) || STATUS_OPTIONS[0]
                const StatusIcon = statusOption.icon
                
                return (
                  <motion.div 
                    key={manifestacao.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${statusOption.color} bg-opacity-20`}>
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Protocolo</p>
                            <p className="text-2xl font-mono font-bold text-[#00482B] tracking-wider">
                              {manifestacao.protocolo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusOption.color}>
                            {statusOption.label}
                          </Badge>
                          <Button 
                            onClick={() => abrirModal(manifestacao)} 
                            className="bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Status
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4 bg-gray-200" />
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Tipo
                          </p>
                          <p className="font-semibold text-gray-900">{formatarTipo(manifestacao.tipo)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Data
                          </p>
                          <p className="font-semibold text-gray-900">{formatarData(manifestacao.datacriacao)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Solicitante
                          </p>
                          <p className="font-semibold text-gray-900">
                            {manifestacao.anonima ? (
                              <span className="text-[#00703C]">ANÔNIMO</span>
                            ) : (
                              manifestacao.nome || 'Não informado'
                            )}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Contato
                          </p>
                          <p className="font-semibold text-gray-900 truncate">
                            {manifestacao.anonima ? '---' : manifestacao.email || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Descrição:</p>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {manifestacao.descricao}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO - PREMIUM */}
      <AnimatePresence>
        {modalAberto && manifestacaoSelecionada && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
            onClick={fecharModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              <div className="bg-gradient-to-r from-[#00482B] to-[#00703C] px-6 py-5 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Alterar Status da Manifestação</h2>
                </div>
                <button 
                  onClick={fecharModal} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00482B]/10 rounded-lg">
                        <FileText className="w-4 h-4 text-[#00482B]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Protocolo</p>
                        <p className="font-mono font-bold text-[#00482B] text-lg">
                          {manifestacaoSelecionada.protocolo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00482B]/10 rounded-lg">
                        <FileText className="w-4 h-4 text-[#00482B]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tipo</p>
                        <p className="font-medium text-gray-900">{formatarTipo(manifestacaoSelecionada.tipo)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00482B]/10 rounded-lg">
                        <Clock className="w-4 h-4 text-[#00482B]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Data de Criação</p>
                        <p className="font-medium text-gray-900">
                          {formatarData(manifestacaoSelecionada.datacriacao)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00482B]/10 rounded-lg">
                        <Users className="w-4 h-4 text-[#00482B]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Solicitante</p>
                        <p className="font-medium text-gray-900">
                          {manifestacaoSelecionada.anonima ? 'ANÔNIMO' : manifestacaoSelecionada.nome}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#00482B]" />
                    Status da Manifestação *
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer text-gray-900"
                    value={formEdicao.status} 
                    onChange={(e) => setFormEdicao({ ...formEdicao, status: e.target.value })}
                    disabled={salvando}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00482B]" />
                    Descrição Original
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {manifestacaoSelecionada.descricao}
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-gray-200" />
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={fecharModal} 
                    variant="outline" 
                    className="flex-1 rounded-xl h-12 border-2 hover:bg-gray-50 transition-all"
                    disabled={salvando}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={salvarAlteracoes} 
                    className="flex-1 bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-white/90">
            © {new Date().getFullYear()} Premium Bebidas - Sistema de Ouvidoria
          </p>
          <p className="text-xs text-white/70 mt-2">
            Área Administrativa - Acesso Restrito
          </p>
        </div>
      </footer>
    </div>
  )
}