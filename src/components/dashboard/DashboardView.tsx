import React from 'react';
import { UnidadeComDetalhes, Materia } from '@/lib/types';
import { CardUnidadeAtiva } from './CardUnidadeAtiva';
import { EstadoVazio } from '../common/EstadoVazio';
import { LayoutDashboard, BookOpen, CheckCircle2, Clock, Calendar, ArrowRight, Layers } from 'lucide-react';

interface DashboardViewProps {
  unidadesAtivas: UnidadeComDetalhes[];
  materias: Materia[];
  totalAtividadesPendentes: number;
  totalAtividadesConcluidas: number;
  dataFiltro: string;
  aoMudarDataFiltro: (novaData: string) => void;
  aoSelecionarFoco: (unidadeId: string) => void;
  aoNavegarParaSetup: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  unidadesAtivas,
  materias,
  totalAtividadesPendentes,
  totalAtividadesConcluidas,
  dataFiltro,
  aoMudarDataFiltro,
  aoSelecionarFoco,
  aoNavegarParaSetup
}) => {
  return (
    <div className="space-y-8 animate-sleek-in">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            Visão Geral de Estudos
            <LayoutDashboard className="w-6 h-6 text-[#3B82F6]" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Acompanhe o andamento do seu semestre acadêmico e suas unidades ativas hoje.
          </p>
        </div>

        {/* Seletor de Data */}
        <div className="flex items-center space-x-2 bg-[#111827] p-2 rounded-xl border border-[#1E293B]">
          <Calendar className="w-4 h-4 text-[#3B82F6] ml-1" />
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Data de Referência:</span>
          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => aoMudarDataFiltro(e.target.value)}
            className="bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Grid de Métricas Resumidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="sleek-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Disciplinas Ativas</p>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mt-1 font-mono">{materias.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="sleek-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Unidades no Período</p>
            <h3 className="text-2xl font-bold text-[#3B82F6] mt-1 font-mono">{unidadesAtivas.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="sleek-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Tarefas Pendentes</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">{totalAtividadesPendentes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="sleek-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Tarefas Concluídas</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{totalAtividadesConcluidas}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Seção de Unidades Ativas */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Unidades em Andamento</h2>
            <p className="text-xs text-slate-400">Unidades acadêmicas vigentes na data selecionada.</p>
          </div>
        </div>

        {unidadesAtivas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unidadesAtivas.map((uni) => (
              <CardUnidadeAtiva
                key={uni.id}
                unidade={uni}
                aoSelecionarFoco={aoSelecionarFoco}
              />
            ))}
          </div>
        ) : (
          <EstadoVazio
            icone={Layers}
            titulo="Nenhuma unidade ativa nesta data"
            descricao="Você não possui unidades com período vigente para a data selecionada. Altere a data no topo ou cadastre novas matérias."
            textoBotao="Ir para Setup de Matérias"
            aoClicarBotao={aoNavegarParaSetup}
          />
        )}
      </div>
    </div>
  );
};
