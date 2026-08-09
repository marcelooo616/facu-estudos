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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-sleek-in">
      <div className="w-full max-w-md bg-[#111827] rounded-xl p-6 border border-[#1E293B] shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <PlusCircle className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">Criar Nova Unidade Manual</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Defina uma unidade específica para{' '}
          <span className="text-[#3B82F6] font-semibold">{materiaNome || 'sua matéria'}</span> com datas de início e término manuais.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Título da Unidade *</label>
            <input
              type="text"
              required
              placeholder="Ex: Unidade 1: Introdução ao Projeto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Data de Início *
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
                Data de Término *
              </label>
              <input
                type="date"
                required
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono text-zinc-200"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0F172A] rounded-lg border border-[#1E293B] text-xs text-zinc-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-mono text-[#3B82F6]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Intervalo Configurado:</span>
            </div>
            <p className="leading-relaxed font-mono">
              Unidade ativa de <strong className="text-white">{dataInicio}</strong> até{' '}
              <strong className="text-[#3B82F6]">{dataFim}</strong>.
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
              Salvar Unidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
