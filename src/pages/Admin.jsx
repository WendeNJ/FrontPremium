import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Newspaper,
    Star,
    Cake,
    Heart,
    ArrowLeft,
    LogOut,
    Eye,
    Shield,
    Users,
    Bell,
    Calendar,
    Image,
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    Sparkles,
    Award,
    Home,
    FileText,
    Menu,
    Clock,
    UserPlus,
    Mail,
    Filter,
    Download,
    Paperclip,
    RefreshCw,
    XCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cardMuralAPI, noticiasAPI, usersAPI } from '@/api/ouvidoriaApi';

const LOGO_URL = 'https://d335luupugsy2.cloudfront.net/cms/files/1124874/1768396355/$zqh0zhgnv8j';

export default function Admin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [editingNoticia, setEditingNoticia] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [activeTab, setActiveTab] = useState('noticias');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accessCount, setAccessCount] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [busca, setBusca] = useState('');
    const [newNoticia, setNewNoticia] = useState({
        titulo: '',
        resumo: '',
        conteudo: '',
        imagem_url: '',
        data_publicacao: new Date().toISOString().split('T')[0],
        ativo: true
    });
    const [newCard, setNewCard] = useState({
        tipo: 'funcionario_destaque',
        titulo: '',
        descricao: '',
        imagem_url: '',
        setor: '',
        nome_funcionario: '',
        mes_referencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        cor_destaque: '',
        ativo: true,
        ordem: 0
    });

    // Verificar sessão ao montar
    useEffect(() => {
        const checkSession = async () => {
            try {
                await usersAPI.testAuth();
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkSession();
    }, []);

    // Contador de acessos
    useEffect(() => {
        const count = localStorage.getItem('adminAccessCount') || 0;
        const newCount = parseInt(count) + 1;
        setAccessCount(newCount);
        localStorage.setItem('adminAccessCount', newCount.toString());
    }, []);

    // ============================================
    // 📌 QUERIES
    // ============================================
    const { data: noticias = [], isLoading: loadingNoticias } = useQuery({
        queryKey: ['noticias-admin'],
        queryFn: noticiasAPI.list,
        enabled: isAuthenticated,
    });

    const { data: cardsMural = [], isLoading: loadingCards } = useQuery({
        queryKey: ['cardsMural-admin'],
        queryFn: cardMuralAPI.list,
        enabled: isAuthenticated,
    });

    // ============================================
    // 📌 MUTATIONS - NOTÍCIAS
    // ============================================
    const createNoticiaMutation = useMutation({
        mutationFn: noticiasAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['noticias-admin'] });
            queryClient.invalidateQueries({ queryKey: ['noticias'] });
            setNewNoticia({
                titulo: '',
                resumo: '',
                conteudo: '',
                imagem_url: '',
                data_publicacao: new Date().toISOString().split('T')[0],
                ativo: true
            });
        },
    });

    const updateNoticiaMutation = useMutation({
        mutationFn: ({ id, data }) => noticiasAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['noticias-admin'] });
            queryClient.invalidateQueries({ queryKey: ['noticias'] });
            setEditingNoticia(null);
        },
    });

    const deleteNoticiaMutation = useMutation({
        mutationFn: noticiasAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['noticias-admin'] });
            queryClient.invalidateQueries({ queryKey: ['noticias'] });
        },
    });

    // ============================================
    // 📌 MUTATIONS - CARDS MURAL
    // ============================================
    const createCardMutation = useMutation({
        mutationFn: cardMuralAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cardsMural-admin'] });
            queryClient.invalidateQueries({ queryKey: ['cardsMural'] });
            setNewCard({
                tipo: 'funcionario_destaque',
                titulo: '',
                descricao: '',
                imagem_url: '',
                setor: '',
                nome_funcionario: '',
                mes_referencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                cor_destaque: '',
                ativo: true,
                ordem: 0
            });
        },
    });

    const updateCardMutation = useMutation({
        mutationFn: ({ id, data }) => cardMuralAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cardsMural-admin'] });
            queryClient.invalidateQueries({ queryKey: ['cardsMural'] });
            setEditingCard(null);
        },
    });

    const deleteCardMutation = useMutation({
        mutationFn: cardMuralAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cardsMural-admin'] });
            queryClient.invalidateQueries({ queryKey: ['cardsMural'] });
        },
    });

    // ============================================
    // 📌 HANDLERS
    // ============================================
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);

        try {
            await usersAPI.login({
                email: loginUser,
                password: loginPass,
            });
            setIsAuthenticated(true);
        } catch (err) {
            setLoginError(err.response?.data?.message || "Usuário ou senha inválidos");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        await usersAPI.logout();
        setIsAuthenticated(false);
        navigate('/admin');
    };

    const tipoIcons = {
        funcionario_destaque: Star,
        aniversariantes: Cake,
        campanha: Heart,
    };

    const tipoColors = {
        funcionario_destaque: 'text-yellow-500 bg-yellow-500/10',
        aniversariantes: 'text-pink-500 bg-pink-500/10',
        campanha: 'text-purple-500 bg-purple-500/10',
    };

    // Filtros
    const noticiasFiltradas = noticias.filter((n) => {
        const matchStatus = filtroStatus === 'TODOS' || 
            (filtroStatus === 'ATIVOS' && n.ativo) || 
            (filtroStatus === 'INATIVOS' && !n.ativo);
        const matchBusca = n.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
                          n.resumo?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    });

    const cardsFiltrados = cardsMural.filter((c) => {
        const matchStatus = filtroStatus === 'TODOS' || 
            (filtroStatus === 'ATIVOS' && c.ativo) || 
            (filtroStatus === 'INATIVOS' && !c.ativo);
        const matchBusca = c.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
                          c.descricao?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    });

    // Stats para o dashboard
    const stats = [
        { 
            label: 'Notícias', 
            value: noticias.length, 
            icon: Newspaper, 
            color: 'text-blue-500 bg-blue-500/10',
            trend: `${noticias.filter(n => n.ativo).length} ativas`
        },
        { 
            label: 'Cards Ativos', 
            value: cardsMural.filter(c => c.ativo).length, 
            icon: Star, 
            color: 'text-yellow-500 bg-yellow-500/10',
            trend: `${cardsMural.filter(c => c.ativo).length} publicados`
        },
        { 
            label: 'Funcionários Destaque', 
            value: cardsMural.filter(c => c.tipo === 'funcionario_destaque' && c.ativo).length, 
            icon: Award, 
            color: 'text-green-500 bg-green-500/10',
            trend: 'Em destaque'
        },
        { 
            label: 'Campanhas', 
            value: cardsMural.filter(c => c.tipo === 'campanha' && c.ativo).length, 
            icon: Heart, 
            color: 'text-purple-500 bg-purple-500/10',
            trend: 'Ativas no momento'
        },
    ];

    function formatarData(dataString) {
        if (!dataString) return '';
        return new Date(dataString).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // ============================================
    // 📌 TELA DE LOGIN MELHORADA
    // ============================================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#111111] flex items-center justify-center px-6 relative overflow-hidden">
                {/* Elementos decorativos */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
                <div className="absolute -top-48 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                                    <Shield className="w-10 h-10 text-black" />
                                </div>
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Área Administrativa</h1>
                            <p className="text-white/50">Premium Bebidas — Gestão de Conteúdo</p>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Acesso Restrito
                                </Badge>
                                <Badge variant="outline" className="border-white/10 text-white/50 bg-white/5">
                                    <Users className="w-3 h-3 mr-1" />
                                    Administradores
                                </Badge>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-white/70 text-sm font-medium">E-mail</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        type="email"
                                        value={loginUser}
                                        onChange={(e) => setLoginUser(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-white/70 text-sm font-medium">Senha</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        type="password"
                                        value={loginPass}
                                        onChange={(e) => setLoginPass(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {loginError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                                    >
                                        <p className="text-red-500 text-sm text-center flex items-center justify-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {loginError}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 disabled:opacity-50"
                            >
                                {loginLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        Acessando...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Acessar Painel
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <Link
                                to="/"
                                className="text-white/50 hover:text-white text-sm flex items-center justify-center gap-2 group transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Voltar ao site institucional
                            </Link>
                            <p className="text-xs text-white/30 mt-4">
                                © {new Date().getFullYear()} Premium Bebidas
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // 📌 PAINEL ADMINISTRATIVO MELHORADO
    // ============================================
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            {/* HEADER MELHORADO - IGUAL AO DA OUVIDORIA */}
            <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/" 
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                        </Link>
                        <img src={LOGO_URL} alt="Logo" className="h-12" />
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-white">Gestão de Conteúdo</h1>
                            <p className="text-xs text-white/40">Premium Bebidas — Painel Administrativo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Eye className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-white/70">{accessCount} acessos</span>
                        </div>
                        
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/5 rounded-xl"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>

                    <button 
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="md:hidden bg-[#0A0A0A] px-4 pb-4 border-t border-gray-800"
                    >
                        <div className="flex flex-col gap-3 py-3">
                            <Link to="/" className="text-white/70 hover:text-white py-2">Home</Link>
                            <Button 
                                onClick={handleLogout} 
                                variant="outline" 
                                className="border-white/20 text-white mt-2" 
                                size="sm"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </motion.div>
                )}
            </header>

            <div className="flex-1 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Título da página */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Gerenciar Conteúdo
                        </h1>
                        <p className="text-gray-600">
                            Logado como: <span className="font-semibold text-[#00482B]">{loginUser}</span>
                        </p>
                    </motion.div>

                    {/* Dashboard Stats - MELHORADO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-gray-500 text-xs border-gray-200">
                                        {stat.trend}
                                    </Badge>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filtros Globais - IGUAL AO DA OUVIDORIA */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-[#00482B]" />
                                Filtros
                            </h2>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowFilters(!showFilters)} 
                                className="text-gray-600 hover:text-[#00482B]"
                            >
                                {showFilters ? 'Ocultar' : 'Mostrar'}
                                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                        
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-4 pt-2">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar por título ou descrição..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none transition-all"
                                                value={busca}
                                                onChange={(e) => setBusca(e.target.value)}
                                            />
                                        </div>
                                        <div className="md:w-64">
                                            <select
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00703C] focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                                                value={filtroStatus}
                                                onChange={(e) => setFiltroStatus(e.target.value)}
                                            >
                                                <option value="TODOS">Todos os Status</option>
                                                <option value="ATIVOS">Ativos</option>
                                                <option value="INATIVOS">Inativos</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tabs - IGUAL AO DA OUVIDORIA */}
                    <Tabs defaultValue="noticias" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 mb-8 w-fit">
                            <TabsTrigger 
                                value="noticias" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00482B] data-[state=active]:to-[#00703C] data-[state=active]:text-white rounded-xl px-6 py-2.5 transition-all text-gray-600"
                            >
                                <Newspaper className="w-4 h-4 mr-2" />
                                Notícias
                                <Badge className="ml-2 bg-gray-100 text-gray-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                                    {noticias.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger 
                                value="cards" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00482B] data-[state=active]:to-[#00703C] data-[state=active]:text-white rounded-xl px-6 py-2.5 transition-all text-gray-600"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Cards do Mural
                                <Badge className="ml-2 bg-gray-100 text-gray-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                                    {cardsMural.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* ========== TAB NOTÍCIAS ========== */}
                        <TabsContent value="noticias">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Formulário Nova Notícia */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <CardHeader className="border-b border-gray-200 pb-4">
                                            <CardTitle className="text-gray-900 flex items-center gap-2 text-xl">
                                                <div className="p-2 rounded-lg bg-green-100">
                                                    <Plus className="w-5 h-5 text-[#00482B]" />
                                                </div>
                                                Nova Notícia
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-5 pt-6">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 text-sm font-medium">Título da Notícia</Label>
                                                <Input
                                                    value={newNoticia.titulo}
                                                    onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
                                                    className="border-gray-300 focus:border-[#00703C] focus:ring-[#00703C]/20 h-11"
                                                    placeholder="Ex: Premium Bebidas alcança marca histórica"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 text-sm font-medium">Resumo</Label>
                                                <Textarea
                                                    value={newNoticia.resumo}
                                                    onChange={(e) => setNewNoticia({ ...newNoticia, resumo: e.target.value })}
                                                    className="border-gray-300 focus:border-[#00703C] focus:ring-[#00703C]/20 min-h-[100px] resize-none"
                                                    placeholder="Breve descrição da notícia..."
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">URL da Imagem</Label>
                                                    <div className="relative">
                                                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            value={newNoticia.imagem_url}
                                                            onChange={(e) => setNewNoticia({ ...newNoticia, imagem_url: e.target.value })}
                                                            className="border-gray-300 pl-10 focus:border-[#00703C] focus:ring-[#00703C]/20 h-11"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">Data de Publicação</Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            type="date"
                                                            value={newNoticia.data_publicacao}
                                                            onChange={(e) => setNewNoticia({ ...newNoticia, data_publicacao: e.target.value })}
                                                            className="border-gray-300 pl-10 focus:border-[#00703C] focus:ring-[#00703C]/20 h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="noticia-ativa"
                                                        checked={newNoticia.ativo}
                                                        onCheckedChange={(checked) => setNewNoticia({ ...newNoticia, ativo: checked })}
                                                        className="data-[state=checked]:bg-[#00482B]"
                                                    />
                                                    <Label htmlFor="noticia-ativa" className="text-gray-600 text-sm">
                                                        Publicar imediatamente
                                                    </Label>
                                                </div>
                                            </div>

                                            <Separator className="bg-gray-200" />

                                            <Button
                                                onClick={() => createNoticiaMutation.mutate(newNoticia)}
                                                disabled={!newNoticia.titulo || !newNoticia.resumo || createNoticiaMutation.isPending}
                                                className="w-full bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                            >
                                                {createNoticiaMutation.isPending ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Publicando...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Plus className="w-4 h-4" />
                                                        Publicar Notícia
                                                    </span>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Lista de Notícias */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <Newspaper className="w-5 h-5 text-[#00482B]" />
                                                Notícias Publicadas
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Gerencie todas as notícias do sistema
                                            </p>
                                        </div>
                                        <Badge className="bg-[#00482B]/10 text-[#00482B] border-[#00482B]/20">
                                            Total: {noticiasFiltradas.length}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingNoticias ? (
                                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                                <div className="w-12 h-12 border-4 border-[#00482B]/30 border-t-[#00482B] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-gray-500">Carregando notícias...</p>
                                            </div>
                                        ) : noticiasFiltradas.length === 0 ? (
                                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                                <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-2">Nenhuma notícia encontrada</p>
                                                <p className="text-sm text-gray-400">Crie sua primeira notícia ao lado</p>
                                            </div>
                                        ) : (
                                            noticiasFiltradas.map((noticia, index) => (
                                                <motion.div
                                                    key={noticia.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden">
                                                        <CardContent className="p-0">
                                                            {editingNoticia?.id === noticia.id ? (
                                                                <div className="p-6 space-y-4">
                                                                    <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                                                                        <Edit className="w-4 h-4 text-[#00482B]" />
                                                                        Editando Notícia
                                                                    </h4>
                                                                    <Input
                                                                        value={editingNoticia.titulo}
                                                                        onChange={(e) => setEditingNoticia({ ...editingNoticia, titulo: e.target.value })}
                                                                        className="border-gray-300"
                                                                        placeholder="Título"
                                                                    />
                                                                    <Textarea
                                                                        value={editingNoticia.resumo}
                                                                        onChange={(e) => setEditingNoticia({ ...editingNoticia, resumo: e.target.value })}
                                                                        className="border-gray-300"
                                                                        placeholder="Resumo"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            onClick={() => updateNoticiaMutation.mutate({ id: noticia.id, data: editingNoticia })}
                                                                            className="bg-[#00482B] hover:bg-[#00703C] text-white"
                                                                            size="sm"
                                                                        >
                                                                            <Save className="w-4 h-4 mr-1" />
                                                                            Salvar
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => setEditingNoticia(null)}
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                                                        >
                                                                            <X className="w-4 h-4 mr-1" />
                                                                            Cancelar
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-6">
                                                                    <div className="flex items-start gap-4">
                                                                        {noticia.imagem_url ? (
                                                                            <img 
                                                                                src={noticia.imagem_url} 
                                                                                alt={noticia.titulo}
                                                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-20 h-20 bg-gradient-to-br from-[#00482B]/20 to-[#00703C]/20 rounded-lg flex items-center justify-center border border-[#00482B]/30">
                                                                                <Newspaper className="w-8 h-8 text-[#00482B]/50" />
                                                                            </div>
                                                                        )}
                                                                        
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between">
                                                                                <div>
                                                                                    <h4 className="text-gray-900 font-medium text-lg mb-1 truncate">
                                                                                        {noticia.titulo}
                                                                                    </h4>
                                                                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                                                                        {noticia.resumo}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                                                                            <Calendar className="w-3 h-3 mr-1" />
                                                                                            {formatarData(noticia.data_publicacao)}
                                                                                        </Badge>
                                                                                        <Badge className={noticia.ativo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                                                                                            {noticia.ativo ? 'Ativo' : 'Inativo'}
                                                                                        </Badge>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center gap-1 ml-4">
                                                                                    <Button
                                                                                        onClick={() => setEditingNoticia(noticia)}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="text-gray-400 hover:text-[#00482B] hover:bg-[#00482B]/10"
                                                                                    >
                                                                                        <Edit className="w-4 h-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => deleteNoticiaMutation.mutate(noticia.id)}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </TabsContent>

                        {/* ========== TAB CARDS MURAL ========== */}
                        <TabsContent value="cards">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Formulário Novo Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <CardHeader className="border-b border-gray-200 pb-4">
                                            <CardTitle className="text-gray-900 flex items-center gap-2 text-xl">
                                                <div className="p-2 rounded-lg bg-green-100">
                                                    <Sparkles className="w-5 h-5 text-[#00482B]" />
                                                </div>
                                                Novo Card
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-5 pt-6">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 text-sm font-medium">Tipo do Card</Label>
                                                <Select
                                                    value={newCard.tipo}
                                                    onValueChange={(value) => setNewCard({ ...newCard, tipo: value })}
                                                >
                                                    <SelectTrigger className="border-gray-300 h-11">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-gray-200">
                                                        <SelectItem value="funcionario_destaque">
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-4 h-4 text-yellow-500" />
                                                                Funcionário Destaque
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="aniversariantes">
                                                            <div className="flex items-center gap-2">
                                                                <Cake className="w-4 h-4 text-pink-500" />
                                                                Aniversariantes
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="campanha">
                                                            <div className="flex items-center gap-2">
                                                                <Heart className="w-4 h-4 text-purple-500" />
                                                                Campanha
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-gray-700 text-sm font-medium">Título do Card</Label>
                                                <Input
                                                    value={newCard.titulo}
                                                    onChange={(e) => setNewCard({ ...newCard, titulo: e.target.value })}
                                                    className="border-gray-300 h-11"
                                                    placeholder={newCard.tipo === 'funcionario_destaque' ? 'Ex: Destaque do Mês' : newCard.tipo === 'aniversariantes' ? 'Ex: Aniversariantes de Fevereiro' : 'Ex: Campanha Setembro Amarelo'}
                                                />
                                            </div>

                                            {newCard.tipo === 'funcionario_destaque' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-700 text-sm font-medium">Nome do Funcionário</Label>
                                                        <div className="relative">
                                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            <Input
                                                                value={newCard.nome_funcionario}
                                                                onChange={(e) => setNewCard({ ...newCard, nome_funcionario: e.target.value })}
                                                                className="border-gray-300 pl-10 h-11"
                                                                placeholder="Ex: João Silva"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-700 text-sm font-medium">Setor</Label>
                                                        <Input
                                                            value={newCard.setor}
                                                            onChange={(e) => setNewCard({ ...newCard, setor: e.target.value })}
                                                            className="border-gray-300 h-11"
                                                            placeholder="Ex: Logística"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className="space-y-2">
                                                <Label className="text-gray-700 text-sm font-medium">Descrição</Label>
                                                <Textarea
                                                    value={newCard.descricao}
                                                    onChange={(e) => setNewCard({ ...newCard, descricao: e.target.value })}
                                                    className="border-gray-300 min-h-[100px] resize-none"
                                                    placeholder="Descreva os detalhes do card..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">URL da Imagem</Label>
                                                    <div className="relative">
                                                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            value={newCard.imagem_url}
                                                            onChange={(e) => setNewCard({ ...newCard, imagem_url: e.target.value })}
                                                            className="border-gray-300 pl-10 h-11"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">Mês de Referência</Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            value={newCard.mes_referencia}
                                                            onChange={(e) => setNewCard({ ...newCard, mes_referencia: e.target.value })}
                                                            className="border-gray-300 pl-10 h-11"
                                                            placeholder="Ex: Janeiro 2025"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {newCard.tipo === 'campanha' && (
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">Cor de Destaque</Label>
                                                    <Select
                                                        value={newCard.cor_destaque}
                                                        onValueChange={(value) => setNewCard({ ...newCard, cor_destaque: value })}
                                                    >
                                                        <SelectTrigger className="border-gray-300 h-11">
                                                            <SelectValue placeholder="Selecione uma cor" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border-gray-200">
                                                            <SelectItem value="amarelo">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                                    Amarelo (Setembro)
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="rosa">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                                                                    Rosa (Outubro)
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="azul">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                                    Azul (Novembro)
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">Ordem de Exibição</Label>
                                                    <Input
                                                        type="number"
                                                        value={newCard.ordem}
                                                        onChange={(e) => setNewCard({ ...newCard, ordem: parseInt(e.target.value) || 0 })}
                                                        className="border-gray-300 h-11"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 text-sm font-medium">Status</Label>
                                                    <div className="flex items-center h-11 px-3 bg-gray-50 border border-gray-300 rounded-lg">
                                                        <Switch
                                                            id="card-ativo"
                                                            checked={newCard.ativo}
                                                            onCheckedChange={(checked) => setNewCard({ ...newCard, ativo: checked })}
                                                            className="data-[state=checked]:bg-[#00482B]"
                                                        />
                                                        <Label htmlFor="card-ativo" className="ml-3 text-gray-600 text-sm">
                                                            {newCard.ativo ? 'Ativo' : 'Inativo'}
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="bg-gray-200" />

                                            <Button
                                                onClick={() => createCardMutation.mutate(newCard)}
                                                disabled={!newCard.titulo || createCardMutation.isPending}
                                                className="w-full bg-gradient-to-r from-[#00482B] to-[#00703C] hover:from-[#00703C] hover:to-[#008C4A] text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                            >
                                                {createCardMutation.isPending ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Criando Card...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4" />
                                                        Criar Card
                                                    </span>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Lista de Cards */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-[#00482B]" />
                                                Cards do Mural
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Gerencie os cards em destaque
                                            </p>
                                        </div>
                                        <Badge className="bg-[#00482B]/10 text-[#00482B] border-[#00482B]/20">
                                            Total: {cardsFiltrados.length}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingCards ? (
                                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                                <div className="w-12 h-12 border-4 border-[#00482B]/30 border-t-[#00482B] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-gray-500">Carregando cards...</p>
                                            </div>
                                        ) : cardsFiltrados.length === 0 ? (
                                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-2">Nenhum card cadastrado</p>
                                                <p className="text-sm text-gray-400">Crie seu primeiro card ao lado</p>
                                            </div>
                                        ) : (
                                            cardsFiltrados.map((card, index) => {
                                                const Icon = tipoIcons[card.tipo] || Star;
                                                const colorClass = tipoColors[card.tipo] || 'text-green-500 bg-green-500/10';
                                                return (
                                                    <motion.div
                                                        key={card.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden">
                                                            <CardContent className="p-0">
                                                                {editingCard?.id === card.id ? (
                                                                    <div className="p-6 space-y-4">
                                                                        <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                                                                            <Edit className="w-4 h-4 text-[#00482B]" />
                                                                            Editando Card
                                                                        </h4>
                                                                        <Input
                                                                            value={editingCard.titulo}
                                                                            onChange={(e) => setEditingCard({ ...editingCard, titulo: e.target.value })}
                                                                            className="border-gray-300"
                                                                            placeholder="Título"
                                                                        />
                                                                        <Textarea
                                                                            value={editingCard.descricao}
                                                                            onChange={(e) => setEditingCard({ ...editingCard, descricao: e.target.value })}
                                                                            className="border-gray-300"
                                                                            placeholder="Descrição"
                                                                        />
                                                                        
                                                                        {editingCard.tipo === 'funcionario_destaque' && (
                                                                            <>
                                                                                <Input
                                                                                    value={editingCard.nome_funcionario}
                                                                                    onChange={(e) => setEditingCard({ ...editingCard, nome_funcionario: e.target.value })}
                                                                                    className="border-gray-300"
                                                                                    placeholder="Nome do Funcionário"
                                                                                />
                                                                                <Input
                                                                                    value={editingCard.setor}
                                                                                    onChange={(e) => setEditingCard({ ...editingCard, setor: e.target.value })}
                                                                                    className="border-gray-300"
                                                                                    placeholder="Setor"
                                                                                />
                                                                            </>
                                                                        )}

                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <Label className="text-gray-600 text-sm">Ordem:</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={editingCard.ordem}
                                                                                    onChange={(e) => setEditingCard({ ...editingCard, ordem: parseInt(e.target.value) || 0 })}
                                                                                    className="border-gray-300 w-20 h-9"
                                                                                />
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Switch
                                                                                    id={`edit-ativo-${card.id}`}
                                                                                    checked={editingCard.ativo}
                                                                                    onCheckedChange={(checked) => setEditingCard({ ...editingCard, ativo: checked })}
                                                                                    className="data-[state=checked]:bg-[#00482B]"
                                                                                />
                                                                                <Label htmlFor={`edit-ativo-${card.id}`} className="text-gray-600 text-sm">
                                                                                    Ativo
                                                                                </Label>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex gap-2 pt-2">
                                                                            <Button
                                                                                onClick={() => updateCardMutation.mutate({ id: card.id, data: editingCard })}
                                                                                className="bg-[#00482B] hover:bg-[#00703C] text-white"
                                                                                size="sm"
                                                                            >
                                                                                <Save className="w-4 h-4 mr-1" />
                                                                                Salvar
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => setEditingCard(null)}
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                                                            >
                                                                                <X className="w-4 h-4 mr-1" />
                                                                                Cancelar
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-6">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                                                                <Icon className="w-7 h-7" />
                                                                            </div>
                                                                            
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-start justify-between">
                                                                                    <div>
                                                                                        <h4 className="text-gray-900 font-semibold text-lg mb-1">
                                                                                            {card.titulo}
                                                                                        </h4>
                                                                                        {card.nome_funcionario && (
                                                                                            <p className="text-[#00482B] font-medium text-sm">
                                                                                                {card.nome_funcionario}
                                                                                            </p>
                                                                                        )}
                                                                                        {card.setor && (
                                                                                            <p className="text-gray-400 text-sm">
                                                                                                {card.setor}
                                                                                            </p>
                                                                                        )}
                                                                                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                                                            {card.descricao}
                                                                                        </p>
                                                                                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                                                            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                                                                                {card.tipo.replace('_', ' ')}
                                                                                            </Badge>
                                                                                            {card.mes_referencia && (
                                                                                                <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                                                                                    <Calendar className="w-3 h-3 mr-1" />
                                                                                                    {card.mes_referencia}
                                                                                                </Badge>
                                                                                            )}
                                                                                            <Badge className={card.ativo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                                                                                                {card.ativo ? 'Ativo' : 'Inativo'}
                                                                                            </Badge>
                                                                                            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                                                                                Ordem: {card.ordem}
                                                                                            </Badge>
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="flex items-center gap-1 ml-4">
                                                                                        <Button
                                                                                            onClick={() => setEditingCard(card)}
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="text-gray-400 hover:text-[#00482B] hover:bg-[#00482B]/10"
                                                                                        >
                                                                                            <Edit className="w-4 h-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                            onClick={() => deleteCardMutation.mutate(card.id)}
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                                        >
                                                                                            <Trash2 className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* FOOTER - IGUAL AO DA OUVIDORIA */}
            <footer className="bg-gradient-to-r from-[#00482B] to-[#00703C] text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-white/90">© {new Date().getFullYear()} Premium Bebidas — Gestão de Conteúdo</p>
                    <p className="text-xs text-white/70 mt-2">Área Administrativa — Acesso Restrito</p>
                </div>
            </footer>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}
