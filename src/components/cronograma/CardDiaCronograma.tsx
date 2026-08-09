import React from 'react';
import { MetaEstudoDiario } from '@/lib/types';
import { Calendar, Video, ExternalLink, ArrowRight, Check } from 'lucide-react';

interface CardDiaCronogramaProps {
  metaDia: MetaEstudoDiario;
  aoAlternarAtividade: (id: string) => void;
  aoNavegarParaFoco: (unidadeId: string) => void;
}

export const CardDiaCronograma: React.FC<CardDiaCronogramaProps> = ({
  metaDia,
  aoAlternarAtividade,
  aoNavegarParaFoco
}) => {
  const formatarData = (dStr: string) => {
    const [ano, mes, dia] = dStr.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <div
      className={`sleek-card p-5 space-y-4 animate-sleek-in transition-all ${
        metaDia.isHoje ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/30 shadow-lg shadow-[#3B82F6]/10' : ''
      }`}
    >
      {/* Cabeçalho do Dia */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${metaDia.isHoje ? 'text-[#3B82F6]' : 'text-zinc-400'}`} />
          <h3 className="text-sm font-bold text-white">
            {metaDia.diaSemanaNome}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            ({formatarData(metaDia.data)})
          </span>
        </div>

        {metaDia.isHoje && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-sleek-blue font-bold">
            Meta de Hoje
          </span>
        )}
      </div>

      {/* Lista de Metas Alocadas para o Dia */}
      {metaDia.itens.length > 0 ? (
        <div className="space-y-3">
          {metaDia.itens.map((item) => {
            const temUrl = item.url && item.url.trim() !== '';

            return (
              <div
                key={item.id}
                className="bg-[#0F172A] p-3 rounded-xl border border-[#1E293B] space-y-2 group hover:border-[#3B82F6]/50 transition-colors"
              >
                {/* Badges de Matéria e Prazo */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#3B82F6] font-semibold uppercase">{item.materiaNome}</span>
                  <span className="text-zinc-400">Prazo: {formatarData(item.dataFimUnidade)}</span>
                </div>

                {/* Título da Unidade */}
                <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">{item.unidadeTitulo}</p>

                {/* Item em si (Vídeo ou Tarefa) */}
                <div className="flex items-center justify-between pt-1">
                  {item.tipo === 'video' ? (
                    <div className="flex items-center space-x-2 flex-1 truncate">
                      <Video className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />
                      <span className="text-xs text-white font-medium truncate">{item.titulo}</span>
                      {temUrl && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#3B82F6] hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex items-center space-x-2 flex-1 cursor-pointer select-none truncate"
                      onClick={() => aoAlternarAtividade(item.id)}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                          item.concluido
                            ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                            : 'bg-[#1E293B] border-[#374151] text-transparent group-hover:border-[#3B82F6]'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span
                        className={`text-xs font-medium truncate ${
                          item.concluido ? 'line-through text-zinc-500' : 'text-white'
                        }`}
                      >
                        {item.titulo}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => aoNavegarParaFoco(item.unidadeId)}
                    className="p-1 text-zinc-500 hover:text-[#3B82F6] transition-colors cursor-pointer"
                    title="Abrir na Área de Foco"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-zinc-500 italic py-3 text-center font-mono">
          Sem obrigações agendadas para este dia. Dia livre! 🚀
        </p>
      )}
    </div>
  );
};
