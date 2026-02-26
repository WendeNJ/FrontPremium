import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { criarManifestacao, criarManifestacaoComArquivo } from '@/api/ouvidoriaApi'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Upload, FileText, ArrowLeft, CheckCircle, Menu, X, User, Mail, Phone, Building2, Tag, MessageSquare, Shield, Paperclip, Trash2, File, ImageIcon, FileArchive } from 'lucide-react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'


// Ícone baseado na extensão do arquivo
function FileIcon({ name }) {
const ext = name?.split('.').pop()?.toLowerCase()
if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
return <ImageIcon className="w-5 h-5 text-blue-500" />
if (['zip', 'rar', '7z'].includes(ext))
return <FileArchive className="w-5 h-5 text-yellow-500" />
if (['pdf'].includes(ext))
return <FileText className="w-5 h-5 text-red-500" />
return <File className="w-5 h-5 text-gray-500" />
}

function formatBytes(bytes) {
if (bytes < 1024) return `${bytes} B`
if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function NovaManifestacao() {
const [params] = useSearchParams()
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [dragOver, setDragOver] = useState(false)

const [form, setForm] = useState({
nome: '',
email: '',
descricao: '',
unidadeId: '',
categoriaId: '',
telefone: '',
anonima: false,
tipo: '',
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

function validarArquivo(file) {
if (!file) return false
const maxSize = 5 * 1024 * 1024
if (file.size > maxSize) {
alert('Arquivo muito grande. Tamanho máximo: 5MB')
return false
}
return true
}

function handleFileChange(e) {
const file = e.target.files[0]
if (file && validarArquivo(file)) setArquivo(file)
e.target.value = ''
}

function handleDrop(e) {
e.preventDefault()
setDragOver(false)
const file = e.dataTransfer.files[0]
if (file && validarArquivo(file)) setArquivo(file)
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
tipo: form.tipo,
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
formData.append('tipo', form.tipo)
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

const Header = () => (
<header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
<Link to="/ouvidoria" className="flex items-center gap-4 group">
<img src={LOGO_URL} alt="Logo" className="h-14 transition-transform group-hover:scale-105" />
<span className="text-white font-bold text-lg tracking-wide hidden sm:block">SISTEMA DE OUVIDORIA</span>
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
<button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>
</div>
{mobileMenuOpen && (
<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800">
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
)

const Footer = () => (
<footer className="bg-[#00482B] text-white/90 py-10 mt-auto">
<div className="max-w-7xl mx-auto px-4">
<div className="flex flex-col md:flex-row justify-between items-center gap-4">
<div className="flex items-center gap-3">
<img src={LOGO_URL} alt="Logo" className="h-10" />
<span className="text-sm">© {new Date().getFullYear()} - Premium Bebidas</span>
</div>
<div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
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
)

if (protocolo) {
return (
<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
<Header />
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
<h2 className="text-3xl font-bold text-gray-800 mb-3">Manifestação Enviada!</h2>
<p className="text-gray-600 mb-8">Sua manifestação foi registrada com sucesso. Guarde este protocolo para acompanhamento:</p>
<div className="bg-gradient-to-br from-[#00482B]/5 to-[#00703C]/5 border-2 border-[#00482B]/20 rounded-xl p-6 mb-8">
<p className="text-sm font-medium text-[#00482B] uppercase tracking-wider mb-2">Número do Protocolo</p>
<p className="text-4xl font-mono font-bold text-[#00482B] tracking-wider">{protocolo}</p>
</div>
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
<p className="text-sm text-blue-800 flex items-start gap-2">
<Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
<span>Enviamos uma cópia do protocolo para o seu e-mail. Utilize-o para consultar o andamento da sua manifestação.</span>
</p>
</div>
<div className="flex flex-col sm:flex-row gap-3">
<Button asChild variant="outline" className="flex-1 rounded-full border-2 hover:bg-gray-50">
<Link to="/ouvidoria"><ArrowLeft className="w-4 h-4 mr-2" />Voltar ao Início</Link>
</Button>
<Button
onClick={() => { setProtocolo(null); setForm({ nome: '', email: '', descricao: '', unidadeId: '', categoriaId: '', telefone: '', anonima: false, tipo: '' }); setArquivo(null) }}
className="flex-1 bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
>
Nova Manifestação
</Button>
</div>
</motion.div>
</div>
<Footer />
</div>
)
}

return (
<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
<Header />

<div className="flex-1 py-16 px-4">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">

<div className="mb-8">
<Link to="/ouvidoria" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#00703C] transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow">
<ArrowLeft className="w-4 h-4 mr-2" />Voltar para Página Inicial
</Link>
</div>

<div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
<div className="bg-gradient-to-r from-[#00482B] to-[#00703C] px-8 py-8">
<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Nova Manifestação</h1>
<p className="text-white/90 text-lg">Registre sua manifestação de forma rápida e segura</p>
</div>

<form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

{/* Anônima */}
<div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
<div className="flex items-center">
<div className="relative">
<input type="checkbox" id="anonima" checked={form.anonima} onChange={(e) => setForm({ ...form, anonima: e.target.checked })} className="sr-only" />
<label htmlFor="anonima" className={`flex items-center cursor-pointer gap-3 p-3 rounded-lg transition-all ${form.anonima ? 'bg-[#00482B]/10' : 'hover:bg-gray-100'}`}>
<div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-all ${form.anonima ? 'bg-[#00482B] border-[#00482B]' : 'border-gray-300 bg-white'}`}>
{form.anonima && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
</div>
<span className="text-gray-700 font-medium">Desejo registrar manifestação anônima</span>
</label>
</div>
</div>
{form.anonima && (
<motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[#00703C] mt-3 ml-12">
⚡ Sua identidade será preservada em todo o processo
</motion.p>
)}
</div>

{/* Dados Pessoais */}
{!form.anonima && (
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
<User className="w-5 h-5 text-[#00703C]" />Dados Pessoais
</h3>
<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" />Nome Completo *</label>
<input name="nome" placeholder="Digite seu nome completo" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" onChange={handleChange} value={form.nome} required={!form.anonima} />
</div>
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />E-mail *</label>
<input name="email" type="email" placeholder="seu.email@exemplo.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" onChange={handleChange} value={form.email} required={!form.anonima} />
</div>
<div className="md:col-span-2">
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />Telefone para Contato</label>
<input name="telefone" placeholder="(00) 00000-0000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" onChange={handleChange} value={form.telefone} />
<p className="text-xs text-gray-500 mt-1">Opcional - Para contato rápido se necessário</p>
</div>
</div>
</motion.div>
)}

{/* Detalhes */}
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
<MessageSquare className="w-5 h-5 text-[#00703C]" />Detalhes da Manifestação
</h3>
<div className="grid md:grid-cols-3 gap-6">
{/* TIPO DE MANIFESTAÇÃO */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
<Tag className="w-4 h-4 text-gray-400" />Tipo *
</label>
<select
name="tipo"
value={form.tipo}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
onChange={handleChange}
required
>
<option value="">Selecione o tipo</option>
<option value="RECLAMACAO">Reclamação</option>
<option value="DENUNCIA">Denúncia</option>
<option value="SUGESTAO">Sugestão</option>
<option value="ELOGIO">Elogio</option>
<option value="SOLICITACAO">Solicitação</option>
</select>
</div>

{/* CATEGORIA */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400" />Categoria *</label>
<select name="categoriaId" value={form.categoriaId} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer" onChange={handleChange} required disabled={loadingDados}>
<option value="">{loadingDados ? 'Carregando...' : 'Selecione uma categoria'}</option>
{categorias.map((c) => <option key={c.id} value={c.id}>{c.name || c.descricao}</option>)}
</select>
</div>

{/* UNIDADE */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" />Unidade *</label>
<select name="unidadeId" value={form.unidadeId} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer" onChange={handleChange} required disabled={loadingDados}>
<option value="">{loadingDados ? 'Carregando...' : 'Selecione uma unidade'}</option>
{unidades.map((u) => <option key={u.id} value={u.id}>{u.name || u.descricao}</option>)}
</select>
</div>
</div>
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-400" />Descreva sua manifestação *</label>
<textarea name="descricao" placeholder="Descreva detalhadamente sua manifestação. Quanto mais informações, melhor poderemos atendê-lo(a)." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00703C] focus:border-transparent transition-all outline-none resize-none bg-gray-50 hover:bg-white focus:bg-white" rows={6} onChange={handleChange} value={form.descricao} required />
<p className="text-xs text-gray-500 mt-1 text-right">{form.descricao.length} caracteres</p>
</div>
</div>

{/* ========================
                 SEÇÃO ANEXOS
                 ======================== */}
<div className="space-y-4">
<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
<Paperclip className="w-5 h-5 text-[#00703C]" />
Anexar Documento
<span className="ml-auto text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Opcional</span>
</h3>

<AnimatePresence mode="wait">
{!arquivo ? (
<motion.div
key="dropzone"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0, scale: 0.97 }}
transition={{ duration: 0.2 }}
>
<input
type="file"
id="file-upload"
onChange={handleFileChange}
className="hidden"
accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
/>
<label
htmlFor="file-upload"
onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
onDragLeave={() => setDragOver(false)}
onDrop={handleDrop}
className={`
                         relative flex flex-col items-center justify-center w-full py-10 px-6
                         border-2 border-dashed rounded-2xl cursor-pointer
                         transition-all duration-200 group overflow-hidden
                         ${dragOver
                           ? 'border-[#00703C] bg-[#00703C]/5 scale-[1.01]'
                           : 'border-gray-200 bg-gray-50 hover:border-[#00703C] hover:bg-[#00703C]/5'
                         }
                       `}
>
{/* Fundo decorativo */}
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
<div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#00703C]/5" />
<div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#00703C]/5" />
</div>

{/* Ícone animado */}
<motion.div
animate={dragOver ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
transition={{ type: 'spring', stiffness: 300 }}
className={`
                           w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm
                           transition-colors duration-200
                           ${dragOver ? 'bg-[#00703C] text-white' : 'bg-white text-[#00703C] group-hover:bg-[#00703C] group-hover:text-white'}
                         `}
>
<Upload className="w-6 h-6" />
</motion.div>

<p className={`font-semibold text-base transition-colors duration-200 ${dragOver ? 'text-[#00482B]' : 'text-gray-700 group-hover:text-[#00482B]'}`}>
{dragOver ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
</p>
<p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG, ZIP — até 5 MB</p>

{/* Tipos de arquivo */}
<div className="flex gap-2 mt-5 flex-wrap justify-center">
{['PDF', 'DOC', 'JPG', 'PNG', 'ZIP'].map((ext) => (
<span key={ext} className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-md tracking-wide">
{ext}
</span>
))}
</div>
</label>
</motion.div>
) : (
<motion.div
key="file-preview"
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 8 }}
transition={{ duration: 0.25 }}
className="rounded-2xl border border-[#00703C]/20 bg-gradient-to-r from-[#00482B]/5 to-white overflow-hidden"
>
{/* Barra de progresso decorativa */}
<div className="h-1 w-full bg-gray-100">
<motion.div
initial={{ width: 0 }}
animate={{ width: '100%' }}
transition={{ duration: 0.6, ease: 'easeOut' }}
className="h-full bg-gradient-to-r from-[#00482B] to-[#00703C]"
/>
</div>

<div className="flex items-center gap-4 px-5 py-4">
{/* Ícone do arquivo */}
<div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
<FileIcon name={arquivo.name} />
</div>

{/* Info */}
<div className="flex-1 min-w-0">
<p className="text-sm font-semibold text-gray-800 truncate">{arquivo.name}</p>
<div className="flex items-center gap-3 mt-0.5">
<span className="text-xs text-gray-400">{formatBytes(arquivo.size)}</span>
<span className="inline-flex items-center gap-1 text-xs font-medium text-[#00703C]">
<CheckCircle className="w-3 h-3" /> Pronto para enviar
</span>
</div>
</div>

{/* Ações */}
<div className="flex items-center gap-2 flex-shrink-0">
<label htmlFor="file-upload-replace" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#00703C] hover:text-[#00703C] transition-colors">
<Upload className="w-3.5 h-3.5" /> Trocar
</label>
<input type="file" id="file-upload-replace" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" />

<button
type="button"
onClick={() => setArquivo(null)}
className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-white border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
>
<Trash2 className="w-3.5 h-3.5" /> Remover
</button>
</div>
</div>
</motion.div>
)}
</AnimatePresence>
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
) : 'Enviar Manifestação'}
</Button>
<p className="text-center text-xs text-gray-500 mt-4">
Ao enviar, você concorda com nossa Política de Privacidade e Termos de Uso
</p>
</div>

</form>
</div>
</motion.div>
</div>

<Footer />
</div>
)
}
