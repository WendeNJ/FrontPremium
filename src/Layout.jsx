import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';

export const ThemeContext = createContext({ isDark: true });
export const useTheme = () => useContext(ThemeContext);

const navLinks = [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Missão e Valores', href: '#valores' },
    { label: 'Mural', href: '#mural' },
    { label: 'Onde Estamos', href: '#localizacao' },
    { label: 'Contato', href: '#contato' },
    { label: 'Ouvidoria', href: '#ouvidoria' },
];

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/e0e3bf7fc_Captura_de_tela_2025-12-17_094638-removebg-preview1.png";

export default function Layout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark }}>
        <div className="min-h-screen bg-[#0a0a0a]">
            <style>{`
                :root { --green-primary: #22c55e; --green-dark: #16a34a; }
                * { scrollbar-width: thin; scrollbar-color: rgba(34, 197, 94, 0.3) transparent; }
                *::-webkit-scrollbar { width: 6px; }
                *::-webkit-scrollbar-track { background: transparent; }
                *::-webkit-scrollbar-thumb { background-color: rgba(34, 197, 94, 0.3); border-radius: 3px; }
                ::selection { background-color: rgba(34, 197, 94, 0.3); color: white; }
            `}</style>

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}
            >
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
                            <img src={LOGO_URL} alt="Premium Distribuidora" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a key={link.label} href={link.href} className="px-3 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full hover:bg-white/5 transition-all">
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <Link to={createPageUrl('Admin')} className="hidden md:flex items-center gap-2 px-3 py-2 text-white/40 hover:text-white/70 text-xs font-medium rounded-full hover:bg-white/5 transition-all">
                            <Settings className="w-4 h-4" />
                            <span>Admin</span>
                        </Link>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5">
                            <nav className="flex flex-col p-6 gap-2">
                                {navLinks.map((link) => (
                                    <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white/70 hover:text-white font-medium rounded-xl hover:bg-white/5 transition-all">
                                        {link.label}
                                    </a>
                                ))}
                                <Link to={createPageUrl('Admin')} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white/40 hover:text-white/70 font-medium rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Administrador
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <main>{children}</main>
        </div>
        </ThemeContext.Provider>
    );
}