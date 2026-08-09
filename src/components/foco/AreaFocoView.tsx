import React, { useState, useEffect } from 'react';
import { UnidadeComDetalhes, Materia, Unidade, Video, Atividade } from '@/lib/types';
import { ListaMateriasFoco } from './ListaMateriasFoco';
import { ListaUnidadesMateria } from './ListaUnidadesMateria';
import { ListaVideos } from './ListaVideos';
import { ChecklistAtividades } from './ChecklistAtividades';
import { ModalNovoVideo } from './ModalNovoVideo';
import { ModalNovaAtividade } from './ModalNovaAtividade';
import { ModalNovaUnidade } from '../setup/ModalNovaUnidade';
import { Target, Calendar, ArrowLeft, Zap } from 'lucide-react';

interface AreaFocoViewProps {
  unidadeIdAtiva: string | null;
  materias: Materia[];
  unidades: Unidade[];
  videos: Video[];
  atividades: Atividade[];
  obterDetalhesUnidade: (id: string) => UnidadeComDetalhes | null;
  aoMudarUnidade: (unidadeId: string | null) => void;
  aoCriarUnidade: (dados: { materiaId: string; titulo: string; dataInicio: string; dataFim: string }) => void;
  aoAdicionarVideo: (dados: { unidadeId: string; titulo: string; url?: string; duracaoMinutos?: number }) => void;
  aoEditarVideo: (id: string, dados: { titulo: string; url?: string; duracaoMinutos?: number }) => void;
  aoAlternarVideoAssistido: (id: string) => void;
  aoExcluirVideo: (id: string) => void;
  aoAdicionarAtividade: (dados: { unidadeId: string; titulo: string; descricao: string }) => void;
  aoAlternarAtividade: (id: string) => void;
  aoExcluirAtividade: (id: string) => void;
  aoNavegarParaSetup: () => void;
}

