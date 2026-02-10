import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Star, Cake, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { cardMuralAPI, noticiasAPI } from '@/api/ouvidoriaApi'; // 🔥 IMPORTA DO OUVIDORIAAPI

const tipoIcons = { 
    funcionario_destaque: Star, 
    aniversariantes: Cake, 
    campanha: Heart 
};

const tipoLabels = { 
    funcionario_destaque: 'Funcionário Destaque', 
    aniversariantes: 'Aniversariantes', 
    campanha: 'Campanha' 
};

const campanhaColors = { 
    amarelo: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30', 
    rosa: 'from-pink-500/20 to-pink-600/10 border-pink-500/30', 
    azul: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', 
    default: 'from-green-500/20 to-green-600/10 border-green-500/30' 
};

export default function MuralSection() {
    const { isDark } = useTheme();
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    // 🔥 Buscar notícias da API
    const { data: noticiasData = [], isLoading: loadingNoticias } = useQuery({
        queryKey: ['noticias'],
        queryFn: noticiasAPI.list,
    });

    // 🔥 Buscar cards do mural da API
    const { data: cardsData = [], isLoading: loadingCards } = useQuery({
        queryKey: ['cardsMural'],
        queryFn: cardMuralAPI.list,
    });

    // Filtrar apenas ativos
    const noticias = noticiasData.filter(n => n.ativo);
    const cardsMural = cardsData.filter(c => c.ativo).sort((a, b) => a.ordem - b.ordem);

    useEffect(() => {
        if (noticias.length > 1) {
            const interval = setInterval(() => {
                setCurrentNewsIndex((prev) => (prev + 1) % noticias.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [noticias.length]);

    const nextNews = () => setCurrentNewsIndex((prev) => (prev + 1) % noticias.length);
    const prevNews = () => setCurrentNewsIndex((prev) => (prev - 1 + noticias.length) % noticias.length);

    if (loadingNoticias || loadingCards) {
        return (
            <section className={`relative py-32 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className={isDark ? 'text-white/40' : 'text-gray-400'}>Carregando mural...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="mural" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            <div className="max-w-7xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    className="text-center mb-16"
                >
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Novidades</span>
                    <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Mural</h2>
                </motion.div>

                {/* Carrossel de Notícias */}
                {noticias.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        className={`relative mb-12 rounded-3xl overflow-hidden border ${isDark ? 'bg-[#111111] border-white/5' : 'bg-gray-50 border-gray-200'}`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentNewsIndex} 
                                initial={{ opacity: 0, x: 50 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -50 }} 
                                transition={{ duration: 0.3 }} 
                                className="grid md:grid-cols-2"
                            >
                                <div className="aspect-video md:aspect-auto md:h-80 overflow-hidden">
                                    <img 
                                        src={noticias[currentNewsIndex]?.imagem_url || 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80'} 
                                        alt={noticias[currentNewsIndex]?.titulo} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className={`flex items-center gap-2 text-sm mb-4 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                                        <Calendar className="w-4 h-4" />
                                        {noticias[currentNewsIndex]?.data_publicacao || 'Recente'}
                                        <span className="ml-auto px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Notícia</span>
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {noticias[currentNewsIndex]?.titulo}
                                    </h3>
                                    <p className={`leading-relaxed line-clamp-3 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                        {noticias[currentNewsIndex]?.resumo}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {noticias.length > 1 && (
                            <>
                                <button 
                                    onClick={prevNews} 
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={nextNews} 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {noticias.map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setCurrentNewsIndex(i)} 
                                            className={`w-2 h-2 rounded-full transition-all ${i === currentNewsIndex ? 'bg-green-500 w-6' : 'bg-white/30'}`} 
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* Cards do Mural */}
                {cardsMural.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cardsMural.map((card, index) => {
                            const Icon = tipoIcons[card.tipo] || Star;
                            const colorClass = card.cor_destaque ? campanhaColors[card.cor_destaque] || campanhaColors.default : campanhaColors.default;
                            return (
                                <motion.div 
                                    key={card.id} 
                                    initial={{ opacity: 0, y: 30 }} 
                                    whileInView={{ opacity: 1, y: 0 }} 
                                    viewport={{ once: true }} 
                                    transition={{ delay: index * 0.1 }} 
                                    className={`group p-6 rounded-2xl bg-gradient-to-br ${colorClass} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-green-400" />
                                            <span className="text-xs text-white/60 uppercase tracking-wider">
                                                {tipoLabels[card.tipo]}
                                            </span>
                                        </div>
                                        {card.mes_referencia && (
                                            <span className="text-xs text-white/40">{card.mes_referencia}</span>
                                        )}
                                    </div>
                                    {card.imagem_url && (
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20">
                                            <img src={card.imagem_url} alt={card.titulo} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <h4 className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {card.titulo}
                                    </h4>
                                    {card.nome_funcionario && (
                                        <p className="text-green-500 text-center font-medium mb-1">{card.nome_funcionario}</p>
                                    )}
                                    {card.setor && (
                                        <p className={`text-sm text-center mb-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{card.setor}</p>
                                    )}
                                    {card.descricao && (
                                        <p className={`text-sm text-center line-clamp-3 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                            {card.descricao}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Fallback caso não tenha nada */}
                {noticias.length === 0 && cardsMural.length === 0 && (
                    <div className="text-center py-16">
                        <p className={isDark ? 'text-white/40' : 'text-gray-400'}>
                            Nenhum conteúdo no mural ainda.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};




