import React from 'react';
import { UnidadeComDetalhes } from '@/lib/types';
import { BarraProgresso } from '../common/BarraProgresso';
import { Video, CheckSquare, ArrowRight, Clock, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CardUnidadeAtivaProps {
  unidade: UnidadeComDetalhes;
  aoSelecionarFoco: (unidadeId: string) => void;
}

export const CardUnidadeAtiva: React.FC<CardUnidadeAtivaProps> = ({
  unidade,
  aoSelecionarFoco
}) => {
  const percentual = unidade.percentualConclusao;

  const formatarData = (dStr: string) => {
    if (!dStr) return '';
    const [ano, mes, dia] = dStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const renderStatusColorBadge = () => {
    if (unidade.statusCor === 'verde' || unidade.concluida) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/70 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>100%</span>
        </span>
      );
    }
    if (unidade.statusCor === 'amarelo') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-950/70 text-amber-300 border border-amber-800/70 flex items-center gap-1.5 shadow-sm">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>{percentual}%</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-950/70 text-red-400 border border-red-800/70 flex items-center gap-1.5 shadow-sm">
        <AlertCircle className="w-3 h-3 text-red-400" />
        <span>{percentual}%</span>
      </span>
    );
  };

  return (
    <div className="card-tetris card-tetris-cyan p-6 flex flex-col justify-between space-y-5 bg-[#0F172A] border-[#1E293B] hover:border-[#06B6D4]/50 group transition-all duration-200">
      <div className="space-y-3">
        {/* Cabeçalho com Matéria e Badge de Status por Cor */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold badge-tetris-cyan uppercase tracking-wider truncate">
            {unidade.materiaNome}
          </span>
          {renderStatusColorBadge()}
        </div>

        {/* Título da Unidade */}
        <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#22D3EE] transition-colors leading-snug">
          {unidade.titulo}
        </h3>

        {/* Período de Vigência */}
        <div className="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono bg-[#0B1120] px-3 py-1.5 rounded-lg border border-[#1E293B] w-fit">
          <Clock className="w-3.5 h-3.5 text-[#22D3EE] flex-shrink-0" />
          <span>
            {formatarData(unidade.dataInicio)} — {formatarData(unidade.dataFim)}
          </span>
        </div>
      </div>

      {/* Métricas e Barra de Progresso Combinada */}
      <div className="space-y-4 pt-3 border-t border-[#1E293B]">
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-[#0B1120] p-2.5 rounded-xl border border-[#1E293B]">
            <Video className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-[#94A3B8]">Vídeos/Leituras</p>
              <p className="font-bold text-slate-200">
                {unidade.videosAssistidos}/{unidade.totalVideos}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-[#0B1120] p-2.5 rounded-xl border border-[#1E293B]">
            <CheckSquare className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-[#94A3B8]">Tarefas</p>
              <p className="font-bold text-slate-200">
                {unidade.atividadesConcluidas}/{unidade.totalAtividades}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Progresso Matricial em Blocos */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#94A3B8]">Progresso Acumulado</span>
            <span className="font-bold text-[#22D3EE]">{percentual}%</span>
          </div>
          <BarraProgresso progresso={percentual} mostraTexto={false} tamanho="md" />
        </div>

        {/* Botão para Acessar a Área de Foco */}
        <button
          onClick={() => aoSelecionarFoco(unidade.id)}
          className="w-full btn-tetris-primary py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 cursor-pointer mt-2"
        >
          <span>Abrir na Área de Foco</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
