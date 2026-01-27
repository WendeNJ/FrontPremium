import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Layout';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/e0e3bf7fc_Captura_de_tela_2025-12-17_094638-removebg-preview1.png";

export default function Footer() {
    const { isDark } = useTheme();
    
    return (
        <footer className={`relative py-12 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            
            <div className="max-w-7xl mx-auto px-6">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src={LOGO_URL} alt="Premium Distribuidora" className="h-10 w-auto object-contain" />
                    </div>
                    <p className={`text-sm text-center ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                        PREMIUM DISTRIBUIDORA ©2025. Distribuindo alegria e qualidade desde 2004.
                        <br className="md:hidden" />
                        <span className="hidden md:inline"> • </span>
                        Todos os direitos reservados.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}