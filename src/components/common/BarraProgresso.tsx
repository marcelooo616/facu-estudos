import React from 'react';

interface BarraProgressoProps {
  progresso: number;
  mostraTexto?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BarraProgresso: React.FC<BarraProgressoProps> = ({
  progresso,
  mostraTexto = true,
  tamanho = 'md',
  className = ''
}) => {
  const valorFormatado = Math.min(100, Math.max(0, Math.round(progresso || 0)));

  const altureClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[tamanho];

  return (
    <div className={`w-full ${className}`}>
      {mostraTexto && (
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-mono">
          <span>Progresso</span>
          <span className="text-[#3B82F6] font-semibold">{valorFormatado}%</span>
        </div>
      )}
      <div className={`w-full bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B] ${altureClass}`}>
        <div
          className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${valorFormatado}%` }}
        />
      </div>
    </div>
  );
};
