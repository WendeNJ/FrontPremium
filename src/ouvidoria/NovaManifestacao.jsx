import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { criarManifestacao, criarManifestacaoComArquivo } from '@/api/ouvidoriaApi'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Upload, FileText, ArrowLeft, CheckCircle, Menu, X, User, Mail, Phone, Building2, Tag, MessageSquare, Shield } from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function NovaManifestacao() {
  const [params] = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    descricao: '',
    unidadeId: '',
    categoriaId: '',
    telefone: '',
    anonima: false,
  })

  const [arquivo, setArquivo] = useState(null)
  const [unidades, setUnidades] = useState([])
  const [categorias, setCategorias] = useState([])
  const [protocolo, setProtocolo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDados, setLoadingDados] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [unidadesData, categoriasData] = await Promise.all([
          base44.entities.Unidades.list(),
          base44.entities.Categorias.list(),
        ])

        setUnidades(unidadesData || [])
        setCategorias(categoriasData || [])
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        alert('Erro ao carregar unidades ou categorias')
      } finally {
        setLoadingDados(false)
      }
    }

    carregarDados()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert('Arquivo muito grande. Tamanho máximo: 5MB')
        e.target.value = ''
        return
      }
      setArquivo(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let res

      const dadosParaEnviar = {
        nome: form.nome,
        email: form.email,
        descricao: form.descricao,
        unidadeId: form.unidadeId,
        categoriaId: form.categoriaId,
        telefone: form.telefone || '',
        anonima: form.anonima,
        tipo: 'RECLAMACAO'
      }

      if (arquivo) {
        const formData = new FormData()
        formData.append('nome', form.nome)
        formData.append('email', form.email)
        formData.append('descricao', form.descricao)
        formData.append('unidadeId', form.unidadeId)
        formData.append('categoriaId', form.categoriaId)
        formData.append('telefone', form.telefone || '')
        formData.append('anonima', form.anonima.toString())
        formData.append('tipo', 'RECLAMACAO')
        formData.append('arquivo', arquivo)

        res = await criarManifestacaoComArquivo(formData)
      } else {
        res = await criarManifestacao(dadosParaEnviar)
      }

      setProtocolo(res.data.protocolo)
    } catch (err) {
      console.error('Erro detalhado:', err.response?.data || err.message)
      alert(err.response?.data?.message || 'Erro ao enviar manifestação')
    } finally {
      setLoading(false)
    }
  }

  if (protocolo) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        {/* HEADER */}
        <header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link to="/ouvidoria" className="flex items-center gap-4 group">
              <img src={LOGO_URL} alt="Logo" className="h-14 transition-transform group-hover:scale-105" />
              <span className="text-white font-bold text-lg tracking-wide hidden sm:block">
                SISTEMA DE OUVIDORIA
              </span>
            </Link>

            <nav className="hidden md:flex gap-8 text-white/90 text-sm font-medium">
              <Link to="/ouvidoria" className="hover:text-white transition-colors">INÍCIO</Link>
              <Link to="/ouvidoria/sobre" className="hover:text-white transition-colors">SOBRE</Link>
              <Link to="/ouvidoria/consultar" className="hover:text-white transition-colors">CONSULTAR</Link>
            </nav>

            <div className="hidden md:flex gap-3">
              <Button asChild className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-6 font-semibold">
                <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
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
                <Link to="/ouvidoria" className="text-white/90 hover:text-white py-2">Início</Link>
                <Link to="/ouvidoria/sobre" className="text-white/90 hover:text-white py-2">Sobre</Link>
                <Link to="/ouvidoria/consultar" className="text-white/90 hover:text-white py-2">Consultar</Link>
                <Button asChild className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full mt-2">
                  <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </header>

        {/* SUCESSO */}
        <div className="flex-1 flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-gray-100"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-[#00703C]" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Manifestação Enviada!
            </h2>

            <p className="text-gray-600 mb-8">
              Sua manifestação foi registrada com sucesso. Guarde este protocolo para acompanhamento:
            </p>

            <div className="bg-gradient-to-br from-[#00482B]/5 to-[#00703C]/5 border-2 border-[#00482B]/20 rounded-xl p-6 mb-8">
              <p className="text-sm font-medium text-[#00482B] uppercase tracking-wider mb-2">
                Número do Protocolo
              </p>
              <p className="text-4xl font-mono font-bold text-[#00482B] tracking-wider">
                {protocolo}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Enviamos uma cópia do protocolo para o seu e-mail. Utilize-o para consultar o andamento da sua manifestação.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full border-2 hover:bg-gray-50"
              >
                <Link to="/ouvidoria">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>

              <Button
                onClick={() => {
                  setProtocolo(null)
                  setForm({
                    nome: '',
                    email: '',
                    descricao: '',
                    unidadeId: '',
                    categoriaId: '',
                    telefone: '',
                    anonima: false,
                  })
                  setArquivo(null)
                }}
                className="flex-1 bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Nova Manifestação
              </Button>
            </div>
          </motion.div>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#00482B] text-white/90 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="Logo" className="h-10" />
                <span className="text-sm">© {new Date().getFullYear()} - Todos os direitos reservados</span>
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/ouvidoria/sobre" className="hover:text-white transition-colors">Sobre</Link>
                <Link to="/ouvidoria/consultar" className="hover:text-white transition-colors">Consultar</Link>
                <Link to="/ouvidoria" className="hover:text-white transition-colors">Início</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* HEADER */}
      <header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/ouvidoria" className="flex items-center gap-4 group">
            <img src={LOGO_URL} alt="Logo" className="h-14 transition-transform group-hover:scale-105" />
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">
              SISTEMA DE OUVIDORIA
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 text-white/90 text-sm font-medium">
            <Link to="/ouvidoria" className="hover:text-white transition-colors">INÍCIO</Link>
            <Link to="/ouvidoria/sobre" className="hover:text-white transition-colors">SOBRE</Link>
            <Link to="/ouvidoria/consultar" className="hover:text-white transition-colors">CONSULTAR</Link>
          </nav>

          <div className="hidden md:flex gap-3">
            <Button asChild className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-6 font-semibold">
              <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
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
              <Link to="/ouvidoria" className="text-white/90 hover:text-white py-2">Início</Link>
              <Link to="/ouvidoria/sobre" className="text-white/90 hover:text-white py-2">Sobre</Link>
              <Link to="/ouvidoria/consultar" className="text-white/90 hover:text-white py-2">Consultar</Link>
              <Button asChild className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full mt-2">
                <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* FORMULÁRIO */}
      <div className="flex-1 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/ouvidoria"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#00703C] transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Página Inicial
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-[#00482B] to-[#00703C] px-8 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Nova Manifestação
              </h1>
              <p className="text-white/90 text-lg">
                Registre sua manifestação de forma rápida e segura
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              {/* Campo Anônima */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="anonima"
                      checked={form.anonima}
                      onChange={(e) => setForm({ ...form, anonima: e.target.checked })}
                      className="sr-only"
                    />
                    <label
                      htmlFor="anonima"
                      className={`flex items-center cursor-pointer gap-3 p-3 rounded-lg transition-all ${form.anonima ? 'bg-[#00482B]/10' : 'hover:bg-gray-100'
                        }`}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-all ${form.anonima
                          ? 'bg-[#00482B] border-[#00482B]'
                          : 'border-gray-300 bg-white'
                        }`}>
                        {form.anonima && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium">
                        Desejo registrar manifestação anônima
                      </span>
                    </label>
                  </div>
                </div>
                {form.anonima && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[#00703C] mt-3 ml-12"
                  >
                    ⚡ Sua identidade será preservada em todo o processo
                  </motion.p>
                )}
              </div>

              {/* Dados Pessoais - Mostrar apenas se não for anônimo */}
              {!form.anonima && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                    <User className="w-5 h-5 text-[#00703C]" />
                    Dados Pessoais
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Nome Completo *
                      </label>
                      <input
                        name="nome"
                        placeholder="Digite seu nome completo"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white"
                        onChange={handleChange}
                        value={form.nome}
                        required={!form.anonima}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        E-mail *
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white"
                        onChange={handleChange}
                        value={form.email}
                        required={!form.anonima}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        Telefone para Contato
                      </label>
                      <input
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white"
                        onChange={handleChange}
                        value={form.telefone}
                      />
                      <p className="text-xs text-gray-500 mt-1">Opcional - Para contato rápido se necessário</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Dados da Manifestação */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <MessageSquare className="w-5 h-5 text-[#00703C]" />
                  Detalhes da Manifestação
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      Categoria *
                    </label>
                    <select
                      name="categoriaId"
                      value={form.categoriaId}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                      onChange={handleChange}
                      required
                      disabled={loadingDados}
                    >
                      <option value="">
                        {loadingDados ? 'Carregando...' : 'Selecione uma categoria'}
                      </option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.name || categoria.descricao}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unidade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      Unidade *
                    </label>
                    <select
                      name="unidadeId"
                      value={form.unidadeId}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                      onChange={handleChange}
                      required
                      disabled={loadingDados}
                    >
                      <option value="">
                        {loadingDados ? 'Carregando...' : 'Selecione uma unidade'}
                      </option>
                      {unidades.map((unidade) => (
                        <option key={unidade.id} value={unidade.id}>
                          {unidade.name || unidade.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    Descreva sua manifestação *
                  </label>
                  <textarea
                    name="descricao"
                    placeholder="Descreva detalhadamente sua manifestação. Quanto mais informações, melhor poderemos atendê-lo(a)."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none resize-none bg-gray-50 hover:bg-white focus:bg-white"
                    rows={6}
                    onChange={handleChange}
                    value={form.descricao}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {form.descricao.length} caracteres
                  </p>
                </div>
              </div>

              {/* Anexo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Upload className="w-5 h-5 text-[#00703C]" />
                  Anexos
                </h3>

                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full px-4 py-8 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#00703C] hover:bg-gradient-to-b hover:from-gray-50 hover:to-white transition-all group"
                  >
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#00703C] transition-colors mb-3" />
                    <span className="text-gray-600 font-medium group-hover:text-[#00703C] transition-colors">
                      {arquivo ? 'Trocar arquivo' : 'Clique para escolher um arquivo'}
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                      ou arraste e solte aqui
                    </span>
                  </label>
                </div>

                {arquivo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#00482B]/5 to-[#00703C]/5 rounded-lg border border-[#00703C]/20"
                  >
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="w-6 h-6 text-[#00703C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {arquivo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(arquivo.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setArquivo(null)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Remover
                    </button>
                  </motion.div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, ZIP (tamanho máximo: 5MB)
                  </p>
                </div>
              </div>

              {/* Botão */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando Manifestação...
                    </span>
                  ) : (
                    'Enviar Manifestação'
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  Ao enviar, você concorda com nossa Política de Privacidade e Termos de Uso
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

     
      <footer className="bg-[#00482B] text-white/90 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10" />
              <span className="text-sm">© {new Date().getFullYear()} - Premium Bebidas</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              {/* 🔥 CONTATOS PREMIUM */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/90">rh@premiumteresina.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/90">(86) 8825-0227</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
