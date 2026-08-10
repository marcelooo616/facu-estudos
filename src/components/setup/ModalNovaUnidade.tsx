import React, { useState } from 'react';
import { X, Calendar, PlusCircle } from 'lucide-react';

interface ModalNovaUnidadeProps {
  estaAberto: boolean;
  materiaNome?: string;
  aoFechar: () => void;
  aoSalvar: (dados: { titulo: string; dataInicio: string; dataFim: string }) => void;
}

export const ModalNovaUnidade: React.FC<ModalNovaUnidadeProps> = ({
  estaAberto,
  materiaNome,
  aoFechar,
  aoSalvar
}) => {
  const hoje = new Date().toISOString().split('T')[0];
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !dataInicio || !dataFim) return;
    aoSalvar({
      titulo: titulo.trim(),
      dataInicio,
      dataFim
    });
    setTitulo('');
    setDataInicio(hoje);
    setDataFim(hoje);
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
          <PlusCircle className="w-5 h-5 text-[#06B6D4]" />
          <h3 className="text-lg font-bold text-white font-mono">Criar Unidade Manual</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5 font-mono">
          Defina uma unidade específica para{' '}
          <span className="text-[#06B6D4] font-bold">{materiaNome || 'sua matéria'}</span> com datas de início e término manuais.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Título da Unidade *</label>
            <input
              type="text"
              required
              placeholder="Ex: Unidade 1: Introdução ao Projeto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full input-tetris px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Data de Término *
              </label>
              <input
                type="date"
                required
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg text-slate-200"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0B1120] rounded-lg border border-[#1E293B] text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-mono text-[#06B6D4]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Intervalo Configurado:</span>
            </div>
            <p className="leading-relaxed font-mono">
              Unidade ativa de <strong className="text-white">{dataInicio}</strong> até{' '}
              <strong className="text-[#06B6D4]">{dataFim}</strong>.
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
              className="btn-tetris-primary px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Salvar Unidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
