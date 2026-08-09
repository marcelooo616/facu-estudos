import React from 'react';
import { Materia, Unidade, Video, Atividade } from '@/lib/types';
import { EstadoVazio } from '../common/EstadoVazio';
import { BarraProgresso } from '../common/BarraProgresso';
import { Calendar, Video as VideoIcon, CheckSquare, ArrowRight, ArrowLeft, Plus, Layers } from 'lucide-react';

interface ListaUnidadesMateriaProps {
  materia: Materia;
  unidades: Unidade[];
  videos: Video[];
  atividades: Atividade[];
  aoVoltarParaMaterias: () => void;
  aoSelecionarUnidade: (unidadeId: string) => void;
  aoAbrirModalNovaUnidade: () => void;
}

export const ListaUnidadesMateria: React.FC<ListaUnidadesMateriaProps> = ({
  materia,
  unidades,
  videos,
  atividades,
  aoVoltarParaMaterias,
  aoSelecionarUnidade,
  aoAbrirModalNovaUnidade
}) => {
  const unidadesDaMateria = unidades.filter((u) => u.materiaId === materia.id);
  const hojeStr = new Date().toISOString().split('T')[0];

  const formatarData = (d: string) => {
    if (!d) return '';
    const [ano, mes, dia] = d.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="space-y-6 animate-sleek-in">
      {/* Navegação Breadcrumb & Botão Voltar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mb-1">
            <button
              onClick={aoVoltarParaMaterias}
              className="hover:text-[#3B82F6] transition-colors cursor-pointer"
            >
              Área de Foco
            </button>
            <span>/</span>
            <span className="text-[#3B82F6] font-semibold">{materia.nome}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Unidades de {materia.nome}
            <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-sleek-blue">
              {materia.semestre}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Selecione uma unidade para acessar vídeo-aulas e a checklist de entregas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={aoVoltarParaMaterias}
            className="btn-sleek-secondary flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Matérias</span>
          </button>

          <button
            onClick={aoAbrirModalNovaUnidade}
            className="btn-sleek-primary flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Unidade Manual</span>
          </button>
        </div>
      </div>

      {/* Lista de Unidades da Matéria */}
      {unidadesDaMateria.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unidadesDaMateria.map((uni) => {
            const vids = videos.filter((v) => v.unidadeId === uni.id);
            const ativs = atividades.filter((a) => a.unidadeId === uni.id);
            const concluidas = ativs.filter((a) => a.concluida).length;
            const percentual = ativs.length > 0 ? (concluidas / ativs.length) * 100 : 0;
            const ativaHoje = uni.dataInicio <= hojeStr && uni.dataFim >= hojeStr;

            return (
              <div
                key={uni.id}
                onClick={() => aoSelecionarUnidade(uni.id)}
                className="sleek-card p-5 cursor-pointer group flex flex-col justify-between hover:border-[#3B82F6] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#3B82F6] transition-colors line-clamp-1">
                      {uni.titulo}
                    </span>
                    {ativaHoje && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold flex-shrink-0">
                        Ativa Hoje
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-zinc-300 mb-4 bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>
                      {formatarData(uni.dataInicio)} — {formatarData(uni.dataFim)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 mb-4 font-mono">
                    <div className="flex items-center space-x-1.5 bg-[#0D131F] p-2 rounded-lg border border-[#1E293B]">
                      <VideoIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>{vids.length} Vídeo(s)</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-[#0D131F] p-2 rounded-lg border border-[#1E293B]">
                      <CheckSquare className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>
                        {concluidas}/{ativs.length} Tasks
                      </span>
                    </div>
                  </div>

                  <BarraProgresso progresso={percentual} tamanho="sm" />
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#3B82F6] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Acessar Foco da Unidade</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EstadoVazio
          icone={Layers}
          titulo="Nenhuma unidade nesta matéria"
          descricao="Você pode criar unidades com datas manuais de início e término específicas para esta disciplina."
          textoBotao="Criar Nova Unidade Manual"
          aoClicarBotao={aoAbrirModalNovaUnidade}
        />
      )}
    </div>
  );
};
