import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, Users, Clock } from 'lucide-react'
import { estatisticasAPI } from '@/api/ouvidoriaApi'

export default function DashboardStats() {
    const [stats, setStats] = useState({
        manifestacoesRecebidas: 0,
        taxaResolucao: 0,
        cidadaosAtendidos: 0,
        tempoMedioResposta: 0,
    })
    const [loading, setLoading] = useState(true)

    // Buscar estatísticas
    const fetchStats = async () => {
        try {
            const data = await estatisticasAPI.get()
            setStats(data)
            setLoading(false)
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            setLoading(false)
        }
    }

    // Buscar ao montar e atualizar a cada 30 segundos
    useEffect(() => {
        fetchStats()
        const interval = setInterval(fetchStats, 30000) // 30 segundos
        return () => clearInterval(interval)
    }, [])

    // Formatar número com separadores de milhar
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        }
        if (num >= 1000) {
            return num.toLocaleString('pt-BR')
        }
        return num
    }

    const cards = [
        {
            icon: MessageSquare,
            value: formatNumber(stats.manifestacoesRecebidas),
            label: 'Manifestações recebidas',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: CheckCircle,
            value: `${stats.taxaResolucao}%`,
            label: 'Taxa de resolução',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            icon: Users,
            value: formatNumber(stats.cidadaosAtendidos),
            label: 'Cidadãos atendidos',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            icon: Clock,
            value: `${stats.tempoMedioResposta} dias`,
            label: 'Tempo médio de resposta',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-100 rounded-2xl p-6 animate-pulse"
                    >
                        <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <card.icon className={`${card.color} w-6 h-6`} />
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {card.value}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        {card.label}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}