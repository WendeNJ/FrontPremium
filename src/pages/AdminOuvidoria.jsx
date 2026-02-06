import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

const STATUS_OPTIONS = [
  { value: 'ABERTA', label: 'Aberta', color: 'bg-blue-100 text-blue-800' },
  { value: 'EM_ANALISE', label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'RESPONDIDA', label: 'Respondida', color: 'bg-green-100 text-green-800' },
  { value: 'ENCERRADA', label: 'Encerrada', color: 'bg-gray-100 text-gray-800' },
]

export default function AdminOuvidoria() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [accessCount, setAccessCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [manifestacoes, setManifestacoes] = useState([])
  const [loadingManifestacoes, setLoadingManifestacoes] = useState(true) // Estado separado
  const [loginLoading, setLoginLoading] = useState(false) // Estado separado para login
  const [filtroStatus, setFiltroStatus] = useState('TODAS')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [formEdicao, setFormEdicao] = useState({ status: '' })

  // Verifica se o usuário já está logado
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        // Tenta acessar um endpoint qualquer que requer autenticação
        const res = await fetch('http://localhost:8081/users/test', { 
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
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
    setLoadingManifestacoes(true) // Usa estado separado
    try {
      const data = await base44.entities.Manifestacoes.list()
      setManifestacoes(data || [])
      console.log('📦 Manifestações carregadas:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erro ao carregar manifestações:', err)
      alert('Erro ao carregar manifestações')
    } finally {
      setLoadingManifestacoes(false) // Usa estado separado
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true) // Usa estado separado para login

    try {
      console.log('🔐 Tentando login com:', loginUser)
      
      // FAZ LOGIN
      const loginRes = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // IMPORTANTE para cookies
        body: JSON.stringify({
          email: loginUser,
          password: loginPass,
        }),
      })

      console.log('📤 Login response status:', loginRes.status)

      if (!loginRes.ok) {
        const errorText = await loginRes.text()
        console.error('❌ Erro no login:', errorText)
        throw new Error('Usuário ou senha inválidos')
      }

      console.log('✅ Login bem-sucedido!')
      
      // Login bem sucedido - autoriza acesso
      setIsAuthenticated(true)

    } catch (err) {
      console.error('💥 Erro no login:', err)
      setLoginError(err.message || 'Erro ao autenticar')
    } finally {
      setLoginLoading(false) // Usa estado separado para login
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8081/users/logout', { 
        method: 'POST', 
        credentials: 'include' 
      })
      console.log('👋 Logout realizado')
      setIsAuthenticated(false)
      setLoginUser('')
      setLoginPass('')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  function abrirModal(manifestacao) {
    setManifestacaoSelecionada(manifestacao)
    setFormEdicao({ status: manifestacao.status || 'ABERTA' })
    setModalAberto(true)
    console.log('📝 Abrindo modal para manifestação:', manifestacao.protocolo)
  }

  function fecharModal() {
    setModalAberto(false)
    setManifestacaoSelecionada(null)
    console.log('📭 Fechando modal')
  }

  async function salvarAlteracoes() {
    if (!manifestacaoSelecionada) return
    setSalvando(true)
    
    try {
      const url = `http://localhost:8081/manifestacoes/${manifestacaoSelecionada.id}/status?status=${formEdicao.status}`
      console.log('🔄 Enviando PATCH para:', url)
      console.log('📋 Dados:', {
        id: manifestacaoSelecionada.id,
        status: formEdicao.status
      })

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include', // ENVIA COOKIES
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('📥 Resposta status:', response.status)

      if (response.status === 204) {
        console.log('✅ Status atualizado com sucesso!')
        alert('✅ Status atualizado com sucesso!')
        fecharModal()
        carregarManifestacoes()
      } else if (response.status === 403) {
        const errorText = await response.text()
        console.error('❌ 403 Forbidden - Detalhes:', errorText)
        
        // Tenta mostrar mensagem mais descritiva
        if (errorText.includes('Access Denied') || errorText.includes('Forbidden')) {
          alert('❌ Acesso negado! Você não tem permissão para atualizar o status.')
        } else {
          alert('❌ Acesso negado! Verifique suas permissões.')
        }
        
      } else if (response.status === 401) {
        console.error('❌ 401 Unauthorized - Sessão expirada')
        alert('⚠️ Sessão expirada! Faça login novamente.')
        setIsAuthenticated(false)
      } else {
        const errorText = await response.text()
        console.error(`❌ Erro ${response.status}:`, errorText)
        alert(`❌ Erro ${response.status}: ${errorText || 'Erro desconhecido'}`)
      }
      
    } catch (err) {
      console.error('💥 Erro de rede:', err)
      alert('❌ Erro de conexão com o servidor. Verifique se o backend está rodando.')
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

  function getStatusColor(status) {
    const statusObj = STATUS_OPTIONS.find((s) => s.value === status?.toUpperCase())
    return statusObj?.color || 'bg-gray-100 text-gray-800'
  }

  function getStatusIcon(status) {
    switch (status?.toUpperCase()) {
      case 'ABERTA': return <AlertCircle className="w-5 h-5" />
      case 'EM_ANALISE': return <RefreshCw className="w-5 h-5" />
      case 'RESPONDIDA': return <CheckCircle className="w-5 h-5" />
      case 'ENCERRADA': return <XCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
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

  // Função para debug no console
  const debugLogin = async () => {
    console.log('🧪 Debug login...')
    console.log('Email:', loginUser)
    console.log('Password length:', loginPass.length)
    
    // Testa se o backend está respondendo
    try {
      const test = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      })
      console.log('Backend online, status:', test.status)
    } catch (err) {
      console.error('Backend offline:', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md"
        >
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#00482B]/10 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-[#00482B]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Área Administrativa</h1>
              <p className="text-gray-600 mt-2">Ouvidoria - Faça login para continuar</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-gray-700">E-mail</Label>
                <Input 
                  type="email" 
                  value={loginUser} 
                  onChange={(e) => setLoginUser(e.target.value)} 
                  className="bg-gray-50 border-gray-300 text-gray-800" 
                  placeholder="seu@email.com" 
                  required 
                  disabled={loginLoading}
                />
              </div>
              <div>
                <Label className="text-gray-700">Senha</Label>
                <Input 
                  type="password" 
                  value={loginPass} 
                  onChange={(e) => setLoginPass(e.target.value)} 
                  className="bg-gray-50 border-gray-300 text-gray-800" 
                  placeholder="Sua senha" 
                  required 
                  disabled={loginLoading}
                />
              </div>
              
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center">{loginError}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-[#00482B] hover:bg-[#00703C] text-white font-semibold py-6"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </span>
                ) : 'Entrar na Área Administrativa'}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <Link 
                to="/ouvidoria" 
                className="text-gray-600 hover:text-[#00482B] text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o site público
              </Link>
              
              {/* Apenas para desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Debug (apenas desenvolvimento)</p>
                  <Button
                    onClick={debugLogin}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    disabled={loginLoading}
                  >
                    🧪 Testar Conexão Backend
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="h-14" />
            <span className="text-white font-bold hidden sm:block">PAINEL ADMINISTRATIVO</span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
            <Link to="/ouvidoria">INÍCIO</Link>
            <Link to="/ouvidoria/sobre">SOBRE</Link>
            <Link to="/ouvidoria/consultar">CONSULTAR</Link>
            <Link to="/ouvidoria/admin" className="font-semibold">ADMIN</Link>
          </nav>
          
          <div className="hidden md:flex gap-3 items-center">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Eye className="w-3 h-3" />
              <span>{accessCount} acessos</span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 rounded-full" 
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
          
          <button 
            className="md:hidden text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            disabled={loadingManifestacoes}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] px-4 pb-4 flex flex-col gap-3 text-white">
            <Link to="/ouvidoria">Início</Link>
            <Link to="/ouvidoria/sobre">Sobre</Link>
            <Link to="/ouvidoria/consultar">Consultar</Link>
            <Link to="/ouvidoria/admin" className="font-semibold">Admin</Link>
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
        )}
      </header>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/ouvidoria" 
              className="text-sm text-gray-600 hover:text-[#00703C] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para início
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Manifestações</h1>
            <p className="text-gray-600">
              Logado como: <span className="font-semibold">{loginUser}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-blue-600">Abertas</p>
              <p className="text-2xl font-bold text-blue-800">{stats.abertas}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-yellow-600">Em Análise</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.emAnalise}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-green-600">Respondidas</p>
              <p className="text-2xl font-bold text-green-800">{stats.respondidas}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Encerradas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.encerradas}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por protocolo, nome ou email..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none" 
                    value={busca} 
                    onChange={(e) => setBusca(e.target.value)}
                    disabled={loadingManifestacoes}
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white" 
                  value={filtroStatus} 
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  disabled={loadingManifestacoes}
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
          </div>

          {loadingManifestacoes ? ( // Agora usando o estado correto
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00703C] mb-4" />
              <p className="text-gray-600">Carregando manifestações...</p>
            </div>
          ) : manifestacoesFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma manifestação encontrada</h3>
              <p className="text-gray-500">Ajuste os filtros ou aguarde novas manifestações</p>
            </div>
          ) : (
            <div className="space-y-4">
              {manifestacoesFiltradas.map((manifestacao) => (
                <motion.div 
                  key={manifestacao.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(manifestacao.status)}`}>
                          {getStatusIcon(manifestacao.status)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Protocolo</p>
                          <p className="text-lg font-mono font-bold text-[#00482B]">
                            {manifestacao.protocolo}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => abrirModal(manifestacao)} 
                        className="bg-[#00482B] hover:bg-[#00703C] text-white rounded-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Status
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Tipo</p>
                        <p className="font-medium">{formatarTipo(manifestacao.tipo)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Data</p>
                        <p className="font-medium">{formatarData(manifestacao.datacriacao)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Solicitante</p>
                        <p className="font-medium">
                          {manifestacao.anonima ? 'ANÔNIMO' : manifestacao.nome}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Descrição:</p>
                      <p className="text-gray-700 line-clamp-2">{manifestacao.descricao}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalAberto && manifestacaoSelecionada && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
            onClick={fecharModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-[#00482B] px-6 py-4 flex items-center justify-between sticky top-0">
                <h2 className="text-xl font-bold text-white">Alterar Status da Manifestação</h2>
                <button 
                  onClick={fecharModal} 
                  className="text-white hover:text-gray-300 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Protocolo</p>
                      <p className="font-mono font-bold text-[#00482B]">
                        {manifestacaoSelecionada.protocolo}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium">{formatarTipo(manifestacaoSelecionada.tipo)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data de Criação</p>
                      <p className="font-medium">
                        {formatarData(manifestacaoSelecionada.datacriacao)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Solicitante</p>
                      <p className="font-medium">
                        {manifestacaoSelecionada.anonima ? 'ANÔNIMO' : manifestacaoSelecionada.nome}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white" 
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
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Original
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {manifestacaoSelecionada.descricao}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={fecharModal} 
                    variant="outline" 
                    className="flex-1 rounded-full" 
                    disabled={salvando}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={salvarAlteracoes} 
                    className="flex-1 bg-[#00482B] hover:bg-[#00703C] text-white rounded-full" 
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

      <footer className="bg-[#00482B] text-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Sistema de Ouvidoria - Área Administrativa
        </div>
      </footer>
    </div>
  )
}