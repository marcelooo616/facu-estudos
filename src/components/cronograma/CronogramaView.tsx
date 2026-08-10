import React, { useState } from 'react';
import { Materia, Unidade, Video, Atividade, ConfiguracaoCronograma } from '@/lib/types';
import { CardDiaCronograma } from './CardDiaCronograma';
import { ModalConfigCronograma } from './ModalConfigCronograma';
import { gerarPlanoEstudos } from '@/lib/cronogramaAlgoritmo';
import { Calendar, Settings2, Sparkles } from 'lucide-react';

interface CronogramaViewProps {
  materias: Materia[];
  unidades: Unidade[];
  videos: Video[];
  atividades: Atividade[];
  configuracao: ConfiguracaoCronograma;
  aoSalvarConfiguracao: (config: ConfiguracaoCronograma) => void;
  aoSelecionarFoco?: (unidadeId: string) => void;
}

export const CronogramaView: React.FC<CronogramaViewProps> = ({
  materias,
  unidades,
  videos,
  atividades,
  configuracao,
  aoSalvarConfiguracao,
  aoSelecionarFoco
}) => {
  const [modalConfigAberto, setModalConfigAberto] = useState(false);

  const metasDiarias = gerarPlanoEstudos(
    materias,
    unidades,
    videos,
    atividades,
    configuracao
  );

  return (
    <div className="space-y-6 animate-tetris-drop max-w-7xl mx-auto">
      {/* Cabeçalho do Cronograma */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono badge-tetris-green font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#22C55E]" /> CRONOGRAMA POR MATÉRIAS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Cronograma por Disciplina
            <Calendar className="w-5 h-5 text-[#22C55E]" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Distribuição automatizada das matérias a serem estudadas em cada dia da semana.
          </p>
        </div>

        <button
          onClick={() => setModalConfigAberto(true)}
          className="btn-tetris-green flex items-center justify-center space-x-2 px-4 py-2.5 text-xs rounded-xl cursor-pointer self-start md:self-auto"
        >
          <Settings2 className="w-4 h-4" />
          <span>Ajustar Dias e Limite de Matérias</span>
        </button>
      </div>

      {/* Grade Diária do Cronograma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metasDiarias.map((meta) => (
          <CardDiaCronograma
            key={meta.data}
            metaDia={meta}
            aoSelecionarFoco={aoSelecionarFoco}
          />
        ))}
      </div>

      {/* Modal de Configurações do Algoritmo */}
      <ModalConfigCronograma
        estaAberto={modalConfigAberto}
        configuracaoAtual={configuracao}
        aoFechar={() => setModalConfigAberto(false)}
        aoSalvar={(novaConfig) => {
          aoSalvarConfiguracao(novaConfig);
          setModalConfigAberto(false);
        }}
      />
    </div>
  );
};
