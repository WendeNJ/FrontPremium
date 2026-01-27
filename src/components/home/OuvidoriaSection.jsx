import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { useTheme } from '../../Layout';

export default function OuvidoriaSection() {
    const { isDark } = useTheme();
    
    return (
        <section id="ouvidoria" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Canal de Comunicação</span>
                    <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ouvidoria</h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-8 md:p-12 max-w-4xl mx-auto ${!isDark && 'bg-white shadow-sm'}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Canal de Ouvidoria</h3>
                                <p className={`max-w-lg ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Registre reclamações, elogios ou denúncias de forma segura e confidencial através do nosso Canal de Ouvidoria.</p>
                            </div>
                        </div>
                        
                        <a href="https://gestor-de-fluxos-85b3e321.base44.app/?is_new_user=true" target="_blank" rel="noopener noreferrer">
                            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 text-base rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center gap-2">
                                Acessar Ouvidoria
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}