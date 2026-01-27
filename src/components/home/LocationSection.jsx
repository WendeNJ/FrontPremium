import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ExternalLink } from 'lucide-react';
import { useTheme } from '../../Layout';

const MAP_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/cc79f2564_Captura_de_tela_2026-01-20_073443-removebg-preview.png";

const filiais = [
    { id: 1, nome: 'Filial Teresina', cidade: 'Teresina', estado: 'PI', endereco: 'Av. Principal, 645 - Centro, Teresina - PI', foto_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a3008ef0dc4959628d298/8ceeb2495_PREMIUM.jpg', google_maps_url: 'https://maps.google.com/?q=Teresina,PI' },
    { id: 2, nome: 'Filial Iguatu', cidade: 'Iguatu', estado: 'CE', endereco: 'Rua Comercial, 123 - Centro, Iguatu - CE', foto_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', google_maps_url: 'https://maps.google.com/?q=Iguatu,CE' },
    { id: 3, nome: 'Filial Juazeiro do Norte', cidade: 'Juazeiro do Norte', estado: 'CE', endereco: 'Av. Industrial, 456 - Distrito Industrial, Juazeiro do Norte - CE', foto_url: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&q=80', google_maps_url: 'https://maps.google.com/?q=Juazeiro+do+Norte,CE' },
];

export default function LocationSection() {
    const { isDark } = useTheme();
    const [selectedFilial, setSelectedFilial] = useState(null);

    return (
        <section id="localizacao" className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`} />
            
            <div className="max-w-7xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-4 block">Localização</span>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Onde Estamos</h2>
                    <p className={`max-w-xl mx-auto ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Presentes em mais de 51 cidades do Piauí e Ceará</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative max-w-4xl mx-auto">
                    <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden border ${isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="w-full h-full flex items-center justify-center p-8">
                            <img src={MAP_IMAGE} alt="Mapa Piauí e Ceará" className="max-w-full max-h-full object-contain" style={{ filter: 'sepia(100%) hue-rotate(70deg) saturate(2) brightness(0.85)' }} />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        {filiais.map((filial) => (
                            <button key={filial.id} onClick={() => setSelectedFilial(filial)} className={`flex items-center gap-2 px-4 py-2 rounded-full border hover:border-green-500/30 transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/70 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}>
                                <MapPin className="w-4 h-4 text-green-500" />
                                {filial.cidade}/{filial.estado}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {selectedFilial && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedFilial(null)}>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative max-w-lg w-full bg-[#111111] rounded-3xl overflow-hidden border border-white/10">
                                <button onClick={() => setSelectedFilial(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="aspect-video overflow-hidden">
                                    <img src={selectedFilial.foto_url} alt={selectedFilial.nome} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-green-500 text-sm mb-2">
                                        <MapPin className="w-4 h-4" />
                                        {selectedFilial.cidade}/{selectedFilial.estado}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{selectedFilial.nome}</h3>
                                    <p className="text-white/60 mb-6">{selectedFilial.endereco}</p>
                                    <a href={selectedFilial.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                        Ver no Google Maps
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}