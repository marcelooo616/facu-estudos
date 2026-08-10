import React from 'react';
import { UnidadeComDetalhes, Materia, Unidade, Video, Atividade } from '@/lib/types';
import { CardUnidadeAtiva } from './CardUnidadeAtiva';
import { EstadoVazio } from '../common/EstadoVazio';
import { Zap, BookOpen, Layers, Video as VideoIcon, CheckSquare, Plus, Trophy, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  unidadesAtivas: UnidadeComDetalhes[];
  materias: Materia[];
  unidades: Unidade[];
  videos: Video[];
  atividades: Atividade[];
  aoSelecionarFoco: (unidadeId: string) => void;
  aoNavegarParaSetup: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  unidadesAtivas,
  materias,
  unidades,
  videos,
  atividades,
  aoSelecionarFoco,
  aoNavegarParaSetup
}) => {
  const totalVideosAssistidos = videos.filter((v) => v.assistido).length;
  const totalAtividadesConcluidas = atividades.filter((a) => a.concluida).length;

  return (
    <div className="space-y-8 animate-tetris-drop max-w-7xl mx-auto">
      {/* Card Hero de Boas-Vindas — Design Fluido e Ergonômico */}
      <div className="card-tetris card-tetris-purple p-7 sm:p-8 relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#131C31] to-[#1E1B4B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full badge-tetris-purple font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>PAINEL ACADÊMICO UNIFICADO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight leading-snug font-sans">
              Visão Geral dos Seus Estudos
            </h1>
            <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
              Gerencie suas disciplinas, acompanhe o percentual acumulado de cada unidade e acesse rapidamente o material de estudos da semana.
            </p>
          </div>

          <button
            onClick={aoNavegarParaSetup}
            className="btn-tetris-purple flex items-center justify-center space-x-2 px-5 py-3 text-xs font-semibold rounded-xl cursor-pointer self-start md:self-auto shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Gerenciar Matérias</span>
          </button>
        </div>
      </div>

      {/* Grid de 4 Indicadores Limpos (Stat Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Disciplinas */}
        <div className="card-tetris card-tetris-cyan p-5 bg-[#0F172A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Disciplinas</span>
            <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#22D3EE]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black font-mono text-white">{materias.length}</p>
            <p className="text-[11px] font-mono text-[#22D3EE] mt-1 font-medium">Cadastradas no semestre</p>
          </div>
        </div>

        {/* Stat 2: Unidades Ativas */}
        <div className="card-tetris card-tetris-yellow p-5 bg-[#0F172A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Unidades Ativas</span>
            <div className="w-8 h-8 rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black font-mono text-white">{unidadesAtivas.length}</p>
            <p className="text-[11px] font-mono text-[#FACC15] mt-1 font-medium">Em vigência hoje</p>
          </div>
        </div>

        {/* Stat 3: Aulas e Leituras */}
        <div className="card-tetris p-5 bg-[#0F172A] border-blue-900/40 hover:border-blue-500/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Aulas / Leituras</span>
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#60A5FA]">
              <VideoIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black font-mono text-white">
              {totalVideosAssistidos} <span className="text-sm font-normal text-[#94A3B8]">/ {videos.length}</span>
            </p>
            <p className="text-[11px] font-mono text-[#60A5FA] mt-1 font-medium">Conteúdos assistidos</p>
          </div>
        </div>

        {/* Stat 4: Tarefas Entregues */}
        <div className="card-tetris p-5 bg-[#0F172A] border-emerald-900/40 hover:border-emerald-500/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Tarefas Entregues</span>
            <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#4ADE80]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black font-mono text-white">
              {totalAtividadesConcluidas} <span className="text-sm font-normal text-[#94A3B8]">/ {atividades.length}</span>
            </p>
            <p className="text-[11px] font-mono text-[#4ADE80] mt-1 font-medium">Checklists concluídos</p>
          </div>
        </div>
      </div>

      {/* Seção de Unidades em Vigência Nesta Semana */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center text-[#22D3EE]">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">
              Unidades em Vigência Nesta Semana
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#1E293B] text-[#94A3B8]">
            {unidadesAtivas.length} unidade(s) ativa(s)
          </span>
        </div>

        {unidadesAtivas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unidadesAtivas.map((unidade) => (
              <CardUnidadeAtiva
                key={unidade.id}
                unidade={unidade}
                aoSelecionarFoco={aoSelecionarFoco}
              />
            ))}
          </div>
        ) : (
          <EstadoVazio
            icone={Layers}
            titulo="Nenhuma unidade ativa nesta semana"
            descricao="Adicione matérias e defina o período das unidades para ter acesso direto ao painel de foco."
            textoBotao="Configurar Matérias e Unidades"
            aoClicarBotao={aoNavegarParaSetup}
          />
        )}
      </div>
    </div>
  );
};