export const AreaFocoView: React.FC<AreaFocoViewProps> = ({
  unidadeIdAtiva,
  materias,
  unidades,
  videos,
  atividades,
  obterDetalhesUnidade,
  aoMudarUnidade,
  aoCriarUnidade,
  aoAdicionarVideo,
  aoEditarVideo,
  aoAlternarVideoAssistido,
  aoExcluirVideo,
  aoAdicionarAtividade,
  aoAlternarAtividade,
  aoExcluirAtividade,
  aoNavegarParaSetup
}) => {
  const [materiaIdSelecionada, setMateriaIdSelecionada] = useState<string | null>(null);
  const [modalVideoAberto, setModalVideoAberto] = useState(false);
  const [videoEmEdicao, setVideoEmEdicao] = useState<Video | null>(null);
  const [modalAtividadeAberto, setModalAtividadeAberto] = useState(false);
  const [modalNovaUnidadeAberto, setModalNovaUnidadeAberto] = useState(false);

  // Se unidadeIdAtiva vier preenchido (ex: do Dashboard), sincroniza matéria e entra direto no Nível 3
  useEffect(() => {
    if (unidadeIdAtiva) {
      const u = unidades.find((item) => item.id === unidadeIdAtiva);
      if (u) {
        setMateriaIdSelecionada(u.materiaId);
      }
    }
  }, [unidadeIdAtiva, unidades]);

  const materiaAtual = materias.find((m) => m.id === materiaIdSelecionada);
  const unidadeDetalhada = unidadeIdAtiva ? obterDetalhesUnidade(unidadeIdAtiva) : null;

  const videosDaUnidade = unidadeIdAtiva ? videos.filter((v) => v.unidadeId === unidadeIdAtiva) : [];
  const atividadesDaUnidade = unidadeIdAtiva ? atividades.filter((a) => a.unidadeId === unidadeIdAtiva) : [];

  const formatarData = (d?: string) => {
    if (!d) return '';
    const [ano, mes, dia] = d.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // NÍVEL 1: Seleção de Matérias
  if (!materiaIdSelecionada && !unidadeIdAtiva) {
    return (
      <ListaMateriasFoco
        materias={materias}
        unidades={unidades}
        aoSelecionarMateria={(mId) => setMateriaIdSelecionada(mId)}
        aoNavegarParaSetup={aoNavegarParaSetup}
      />
    );
  }

  // NÍVEL 2: Lista de Unidades da Matéria Selecionada
  if (materiaAtual && !unidadeIdAtiva) {
    return (
      <>
        <ListaUnidadesMateria
          materia={materiaAtual}
          unidades={unidades}
          videos={videos}
          atividades={atividades}
          aoVoltarParaMaterias={() => setMateriaIdSelecionada(null)}
          aoSelecionarUnidade={(uId) => aoMudarUnidade(uId)}
          aoAbrirModalNovaUnidade={() => setModalNovaUnidadeAberto(true)}
        />

        <ModalNovaUnidade
          estaAberto={modalNovaUnidadeAberto}
          materiaNome={materiaAtual.nome}
          aoFechar={() => setModalNovaUnidadeAberto(false)}
          aoSalvar={(dados) => aoCriarUnidade({ ...dados, materiaId: materiaAtual.id })}
        />
      </>
    );
  }

  // NÍVEL 3: Visão Detalhada da Unidade (Split-Screen)
  if (unidadeDetalhada) {
    return (
      <div className="space-y-6 animate-sleek-in">
        {/* Breadcrumb e Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mb-1">
              <button
                onClick={() => {
                  aoMudarUnidade(null);
                  setMateriaIdSelecionada(null);
                }}
                className="hover:text-[#3B82F6] transition-colors cursor-pointer"
              >
                Área de Foco
              </button>
              <span>/</span>
              <button
                onClick={() => aoMudarUnidade(null)}
                className="hover:text-[#3B82F6] transition-colors cursor-pointer"
              >
                {unidadeDetalhada.materiaNome}
              </button>
              <span>/</span>
              <span className="text-[#3B82F6] font-semibold">{unidadeDetalhada.titulo}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {unidadeDetalhada.titulo}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>
                Período: {formatarData(unidadeDetalhada.dataInicio)} — {formatarData(unidadeDetalhada.dataFim)}
              </span>
            </p>
          </div>

          <button
            onClick={() => aoMudarUnidade(null)}
            className="btn-sleek-secondary flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Unidades</span>
          </button>
        </div>

        {/* Interface Dividida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListaVideos
            videos={videosDaUnidade}
            aoAbrirModalNovoVideo={() => {
              setVideoEmEdicao(null);
              setModalVideoAberto(true);
            }}
            aoAbrirModalEditarVideo={(vid) => {
              setVideoEmEdicao(vid);
              setModalVideoAberto(true);
            }}
            aoAlternarVideoAssistido={aoAlternarVideoAssistido}
            aoExcluirVideo={aoExcluirVideo}
          />
          <ChecklistAtividades
            atividades={atividadesDaUnidade}
            aoAlternarStatus={aoAlternarAtividade}
            aoAbrirModalNovaAtividade={() => setModalAtividadeAberto(true)}
            aoExcluirAtividade={aoExcluirAtividade}
          />
        </div>

        {/* Modais */}
        <ModalNovoVideo
          estaAberto={modalVideoAberto}
          videoParaEditar={videoEmEdicao}
          aoFechar={() => {
            setModalVideoAberto(false);
            setVideoEmEdicao(null);
          }}
          aoSalvar={(dados) => {
            if (videoEmEdicao) {
              aoEditarVideo(videoEmEdicao.id, dados);
            } else {
              aoAdicionarVideo({ ...dados, unidadeId: unidadeDetalhada.id });
            }
            setVideoEmEdicao(null);
          }}
        />
        <ModalNovaAtividade
          estaAberto={modalAtividadeAberto}
          aoFechar={() => setModalAtividadeAberto(false)}
          aoSalvar={(dados) => aoAdicionarAtividade({ ...dados, unidadeId: unidadeDetalhada.id })}
        />
      </div>
    );
  }

  return null;
};
