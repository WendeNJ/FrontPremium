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
    Settings,
    LogOut,
    Eye,
    Shield,
    Users,
    Bell,
    Calendar,
    Image,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Clock,
    Sparkles,
    Award,
    TrendingUp,
    Home,
    FileText,
    UserCog
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
    const [editingNoticia, setEditingNoticia] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [activeTab, setActiveTab] = useState('noticias');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accessCount, setAccessCount] = useState(0);
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

        try {
            await usersAPI.login({
                email: loginUser,
                password: loginPass,
            });
            setIsAuthenticated(true);
        } catch (err) {
            setLoginError(err.response?.data?.message || "Usuário ou senha inválidos");
        }
    };

    const handleLogout = async () => {
        await usersAPI.logout();
        setIsAuthenticated(false);
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

    // Stats para o dashboard
    const stats = [
        { 
            label: 'Notícias', 
            value: noticias.length, 
            icon: Newspaper, 
            color: 'text-blue-500 bg-blue-500/10',
            trend: '+12% este mês'
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
            value: cardsMural.filter(c => c.tipo === 'funcionario_destaque').length, 
            icon: Award, 
            color: 'text-green-500 bg-green-500/10',
            trend: 'Último: ' + (cardsMural.find(c => c.tipo === 'funcionario_destaque')?.nome_funcionario || 'Nenhum')
        },
        { 
            label: 'Campanhas', 
            value: cardsMural.filter(c => c.tipo === 'campanha').length, 
            icon: Heart, 
            color: 'text-purple-500 bg-purple-500/10',
            trend: 'Ativas no momento'
        },
    ];

    // ============================================
    // 📌 TELA DE LOGIN
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
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                                    <Shield className="w-10 h-10 text-black" />
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Área Administrativa</h1>
                            <p className="text-white/50">Premium Bebidas - Ouvidoria</p>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Acesso Restrito
                                </Badge>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-white/70 text-sm font-medium">Usuário</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        value={loginUser}
                                        onChange={(e) => setLoginUser(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white pl-10 h-12 focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                                        placeholder="Digite seu e-mail"
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
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300"
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Acessar Painel
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <Link
                                to={createPageUrl('Home')}
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
    // 📌 PAINEL ADMINISTRATIVO
    // ============================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#111111]">
            {/* Header */}
            <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/" 
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                        </Link>
                        <img src={LOGO_URL} alt="Logo" className="h-12" />
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
                            <p className="text-xs text-white/40">Premium Bebidas - Ouvidoria</p>
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
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <Badge variant="outline" className="border-white/10 text-white/50 text-xs">
                                    {stat.trend}
                                </Badge>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-white/50">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="noticias" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="bg-[#1a1a1a] border border-white/10 p-1 mb-8 rounded-xl">
                        <TabsTrigger 
                            value="noticias" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-black rounded-lg px-6 py-2.5 transition-all"
                        >
                            <Newspaper className="w-4 h-4 mr-2" />
                            Notícias
                            <Badge className="ml-2 bg-white/10 text-white data-[state=active]:bg-black/20">
                                {noticias.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="cards" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-black rounded-lg px-6 py-2.5 transition-all"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Cards do Mural
                            <Badge className="ml-2 bg-white/10 text-white data-[state=active]:bg-black/20">
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
                                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border-white/10 shadow-xl overflow-hidden">
                                    <CardHeader className="border-b border-white/10 pb-4">
                                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                <Plus className="w-5 h-5 text-green-500" />
                                            </div>
                                            Nova Notícia
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5 pt-6">
                                        <div className="space-y-2">
                                            <Label className="text-white/70 text-sm">Título da Notícia</Label>
                                            <Input
                                                value={newNoticia.titulo}
                                                onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white focus:border-green-500/50 focus:ring-green-500/20 h-11"
                                                placeholder="Ex: Premium Bebidas alcança marca histórica"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-white/70 text-sm">Resumo</Label>
                                            <Textarea
                                                value={newNoticia.resumo}
                                                onChange={(e) => setNewNoticia({ ...newNoticia, resumo: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white focus:border-green-500/50 focus:ring-green-500/20 min-h-[100px] resize-none"
                                                placeholder="Breve descrição da notícia..."
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">URL da Imagem</Label>
                                                <div className="relative">
                                                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <Input
                                                        value={newNoticia.imagem_url}
                                                        onChange={(e) => setNewNoticia({ ...newNoticia, imagem_url: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white pl-10 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">Data de Publicação</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <Input
                                                        type="date"
                                                        value={newNoticia.data_publicacao}
                                                        onChange={(e) => setNewNoticia({ ...newNoticia, data_publicacao: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white pl-10 focus:border-green-500/50 focus:ring-green-500/20 h-11"
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
                                                    className="data-[state=checked]:bg-green-500"
                                                />
                                                <Label htmlFor="noticia-ativa" className="text-white/70 text-sm">
                                                    Publicar imediatamente
                                                </Label>
                                            </div>
                                        </div>

                                        <Separator className="bg-white/10" />

                                        <Button
                                            onClick={() => createNoticiaMutation.mutate(newNoticia)}
                                            disabled={!newNoticia.titulo || !newNoticia.resumo}
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {createNoticiaMutation.isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Newspaper className="w-5 h-5 text-green-500" />
                                            Notícias Publicadas
                                        </h2>
                                        <p className="text-sm text-white/40 mt-1">
                                            Gerencie todas as notícias do sistema
                                        </p>
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                                        Total: {noticias.length}
                                    </Badge>
                                </div>

                                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingNoticias ? (
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
                                            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-white/50">Carregando notícias...</p>
                                        </div>
                                    ) : noticias.length === 0 ? (
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
                                            <Newspaper className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                            <p className="text-white/50 mb-2">Nenhuma notícia cadastrada</p>
                                            <p className="text-sm text-white/30">Crie sua primeira notícia ao lado</p>
                                        </div>
                                    ) : (
                                        noticias.map((noticia, index) => (
                                            <motion.div
                                                key={noticia.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card className="bg-[#1a1a1a] border-white/10 hover:border-green-500/30 transition-all overflow-hidden group">
                                                    <CardContent className="p-0">
                                                        {editingNoticia?.id === noticia.id ? (
                                                            <div className="p-6 space-y-4">
                                                                <h4 className="text-white font-semibold flex items-center gap-2">
                                                                    <Edit className="w-4 h-4 text-green-500" />
                                                                    Editando Notícia
                                                                </h4>
                                                                <Input
                                                                    value={editingNoticia.titulo}
                                                                    onChange={(e) => setEditingNoticia({ ...editingNoticia, titulo: e.target.value })}
                                                                    className="bg-white/5 border-white/10 text-white"
                                                                    placeholder="Título"
                                                                />
                                                                <Textarea
                                                                    value={editingNoticia.resumo}
                                                                    onChange={(e) => setEditingNoticia({ ...editingNoticia, resumo: e.target.value })}
                                                                    className="bg-white/5 border-white/10 text-white"
                                                                    placeholder="Resumo"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        onClick={() => updateNoticiaMutation.mutate({ id: noticia.id, data: editingNoticia })}
                                                                        className="bg-green-500 hover:bg-green-600 text-black"
                                                                    >
                                                                        <Save className="w-4 h-4 mr-1" />
                                                                        Salvar
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => setEditingNoticia(null)}
                                                                        variant="outline"
                                                                        className="border-white/10 text-white hover:bg-white/5"
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
                                                                            className="w-20 h-20 object-cover rounded-lg border border-white/10"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
                                                                            <Newspaper className="w-8 h-8 text-green-500/50" />
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between">
                                                                            <div>
                                                                                <h4 className="text-white font-medium text-lg mb-1 truncate">
                                                                                    {noticia.titulo}
                                                                                </h4>
                                                                                <p className="text-white/50 text-sm line-clamp-2 mb-3">
                                                                                    {noticia.resumo}
                                                                                </p>
                                                                                <div className="flex items-center gap-3">
                                                                                    <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                                                                                        <Calendar className="w-3 h-3 mr-1" />
                                                                                        {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}
                                                                                    </Badge>
                                                                                    <Badge className={noticia.ativo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                                                                        {noticia.ativo ? 'Ativo' : 'Inativo'}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex items-center gap-1 ml-4">
                                                                                <Button
                                                                                    onClick={() => setEditingNoticia(noticia)}
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="text-white/50 hover:text-white hover:bg-white/5"
                                                                                >
                                                                                    <Edit className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() => deleteNoticiaMutation.mutate(noticia.id)}
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
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
                                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border-white/10 shadow-xl overflow-hidden">
                                    <CardHeader className="border-b border-white/10 pb-4">
                                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                <Sparkles className="w-5 h-5 text-green-500" />
                                            </div>
                                            Novo Card
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5 pt-6">
                                        <div className="space-y-2">
                                            <Label className="text-white/70 text-sm">Tipo do Card</Label>
                                            <Select
                                                value={newCard.tipo}
                                                onValueChange={(value) => setNewCard({ ...newCard, tipo: value })}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                                                    <SelectItem value="funcionario_destaque" className="hover:bg-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <Star className="w-4 h-4 text-yellow-500" />
                                                            Funcionário Destaque
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="aniversariantes" className="hover:bg-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <Cake className="w-4 h-4 text-pink-500" />
                                                            Aniversariantes
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="campanha" className="hover:bg-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-4 h-4 text-purple-500" />
                                                            Campanha
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white/70 text-sm">Título do Card</Label>
                                            <Input
                                                value={newCard.titulo}
                                                onChange={(e) => setNewCard({ ...newCard, titulo: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white h-11"
                                                placeholder={newCard.tipo === 'funcionario_destaque' ? 'Ex: Destaque do Mês' : newCard.tipo === 'aniversariantes' ? 'Ex: Aniversariantes de Fevereiro' : 'Ex: Campanha Setembro Amarelo'}
                                            />
                                        </div>

                                        {newCard.tipo === 'funcionario_destaque' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-white/70 text-sm">Nome do Funcionário</Label>
                                                    <div className="relative">
                                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                        <Input
                                                            value={newCard.nome_funcionario}
                                                            onChange={(e) => setNewCard({ ...newCard, nome_funcionario: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white pl-10 h-11"
                                                            placeholder="Ex: João Silva"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-white/70 text-sm">Setor</Label>
                                                    <Input
                                                        value={newCard.setor}
                                                        onChange={(e) => setNewCard({ ...newCard, setor: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white h-11"
                                                        placeholder="Ex: Logística"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-2">
                                            <Label className="text-white/70 text-sm">Descrição</Label>
                                            <Textarea
                                                value={newCard.descricao}
                                                onChange={(e) => setNewCard({ ...newCard, descricao: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none"
                                                placeholder="Descreva os detalhes do card..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">URL da Imagem</Label>
                                                <div className="relative">
                                                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <Input
                                                        value={newCard.imagem_url}
                                                        onChange={(e) => setNewCard({ ...newCard, imagem_url: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white pl-10 h-11"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">Mês de Referência</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <Input
                                                        value={newCard.mes_referencia}
                                                        onChange={(e) => setNewCard({ ...newCard, mes_referencia: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white pl-10 h-11"
                                                        placeholder="Ex: Janeiro 2025"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {newCard.tipo === 'campanha' && (
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">Cor de Destaque</Label>
                                                <Select
                                                    value={newCard.cor_destaque}
                                                    onValueChange={(value) => setNewCard({ ...newCard, cor_destaque: value })}
                                                >
                                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                                                        <SelectValue placeholder="Selecione uma cor" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
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
                                                <Label className="text-white/70 text-sm">Ordem de Exibição</Label>
                                                <Input
                                                    type="number"
                                                    value={newCard.ordem}
                                                    onChange={(e) => setNewCard({ ...newCard, ordem: parseInt(e.target.value) || 0 })}
                                                    className="bg-white/5 border-white/10 text-white h-11"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white/70 text-sm">Status</Label>
                                                <div className="flex items-center h-11 px-3 bg-white/5 border border-white/10 rounded-lg">
                                                    <Switch
                                                        id="card-ativo"
                                                        checked={newCard.ativo}
                                                        onCheckedChange={(checked) => setNewCard({ ...newCard, ativo: checked })}
                                                        className="data-[state=checked]:bg-green-500"
                                                    />
                                                    <Label htmlFor="card-ativo" className="ml-3 text-white/70 text-sm">
                                                        {newCard.ativo ? 'Ativo' : 'Inativo'}
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-white/10" />

                                        <Button
                                            onClick={() => createCardMutation.mutate(newCard)}
                                            disabled={!newCard.titulo}
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold h-12 rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {createCardMutation.isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-green-500" />
                                            Cards do Mural
                                        </h2>
                                        <p className="text-sm text-white/40 mt-1">
                                            Gerencie os cards em destaque
                                        </p>
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                                        Total: {cardsMural.length}
                                    </Badge>
                                </div>

                                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingCards ? (
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
                                            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-white/50">Carregando cards...</p>
                                        </div>
                                    ) : cardsMural.length === 0 ? (
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
                                            <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                            <p className="text-white/50 mb-2">Nenhum card cadastrado</p>
                                            <p className="text-sm text-white/30">Crie seu primeiro card ao lado</p>
                                        </div>
                                    ) : (
                                        cardsMural.map((card, index) => {
                                            const Icon = tipoIcons[card.tipo] || Star;
                                            const colorClass = tipoColors[card.tipo] || 'text-green-500 bg-green-500/10';
                                            return (
                                                <motion.div
                                                    key={card.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Card className="bg-[#1a1a1a] border-white/10 hover:border-green-500/30 transition-all overflow-hidden group">
                                                        <CardContent className="p-0">
                                                            {editingCard?.id === card.id ? (
                                                                <div className="p-6 space-y-4">
                                                                    <h4 className="text-white font-semibold flex items-center gap-2">
                                                                        <Edit className="w-4 h-4 text-green-500" />
                                                                        Editando Card
                                                                    </h4>
                                                                    <Input
                                                                        value={editingCard.titulo}
                                                                        onChange={(e) => setEditingCard({ ...editingCard, titulo: e.target.value })}
                                                                        className="bg-white/5 border-white/10 text-white"
                                                                        placeholder="Título"
                                                                    />
                                                                    <Textarea
                                                                        value={editingCard.descricao}
                                                                        onChange={(e) => setEditingCard({ ...editingCard, descricao: e.target.value })}
                                                                        className="bg-white/5 border-white/10 text-white"
                                                                        placeholder="Descrição"
                                                                    />
                                                                    
                                                                    {editingCard.tipo === 'funcionario_destaque' && (
                                                                        <>
                                                                            <Input
                                                                                value={editingCard.nome_funcionario}
                                                                                onChange={(e) => setEditingCard({ ...editingCard, nome_funcionario: e.target.value })}
                                                                                className="bg-white/5 border-white/10 text-white"
                                                                                placeholder="Nome do Funcionário"
                                                                            />
                                                                            <Input
                                                                                value={editingCard.setor}
                                                                                onChange={(e) => setEditingCard({ ...editingCard, setor: e.target.value })}
                                                                                className="bg-white/5 border-white/10 text-white"
                                                                                placeholder="Setor"
                                                                            />
                                                                        </>
                                                                    )}

                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <Label className="text-white/70 text-sm">Ordem:</Label>
                                                                            <Input
                                                                                type="number"
                                                                                value={editingCard.ordem}
                                                                                onChange={(e) => setEditingCard({ ...editingCard, ordem: parseInt(e.target.value) || 0 })}
                                                                                className="bg-white/5 border-white/10 text-white w-20 h-9"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Switch
                                                                                id={`edit-ativo-${card.id}`}
                                                                                checked={editingCard.ativo}
                                                                                onCheckedChange={(checked) => setEditingCard({ ...editingCard, ativo: checked })}
                                                                                className="data-[state=checked]:bg-green-500"
                                                                            />
                                                                            <Label htmlFor={`edit-ativo-${card.id}`} className="text-white/70 text-sm">
                                                                                Ativo
                                                                            </Label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex gap-2 pt-2">
                                                                        <Button
                                                                            onClick={() => updateCardMutation.mutate({ id: card.id, data: editingCard })}
                                                                            className="bg-green-500 hover:bg-green-600 text-black"
                                                                            size="sm"
                                                                        >
                                                                            <Save className="w-4 h-4 mr-1" />
                                                                            Salvar
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => setEditingCard(null)}
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="border-white/10 text-white hover:bg-white/5"
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
                                                                                    <h4 className="text-white font-semibold text-lg mb-1">
                                                                                        {card.titulo}
                                                                                    </h4>
                                                                                    {card.nome_funcionario && (
                                                                                        <p className="text-green-500 font-medium text-sm">
                                                                                            {card.nome_funcionario}
                                                                                        </p>
                                                                                    )}
                                                                                    {card.setor && (
                                                                                        <p className="text-white/40 text-sm">
                                                                                            {card.setor}
                                                                                        </p>
                                                                                    )}
                                                                                    <p className="text-white/50 text-sm mt-2 line-clamp-2">
                                                                                        {card.descricao}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                                                        <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                                                                                            {card.tipo.replace('_', ' ')}
                                                                                        </Badge>
                                                                                        {card.mes_referencia && (
                                                                                            <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                                                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                                                {card.mes_referencia}
                                                                                            </Badge>
                                                                                        )}
                                                                                        <Badge className={card.ativo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                                                                            {card.ativo ? 'Ativo' : 'Inativo'}
                                                                                        </Badge>
                                                                                        <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                                                                                            Ordem: {card.ordem}
                                                                                        </Badge>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center gap-1 ml-4">
                                                                                    <Button
                                                                                        onClick={() => setEditingCard(card)}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="text-white/50 hover:text-white hover:bg-white/5"
                                                                                    >
                                                                                        <Edit className="w-4 h-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => deleteCardMutation.mutate(card.id)}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
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

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}