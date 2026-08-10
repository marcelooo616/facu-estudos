import React, { useState } from 'react';
import { X, Settings2, Check, Calendar, Zap } from 'lucide-react';
import { ConfiguracaoCronograma } from '@/lib/types';

interface ModalConfigCronogramaProps {
  estaAberto: boolean;
  configuracaoAtual: ConfiguracaoCronograma;
  aoFechar: () => void;
  aoSalvar: (novaConfig: ConfiguracaoCronograma) => void;
}

const DIAS_SEMANA_OPCOES = [
  { valor: 0, rotulo: 'Domingo' },
  { valor: 1, rotulo: 'Segunda' },
  { valor: 2, rotulo: 'Terça' },
  { valor: 3, rotulo: 'Quarta' },
  { valor: 4, rotulo: 'Quinta' },
  { valor: 5, rotulo: 'Sexta' },
  { valor: 6, rotulo: 'Sábado' }
];

export const ModalConfigCronograma: React.FC<ModalConfigCronogramaProps> = ({
  estaAberto,
  configuracaoAtual,
  aoFechar,
  aoSalvar
}) => {
  const [diasSemana, setDiasSemana] = useState<number[]>(configuracaoAtual.diasSemana || [1, 2, 3, 4, 5]);
  const [materiasPorDia, setMateriasPorDia] = useState<'auto' | 1 | 2 | 3>(
    configuracaoAtual.materiasPorDia || 'auto'
  );
  const [incluirConcluidas, setIncluirConcluidas] = useState<boolean>(
    configuracaoAtual.incluirConcluidas || false
  );

  if (!estaAberto) return null;

  const alternarDia = (dia: number) => {
    if (diasSemana.includes(dia)) {
      if (diasSemana.length === 1) return; // Mantém ao menos 1 dia
      setDiasSemana(diasSemana.filter((d) => d !== dia));
    } else {
      setDiasSemana([...diasSemana, dia].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aoSalvar({
      diasSemana,
      materiasPorDia,
      incluirConcluidas
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-tetris-drop">
      <div className="w-full max-w-md card-tetris card-tetris-purple p-6 shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <Settings2 className="w-5 h-5 text-[#A855F7]" />
          <h3 className="text-lg font-bold text-white font-mono">Regras do Cronograma Smart</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5 font-mono">
          Configure em quais dias da semana você estuda e a carga horária desejada.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Escolha dos Dias da Semana */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2">
              Dias de Estudo Selecionados *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {DIAS_SEMANA_OPCOES.map((d) => {
                const ativo = diasSemana.includes(d.valor);
                return (
                  <button
                    key={d.valor}
                    type="button"
                    onClick={() => alternarDia(d.valor)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      ativo
                        ? 'bg-[#A855F7]/15 border-[#A855F7] text-white font-bold'
                        : 'bg-[#0B1120] border-[#1E293B] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{d.rotulo}</span>
                    {ativo && <Check className="w-3.5 h-3.5 text-[#A855F7]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Limite de Disciplinas Por Dia */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2">
              Limite de Matérias por Dia *
            </label>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {[
                { id: 'auto', rotulo: 'Auto' },
                { id: 1, rotulo: '1 Matéria' },
                { id: 2, rotulo: '2 Matérias' },
                { id: 3, rotulo: '3 Matérias' }
              ].map((opt) => {
                const ativo = materiasPorDia === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMateriasPorDia(opt.id as any)}
                    className={`py-2 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      ativo
                        ? 'bg-[#06B6D4]/15 border-[#06B6D4] text-[#06B6D4]'
                        : 'bg-[#0B1120] border-[#1E293B] text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.rotulo}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={aoFechar}
              className="btn-tetris-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-tetris-purple px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Salvar Configuração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
