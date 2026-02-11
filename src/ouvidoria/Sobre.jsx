import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Shield,
  Clock,
  Mail,
  Users,
  Heart,
  Award,
  TrendingUp,
  MessageSquare,
  Menu,
  X,
  Lock,
  Eye,
  CheckCircle,
  FileText,
  MapPin,
  Phone
} from 'lucide-react'
import { useState } from 'react'

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j'

export default function Sobre() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = [
    { icon: MapPin, number: '51+', label: 'Cidades atendidas', desc: 'Juazeiro do Norte, Iguatu, Teresina e região' },
    { icon: Award, number: '20+', label: 'Anos de história', desc: 'Desde 2004 construindo confiança' },
    { icon: Users, number: '100%', label: 'Sigilo garantido', desc: 'Compromisso com sua privacidade' },
    { icon: TrendingUp, number: '48+', label: 'Marcas premium', desc: 'Portfólio completo e diversificado' },
  ]

  const compromissos = [
    {
      icon: Lock,
      title: 'Sigilo Absoluto',
      description: 'Garantimos o anonimato total quando solicitado. Sua identidade é protegida em todas as etapas do processo.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: 'Resposta Ágil',
      description: 'Compromisso de resposta em até 5 dias úteis. Acompanhe o andamento pelo protocolo a qualquer momento.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Eye,
      title: 'Transparência',
      description: 'Acompanhamento completo da sua manifestação. Você sabe exatamente onde e como está sendo tratada.',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Heart,
      title: 'Atendimento Humanizado',
      description: 'Cada manifestação é única e tratada com respeito, empatia e atenção individual.',
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="bg-[#0A0A0A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/ouvidoria" className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="h-14" />
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">
              SISTEMA DE OUVIDORIA
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link to="/ouvidoria" className="text-white/70 hover:text-white transition-colors">
              INÍCIO
            </Link>
            <Link to="/ouvidoria/sobre" className="text-white font-medium border-b-2 border-white">
              SOBRE
            </Link>
            <Link to="/ouvidoria/consultar" className="text-white/70 hover:text-white transition-colors">
              CONSULTAR
            </Link>
            <Link to="/ouvidoria/admin" className="text-white/50 hover:text-white transition-colors">
              ADMIN
            </Link>
          </nav>

          <div className="hidden md:flex gap-3">
            <Button asChild className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-6">
              <Link to="/ouvidoria/nova">Fazer Manifestação</Link>
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
              <Link to="/ouvidoria/sobre" className="text-white py-2">Sobre</Link>
              <Link to="/ouvidoria/consultar" className="text-white/70 py-2">Consultar</Link>
              <Link to="/ouvidoria/admin" className="text-white/50 py-2">Admin</Link>
              <Button asChild className="bg-white text-[#00482B] rounded-full mt-2">
                <Link to="/ouvidoria/nova">Fazer Manifestação</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* CONTEÚDO */}
      <div className="flex-1">
        {/* HERO - CANAL DE OUVIDORIA */}
        <section className="relative bg-gradient-to-br from-[#00482B] to-[#00703C] text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Canal Oficial</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Sua voz é<br />nosso <span className="text-amber-300">compromisso</span>
                </h1>

                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  A Ouvidoria da Premium Bebidas é o canal direto e seguro para você compartilhar
                  suas experiências, sugestões, reclamações e elogios. Atuamos com total
                  imparcialidade, sigilo e respeito.
                </p>

                <div className="flex gap-4">
                  <Button
                    asChild
                    className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-8 py-6 text-base font-semibold"
                  >
                    <Link to="/ouvidoria/nova">Falar com a Ouvidoria</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold"
                  >
                    <Link to="/ouvidoria/consultar">Acompanhar Protocolo</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SOBRE A PREMIUM */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#00482B] text-sm font-semibold tracking-widest uppercase mb-4 block">
                  Sobre a Premium
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Distribuidora Premium Bebidas
                </h2>
                <div className="w-20 h-1 bg-[#00482B] rounded-full mb-8"></div>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    A Premium é uma distribuidora de bebidas que atua nas cidades de
                    <span className="font-semibold text-gray-900"> Juazeiro do Norte/CE, Iguatu/CE, Teresina/PI</span>
                    {' '}e mais <span className="font-semibold text-gray-900">48 cidades da região</span>.
                  </p>
                  <p className="text-lg">
                    Somos representantes das melhores marcas, possuímos um vasto portfólio de produtos,
                    entre cervejas, refrigerantes, sucos, energéticos e águas.
                  </p>
                  <p className="text-lg">
                    Iniciamos nossos trabalhos em <span className="font-semibold text-gray-900">2004</span>,
                    de forma sólida e consciente, acreditando na marca e na qualidade dos produtos
                    e serviços oferecidos.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[#00482B] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Canal oficial da Ouvidoria</p>
                      <p className="font-medium text-gray-900">rh@premiumteresina.com.br</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Respondemos todas as manifestações em até 5 dias úteis
                      </p>
                    </div>
                  </div>
                  
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-6 rounded-2xl border border-gray-200 hover:border-[#00482B]/30 hover:shadow-lg transition-all bg-gray-50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#00482B]/10 flex items-center justify-center mb-4 group-hover:bg-[#00482B]/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-[#00482B]" />
                    </div>
                    <span className="text-3xl font-bold text-[#00482B] block mb-1">{stat.number}</span>
                    <span className="font-semibold text-gray-900 block">{stat.label}</span>
                    <span className="text-sm text-gray-500">{stat.desc}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* NOSSO COMPROMISSO COM A OUVIDORIA */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-[#00482B] text-sm font-semibold tracking-widest uppercase mb-4 block">
                Compromisso com Você
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Como tratamos sua manifestação
              </h2>
              <p className="text-lg text-gray-600">
                Sua opinião é essencial para melhorarmos nossos produtos e serviços.
                Por isso, criamos um canal seguro, transparente e eficiente.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {compromissos.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-5`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Diferenciais da Ouvidoria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-16 bg-white p-8 rounded-2xl border border-gray-200"
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Anonimato Garantido</h4>
                    <p className="text-sm text-gray-600">Você escolhe se quer se identificar ou permanecer anônimo. Seus dados são protegidos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Acompanhamento Total</h4>
                    <p className="text-sm text-gray-600">Com seu protocolo, você consulta o andamento a qualquer momento, 24 horas por dia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Resolução Efetiva</h4>
                    <p className="text-sm text-gray-600">Cada caso é analisado individualmente e direcionado para a área responsável.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FLUXO DA MANIFESTAÇÃO */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Como funciona?
              </h2>
              <p className="text-lg text-gray-600">
                Processo simples, rápido e transparente
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="bg-[#00482B]/5 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-[#00482B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                  <h3 className="font-bold text-gray-900 mb-2">Registre</h3>
                  <p className="text-sm text-gray-600">Preencha o formulário com sua manifestação</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 text-[#00482B] text-2xl">→</div>
              </div>
              <div className="relative">
                <div className="bg-[#00482B]/5 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-[#00482B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                  <h3 className="font-bold text-gray-900 mb-2">Protocolo</h3>
                  <p className="text-sm text-gray-600">Receba um código único para acompanhamento</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 text-[#00482B] text-2xl">→</div>
              </div>
              <div className="relative">
                <div className="bg-[#00482B]/5 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-[#00482B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                  <h3 className="font-bold text-gray-900 mb-2">Análise</h3>
                  <p className="text-sm text-gray-600">Nossa equipe avalia e direciona sua demanda</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 text-[#00482B] text-2xl">→</div>
              </div>
              <div>
                <div className="bg-[#00482B]/5 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-[#00482B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">4</div>
                  <h3 className="font-bold text-gray-900 mb-2">Resposta</h3>
                  <p className="text-sm text-gray-600">Retorno em até 5 dias úteis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-br from-[#00482B] to-[#00703C]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para falar com a gente?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Sua manifestação é o primeiro passo para construirmos uma relação
              ainda mais transparente e de confiança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white text-[#00482B] hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
              >
                <Link to="/ouvidoria/nova">
                  Fazer Manifestação
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
              >
                <Link to="/ouvidoria/consultar">Consultar Protocolo</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white/80 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Logo" className="h-10" />
              <span className="text-sm text-white/60">
                © {new Date().getFullYear()} - Premium Bebidas
              </span>
            </div>

            <div className="flex gap-8 text-sm">
              <Link to="/ouvidoria" className="text-white/60 hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/ouvidoria/sobre" className="text-white hover:text-white transition-colors">
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

          <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>
              Canal oficial de comunicação da Premium Bebidas. Todas as manifestações são tratadas com sigilo e transparência.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}