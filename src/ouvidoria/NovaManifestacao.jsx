import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { criarManifestacao, criarManifestacaoComArquivo } from '@/api/ouvidoriaApi'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Upload, FileText, ArrowLeft, CheckCircle, Menu, X } from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function NovaManifestacao() {
  const [params] = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    descricao: '', // MUDADO: de 'mensagem' para 'descricao'
    unidadeId: '',
    categoriaId: '',
    telefone: '', // ADICIONADO
    anonima: false, // ADICIONADO
    // O campo 'tipo' será fixo temporariamente
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

      // Preparar os dados no formato que o backend espera
      const dadosParaEnviar = {
        nome: form.nome,
        email: form.email,
        descricao: form.descricao, // Campo correto
        unidadeId: form.unidadeId,
        categoriaId: form.categoriaId,
        telefone: form.telefone || '', // Opcional
        anonima: form.anonima,
        tipo: 'RECLAMACAO' // Valor fixo temporariamente para teste
      }

      console.log('Enviando dados:', dadosParaEnviar) // Para debug

      if (arquivo) {
        const formData = new FormData()
        formData.append('nome', form.nome)
        formData.append('email', form.email)
        formData.append('descricao', form.descricao) // Campo correto
        formData.append('unidadeId', form.unidadeId)
        formData.append('categoriaId', form.categoriaId)
        formData.append('telefone', form.telefone || '')
        formData.append('anonima', form.anonima.toString())
        formData.append('tipo', 'RECLAMACAO') // Valor fixo
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* HEADER */}
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
              <Link to="/ouvidoria/consultar">CONSULTAR</Link>
            </nav>

            <div className="hidden md:flex gap-3">
              <Button asChild className="bg-white text-[#00703C] rounded-full">
                <Link to="/ouvidoria/consultar">Acompanhar</Link>
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
              <Link to="/ouvidoria/consultar">Consultar</Link>
            </div>
          )}
        </header>

        {/* SUCESSO */}
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#00703C]" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Manifestação enviada!
            </h2>

            <p className="text-gray-600 mb-6">
              Guarde seu protocolo para acompanhamento:
            </p>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">Protocolo</p>
              <p className="text-3xl font-mono font-bold text-[#00482B]">
                {protocolo}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full"
              >
                <Link to="/ouvidoria">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao início
                </Link>
              </Button>

              <Button
                onClick={() => {
                  setProtocolo(null)
                  setForm({
                    nome: '',
                    email: '',
                    mensagem: '',
                    unidadeId: '',
                    categoriaId: '',
                  })
                  setArquivo(null)
                }}
                className="flex-1 bg-[#00482B] hover:bg-[#00703C] rounded-full"
              >
                Nova Manifestação
              </Button>
            </div>
          </motion.div>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#00482B] text-white py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            © {new Date().getFullYear()} Sistema de Ouvidoria
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
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
            <Link to="/ouvidoria/consultar">CONSULTAR</Link>
          </nav>

          <div className="hidden md:flex gap-3">
            <Button asChild className="bg-white text-[#00703C] rounded-full">
              <Link to="/ouvidoria/consultar">Acompanhar</Link>
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
            <Link to="/ouvidoria/consultar">Consultar</Link>
          </div>
        )}
      </header>

      {/* FORMULÁRIO */}
      <div className="flex-1 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/ouvidoria"
              className="text-sm text-gray-600 hover:text-[#00703C] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para início
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header do Card */}
            <div className="bg-[#00482B] px-8 py-6">
              <h1 className="text-3xl font-bold text-white">
                Nova Manifestação
              </h1>
              <p className="text-white/80 mt-2">
                Preencha os campos abaixo para registrar sua manifestação
              </p>
            </div>

            {/* Form */}
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Campo Anônima */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="anonima"
                  checked={form.anonima}
                  onChange={(e) => setForm({ ...form, anonima: e.target.checked })}
                  className="h-4 w-4 text-[#00703C] rounded focus:ring-[#00703C] border-gray-300"
                />
                <label htmlFor="anonima" className="ml-2 text-sm text-gray-700">
                  Manifestação anônima
                </label>
              </div>

              {/* Nome - mostrar apenas se não for anônimo */}
              {!form.anonima && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    name="nome"
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none"
                    onChange={handleChange}
                    value={form.nome}
                    required={!form.anonima}
                  />
                </div>
              )}

              {/* Email - mostrar apenas se não for anônimo */}
              {!form.anonima && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none"
                    onChange={handleChange}
                    value={form.email}
                    required={!form.anonima}
                  />
                </div>
              )}

              {/* Telefone - mostrar apenas se não for anônimo */}
              {!form.anonima && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none"
                    onChange={handleChange}
                    value={form.telefone}
                  />
                </div>
              )}

              {/* Grid: Categoria e Unidade */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-white"
                    onChange={handleChange}
                    required
                    disabled={loadingDados}
                  >
                    <option value="">
                      {loadingDados ? 'Carregando...' : 'Selecione'}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unidade *
                  </label>
                  <select
                    name="unidadeId"
                    value={form.unidadeId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-white"
                    onChange={handleChange}
                    required
                    disabled={loadingDados}
                  >
                    <option value="">
                      {loadingDados ? 'Carregando...' : 'Selecione'}
                    </option>
                    {unidades.map((unidade) => (
                      <option key={unidade.id} value={unidade.id}>
                        {unidade.name || unidade.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mensagem (campo descricao no backend) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descreva sua manifestação *
                </label>
                <textarea
                  name="descricao" // MUDADO: de 'mensagem' para 'descricao'
                  placeholder="Descreva detalhadamente sua manifestação..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none resize-none"
                  rows={6}
                  onChange={handleChange}
                  value={form.descricao} // MUDADO
                  required
                />
              </div>

              {/* Anexo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Anexar arquivo (opcional)
                </label>
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
                    className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00703C] hover:bg-gray-50 transition-all"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {arquivo ? 'Trocar arquivo' : 'Clique para escolher um arquivo'}
                    </span>
                  </label>
                </div>

                {arquivo && (
                  <div className="mt-3 flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-5 h-5 text-[#00703C]" />
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
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remover
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, ZIP (máx. 5MB)
                </p>
              </div>

              {/* Botão */}
              <div className="pt-4">
                <Button
                  disabled={loading}
                  className="w-full bg-[#00482B] hover:bg-[#00703C] text-white py-4 text-lg font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Manifestação'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#00482B] text-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Sistema de Ouvidoria
        </div>
      </footer>
    </div>
  )
}