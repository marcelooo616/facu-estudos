import React from 'react';
import { UnidadeComDetalhes } from '@/lib/types';
import { BarraProgresso } from '../common/BarraProgresso';
import { Calendar, Video, CheckSquare, ArrowRight, Clock } from 'lucide-react';

interface CardUnidadeAtivaProps {
  unidade: UnidadeComDetalhes;
  aoSelecionarFoco: (unidadeId: string) => void;
}

export const CardUnidadeAtiva: React.FC<CardUnidadeAtivaProps> = ({
  unidade,
  aoSelecionarFoco
}) => {
  const percentualConclusao =
    unidade.totalAtividades > 0
      ? Math.round((unidade.atividadesConcluidas / unidade.totalAtividades) * 100)
      : 0;

  const formatarData = (dStr: string) => {
    const [ano, mes, dia] = dStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="sleek-card p-6 flex flex-col justify-between space-y-5 border-[#1E293B] hover:border-[#3B82F6]/60 group">
      <div>
        {/* Cabeçalho da Matéria e Semestre */}
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="px-2.5 py-0.5 rounded-full badge-sleek-blue font-semibold uppercase tracking-wide">
            {unidade.materiaNome}
          </span>
          <span className="text-slate-400 bg-[#0F172A] px-2 py-0.5 rounded border border-[#1E293B]">
            {unidade.materiaSemestre}
          </span>
        </div>

        {/* Título da Unidade */}
        <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#3B82F6] transition-colors mt-2">
          {unidade.titulo}
        </h3>

        {/* Período / Prazos */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono mt-2">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>
            {formatarData(unidade.dataInicio)} — {formatarData(unidade.dataFim)}
          </span>
        </div>
      </div>

      {/* Métricas e Progresso */}
      <div className="space-y-4 pt-3 border-t border-[#1E293B]/70">
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B]">
            <Video className="w-4 h-4 text-[#3B82F6]" />
            <div>
              <p className="text-[10px] text-slate-400">Vídeos</p>
              <p className="font-bold text-slate-200">{unidade.totalVideos} aula(s)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B]">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400">Tarefas</p>
              <p className="font-bold text-slate-200">
                {unidade.atividadesConcluidas}/{unidade.totalAtividades}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Progresso da Unidade</span>
            <span className="font-bold text-[#3B82F6]">{percentualConclusao}%</span>
          </div>
          <BarraProgresso progresso={percentualConclusao} mostraTexto={false} tamanho="md" />
        </div>

        {/* Botão Entrar na Área de Foco */}
        <button
          onClick={() => aoSelecionarFoco(unidade.id)}
          className="w-full btn-sleek-primary py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 cursor-pointer mt-2"
        >
          <span>Abrir na Área de Foco</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
