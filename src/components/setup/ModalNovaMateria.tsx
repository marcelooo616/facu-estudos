import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface ModalNovaMateriaProps {
  estaAberto: boolean;
  aoFechar: () => void;
  aoSalvar: (dados: { nome: string; semestre: string; descricao: string; codigo?: string }) => void;
}

export const ModalNovaMateria: React.FC<ModalNovaMateriaProps> = ({
  estaAberto,
  aoFechar,
  aoSalvar
}) => {
  const [nome, setNome] = useState('');
  const [semestre, setSemestre] = useState('2026.1');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    aoSalvar({
      nome: nome.trim(),
      semestre: semestre.trim(),
      codigo: codigo.trim() || undefined,
      descricao: descricao.trim()
    });
    setNome('');
    setCodigo('');
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
          <BookOpen className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">Cadastrar Nova Matéria</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Adicione uma disciplina para organizar unidades e cronogramas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Nome da Matéria *</label>
            <input
              type="text"
              required
              placeholder="Ex: Banco de Dados Relacionais"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Semestre *</label>
              <input
                type="text"
                required
                placeholder="2026.1"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Código (Opcional)</label>
              <input
                type="text"
                placeholder="COMP204"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Descrição</label>
            <textarea
              rows={3}
              placeholder="Resumo do programa da matéria..."
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
              Criar Matéria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
