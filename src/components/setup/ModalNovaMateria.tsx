import React, { useState } from 'react';
import { X, BookOpen, PlusCircle } from 'lucide-react';

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
  const [semestre, setSemestre] = useState('1º Semestre');
  const [descricao, setDescricao] = useState('');
  const [codigo, setCodigo] = useState('');

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;
    aoSalvar({
      nome: nome.trim(),
      semestre,
      descricao: descricao.trim(),
      codigo: codigo.trim() || undefined
    });
    setNome('');
    setDescricao('');
    setCodigo('');
    aoFechar();
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
          <BookOpen className="w-5 h-5 text-[#A855F7]" />
          <h3 className="text-lg font-bold text-white font-mono">Cadastrar Nova Disciplina</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5 font-mono">
          Preencha os dados da matéria para adicioná-la à sua grade do semestre.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Nome da Matéria *</label>
            <input
              type="text"
              required
              placeholder="Ex: Algoritmos e Estrutura de Dados"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full input-tetris px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Semestre *</label>
              <select
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg text-slate-200"
              >
                <option value="1º Semestre">1º Semestre</option>
                <option value="2º Semestre">2º Semestre</option>
                <option value="3º Semestre">3º Semestre</option>
                <option value="4º Semestre">4º Semestre</option>
                <option value="5º Semestre">5º Semestre</option>
                <option value="6º Semestre">6º Semestre</option>
                <option value="7º Semestre">7º Semestre</option>
                <option value="8º Semestre">8º Semestre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Código <span className="text-slate-500">(Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: MAT101"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full input-tetris px-3 py-2 text-sm rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Ementa / Descrição *</label>
            <textarea
              required
              rows={3}
              placeholder="Descreva brevemente os temas principais da disciplina..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full input-tetris px-3 py-2 text-sm rounded-lg"
            />
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
              Salvar Matéria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
