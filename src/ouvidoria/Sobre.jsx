import { useEffect, useState } from 'react'
import { getConfiguracaoOuvidoria } from '@/api/ouvidoriaApi'

export default function Sobre() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    getConfiguracaoOuvidoria().then(setConfig)
  }, [])

  if (!config) {
    return <p className="text-center py-20">Carregando...</p>
  }

  return (
    <div className="max-w-3xl mx-auto py-20 space-y-4">
      <h1 className="text-2xl font-bold">Sobre a Ouvidoria</h1>

      <p>{config.descricao}</p>

      <p><b>Prazo de resposta:</b> {config.prazoResposta} dias</p>
      <p><b>Email:</b> {config.emailContato}</p>
    </div>
  )
}
