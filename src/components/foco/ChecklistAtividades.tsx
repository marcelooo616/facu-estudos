import React from 'react';
import { Atividade } from '@/lib/types';
import { EstadoVazio } from '../common/EstadoVazio';
import { CheckSquare, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

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
  const concluidasCount = atividades.filter((a) => a.concluida).length;

  return (
    <div className="sleek-card p-5 space-y-4">
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Checklist de Atividades & Tarefas</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 font-semibold">
            {concluidasCount}/{atividades.length} concluidas
          </span>
        </div>

        <button
          onClick={aoAbrirModalNovaAtividade}
          className="btn-sleek-secondary flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Lista de Atividades */}
      {atividades.length > 0 ? (
        <div className="space-y-3">
          {atividades.map((ativ) => (
            <div
              key={ativ.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                ativ.concluida
                  ? 'bg-[#0F172A] border-[#1E293B] opacity-75'
                  : 'bg-red-950/15 border-red-900/40 hover:border-red-700/60'
              }`}
            >
              <div className="flex items-start space-x-3 flex-1 cursor-pointer select-none" onClick={() => aoAlternarStatus(ativ.id)}>
                {/* Checkbox de Atividade */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 flex-shrink-0 ${
                    ativ.concluida
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'bg-[#1E293B] border-red-800/80 text-transparent group-hover:border-red-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {ativ.concluida ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold">
                        CONCLUÍDA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-950/80 text-red-400 border border-red-800/80 font-bold flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                        PENDENTE
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-xs font-semibold transition-colors ${
                      ativ.concluida ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-red-300'
                    }`}
                  >
                    {ativ.titulo}
                  </h4>
                  {ativ.descricao && (
                    <p
                      className={`text-[11px] mt-1 leading-relaxed ${
                        ativ.concluida ? 'line-through text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {ativ.descricao}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => aoExcluirAtividade(ativ.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer hover:bg-[#1E293B]"
                title="Excluir atividade"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EstadoVazio
          icone={CheckSquare}
          titulo="Nenhuma atividade cadastrada"
          descricao="Adicione tarefas ou entregas para esta unidade. Pendências ficam destacadas em vermelho."
          textoBotao="Adicionar Tarefa"
          aoClicarBotao={aoAbrirModalNovaAtividade}
        />
      )}
    </div>
  );
};
