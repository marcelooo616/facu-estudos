import React from 'react';

interface BarraProgressoProps {
  progresso: number; // 0 a 100
  mostraTexto?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
}

export const BarraProgresso: React.FC<BarraProgressoProps> = ({
  progresso,
  mostraTexto = true,
  tamanho = 'md'
}) => {
  const progressoLimpo = Math.min(100, Math.max(0, Math.round(progresso)));
  const totalBlocos = 10;
  const blocosAtivos = Math.round((progressoLimpo / 100) * totalBlocos);

  const obterClasseCorBloco = (idx: number) => {
    if (idx >= blocosAtivos) return '';
    if (progressoLimpo >= 100) return 'active-green';
    if (progressoLimpo >= 50) return 'active-yellow';
    return 'active-cyan';
  };

  return (
    <div className="space-y-1.5 w-full">
      {mostraTexto && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Progresso</span>
          <span className="font-bold text-[#06B6D4]">{progressoLimpo}%</span>
        </div>
      )}

      {/* Matriz de Blocos estilo Tetris Row */}
      <div className={`tetris-block-grid ${tamanho === 'sm' ? 'h-2' : tamanho === 'lg' ? 'h-3.5' : 'h-2.5'}`}>
        {Array.from({ length: totalBlocos }).map((_, idx) => (
          <div
            key={idx}
            className={`tetris-block-cell ${obterClasseCorBloco(idx)}`}
            title={`${progressoLimpo}% Concluído`}
          />
        ))}
      </div>
    </div>
  );
};
