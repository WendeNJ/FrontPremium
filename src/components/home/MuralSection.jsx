import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Star, 
    Cake, 
    Heart, 
    ChevronLeft, 
    ChevronRight,
    Newspaper,
    Award,
    Sparkles,
    Clock,
    User,
    Briefcase,
    Tag,
    Eye,
    BookOpen,
    X
} from 'lucide-react';
import { useTheme } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { cardMuralAPI, noticiasAPI } from '@/api/ouvidoriaApi';

const tipoIcons = { 
    funcionario_destaque: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    aniversariantes: { icon: Cake, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    campanha: { icon: Heart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    noticia: { icon: Newspaper, color: 'text-blue-500', bg: 'bg-blue-500/10' }
};

const tipoLabels = { 
    funcionario_destaque: 'Funcionário Destaque', 
    aniversariantes: 'Aniversariantes do Mês', 
    campanha: 'Campanha',
    noticia: 'Notícia'
};

const campanhaColors = { 
    amarelo: { 
        gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
        border: 'border-yellow-500/30',
        text: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        hover: 'hover:border-yellow-500/50',
        shadow: 'shadow-yellow-500/10',
        pill: 'bg-yellow-500/10 text-yellow-500'
    },
    rosa: { 
        gradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
        border: 'border-pink-500/30',
        text: 'text-pink-500',
        bg: 'bg-pink-500/10',
        hover: 'hover:border-pink-500/50',
        shadow: 'shadow-pink-500/10',
        pill: 'bg-pink-500/10 text-pink-500'
    },
    azul: { 
        gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
        border: 'border-blue-500/30',
        text: 'text-blue-500',
        bg: 'bg-blue-500/10',
        hover: 'hover:border-blue-500/50',
        shadow: 'shadow-blue-500/10',
        pill: 'bg-blue-500/10 text-blue-500'
    },
    default: { 
        gradient: 'from-green-500/10 via-green-500/5 to-transparent',
        border: 'border-green-500/30',
        text: 'text-green-500',
        bg: 'bg-green-500/10',
        hover: 'hover:border-green-500/50',
        shadow: 'shadow-green-500/10',
        pill: 'bg-green-500/10 text-green-500'
    }
};

export default function MuralSection() {
    const { isDark } = useTheme();
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedNoticia, setSelectedNoticia] = useState(null);

    const { data: noticiasData = [], isLoading: loadingNoticias } = useQuery({
        queryKey: ['noticias'],
        queryFn: noticiasAPI.list,
    });

    const { data: cardsData = [], isLoading: loadingCards } = useQuery({
        queryKey: ['cardsMural'],
        queryFn: cardMuralAPI.list,
    });

    const noticias = noticiasData
        .filter(n => n.ativo)
        .sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
    
    const cardsMural = cardsData
        .filter(c => c.ativo)
        .sort((a, b) => a.ordem - b.ordem);

    useEffect(() => {
        if (noticias.length > 1) {
            const interval = setInterval(() => {
                setCurrentNewsIndex((prev) => (prev + 1) % noticias.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [noticias.length]);

    const nextNews = () => setCurrentNewsIndex((prev) => (prev + 1) % noticias.length);
    const prevNews = () => setCurrentNewsIndex((prev) => (prev - 1 + noticias.length) % noticias.length);

    const formatarData = (dataString) => {
        if (!dataString) return '';
        return new Date(dataString).toLocaleDateString('pt-BR', { 
            day: '2-digit', month: 'long', year: 'numeric' 
        });
    };

    // Formata a data de aniversário — exibe apenas dia e mês (sem o ano)
    const formatarAniversario = (dataString) => {
        if (!dataString) return '';
        // Força o parse em horário local para não ter problema de timezone
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    };

    if (loadingNoticias || loadingCards) {
        return (
            <section className={`relative py-32 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full mx-auto mb-4"
                    />
                    <p className={isDark ? 'text-white/40' : 'text-gray-400'}>Carregando mural...</p>
                </div>
            </section>
        );
    }

    const hasContent = noticias.length > 0 || cardsMural.length > 0;

    return (
        <section 
            id="mural" 
            className={`relative py-20 md:py-32 overflow-hidden transition-colors duration-500 ${
                isDark ? 'bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111111]' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
            }`}
        >
            {/* Elementos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-48 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${
                    isDark ? 'via-white/10' : 'via-black/10'
                } to-transparent`} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Cabeçalho */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-6"
                    >
                        <Sparkles className="w-8 h-8 text-green-500" />
                    </motion.div>
                    
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">
                        Fique por dentro
                    </span>
                    
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Mural de Novidades
                    </h2>
                    
                    <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        Acompanhe as últimas notícias, campanhas e destaques da Premium Bebidas
                    </p>
                </motion.div>

                {!hasContent ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <Newspaper className="w-12 h-12 text-green-500/50" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Nenhum conteúdo no momento
                        </h3>
                        <p className={isDark ? 'text-white/40' : 'text-gray-400'}>
                            Em breve traremos novidades para você
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* ── Carrossel de Notícias ── */}
                        {noticias.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }} 
                                className="relative mb-16"
                            >
                                <div className={`relative rounded-3xl overflow-hidden border ${
                                    isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-gray-200'
                                } shadow-2xl`}>
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={currentNewsIndex} 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }} 
                                            transition={{ duration: 0.5 }} 
                                            className="relative"
                                        >
                                            <div className="grid md:grid-cols-2">
                                                {/* Imagem */}
                                                <div className="relative aspect-video md:aspect-auto md:h-[400px] overflow-hidden">
                                                    <motion.img 
                                                        initial={{ scale: 1.2 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 6 }}
                                                        src={noticias[currentNewsIndex]?.imagem_url || 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80'} 
                                                        alt={noticias[currentNewsIndex]?.titulo} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                                        <div className="px-3 py-1.5 rounded-full bg-green-500 text-black text-xs font-semibold flex items-center gap-1">
                                                            <Newspaper className="w-3 h-3" />Notícia
                                                        </div>
                                                        {noticias[currentNewsIndex]?.data_publicacao && (
                                                            <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatarData(noticias[currentNewsIndex].data_publicacao)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Conteúdo */}
                                                <div className={`p-8 md:p-12 flex flex-col justify-center ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
                                                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {noticias[currentNewsIndex]?.titulo}
                                                    </h3>
                                                    <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                                                        {noticias[currentNewsIndex]?.resumo}
                                                    </p>
                                                    <motion.button
                                                        whileHover={{ x: 5 }}
                                                        onClick={() => setSelectedNoticia(noticias[currentNewsIndex])}
                                                        className="flex items-center gap-2 text-green-500 font-semibold group w-fit"
                                                    >
                                                        <span>Ler notícia completa</span>
                                                        <BookOpen className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {noticias.length > 1 && (
                                        <>
                                            <button onClick={prevNews} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all hover:scale-110 z-20">
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button onClick={nextNews} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all hover:scale-110 z-20">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                                {noticias.map((_, i) => (
                                                    <button key={i} onClick={() => setCurrentNewsIndex(i)} 
                                                        className={`transition-all ${i === currentNewsIndex ? 'w-8 h-2 bg-green-500 rounded-full' : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'}`} 
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-center mt-4">
                                    <span className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                        {currentNewsIndex + 1} de {noticias.length} notícias
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Cards do Mural ── */}
                        {cardsMural.length > 0 && (
                            <div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-10"
                                >
                                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Destaques da Semana
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                        Confira as novidades em destaque
                                    </p>
                                </motion.div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {cardsMural.map((card, index) => {
                                        const IconConfig = tipoIcons[card.tipo] || tipoIcons.noticia;
                                        const Icon = IconConfig.icon;
                                        const isAniversariante = card.tipo === 'aniversariantes';
                                        // Aniversariantes sempre usam o tema rosa independentemente de cor_destaque
                                        const colors = isAniversariante
                                            ? campanhaColors.rosa
                                            : card.cor_destaque
                                                ? campanhaColors[card.cor_destaque] || campanhaColors.default
                                                : campanhaColors.default;
                                        
                                        return (
                                            <motion.div 
                                                key={card.id} 
                                                initial={{ opacity: 0, y: 30 }} 
                                                whileInView={{ opacity: 1, y: 0 }} 
                                                viewport={{ once: true }} 
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -5 }}
                                                onHoverStart={() => setHoveredCard(card.id)}
                                                onHoverEnd={() => setHoveredCard(null)}
                                                className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 ${
                                                    isDark 
                                                        ? `bg-gradient-to-br ${colors.gradient} ${colors.border} ${colors.hover}` 
                                                        : `bg-white border-gray-200`
                                                } ${colors.shadow} hover:shadow-2xl`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-t ${
                                                    isDark ? 'from-black/50 via-transparent to-transparent' : 'from-gray-900/5 via-transparent to-transparent'
                                                } opacity-0 group-hover:opacity-100 transition-opacity`} />

                                                <div className="relative p-8">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className={`w-12 h-12 rounded-2xl ${IconConfig.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                            <Icon className={`w-6 h-6 ${IconConfig.color}`} />
                                                        </div>
                                                        {card.mes_referencia && (
                                                            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                                isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                <Clock className="w-3 h-3" />
                                                                {card.mes_referencia}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Foto */}
                                                    {card.imagem_url && (
                                                        <div className="relative w-24 h-24 mx-auto mb-6">
                                                            <div className={`absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-xl ${
                                                                isAniversariante ? 'bg-gradient-to-r from-pink-500 to-pink-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                                                            }`} />
                                                            <img 
                                                                src={card.imagem_url} 
                                                                alt={card.titulo} 
                                                                className="relative w-24 h-24 rounded-full object-cover border-4 border-white/20 group-hover:border-white/30 transition-all group-hover:scale-105"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Conteúdo */}
                                                    <div className="text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                                                            isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {tipoLabels[card.tipo]}
                                                        </span>
                                                        
                                                        <h4 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {card.titulo}
                                                        </h4>
                                                        
                                                        {card.nome_funcionario && (
                                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                                <User className={`w-4 h-4 ${colors.text}`} />
                                                                <p className={`font-medium ${colors.text}`}>
                                                                    {card.nome_funcionario}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* ── DATA DE ANIVERSÁRIO ── */}
                                                        {isAniversariante && card.data_aniversario && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                viewport={{ once: true }}
                                                                className="flex items-center justify-center gap-2 mb-3"
                                                            >
                                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                                                    isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-600 border border-pink-200'
                                                                }`}>
                                                                    <Cake className="w-3.5 h-3.5" />
                                                                    {formatarAniversario(card.data_aniversario)}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                        
                                                        {card.setor && (
                                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                                <Briefcase className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                                                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                                                    {card.setor}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {card.descricao && (
                                                            <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                                                {card.descricao}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Barra de hover */}
                                                    <motion.div 
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: hoveredCard === card.id ? 1 : 0 }}
                                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                                                            isAniversariante ? 'from-pink-400 to-pink-600' :
                                                            card.cor_destaque === 'amarelo' ? 'from-yellow-500 to-yellow-600' :
                                                            card.cor_destaque === 'rosa' ? 'from-pink-500 to-pink-600' :
                                                            card.cor_destaque === 'azul' ? 'from-blue-500 to-blue-600' :
                                                            'from-green-500 to-green-600'
                                                        }`} 
                                                    />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Modal de notícia completa ── */}
            <AnimatePresence>
                {selectedNoticia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedNoticia(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedNoticia.imagem_url && (
                                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                                    <img 
                                        src={selectedNoticia.imagem_url} 
                                        alt={selectedNoticia.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <button
                                        onClick={() => setSelectedNoticia(null)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                                        Notícia
                                    </div>
                                    {selectedNoticia.data_publicacao && (
                                        <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatarData(selectedNoticia.data_publicacao)}
                                        </div>
                                    )}
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {selectedNoticia.titulo}
                                </h2>
                                
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {selectedNoticia.conteudo || selectedNoticia.resumo}
                                </p>
                                
                                <button
                                    onClick={() => setSelectedNoticia(null)}
                                    className="w-full py-3 bg-gradient-to-r from-[#00482B] to-[#00703C] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
