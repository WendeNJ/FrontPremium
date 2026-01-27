import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Lightbulb, Leaf, Users, Award } from 'lucide-react';
import { useTheme } from '../../Layout';

export default function ValuesSection() {
    const { isDark } = useTheme();
    
    const mainCards = [
        { icon: Target, title: 'Missão', description: 'Gerar em nossos consumidores e Clientes, entretenimento, emoção e alegria, através do fornecimento dos nossos produtos e serviços.', gradient: 'from-green-500/20 to-transparent' },
        { icon: Eye, title: 'Visão', description: 'Ser a melhor distribuidora de bebidas referência em gestão com crescimento sustentável e de qualidade.', gradient: 'from-white/10 to-transparent' },
        { icon: Heart, title: 'Valores', description: 'Responsabilidade, Inovação, Sustentabilidade, Integridade e Respeito.', gradient: 'from-green-500/10 to-transparent' },
    ];

    const values = [
        { icon: Award, title: 'Resultados', desc: 'Celebrar momentos de alegria e assumir responsabilidade individual pela entrega dos resultados.' },
        { icon: Shield, title: 'Integridade', desc: 'Ser exemplo de responsabilidade e agir com transparência em todas as relações comerciais e humanas.' },
        { icon: Users, title: 'Respeito', desc: 'Tratar todos com respeito, promovendo um ambiente inclusivo e valorizando as pessoas.' },
        { icon: Lightbulb, title: 'Inovação', desc: 'Buscar a excelência na gestão e inovar constantemente para surpreender e melhorar os serviços.' },
        { icon: Leaf, title: 'Sustentabilidade', desc: 'Promover ações sustentáveis e encantar o cliente oferecendo experiências marcantes.' },
    ];

    return (
        <section id="valores" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px] -translate-y-1/2" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Nossos Princípios</span>
                    <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Missão, Visão e Valores</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {mainCards.map((card, index) => (
                        <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className={`group relative p-8 rounded-3xl border hover:border-green-500/30 transition-all duration-500 ${isDark ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 group-hover:border-green-500/30 transition-colors ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-green-50 border-gray-200'}`}>
                                    <card.icon className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.title}</h3>
                                <p className={`leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{card.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 rounded-3xl border ${isDark ? 'bg-[#111111] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Nossos Valores em Detalhe
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {values.map((value, index) => (
                            <motion.div key={value.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`group p-5 rounded-2xl border hover:border-green-500/20 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                                <value.icon className="w-6 h-6 text-green-500 mb-3" />
                                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.title}</h4>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}