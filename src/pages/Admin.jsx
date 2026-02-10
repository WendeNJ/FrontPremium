import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
    Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cardMuralAPI, noticiasAPI, usersAPI } from '@/api/ouvidoriaApi'; // 🔥 MUDOU AQUI

export default function Admin() {
    const queryClient = useQueryClient();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [editingNoticia, setEditingNoticia] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [newNoticia, setNewNoticia] = useState({ 
        titulo: '', 
        resumo: '', 
        conteudo: '', 
        imagem_url: '', 
        data_publicacao: '', 
        ativo: true 
    });
    const [newCard, setNewCard] = useState({ 
        tipo: 'funcionario_destaque', 
        titulo: '', 
        descricao: '', 
        imagem_url: '', 
        setor: '', 
        nome_funcionario: '', 
        mes_referencia: '', 
        cor_destaque: '', 
        ativo: true, 
        ordem: 0 
    });
    const [accessCount, setAccessCount] = useState(0);

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
                data_publicacao: '', 
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
                mes_referencia: '', 
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

    // ============================================
    // 📌 TELA DE LOGIN
    // ============================================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-[#111111] border border-white/10 rounded-3xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <Settings className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
                            <p className="text-white/50 mt-2">Digite suas credenciais para acessar</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label className="text-white/70">Usuário</Label>
                                <Input
                                    value={loginUser}
                                    onChange={(e) => setLoginUser(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="Digite o usuário"
                                />
                            </div>
                            <div>
                                <Label className="text-white/70">Senha</Label>
                                <Input
                                    type="password"
                                    value={loginPass}
                                    onChange={(e) => setLoginPass(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="Digite a senha"
                                />
                            </div>
                            {loginError && (
                                <p className="text-red-500 text-sm text-center">{loginError}</p>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
                            >
                                Entrar
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to={createPageUrl('Home')}
                                className="text-white/50 hover:text-white text-sm flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar ao site
                            </Link>
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
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to={createPageUrl('Home')}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
                            <p className="text-white/50">Gerencie o conteúdo do mural</p>
                            <div className="flex items-center gap-2 text-xs text-green-500/50 mt-2">
                                <Eye className="w-3 h-3" />
                                <span>{accessCount} acessos</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="noticias" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 mb-8">
                        <TabsTrigger value="noticias" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                            <Newspaper className="w-4 h-4 mr-2" />
                            Notícias
                        </TabsTrigger>
                        <TabsTrigger value="cards" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                            <Star className="w-4 h-4 mr-2" />
                            Cards do Mural
                        </TabsTrigger>
                    </TabsList>

                    {/* ========== TAB NOTÍCIAS ========== */}
                    <TabsContent value="noticias">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Formulário Nova Notícia */}
                            <Card className="bg-[#111111] border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-500" />
                                        Nova Notícia
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-white/70">Título</Label>
                                        <Input
                                            value={newNoticia.titulo}
                                            onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="Título da notícia"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/70">Resumo</Label>
                                        <Textarea
                                            value={newNoticia.resumo}
                                            onChange={(e) => setNewNoticia({ ...newNoticia, resumo: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="Resumo breve da notícia"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/70">URL da Imagem</Label>
                                        <Input
                                            value={newNoticia.imagem_url}
                                            onChange={(e) => setNewNoticia({ ...newNoticia, imagem_url: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/70">Data de Publicação</Label>
                                        <Input
                                            type="date"
                                            value={newNoticia.data_publicacao}
                                            onChange={(e) => setNewNoticia({ ...newNoticia, data_publicacao: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => createNoticiaMutation.mutate(newNoticia)}
                                        disabled={!newNoticia.titulo || !newNoticia.resumo}
                                        className="w-full bg-green-500 hover:bg-green-600 text-black"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Notícia
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Lista de Notícias */}
                            <div className="space-y-4">
                                <h3 className="text-white font-semibold">Notícias Cadastradas</h3>
                                {loadingNoticias ? (
                                    <p className="text-white/40 text-center py-8">Carregando...</p>
                                ) : noticias.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">Nenhuma notícia cadastrada</p>
                                ) : (
                                    noticias.map((noticia) => (
                                        <Card key={noticia.id} className="bg-[#111111] border-white/10">
                                            <CardContent className="p-4">
                                                {editingNoticia?.id === noticia.id ? (
                                                    <div className="space-y-3">
                                                        <Input
                                                            value={editingNoticia.titulo}
                                                            onChange={(e) => setEditingNoticia({ ...editingNoticia, titulo: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                        />
                                                        <Textarea
                                                            value={editingNoticia.resumo}
                                                            onChange={(e) => setEditingNoticia({ ...editingNoticia, resumo: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => updateNoticiaMutation.mutate({ id: noticia.id, data: editingNoticia })}
                                                                className="bg-green-500 hover:bg-green-600 text-black"
                                                                size="sm"
                                                            >
                                                                <Save className="w-4 h-4 mr-1" />
                                                                Salvar
                                                            </Button>
                                                            <Button
                                                                onClick={() => setEditingNoticia(null)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-white/10 text-white"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-medium">{noticia.titulo}</h4>
                                                            <p className="text-white/50 text-sm line-clamp-2">{noticia.resumo}</p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <span className="text-xs text-white/40">{noticia.data_publicacao}</span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${noticia.ativo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                                    {noticia.ativo ? 'Ativo' : 'Inativo'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <Button
                                                                onClick={() => setEditingNoticia(noticia)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-white/50 hover:text-white"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => deleteNoticiaMutation.mutate(noticia.id)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ========== TAB CARDS MURAL ========== */}
                    <TabsContent value="cards">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Formulário Novo Card */}
                            <Card className="bg-[#111111] border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-500" />
                                        Novo Card
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-white/70">Tipo</Label>
                                        <Select
                                            value={newCard.tipo}
                                            onValueChange={(value) => setNewCard({ ...newCard, tipo: value })}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="funcionario_destaque">Funcionário Destaque</SelectItem>
                                                <SelectItem value="aniversariantes">Aniversariantes</SelectItem>
                                                <SelectItem value="campanha">Campanha</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-white/70">Título</Label>
                                        <Input
                                            value={newCard.titulo}
                                            onChange={(e) => setNewCard({ ...newCard, titulo: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="Ex: Destaque de Janeiro, Setembro Amarelo..."
                                        />
                                    </div>
                                    {newCard.tipo === 'funcionario_destaque' && (
                                        <>
                                            <div>
                                                <Label className="text-white/70">Nome do Funcionário</Label>
                                                <Input
                                                    value={newCard.nome_funcionario}
                                                    onChange={(e) => setNewCard({ ...newCard, nome_funcionario: e.target.value })}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-white/70">Setor</Label>
                                                <Input
                                                    value={newCard.setor}
                                                    onChange={(e) => setNewCard({ ...newCard, setor: e.target.value })}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <Label className="text-white/70">Descrição</Label>
                                        <Textarea
                                            value={newCard.descricao}
                                            onChange={(e) => setNewCard({ ...newCard, descricao: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/70">URL da Imagem</Label>
                                        <Input
                                            value={newCard.imagem_url}
                                            onChange={(e) => setNewCard({ ...newCard, imagem_url: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/70">Mês de Referência</Label>
                                        <Input
                                            value={newCard.mes_referencia}
                                            onChange={(e) => setNewCard({ ...newCard, mes_referencia: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="Ex: Janeiro 2025"
                                        />
                                    </div>
                                    {newCard.tipo === 'campanha' && (
                                        <div>
                                            <Label className="text-white/70">Cor de Destaque</Label>
                                            <Select
                                                value={newCard.cor_destaque}
                                                onValueChange={(value) => setNewCard({ ...newCard, cor_destaque: value })}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                    <SelectValue placeholder="Selecione uma cor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="amarelo">Amarelo (Setembro)</SelectItem>
                                                    <SelectItem value="rosa">Rosa (Outubro)</SelectItem>
                                                    <SelectItem value="azul">Azul (Novembro)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div>
                                        <Label className="text-white/70">Ordem de Exibição</Label>
                                        <Input
                                            type="number"
                                            value={newCard.ordem}
                                            onChange={(e) => setNewCard({ ...newCard, ordem: parseInt(e.target.value) || 0 })}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => createCardMutation.mutate(newCard)}
                                        disabled={!newCard.titulo}
                                        className="w-full bg-green-500 hover:bg-green-600 text-black"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Card
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Lista de Cards */}
                            <div className="space-y-4">
                                <h3 className="text-white font-semibold">Cards Cadastrados</h3>
                                {loadingCards ? (
                                    <p className="text-white/40 text-center py-8">Carregando...</p>
                                ) : cardsMural.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">Nenhum card cadastrado</p>
                                ) : (
                                    cardsMural.map((card) => {
                                        const Icon = tipoIcons[card.tipo] || Star;
                                        return (
                                            <Card key={card.id} className="bg-[#111111] border-white/10">
                                                <CardContent className="p-4">
                                                    {editingCard?.id === card.id ? (
                                                        <div className="space-y-3">
                                                            <h4 className="text-white font-semibold mb-3">Editando Card: {card.titulo}</h4>
                                                            <Input value={editingCard.titulo} onChange={(e) => setEditingCard({ ...editingCard, titulo: e.target.value })} placeholder="Título" className="bg-white/5 border-white/10 text-white" />
                                                            <Textarea value={editingCard.descricao} onChange={(e) => setEditingCard({ ...editingCard, descricao: e.target.value })} placeholder="Descrição" className="bg-white/5 border-white/10 text-white" />
                                                            <Input value={editingCard.imagem_url} onChange={(e) => setEditingCard({ ...editingCard, imagem_url: e.target.value })} placeholder="URL da Imagem" className="bg-white/5 border-white/10 text-white" />
                                                            <Input value={editingCard.mes_referencia} onChange={(e) => setEditingCard({ ...editingCard, mes_referencia: e.target.value })} placeholder="Mês de Referência" className="bg-white/5 border-white/10 text-white" />

                                                            {editingCard.tipo === 'funcionario_destaque' && (
                                                                <>
                                                                    <Input value={editingCard.nome_funcionario} onChange={(e) => setEditingCard({ ...editingCard, nome_funcionario: e.target.value })} placeholder="Nome do Funcionário" className="bg-white/5 border-white/10 text-white" />
                                                                    <Input value={editingCard.setor} onChange={(e) => setEditingCard({ ...editingCard, setor: e.target.value })} placeholder="Setor" className="bg-white/5 border-white/10 text-white" />
                                                                </>
                                                            )}

                                                            <div className="flex gap-2 items-center">
                                                                <Label className="text-white/70">Ordem:</Label>
                                                                <Input type="number" value={editingCard.ordem} onChange={(e) => setEditingCard({ ...editingCard, ordem: parseInt(e.target.value) || 0 })} className="bg-white/5 border-white/10 text-white w-20" />
                                                                <div className="flex items-center space-x-2 ml-auto">
                                                                    <Switch id={`ativo-${card.id}`} checked={editingCard.ativo} onCheckedChange={(checked) => setEditingCard({ ...editingCard, ativo: checked })} />
                                                                    <Label htmlFor={`ativo-${card.id}`} className="text-white/70">Ativo</Label>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2 pt-2">
                                                                <Button onClick={() => updateCardMutation.mutate({ id: card.id, data: editingCard })} className="bg-green-500 hover:bg-green-600 text-black" size="sm">
                                                                    <Save className="w-4 h-4 mr-1" /> Salvar
                                                                </Button>
                                                                <Button onClick={() => setEditingCard(null)} variant="outline" size="sm" className="border-white/10 text-white">
                                                                    <X className="w-4 h-4" /> Cancelar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start gap-3 flex-1">
                                                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                                    <Icon className="w-5 h-5 text-green-500" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-white font-medium">{card.titulo}</h4>
                                                                    {card.nome_funcionario && <p className="text-green-500 text-sm">{card.nome_funcionario}</p>}
                                                                    {card.setor && <p className="text-white/40 text-sm">{card.setor}</p>}
                                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                                        <span className="text-xs text-white/40 capitalize px-2 py-0.5 rounded-full bg-white/5">{card.tipo?.replace('_', ' ')}</span>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${card.ativo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                                            {card.ativo ? 'Ativo' : 'Inativo'}
                                                                        </span>
                                                                        {card.mes_referencia && <span className="text-xs text-white/40">{card.mes_referencia}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Button onClick={() => setEditingCard(card)} variant="ghost" size="icon" className="text-white/50 hover:text-white">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button onClick={() => deleteCardMutation.mutate(card.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}