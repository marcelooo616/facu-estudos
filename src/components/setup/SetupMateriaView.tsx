import React, { useState } from 'react';
import { Materia, Unidade } from '@/lib/types';
import { CardMateria } from './CardMateria';
import { ModalNovaMateria } from './ModalNovaMateria';
import { ModalGerarUnidades } from './ModalGerarUnidades';
import { ModalNovaUnidade } from './ModalNovaUnidade';
import { EstadoVazio } from '../common/EstadoVazio';
import { BookOpen, Plus, Settings, Zap } from 'lucide-react';

interface SetupMateriaViewProps {
  materias: Materia[];
  unidades: Unidade[];
  aoCriarMateria: (dados: { nome: string; semestre: string; descricao: string; codigo?: string }) => void;
  aoExcluirMateria: (id: string) => void;
  aoCriarUnidadeManual: (dados: { materiaId: string; titulo: string; dataInicio: string; dataFim: string }) => void;
  aoGerarUnidades: (materiaId: string, quantidade: number, dataInicio: string, diasPorUnidade: number) => void;
  aoExcluirUnidade: (id: string) => void;
}

export const SetupMateriaView: React.FC<SetupMateriaViewProps> = ({
  materias,
  unidades,
  aoCriarMateria,
  aoExcluirMateria,
  aoCriarUnidadeManual,
  aoGerarUnidades,
  aoExcluirUnidade
}) => {
  const [modalMateriaAberto, setModalMateriaAberto] = useState(false);
  const [materiaIdParaGerador, setMateriaIdParaGerador] = useState<string | null>(null);
  const [materiaIdParaUnidadeManual, setMateriaIdParaUnidadeManual] = useState<string | null>(null);

  const materiaSelecionadaGerador = materias.find((m) => m.id === materiaIdParaGerador);
  const materiaSelecionadaManual = materias.find((m) => m.id === materiaIdParaUnidadeManual);

  return (
    <div className="space-y-8 animate-tetris-drop">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono badge-tetris-purple font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#A855F7]" /> SETUP DO SEMESTRE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Configuração de Disciplinas
            <Settings className="w-5 h-5 text-[#A855F7]" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cadastre matérias e crie cronogramas manualmente ou em lote.
          </p>
        </div>

        <button
          onClick={() => setModalMateriaAberto(true)}
          className="btn-tetris-purple flex items-center justify-center space-x-2 px-4 py-2.5 text-xs rounded-xl cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Matéria</span>
        </button>
      </div>

      {/* Grade de Matérias */}
      {materias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materias.map((materia) => (
            <CardMateria
              key={materia.id}
              materia={materia}
              unidades={unidades}
              aoAbrirGerador={(id) => setMateriaIdParaGerador(id)}
              aoAbrirCriadorManual={(id) => setMateriaIdParaUnidadeManual(id)}
              aoExcluirMateria={aoExcluirMateria}
              aoExcluirUnidade={aoExcluirUnidade}
            />
          ))}
        </div>
      ) : (
        <EstadoVazio
          icone={BookOpen}
          titulo="Nenhuma matéria cadastrada"
          descricao="Comece adicionando as disciplinas que você irá cursar neste semestre acadêmico."
          textoBotao="Cadastrar Primeira Matéria"
          aoClicarBotao={() => setModalMateriaAberto(true)}
        />
      )}

      {/* Modal Cadastro de Matéria */}
      <ModalNovaMateria
        estaAberto={modalMateriaAberto}
        aoFechar={() => setModalMateriaAberto(false)}
        aoSalvar={aoCriarMateria}
      />

      {/* Modal Criador Manual de Unidade */}
      <ModalNovaUnidade
        estaAberto={!!materiaIdParaUnidadeManual}
        materiaNome={materiaSelecionadaManual?.nome}
        aoFechar={() => setMateriaIdParaUnidadeManual(null)}
        aoSalvar={(dados) => {
          if (materiaIdParaUnidadeManual) {
            aoCriarUnidadeManual({ ...dados, materiaId: materiaIdParaUnidadeManual });
            setMateriaIdParaUnidadeManual(null);
          }
        }}
      />

      {/* Modal Gerador de Unidades em Lote */}
      <ModalGerarUnidades
        estaAberto={!!materiaIdParaGerador}
        materiaNome={materiaSelecionadaGerador?.nome}
        aoFechar={() => setMateriaIdParaGerador(null)}
        aoGerar={(qtd, inicio, dias) => {
          if (materiaIdParaGerador) {
            aoGerarUnidades(materiaIdParaGerador, qtd, inicio, dias);
            setMateriaIdParaGerador(null);
          }
        }}
      />
    </div>
  );
};
