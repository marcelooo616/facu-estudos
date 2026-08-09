import React, { useState } from 'react';
import { X, Sliders, Calendar } from 'lucide-react';
import { ConfiguracaoCronograma } from '@/lib/types';

interface ModalConfigCronogramaProps {
  estaAberto: boolean;
  config: ConfiguracaoCronograma;
  aoFechar: () => void;
  aoSalvar: (novaConfig: ConfiguracaoCronograma) => void;
}

const DIAS_SEMANA_OPCOES = [
  { id: 1, nome: 'Seg' },
  { id: 2, nome: 'Ter' },
  { id: 3, nome: 'Qua' },
  { id: 4, nome: 'Qui' },
  { id: 5, nome: 'Sex' },
  { id: 6, nome: 'Sáb' },
  { id: 0, nome: 'Dom' }
];

export const ModalConfigCronograma: React.FC<ModalConfigCronogramaProps> = ({
  estaAberto,
  config,
  aoFechar,
  aoSalvar
}) => {
  const [diasSemana, setDiasSemana] = useState<number[]>(config.diasSemana);
  const [materiasPorDia, setMateriasPorDia] = useState<'auto' | 1 | 2 | 3>(config.materiasPorDia);

  if (!estaAberto) return null;

  const alternarDia = (diaId: number) => {
    if (diasSemana.includes(diaId)) {
      if (diasSemana.length === 1) return; // Mantém ao menos 1 dia
      setDiasSemana(diasSemana.filter((d) => d !== diaId));
    } else {
      setDiasSemana([...diasSemana, diaId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aoSalvar({
      ...config,
      diasSemana,
      materiasPorDia
    });
    aoFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-sleek-in">
      <div className="w-full max-w-md bg-[#111827] rounded-xl p-6 border border-[#1E293B] shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <Sliders className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">Preferências do Cronograma</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Ajuste quais dias da semana estudar e a carga de matérias por dia.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dias de Estudo na Semana */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-2">
              Dias de Estudo na Semana *
            </label>
            <div className="grid grid-cols-7 gap-1.5 font-mono text-xs">
              {DIAS_SEMANA_OPCOES.map((d) => {
                const ativo = diasSemana.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => alternarDia(d.id)}
                    className={`py-2 rounded-lg text-center font-semibold transition-all cursor-pointer ${
                      ativo
                        ? 'bg-[#3B82F6] text-white shadow-sm'
                        : 'bg-[#0F172A] border border-[#1E293B] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {d.nome}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carga por Dia */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-2">
              Carga de Matérias por Dia *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setMateriasPorDia('auto')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  materiasPorDia === 'auto'
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Automático</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">O sistema decide por prazo</div>
              </button>

              <button
                type="button"
                onClick={() => setMateriasPorDia(1)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  materiasPorDia === 1
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">1 Matéria/dia</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Foco único e moderado</div>
              </button>

              <button
                type="button"
                onClick={() => setMateriasPorDia(2)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  materiasPorDia === 2
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">2 Matérias/dia</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Ritmo balanceado</div>
              </button>

              <button
                type="button"
                onClick={() => setMateriasPorDia(3)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  materiasPorDia === 3
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">3 Matérias/dia</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Ritmo intensivo</div>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={aoFechar}
              className="btn-sleek-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-sleek-primary px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Aplicar ao Cronograma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
