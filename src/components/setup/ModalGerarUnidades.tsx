import React, { useState } from 'react';
import { X, Sparkles, Calendar, Layers } from 'lucide-react';

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
  const [quantidade, setQuantidade] = useState(4);
  const [dataInicio, setDataInicio] = useState(hoje);
  const [diasPorUnidade, setDiasPorUnidade] = useState(7);

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantidade <= 0 || diasPorUnidade <= 0 || !dataInicio) return;
    aoGerar(quantidade, dataInicio, diasPorUnidade);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-tetris-drop">
      <div className="w-full max-w-md card-tetris card-tetris-cyan p-6 shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#06B6D4]" />
          <h3 className="text-lg font-bold text-white font-mono">Gerador Automático de Unidades</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5 font-mono">
          Gere sequencialmente múltiplas unidades para{' '}
          <span className="text-[#06B6D4] font-bold">{materiaNome || 'a disciplina'}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Quantidade de Unidades (Ex: 4, 6, 8) *
            </label>
            <input
              type="number"
              min={1}
              max={16}
              required
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-full input-tetris px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Data da 1ª Unidade *</label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Dias por Unidade *</label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={diasPorUnidade}
                onChange={(e) => setDiasPorUnidade(parseInt(e.target.value) || 1)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg text-slate-200"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0B1120] rounded-lg border border-[#1E293B] text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-mono text-[#06B6D4]">
              <Layers className="w-3.5 h-3.5" />
              <span>Resumo do Gerador:</span>
            </div>
            <p className="leading-relaxed font-mono">
              Serão criadas <strong className="text-white">{quantidade} unidades</strong> sequenciais de{' '}
              <strong className="text-[#06B6D4]">{diasPorUnidade} dias</strong> a partir de {dataInicio}.
            </p>
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
              className="btn-tetris-primary px-4 py-2 text-xs font-semibold cursor-pointer flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gerar {quantidade} Unidades</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
