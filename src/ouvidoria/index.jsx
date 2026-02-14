import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Lightbulb,
    FileText,
    AlertTriangle,
    Shield,
    Menu,
    X,
    ArrowRight,
    Phone,
    Mail,
    MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DashboardStats from '@/ouvidoria/Dashboardstats'

const manifestationTypes = [
    {
        id: 'SUGESTAO',
        title: 'Sugestão',
        icon: Lightbulb,
        description: 'Contribua com ideias para melhorias',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    },
    {
        id: 'SOLICITACAO',
        title: 'Solicitação',
        icon: FileText,
        description: 'Solicite providências ou serviços',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
    },
    {
        id: 'RECLAMACAO',
        title: 'Reclamação',
        icon: AlertTriangle,
        description: 'Expresse insatisfação com serviços',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
    },
    {
        id: 'DENUNCIA',
        title: 'Denúncia',
        icon: Shield,
        description: 'Reporte irregularidades',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
    },
]

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function OuvidoriaHome({ config }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* HEADER */}
            <header className="bg-[#0A0A0A] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4">
                        <img
                            src={config?.logo_url || LOGO_URL}
                            alt="Logo"
                            className="h-14"
                        />
                        <span className="text-white font-bold text-lg tracking-wide hidden sm:block">
                            SISTEMA DE OUVIDORIA
                        </span>
                    </Link>

                    <nav className="hidden md:flex gap-8">
                        <Link 
                            to="/ouvidoria" 
                            className="text-white font-medium border-b-2 border-white"
                        >
                            INÍCIO
                        </Link>
                        <Link 
                            to="/ouvidoria/sobre" 
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            SOBRE
                        </Link>
                        <Link 
                            to="/ouvidoria/consultar" 
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            CONSULTAR
                        </Link>
                        <Link
                            to="/ouvidoria/admin"
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            ADMIN
                        </Link>
                    </nav>

                    <div className="hidden md:flex gap-3">
                        <Button 
                            asChild 
                            className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-6 font-medium"
                        >
                            <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
                        </Button>
                    </div>

                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800">
                        <div className="flex flex-col gap-3 py-3">
                            <Link to="/ouvidoria" className="text-white py-2">Início</Link>
                            <Link to="/ouvidoria/sobre" className="text-white/70 py-2">Sobre</Link>
                            <Link to="/ouvidoria/consultar" className="text-white/70 py-2">Consultar</Link>
                            <Link to="/ouvidoria/admin" className="text-white/50 py-2">Admin</Link>
                            <Button asChild className="bg-white text-[#00482B] rounded-full mt-2">
                                <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* TEXTO */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {config?.texto_boas_vindas || (
                                    <>
                                        Seu canal de comunicação<br />com a <span className="text-[#00482B]">Ouvidoria</span>
                                    </>
                                )}
                            </h1>
                            
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Faça denúncias, reclamações, sugestões ou acompanhe sua manifestação de forma rápida e segura.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button 
                                    asChild 
                                    className="bg-[#00482B] hover:bg-[#00703C] text-white rounded-full px-8 py-6 text-base font-medium"
                                >
                                    <Link to="/ouvidoria/nova">
                                        Fazer Manifestação
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>

                                <Button 
                                    asChild 
                                    variant="outline" 
                                    className="border border-gray-300 hover:border-[#00482B] text-gray-700 hover:text-[#00482B] rounded-full px-8 py-6 text-base font-medium"
                                >
                                    <Link to="/ouvidoria/consultar">
                                        Consultar Protocolo
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>

                        {/* DASHBOARD */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <DashboardStats />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CARDS */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            O que você deseja fazer?
                        </h2>
                        <p className="text-gray-600">
                            Escolha o tipo de manifestação adequado para o seu caso
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {manifestationTypes.map((type, i) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                            >
                                <Link
                                    to={`/ouvidoria/nova?tipo=${type.id}`}
                                    className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-[#00482B]/30 hover:shadow-lg transition-all h-full"
                                >
                                    <div className={`w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                        <type.icon className={`w-6 h-6 ${type.color}`} />
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {type.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600">
                                        {type.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTATO */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            {/* Informações de Contato */}
                            <div className="p-8 md:p-10 bg-[#00482B] text-white">
                                <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
                                <p className="text-white/80 mb-6">
                                    Nossa equipe está pronta para atender você
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-white/70" />
                                        <div>
                                            <p className="text-white/70 text-xs">Telefone</p>
                                            <p className="font-medium">(86) 8825-0227</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-white/70" />
                                        <div>
                                            <p className="text-white/70 text-xs">E-mail</p>
                                            <p className="font-medium">rh@premiumteresina.com.br</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-white/70" />
                                        <div>
                                            <p className="text-white/70 text-xs">Atendimento</p>
                                            <p className="font-medium">Segunda a Sexta, 8h às 18h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* FAQ */}
                            <div className="p-8 md:p-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Perguntas frequentes
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            O que é uma manifestação anônima?
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Seus dados pessoais não são identificados, garantindo total sigilo.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            Como acompanhar minha manifestação?
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Utilize o protocolo recebido por e-mail na página de consulta.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            Qual o prazo para resposta?
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Até 5 dias úteis para manifestações comuns.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <Link 
                                        to="/ouvidoria/sobre" 
                                        className="text-sm text-[#00482B] hover:text-[#00703C] font-medium inline-flex items-center"
                                    >
                                        
                                   
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white/80 py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <img src={config?.logo_url || LOGO_URL} alt="Logo" className="h-10" />
                            <span className="text-sm text-white/60">
                                © {new Date().getFullYear()} - Sistema de Ouvidoria
                            </span>
                        </div>
                        
                        <div className="flex gap-6 text-sm">
                            <Link to="/ouvidoria/sobre" className="text-white/60 hover:text-white transition-colors">
                                Sobre
                            </Link>
                            <Link to="/ouvidoria/consultar" className="text-white/60 hover:text-white transition-colors">
                                Consultar
                            </Link>
                            <Link to="/ouvidoria/admin" className="text-white/60 hover:text-white transition-colors">
                                Admin
                            </Link>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-800 text-xs text-white/40 text-center md:text-left">
                        <p>Canal oficial de comunicação. Todas as manifestações são tratadas com sigilo.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
