import React from 'react';
import { Materia, Unidade } from '@/lib/types';
import { BookOpen, PlusCircle, Trash2, Calendar, Layers, Plus } from 'lucide-react';

interface CardMateriaProps {
  materia: Materia;
  unidades: Unidade[];
  aoAbrirGerador: (materiaId: string) => void;
  aoAbrirCriadorManual: (materiaId: string) => void;
  aoExcluirMateria: (id: string) => void;
  aoExcluirUnidade: (id: string) => void;
}

export const CardMateria: React.FC<CardMateriaProps> = ({
  materia,
  unidades,
  aoAbrirGerador,
  aoAbrirCriadorManual,
  aoExcluirMateria,
  aoExcluirUnidade
}) => {
  const unidadesDaMateria = unidades.filter((u) => u.materiaId === materia.id);

  const formatarData = (d: string) => {
    if (!d) return '';
    const [ano, mes, dia] = d.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <div className="card-tetris card-tetris-purple p-5 space-y-4 animate-tetris-drop">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold badge-tetris-purple">
              {materia.semestre}
            </span>
            {materia.codigo && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0B1120] border border-[#1E293B] text-slate-400">
                {materia.codigo}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">{materia.nome}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{materia.descricao}</p>
        </div>

        <button
          onClick={() => aoExcluirMateria(materia.id)}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-[#0B1120] rounded-lg transition-colors cursor-pointer"
          title="Excluir Matéria"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de Unidades Cadastradas */}
      <div className="space-y-2 pt-3 border-t border-[#1E293B]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
            Unidades ({unidadesDaMateria.length})
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => aoAbrirCriadorManual(materia.id)}
              className="btn-tetris-secondary flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg cursor-pointer font-mono"
            >
              <Plus className="w-3 h-3 text-[#06B6D4]" />
              <span>Manual</span>
            </button>
            <button
              onClick={() => aoAbrirGerador(materia.id)}
              className="btn-tetris-primary flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Em Lote</span>
            </button>
          </div>
        </div>

        {unidadesDaMateria.length > 0 ? (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {unidadesDaMateria.map((uni) => (
              <div
                key={uni.id}
                className="flex items-center justify-between bg-[#0B1120] p-2.5 rounded-lg border border-[#1E293B] text-xs text-slate-300 group hover:border-[#06B6D4] transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-[#06B6D4] flex-shrink-0" />
                  <span className="truncate font-medium">{uni.titulo}</span>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {formatarData(uni.dataInicio)} - {formatarData(uni.dataFim)}
                  </span>
                  <button
                    onClick={() => aoExcluirUnidade(uni.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2 font-mono">
            Nenhuma unidade cadastrada. Clique em "Manual" ou "Em Lote" para definir as datas.
          </p>
        )}
      </div>
    </div>
  );
};
