// src/components/ui/Header.jsx
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header({ config }) {
  return (
    <header className="bg-[#00703C] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src={config?.logo_url}
            alt={config?.nome_empresa || "Ouvidoria"}
            className="h-12 object-contain"
          />
          <span className="hidden sm:block text-white font-bold">
            SISTEMA DE OUVIDORIA
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/ouvidoria" className="text-white hover:text-green-200">
            Início
          </Link>
          <Link to="/ouvidoria/sobre" className="text-white hover:text-green-200">
            Sobre
          </Link>
          <Link to="/ouvidoria/consultar" className="text-white hover:text-green-200">
            Consultar
          </Link>
        </nav>

        {/* Botões */}
        <div className="hidden md:flex gap-3">
          <Button asChild className="bg-white text-[#00703C] rounded-full">
            <Link to="/ouvidoria/consultar">Acompanhar</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white/80">
            <Link to="/admin/login">Admin</Link>
          </Button>
        </div>

        {/* Mobile */}
        <Menu className="md:hidden text-white" />
      </div>
    </header>
  )
}