import React from 'react';
import { MetaEstudoDiario, MateriaAgendadaDiaria } from '@/lib/types';
import { BookOpen, Layers, ArrowRight, Clock } from 'lucide-react';

interface CardDiaCronogramaProps {
  metaDia: MetaEstudoDiario;
  aoSelecionarFoco?: (unidadeId: string) => void;
}

export const CardDiaCronograma: React.FC<CardDiaCronogramaProps> = ({
  metaDia,
  aoSelecionarFoco
}) => {
  const formatarDataBR = (dStr: string) => {
    if (!dStr) return '';
    const [ano, mes, dia] = dStr.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <div
      className={`card-tetris p-4 space-y-3 transition-all ${
        metaDia.isHoje
          ? 'card-tetris-cyan border-2 border-[#06B6D4] bg-[#0A1628]'
          : 'border-[#1E293B] bg-[#0F172A]'
      }`}
    >
      {/* Cabeçalho do Dia */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center space-x-2">
          <span
            className={`font-black text-sm font-mono uppercase ${
              metaDia.isHoje ? 'text-[#06B6D4]' : 'text-slate-200'
            }`}
          >
            {metaDia.diaSemanaNome}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {formatarDataBR(metaDia.data)}
          </span>
        </div>

        {metaDia.isHoje && (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold badge-tetris-cyan">
            HOJE
          </span>
        )}
      </div>

      {/* Lista de Matérias Agendadas do Dia */}
      {metaDia.materiasAgendadas && metaDia.materiasAgendadas.length > 0 ? (
        <div className="space-y-2.5">
          {metaDia.materiasAgendadas.map((mat) => (
            <div
              key={mat.materiaId}
              onClick={() => aoSelecionarFoco && aoSelecionarFoco(mat.unidadeId)}
              className="p-3 rounded-xl border border-[#1E293B] bg-[#0B1120] hover:border-[#06B6D4] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center space-x-1.5 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-[#06B6D4] flex-shrink-0" />
                  <span className="font-bold text-xs text-white group-hover:text-[#22D3EE] transition-colors truncate">
                    {mat.materiaNome}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#06B6D4] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </div>

              {mat.unidadeTitulo && (
                <p className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span>{mat.unidadeTitulo}</span>
                </p>
              )}

              {mat.totalItensPendentes > 0 && (
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#06B6D4] bg-[#0F172A] px-2 py-0.5 rounded border border-[#1E293B]">
                  <span>{mat.totalItensPendentes} conteúdo(s)</span>
                  <span>Acessar Foco →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-500 text-xs font-mono italic">
          Dia Livre / Sem matéria agendada.
        </div>
      )}
    </div>
  );
};
