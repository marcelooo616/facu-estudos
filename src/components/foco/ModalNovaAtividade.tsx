import React, { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';

interface ModalNovaAtividadeProps {
  estaAberto: boolean;
  aoFechar: () => void;
  aoSalvar: (dados: { titulo: string; descricao: string }) => void;
}

export const ModalNovaAtividade: React.FC<ModalNovaAtividadeProps> = ({
  estaAberto,
  aoFechar,
  aoSalvar
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    aoSalvar({
      titulo: titulo.trim(),
      descricao: descricao.trim()
    });
    setTitulo('');
    setDescricao('');
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
          <CheckSquare className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">Criar Nova Atividade</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Cadastre uma tarefa ou exercício para ser concluído nesta unidade.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Título da Atividade *</label>
            <input
              type="text"
              required
              placeholder="Ex: Resolver exercícios de ordenação de grafos"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Descrição / Detalhes</label>
            <textarea
              rows={3}
              placeholder="Instruções para entrega, links de envio ou prazo..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg resize-none"
            />
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
              Adicionar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
