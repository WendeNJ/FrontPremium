import React from 'react';
import { motion } from 'framer-motion';

const BG_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/8ceeb2495_PREMIUM.jpg";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden flex items-center">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
                <img src={BG_IMAGE} alt="Premium Distribuidora" className="w-full h-full object-cover object-right" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 w-full">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-white/70 font-medium tracking-wide">DESDE 2004</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Bem-vindo à<br /><span className="text-green-500">Premium</span><br />Distribuidora
                    </h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-white/60 max-w-lg leading-relaxed">
                        Distribuindo alegria e qualidade desde 2004. Representantes das melhores marcas com um vasto portfólio de produtos.
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16">
                        <a href="#sobre" className="inline-flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
                            <span className="text-sm">Scroll</span>
                            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
                                <div className="w-1.5 h-3 bg-green-500 rounded-full" />
                            </motion.div>
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}