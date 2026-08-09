import React, { useState } from 'react';
import { X, Calendar, Layers } from 'lucide-react';

interface ModalGerarUnidadesProps {
  estaAberto: boolean;
  materiaNome?: string;
  aoFechar: () => void;
  aoGerar: (quantidade: number, dataInicio: string, diasPorUnidade: number) => void;
}

export const ModalGerarUnidades: React.FC<ModalGerarUnidadesProps> = ({
  estaAberto,
  materiaNome,
  aoFechar,
  aoGerar
}) => {
  const hoje = new Date().toISOString().split('T')[0];
  const [quantidade, setQuantidade] = useState<number>(10);
  const [dataInicio, setDataInicio] = useState<string>(hoje);
  const [diasPorUnidade, setDiasPorUnidade] = useState<number>(7);

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantidade < 1 || !dataInicio || diasPorUnidade < 1) return;
    aoGerar(quantidade, dataInicio, diasPorUnidade);
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
          <Layers className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">Gerar Cronograma de Unidades</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Crie Múltiplas Unidades em sequência para cobrir o semestre de{' '}
          <span className="text-[#3B82F6] font-semibold">{materiaNome || 'sua matéria'}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Quantidade de Unidades (ex: 10) *
            </label>
            <input
              type="number"
              min={1}
              max={30}
              required
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Data Inicial da 1ª Unidade *
              </label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono text-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Duração por Unidade (dias) *
              </label>
              <input
                type="number"
                min={1}
                max={90}
                required
                placeholder="Ex: 7 ou 14"
                value={diasPorUnidade}
                onChange={(e) => setDiasPorUnidade(parseInt(e.target.value) || 7)}
                className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono text-zinc-200"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0F172A] rounded-lg border border-[#1E293B] text-xs text-zinc-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-mono text-[#3B82F6]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Resumo do Gerador:</span>
            </div>
            <p className="leading-relaxed">
              Serão geradas <strong className="text-white">{quantidade} unidades</strong> sequenciais a partir de{' '}
              <strong className="text-white">{dataInicio}</strong> com intervalo manual de{' '}
              <strong className="text-[#3B82F6]">{diasPorUnidade} dias</strong> cada.
            </p>
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
              Gerar {quantidade} Unidades
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
