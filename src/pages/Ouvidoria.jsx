import { Routes, Route } from 'react-router-dom'

import OuvidoriaHome from '../ouvidoria'
import NovaManifestacao from '../ouvidoria/NovaManifestacao'
import Consultar from '../ouvidoria/Consultar'
import Sobre from '../ouvidoria/Sobre'
import AdminOuvidoria from './AdminOuvidoria'

export default function Ouvidoria() {
  return (
    <Routes>
      <Route index element={<OuvidoriaHome />} />
      <Route path="nova" element={<NovaManifestacao />} />
      <Route path="consultar" element={<Consultar />} />
      <Route path="sobre" element={<Sobre />} />
      <Route path="admin" element={<AdminOuvidoria />} />
    </Routes>
  )
}
