import React from 'react';
import { Gamepad2, ArrowRight, ShieldCheck, Sparkles, Layers, Calendar, Video, CheckSquare } from 'lucide-react';

interface LandingPageHomeProps {
  aoAbrirLogin: () => void;
  aoAbrirRegistro: () => void;
}

export const LandingPageHome: React.FC<LandingPageHomeProps> = ({
  aoAbrirLogin,
  aoAbrirRegistro
}) => {
  return (
    <div className="space-y-12 py-6 animate-tetris-drop max-w-6xl mx-auto">
      {/* Hero Arcade Section */}
      <div className="card-tetris card-tetris-purple p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full badge-tetris-purple font-mono text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-[#A855F7]" />
            <span>FACU.SPA — TETRIS GEOMETRIC WORKSPACE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-mono">
            Organização Universitária Descomplicada em Blocos Inteligentes
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            Cadastre suas matérias, organize vídeo-aulas, artigos e tarefas por unidade e deixe nosso cronograma inteligente distribuir seu estudo de forma flexível e automatizada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={aoAbrirRegistro}
              className="w-full sm:w-auto btn-tetris-purple py-3.5 px-8 text-sm font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={aoAbrirLogin}
              className="w-full sm:w-auto btn-tetris-secondary py-3.5 px-8 text-sm font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Já Tenho Conta (Entrar)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tetris Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-tetris card-tetris-cyan p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4] flex items-center justify-center text-[#06B6D4]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Unidades & Prazos</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Estruture suas disciplinas em unidades temporais com datas de início e término bem definidas.
          </p>
        </div>

        <div className="card-tetris card-tetris-yellow p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FACC15]/20 border border-[#FACC15] flex items-center justify-center text-[#FACC15]">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Cronograma Flexível</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O algoritmo calcula automaticamente o roteiro diário respeitando o limite de matérias por dia.
          </p>
        </div>

        <div className="card-tetris card-tetris-green p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 border border-[#22C55E] flex items-center justify-center text-[#22C55E]">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Status & Conclusão</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acompanhe o progresso acumulado (vídeos + tarefas) com alertas de status em vermelho, amarelo e verde.
          </p>
        </div>
      </div>
    </div>
  );
};
