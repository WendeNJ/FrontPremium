import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { useTheme } from '../../Layout';

export default function ContactSection() {
    const { isDark } = useTheme();
    
    const contacts = [
        { icon: Phone, title: 'Central de Atendimento', lines: ['Entre em contato com nossa', 'equipe especializada', '86 3220-3435'] },
        { icon: Mail, title: 'Email', lines: ['Envie sua mensagem para', 'nosso time', 'contato@premium.com.br'] },
    ];

    return (
        <section id="contato" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px] -translate-y-1/2" />
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Contato</span>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Entre em Contato</h2>
                    <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Estamos à disposição para atendê-lo</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {contacts.map((contact, index) => (
                        <motion.div key={contact.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className={`group p-8 rounded-3xl border hover:border-green-500/30 transition-all duration-500 ${isDark ? 'bg-[#111111] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                <contact.icon className="w-7 h-7 text-green-500" />
                            </div>
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contact.title}</h3>
                            <div className="space-y-1">
                                {contact.lines.map((line, i) => (
                                    <p key={i} className={`${i === contact.lines.length - 1 ? 'text-green-500 font-medium' : isDark ? 'text-white/50' : 'text-gray-500'}`}>{line}</p>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}