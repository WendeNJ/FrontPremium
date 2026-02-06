import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { consultarPorProtocolo } from '@/api/ouvidoriaApi'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  MessageSquare,
  Building,
  Tag,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function ConsultarProtocolo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [protocolo, setProtocolo] = useState('')
  const [manifestacao, setManifestacao] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConsultar(e) {
    e.preventDefault()
    
    if (!protocolo.trim()) {
      setError('Por favor, digite um protocolo')
      return
    }

    setLoading(true)
    setError('')
    setManifestacao(null)

    try {
     const res = await consultarPorProtocolo(protocolo.trim())
setManifestacao(res.data)

    } catch (err) {
      console.error('Erro ao consultar:', err)
      setError('Protocolo não encontrado ou inválido')
    } finally {
      setLoading(false)
    }
  }

  function handleNovaConsulta() {
    setProtocolo('')
    setManifestacao(null)
    setError('')
  }

  // Função para formatar data
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

  // Função para obter cor do status
 // Função para obter cor do status
function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case 'ABERTA':
      return 'bg-blue-100 text-blue-800'
    case 'EM_ANALISE':
      return 'bg-yellow-100 text-yellow-800'
    case 'RESPONDIDA':
      return 'bg-green-100 text-green-800'
    case 'ENCERRADA':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Função para obter ícone do status
function getStatusIcon(status) {
  switch (status?.toUpperCase()) {
    case 'ABERTA':
      return <AlertCircle className="w-5 h-5" />
    case 'EM_ANALISE':
      return <RefreshCw className="w-5 h-5" />
    case 'RESPONDIDA':
      return <CheckCircle className="w-5 h-5" />
    case 'ENCERRADA':
      return <XCircle className="w-5 h-5" />
    default:
      return <AlertCircle className="w-5 h-5" />
  }
}
  // Função para formatar o tipo de manifestação
  function formatarTipo(tipo) {
    switch (tipo?.toUpperCase()) {
      case 'RECLAMACAO':
        return 'Reclamação'
      case 'DENUNCIA':
        return 'Denúncia'
      case 'SUGESTAO':
        return 'Sugestão'
      case 'ELOGIO':
        return 'Elogio'
      case 'SOLICITACAO':
        return 'Solicitação'
      default:
        return tipo || 'Não informado'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER - IDÊNTICO AO SEU SITE */}
      <header className="bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/ouvidoria" className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="h-14" />
            <span className="text-white font-bold hidden sm:block">
              SISTEMA DE OUVIDORIA
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
            <Link to="/ouvidoria">INÍCIO</Link>
            <Link to="/ouvidoria/sobre">SOBRE</Link>
            <Link to="/ouvidoria/consultar" className="text-white font-semibold">
              CONSULTAR
            </Link>
          </nav>

          <div className="hidden md:flex gap-3">
            <Button asChild className="bg-white text-[#00703C] rounded-full">
              <Link to="/ouvidoria/nova">Nova Manifestação</Link>
            </Button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] px-4 pb-4 flex flex-col gap-3 text-white">
            <Link to="/ouvidoria">Início</Link>
            <Link to="/ouvidoria/sobre">Sobre</Link>
            <Link to="/ouvidoria/consultar" className="font-semibold">
              Consultar
            </Link>
            <div className="pt-2">
              <Button asChild className="bg-white text-[#00703C] rounded-full w-full">
                <Link to="/ouvidoria/nova">Nova Manifestação</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb - Mesmo estilo da Nova Manifestação */}
          <div className="mb-6">
            <Link 
              to="/ouvidoria" 
              className="text-sm text-gray-600 hover:text-[#00703C] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para início
            </Link>
          </div>

          {/* Card Principal - Mesmo estilo da Nova Manifestação */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header do Card - Mesma cor e estilo */}
            <div className="bg-[#00482B] px-8 py-6">
              <h1 className="text-3xl font-bold text-white">
                Consultar Manifestação
              </h1>
              <p className="text-white/80 mt-2">
                Digite o protocolo para acompanhar o andamento da sua manifestação
              </p>
            </div>

            {/* Formulário de Consulta */}
            <div className="p-8">
              {/* Campo de Protocolo */}
              <form onSubmit={handleConsultar} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número do Protocolo *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Ex: 18C9A407"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none"
                      value={protocolo}
                      onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#00482B] hover:bg-[#00703C] text-white px-8 rounded-full"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Buscando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          Consultar
                        </span>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    * O protocolo foi enviado para o email cadastrado no momento da manifestação
                  </p>
                </div>
              </form>

              {/* Resultado da Consulta */}
              {manifestacao && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6"
                >
                  {/* Separador */}
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Detalhes da Manifestação
                    </h2>

                    {/* Card de Status */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(manifestacao.status)}`}>
                            {getStatusIcon(manifestacao.status)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status Atual</p>
                            <p className="text-lg font-bold text-gray-800">
                              {manifestacao.status || 'Não informado'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Protocolo</p>
                            <p className="text-2xl font-mono font-bold text-[#00482B]">
                              {manifestacao.protocolo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid de Informações */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Coluna 1: Informações da Manifestação */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Tag className="w-4 h-4" />
                            <span className="text-sm font-medium">Tipo</span>
                          </div>
                          <p className="font-medium">{formatarTipo(manifestacao.tipo)}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Building className="w-4 h-4" />
                            <span className="text-sm font-medium">Unidade</span>
                          </div>
                          <p className="font-medium">{manifestacao.unidadenome || 'Não informada'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Categoria</span>
                          </div>
                          <p className="font-medium">{manifestacao.categoriaNome || 'Não informada'}</p>
                        </div>
                      </div>

                      {/* Coluna 2: Datas e Contato */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Data de Criação</span>
                          </div>
                          <p className="font-medium">
                            {formatarData(manifestacao.datacriacao)}
                          </p>
                        </div>

                        {!manifestacao.anonima && (
                          <>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">Solicitante</span>
                              </div>
                              <p className="font-medium">{manifestacao.nome || 'Não informado'}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Email</span>
                              </div>
                              <p className="font-medium">{manifestacao.email || 'Não informado'}</p>
                            </div>

                            {manifestacao.telefone && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                  <Phone className="w-4 h-4" />
                                  <span className="text-sm font-medium">Telefone</span>
                                </div>
                                <p className="font-medium">{manifestacao.telefone}</p>
                              </div>
                            )}
                          </>
                        )}

                        {manifestacao.anonima && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">Tipo de Manifestação</span>
                            </div>
                            <p className="font-medium text-[#00703C]">ANÔNIMA</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mensagem/Descrição */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Mensagem</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 whitespace-pre-line">
                          {manifestacao.descricao || 'Não informada'}
                        </p>
                      </div>
                    </div>

                    {/* Botão Nova Consulta */}
                    <div className="pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleNovaConsulta}
                        variant="outline"
                        className="w-full md:w-auto rounded-full"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Nova Consulta
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Instruções quando não há consulta */}
              {!manifestacao && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center py-8"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Digite um protocolo para consultar
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Informe o número do protocolo recebido por email<br />
                    para acompanhar o andamento da sua manifestação
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER - IDÊNTICO AO SEU SITE */}
      <footer className="bg-[#00482B] text-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Sistema de Ouvidoria
        </div>
      </footer>
    </div>
  )
}