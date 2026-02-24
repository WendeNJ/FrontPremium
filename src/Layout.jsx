import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';

export const ThemeContext = createContext({ isDark: true });
export const useTheme = () => useContext(ThemeContext);

const navLinks = [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Missão e Valores', href: '#valores' },
    { label: 'Mural', href: '#mural' },
    { label: 'Onde Estamos', href: '#localizacao' },
    { label: 'Contato', href: '#contato' },
];

const LOGO_URL =
"https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/e0e3bf7fc_Captura_de_tela_2025-12-17_094638-removebg-preview1.png";

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

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">

                        {/* LOGO */}
                        <Link
                            to={createPageUrl('Home')}
                            className="flex items-center gap-3 group"
                        >
                            <img
                                src={LOGO_URL}
                                alt="Premium Distribuidora"
                                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                            />
                        </Link>

                        {/* MENU DESKTOP */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="px-3 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full hover:bg-white/5 transition-all"
                                >
                                    {link.label}
                                </a>
                            ))}

                            {/* ✅ BOTÃO OUVIDORIA CORRIGIDO */}
                            <Link
                                to="/ouvidoria"
                                className="ml-2 px-5 py-2.5 bg-[#00a651] text-white font-semibold text-sm rounded-full
                                           hover:bg-[#008c44] transition-all duration-300 shadow-lg shadow-[#00a651]/30
                                           flex items-center gap-2 relative overflow-hidden group"
                            >
                                <MessageCircle className="w-4 h-4 animate-pulse" />
                                <span>Ouvidoria</span>

                                <span className="absolute inset-0 bg-white/20
                                    translate-x-[-100%] group-hover:translate-x-[100%]
                                    transition-transform duration-700">
                                </span>
                            </Link>
                        </nav>

                        {/* BOTÃO MOBILE */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* MENU MOBILE */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5"
                        >
                            <nav className="flex flex-col p-6 gap-2">

                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-white/70 hover:text-white font-medium rounded-xl hover:bg-white/5 transition-all"
                                    >
                                        {link.label}
                                    </a>
                                ))}

                                {/* ✅ OUVIDORIA MOBILE CORRIGIDO */}
                                <Link
                                    to="/ouvidoria"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="mt-2 px-4 py-4 bg-[#00a651] text-white font-semibold rounded-xl
                                               hover:bg-[#008c44] transition-all shadow-lg shadow-[#00a651]/30
                                               flex items-center justify-center gap-3 text-base"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Ouvidoria</span>
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
