import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, TrendingUp, Users } from 'lucide-react';
import { useTheme } from '../../Layout';

export default function AboutSection() {
    const { isDark } = useTheme();
    
    const stats = [
        { icon: Award, number: '20+', label: 'Anos de experiência', desc: 'Tradição no mercado' },
        { icon: FileText, number: '51+', label: 'Cidades atendidas', desc: 'Cobertura regional' },
        { icon: Users, number: '100%', label: 'Satisfação do cliente', desc: 'Qualidade garantida' },
        { icon: TrendingUp, number: 'Top', label: 'Marcas do mercado', desc: 'Portfólio premium' },
    ];

    return (
        <section id="sobre" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            
            <div className="max-w-7xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Sobre Nós</span>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Premium Distribuidora</h2>
                    <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <div className={`p-8 rounded-3xl backdrop-blur-sm ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                                <FileText className="w-7 h-7 text-green-500" />
                            </div>
                            
                            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Nossa História</h3>
                            
                            <div className={`space-y-4 leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                <p>A Premium é uma distribuidora de bebidas que atua nas cidades de Juazeiro do Norte/CE, Iguatu/CE, Teresina/PI e mais 48 cidades da região.</p>
                                <p>Somos representantes das melhores marcas, possuímos um vasto portfólio de produtos, entre cervejas, refrigerantes, sucos, energéticos e águas.</p>
                                <p>Iniciamos nossos trabalhos em 2004, de forma sólida e consciente, acreditando na marca e na qualidade dos produtos e serviços oferecidos.</p>
                            </div>

                            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={isDark ? 'text-white/60' : 'text-gray-600'}>Crescimento contínuo</span>
                                    <span className="text-green-500 font-semibold">100%</span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`group p-6 rounded-2xl border hover:border-green-500/30 transition-all duration-300 ${isDark ? 'bg-[#111111] border-white/5 hover:bg-[#151515]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                    <stat.icon className="w-6 h-6 text-green-500" />
                                </div>
                                <span className="text-4xl font-bold text-green-500 block mb-1">{stat.number}</span>
                                <span className={`font-medium block ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.label}</span>
                                <span className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{stat.desc}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}