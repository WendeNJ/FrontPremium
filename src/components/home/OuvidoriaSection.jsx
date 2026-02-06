import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function OuvidoriaSection() {
  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Canal de Ouvidoria</h2>
        <p className="mb-8 text-white/70">
          Registre reclamações, elogios ou denúncias de forma segura e confidencial
        </p>
        <Link to="/ouvidoria">
          <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 text-base rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2">
            Acessar Ouvidoria
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </section>
  );
}