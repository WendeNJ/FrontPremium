import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { consultarPorProtocolo } from '@/api/ouvidoriaApi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  X,
  Shield,
  Eye,
  Info,
  ChevronRight,
  Home,
  Paperclip,
  Download,
  Send,
} from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'
const API_BASE = import.meta.env.VITE_API_URL || 'https://heineken-backend-api-fuc5.onrender.com'

const STATUS_CONFIG = {
  ABERTA: { 
    label: 'Aberta', 
    color: 'bg-blue-500/10 text-blue-700 border-blue-200', 
    icon: AlertCircle,
    bg: 'bg-blue-50'
  },
  EM_ANALISE: { 
    label: 'Em Análise', 
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', 
    icon: RefreshCw,
    bg: 'bg-yellow-50'
  },
  RESPONDIDA: { 
    label: 'Respondida', 
    color: 'bg-green-500/10 text-green-700 border-green-200', 
    icon: CheckCircle,
    bg: 'bg-green-50'
  },
  // Mantido para compatibilidade com registros antigos
  ENCERRADA: { 
    label: 'Encerrada', 
    color: 'bg-gray-500/10 text-gray-700 border-gray-200', 
    icon: XCircle,
    bg: 'bg-gray-50'
  }
}

export default function ConsultarProtocolo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [protocolo, setProtocolo] = useState('')
  const [manifestacao, setManifestacao] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConsultar(e) {
    e.preventDefault()
    if (!protocolo.trim()) { setError('Por favor, digite um protocolo'); return }
    setLoading(true); setError(''); setManifestacao(null)
    try {
      const res = await consultarPorProtocolo(protocolo.trim())
      setManifestacao(res.data)
    } catch (err) {
      console.error('Erro ao consultar:', err)
      setError('Protocolo não encontrado ou inválido')
    } finally { setLoading(false) }
  }

  function handleNovaConsulta() { setProtocolo(''); setManifestacao(null); setError('') }

  function formatarData(dataString) {
    if (!dataString) return ''
    return new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function formatarTipo(tipo) {
    const tipos = { RECLAMACAO: 'Reclamação', DENUNCIA: 'Denúncia', SUGESTAO: 'Sugestão', ELOGIO: 'Elogio', SOLICITACAO: 'Solicitação' }
    return tipos[tipo?.toUpperCase()] || tipo || 'Não informado'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* HEADER */}
      <header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/ouvidoria" className="flex items-center gap-4 group">
            <img src={LOGO_URL} alt="Logo" className="h-14 transition-transform group-hover:scale-105" />
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">SISTEMA DE OUVIDORIA</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/ouvidoria" className="text-white/70 hover:text-white transition-colors">INÍCIO</Link>
            <Link to="/ouvidoria/sobre" className="text-white/70 hover:text-white transition-colors">SOBRE</Link>
            <Link to="/ouvidoria/consultar" className="text-white font-medium border-b-2 border-white">CONSULTAR</Link>
          </nav>
          <div className="hidden md:flex gap-3">
            <Button asChild className="bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
              <Link to="/ouvidoria/nova"><FileText className="w-4 h-4 mr-2" />Nova Manifestação</Link>
            </Button>
          </div>
          <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col gap-3 py-3">
              <Link to="/ouvidoria" className="text-white/70 hover:text-white py-2">Início</Link>
              <Link to="/ouvidoria/sobre" className="text-white/70 hover:text-white py-2">Sobre</Link>
              <Link to="/ouvidoria/consultar" className="text-white font-medium py-2">Consultar</Link>
              <Button asChild className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white rounded-full w-full mt-2">
                <Link to="/ouvidoria/nova">Nova Manifestação</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* CONTEÚDO */}
      <div className="flex-1 py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/ouvidoria" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#00703C] transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow border border-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2" />Voltar para Início
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#00482B] to-[#00703C] px-8 py-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg"><Search className="w-6 h-6 text-white" /></div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Consultar Manifestação</h1>
              </div>
              <p className="text-white/90 text-lg ml-11">Digite o protocolo para acompanhar o andamento</p>
            </div>

            <div className="p-8 md:p-10">
              <form onSubmit={handleConsultar} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#00482B]" />Número do Protocolo
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="Ex: 18C9A407" className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400" value={protocolo} onChange={(e) => setProtocolo(e.target.value.toUpperCase())} disabled={loading} />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 min-w-[160px]">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          Buscando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2"><Search className="w-5 h-5" />Consultar</span>
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-500 text-sm mt-2 flex items-center gap-2 bg-red-50 px-4 py-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
                    <Info className="w-4 h-4 text-gray-400" />O protocolo foi enviado para o e-mail cadastrado no momento da manifestação
                  </p>
                </div>
              </form>

              <AnimatePresence mode="wait">
                {manifestacao && (
                  <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="mt-10 space-y-8">
                    <Separator className="bg-gray-200" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-[#00482B]/10 rounded-lg"><FileText className="w-5 h-5 text-[#00482B]" /></div>
                        Detalhes da Manifestação
                      </h2>

                      {/* Status */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${STATUS_CONFIG[manifestacao.status]?.bg || 'bg-gray-100'}`}>
                              {(() => { const Icon = STATUS_CONFIG[manifestacao.status]?.icon || AlertCircle; return <Icon className={`w-8 h-8 ${STATUS_CONFIG[manifestacao.status]?.color?.split(' ')[1] || 'text-gray-700'}`} /> })()}
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Status Atual</p>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">{STATUS_CONFIG[manifestacao.status]?.label || manifestacao.status}</span>
                                <Badge className={STATUS_CONFIG[manifestacao.status]?.color}>{STATUS_CONFIG[manifestacao.status]?.label}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#00482B]/5 px-6 py-4 rounded-xl border border-[#00482B]/10">
                            <p className="text-sm text-gray-600 mb-1">Protocolo</p>
                            <p className="text-3xl font-mono font-bold text-[#00482B] tracking-wider">{manifestacao.protocolo}</p>
                          </div>
                        </div>
                      </div>

                      {/* Grid de informações */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {[
                            { icon: Tag, label: 'Tipo', value: formatarTipo(manifestacao.tipo) },
                            { icon: Building, label: 'Unidade', value: manifestacao.unidade_nome || 'Não informada' },
                            { icon: FileText, label: 'Categoria', value: manifestacao.categoria_nome || 'Não informada' },
                          ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-3 text-gray-700 mb-3">
                                <div className="p-2 bg-[#00482B]/10 rounded-lg"><Icon className="w-4 h-4 text-[#00482B]" /></div>
                                <span className="text-sm font-semibold">{label}</span>
                              </div>
                              <p className="font-medium text-gray-900 ml-9">{value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 text-gray-700 mb-3">
                              <div className="p-2 bg-[#00482B]/10 rounded-lg"><Calendar className="w-4 h-4 text-[#00482B]" /></div>
                              <span className="text-sm font-semibold">Data de Criação</span>
                            </div>
                            <p className="font-medium text-gray-900 ml-9">
                              {formatarData(manifestacao.data_criacao || manifestacao.datacriacao)}
                            </p>
                          </div>

                          {!manifestacao.anonima ? (
                            <>
                              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 text-gray-700 mb-3">
                                  <div className="p-2 bg-[#00482B]/10 rounded-lg"><User className="w-4 h-4 text-[#00482B]" /></div>
                                  <span className="text-sm font-semibold">Solicitante</span>
                                </div>
                                <p className="font-medium text-gray-900 ml-9">{manifestacao.nome || 'Não informado'}</p>
                              </div>
                              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 text-gray-700 mb-3">
                                  <div className="p-2 bg-[#00482B]/10 rounded-lg"><Mail className="w-4 h-4 text-[#00482B]" /></div>
                                  <span className="text-sm font-semibold">E-mail</span>
                                </div>
                                <p className="font-medium text-gray-900 ml-9 break-all">{manifestacao.email || 'Não informado'}</p>
                              </div>
                              {manifestacao.telefone && (
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                  <div className="flex items-center gap-3 text-gray-700 mb-3">
                                    <div className="p-2 bg-[#00482B]/10 rounded-lg"><Phone className="w-4 h-4 text-[#00482B]" /></div>
                                    <span className="text-sm font-semibold">Telefone</span>
                                  </div>
                                  <p className="font-medium text-gray-900 ml-9">{manifestacao.telefone}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-200 shadow-sm">
                              <div className="flex items-center gap-3 text-purple-700 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><Shield className="w-4 h-4 text-purple-600" /></div>
                                <span className="text-sm font-semibold">Tipo de Manifestação</span>
                              </div>
                              <p className="font-bold text-purple-700 ml-9">ANÔNIMA</p>
                              <p className="text-xs text-purple-600 ml-9 mt-2">Identidade preservada conforme política de sigilo</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mensagem original */}
                      <div className="mt-6">
                        <div className="flex items-center gap-3 text-gray-700 mb-4">
                          <div className="p-2 bg-[#00482B]/10 rounded-lg"><MessageSquare className="w-5 h-5 text-[#00482B]" /></div>
                          <span className="font-semibold text-gray-900">Mensagem</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{manifestacao.descricao || 'Não informada'}</p>
                        </div>
                      </div>

                      {/* ══ RESPOSTA DA OUVIDORIA ══ */}
                      {manifestacao.resposta && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-6"
                        >
                          <div className="flex items-center gap-3 text-gray-700 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg"><Send className="w-5 h-5 text-green-700" /></div>
                            <span className="font-semibold text-gray-900">Resposta da Ouvidoria</span>
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs ml-auto">Respondida</Badge>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200 shadow-sm relative overflow-hidden">
                            {/* Detalhe decorativo */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-300 rounded-l-xl" />
                            <div className="pl-4">
                              <p className="text-gray-800 whitespace-pre-line leading-relaxed">{manifestacao.resposta}</p>
                              {manifestacao.dataResposta && (
                                <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Respondido em {formatarData(manifestacao.dataResposta)}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Anexo */}
                      {manifestacao.possuiAnexo && (
                        <div className="mt-6">
                          <div className="flex items-center gap-3 text-gray-700 mb-4">
                            <div className="p-2 bg-[#00482B]/10 rounded-lg"><Paperclip className="w-5 h-5 text-[#00482B]" /></div>
                            <span className="font-semibold text-gray-900">Documento Anexado</span>
                          </div>
                          <div className="bg-gradient-to-r from-[#00482B]/5 to-white rounded-xl p-5 border border-[#00482B]/15 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-[#00482B]" />
                              </div>
                              <p className="text-sm font-semibold text-gray-800 truncate">{manifestacao.anexoNome}</p>
                            </div>
                            <a
                              href={`${API_BASE}/manifestacoes/anexo/${manifestacao.anexoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-[#00482B] text-white text-sm font-medium rounded-lg hover:bg-[#00703C] transition-colors flex-shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              Baixar
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Nova Consulta */}
                      <div className="pt-6 flex justify-end">
                        <Button onClick={handleNovaConsulta} variant="outline" className="rounded-full px-8 py-6 border-2 hover:bg-[#00482B] hover:text-white hover:border-[#00482B] transition-all group">
                          <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />Nova Consulta
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!manifestacao && !error && (
                  <motion.div key="instrucoes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Digite um protocolo para consultar</h3>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">Informe o número do protocolo recebido por e-mail para acompanhar o andamento da sua manifestação</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl">
                        <Link to="/ouvidoria/nova"><FileText className="w-4 h-4 mr-2" />Fazer uma manifestação</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full px-8 py-6 border-2">
                        <Link to="/ouvidoria/sobre">Conhecer a Ouvidoria</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Logo" className="h-10 brightness-0 invert" />
              <span className="text-sm text-white/80">© {new Date().getFullYear()} - Sistema de Ouvidoria</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/ouvidoria" className="text-white/80 hover:text-white transition-colors">Início</Link>
              <Link to="/ouvidoria/sobre" className="text-white/80 hover:text-white transition-colors">Sobre</Link>
              <Link to="/ouvidoria/consultar" className="text-white font-medium">Consultar</Link>
              <Link to="/ouvidoria/admin" className="text-white/80 hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 text-center md:text-left">
            <p className="text-xs text-white/60">Canal oficial de comunicação. Todas as manifestações são tratadas com sigilo e transparência.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
