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
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const manifestationTypes = [
    {
        id: 'SUGESTAO',
        title: 'Sugestão',
        icon: Lightbulb,
        description: 'Contribua com ideias para melhorias',
    },
    {
        id: 'SOLICITACAO',
        title: 'Solicitação',
        icon: FileText,
        description: 'Solicite providências ou serviços',
    },
    {
        id: 'RECLAMACAO',
        title: 'Reclamação',
        icon: AlertTriangle,
        description: 'Expresse insatisfação com serviços',
    },
    {
        id: 'DENUNCIA',
        title: 'Denúncia',
        icon: Shield,
        description: 'Reporte irregularidades',
    },
]

const LOGO_URL =
    'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function OuvidoriaHome({ config }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="bg-[#0a0a0a] sticky top-0 z-50">


                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/ouvidoria" className="flex items-center gap-4">
                        <img
                            src={config?.logo_url || LOGO_URL}
                            alt="Logo"
                            className="h-14"
                        />
                        <span className="text-white font-bold hidden sm:block">
                            SISTEMA DE OUVIDORIA
                        </span>
                    </Link>

                    <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
                        <Link to="/ouvidoria">INÍCIO</Link>
                        <Link to="/ouvidoria/sobre">SOBRE</Link>
                        <Link to="/ouvidoria/consultar">CONSULTAR</Link>
                        {/* ADMIN */}
                        <Link
                            to="/ouvidoria/admin"
                            className="text-gray-300 hover:text-white transition"
                        >
                            ADMIN
                        </Link>

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
                        {/* ADMIN */}
                        <Link
                            to="/ouvidoria/admin"
                            className="text-gray-300 border-t border-gray-700 pt-3"
                        >
                            Admin
                        </Link>
                    </div>
                )}


            </header>

            {/* HERO */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-6">
                            {config?.texto_boas_vindas ||
                                'O seu canal de comunicação com a Ouvidoria'}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Faça denúncias, reclamações, sugestões ou acompanhe sua
                            manifestação.
                        </p>

                        <div className="flex gap-4">
                            <Button asChild className="rounded-full bg-[#00482B]">
                                <Link to="/ouvidoria/nova">Fazer manifestação</Link>
                            </Button>

                            <Button asChild variant="outline" className="rounded-full">
                                <Link to="/ouvidoria/consultar">Consultar protocolo</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CARDS */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-10">
                        O que você deseja fazer?
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {manifestationTypes.map((type, i) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    to={`/ouvidoria/nova?tipo=${type.id}`}
                                    className="block bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
                                >
                                    <type.icon className="mb-4 text-[#00482B]" />
                                    <h3 className="font-semibold">{type.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {type.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#00482B] text-white py-10 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                    © {new Date().getFullYear()} Sistema de Ouvidoria
                </div>
            </footer>
        </div>
    )
}
