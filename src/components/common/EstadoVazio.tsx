import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EstadoVazioProps {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  textoBotao?: string;
  aoClicarBotao?: () => void;
}

export const EstadoVazio: React.FC<EstadoVazioProps> = ({
  icone: Icone,
  titulo,
  descricao,
  textoBotao,
  aoClicarBotao
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center sleek-card border-dashed border-[#1E293B] my-4 animate-sleek-in">
      <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center mb-4 text-[#3B82F6]">
        <Icone className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{titulo}</h3>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{descricao}</p>
      {textoBotao && aoClicarBotao && (
        <button
          onClick={aoClicarBotao}
          className="btn-sleek-primary px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          {textoBotao}
        </button>
      )}
    </div>
  );
};
