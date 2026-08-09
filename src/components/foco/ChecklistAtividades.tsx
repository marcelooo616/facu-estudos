import React, { useState } from 'react';
import { Atividade } from '@/lib/types';
import { BarraProgresso } from '../common/BarraProgresso';
import { EstadoVazio } from '../common/EstadoVazio';
import { CheckSquare, Plus, Trash2, Check, Clock } from 'lucide-react';

interface ChecklistAtividadesProps {
  atividades: Atividade[];
  aoAlternarStatus: (id: string) => void;
  aoAbrirModalNovaAtividade: () => void;
  aoExcluirAtividade: (id: string) => void;
}

export const ChecklistAtividades: React.FC<ChecklistAtividadesProps> = ({
  atividades,
  aoAlternarStatus,
  aoAbrirModalNovaAtividade,
  aoExcluirAtividade
}) => {
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');

  const total = atividades.length;
  const concluidasCount = atividades.filter((a) => a.concluida).length;
  const percentual = total > 0 ? (concluidasCount / total) * 100 : 0;

  const atividadesFiltradas = atividades.filter((a) => {
    if (filtroStatus === 'pendentes') return !a.concluida;
    if (filtroStatus === 'concluidas') return a.concluida;
    return true;
  });

  return (
    <div className="sleek-card p-5 space-y-4">
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-[#3B82F6]" />
          <h3 className="text-sm font-bold text-white tracking-tight">Checklist de Entregas</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-sleek-blue font-semibold">
            {concluidasCount}/{total}
          </span>
        </div>

        <button
          onClick={aoAbrirModalNovaAtividade}
          className="btn-sleek-primary flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Atividade</span>
        </button>
      </div>

      {/* Progresso Geral */}
      <BarraProgresso progresso={percentual} tamanho="md" />

      {/* Filtros de Status */}
      {total > 0 && (
        <div className="flex items-center space-x-1 bg-[#0F172A] p-1 rounded-xl border border-[#1E293B] text-xs font-mono">
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
              filtroStatus === 'todas'
                ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todas ({total})
          </button>
          <button
            onClick={() => setFiltroStatus('pendentes')}
            className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
              filtroStatus === 'pendentes'
                ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pendentes ({total - concluidasCount})
          </button>
          <button
            onClick={() => setFiltroStatus('concluidas')}
            className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
              filtroStatus === 'concluidas'
                ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Concluídas ({concluidasCount})
          </button>
        </div>
      )}

      {/* Lista Interativa de Checklist */}
      {atividadesFiltradas.length > 0 ? (
        <div className="space-y-2.5">
          {atividadesFiltradas.map((ativ) => (
            <div
              key={ativ.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                ativ.concluida
                  ? 'bg-[#0F172A]/50 border-[#1E293B] opacity-75'
                  : 'bg-[#0F172A] border-[#1E293B] hover:border-[#3B82F6]'
              }`}
            >
              <div
                className="flex items-start space-x-3 cursor-pointer select-none flex-grow"
                onClick={() => aoAlternarStatus(ativ.id)}
              >
                {/* Checkbox Sleek */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 flex-shrink-0 ${
                    ativ.concluida
                      ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                      : 'bg-[#1E293B] border-[#374151] text-transparent group-hover:border-[#3B82F6]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-semibold transition-colors ${
                      ativ.concluida ? 'line-through text-zinc-500' : 'text-zinc-100 group-hover:text-[#3B82F6]'
                    }`}
                  >
                    {ativ.titulo}
                  </h4>
                  {ativ.descricao && (
                    <p
                      className={`text-[11px] mt-0.5 leading-relaxed ${
                        ativ.concluida ? 'text-zinc-600' : 'text-zinc-400'
                      }`}
                    >
                      {ativ.descricao}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => aoExcluirAtividade(ativ.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded-lg transition-all cursor-pointer hover:bg-[#1E293B]"
                title="Excluir atividade"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EstadoVazio
          icone={Clock}
          titulo="Nenhuma atividade nesta visualização"
          descricao="Cadastre os exercícios, trabalhos e entregas pendentes para esta unidade."
          textoBotao="Criar Atividade"
          aoClicarBotao={aoAbrirModalNovaAtividade}
        />
      )}
    </div>
  );
};
