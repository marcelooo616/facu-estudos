import React from 'react';
import { Materia, Unidade } from '@/lib/types';
import { EstadoVazio } from '../common/EstadoVazio';
import { BookOpen, Layers, ArrowRight, Settings } from 'lucide-react';
import { BarraProgresso } from '../common/BarraProgresso';

interface ListaMateriasFocoProps {
  materias: Materia[];
  unidades: Unidade[];
  aoSelecionarMateria: (materiaId: string) => void;
  aoNavegarParaSetup: () => void;
}

export const ListaMateriasFoco: React.FC<ListaMateriasFocoProps> = ({
  materias,
  unidades,
  aoSelecionarMateria,
  aoNavegarParaSetup
}) => {
  if (materias.length === 0) {
    return (
      <EstadoVazio
        icone={BookOpen}
        titulo="Nenhuma matéria cadastrada"
        descricao="Para navegar na Área de Foco, primeiro cadastre suas disciplinas no Setup do Semestre."
        textoBotao="Ir para Setup de Matérias"
        aoClicarBotao={aoNavegarParaSetup}
      />
    );
  }

  return (
    <div className="space-y-6 animate-sleek-in">
      <div className="border-b border-[#1E293B] pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Selecione uma Disciplina</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Escolha uma matéria para visualizar suas unidades e materiais de estudo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((mat) => {
          const unidadesDaMateria = unidades.filter((u) => u.materiaId === mat.id);
          const totalUnidades = unidadesDaMateria.length;

          return (
            <div
              key={mat.id}
              onClick={() => aoSelecionarMateria(mat.id)}
              className="sleek-card p-5 cursor-pointer group flex flex-col justify-between hover:border-[#3B82F6] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-sleek-blue font-semibold">
                    {mat.semestre}
                  </span>
                  {mat.codigo && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0F172A] border border-[#1E293B] text-zinc-400">
                      {mat.codigo}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors leading-snug">
                  {mat.nome}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                  {mat.descricao}
                </p>

                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-300 bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B] mb-3">
                  <Layers className="w-4 h-4 text-[#3B82F6]" />
                  <span>{totalUnidades} Unidade(s) Cadastrada(s)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#3B82F6] font-semibold group-hover:translate-x-1 transition-transform">
                <span>Ver Unidades</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
