import React from 'react';
import { Video, TipoConteudoMaterial } from '@/lib/types';
import { EstadoVazio } from '../common/EstadoVazio';
import { Video as VideoIcon, ExternalLink, Plus, Trash2, Edit3, PlayCircle, Clock, Check, BookOpen, PenTool, Link as LinkIcon } from 'lucide-react';

interface ListaVideosProps {
  videos: Video[];
  aoAbrirModalNovoVideo: () => void;
  aoAbrirModalEditarVideo: (video: Video) => void;
  aoAlternarVideoAssistido: (id: string) => void;
  aoExcluirVideo: (id: string) => void;
}

const obterInfoCategoria = (tipo?: TipoConteudoMaterial) => {
  switch (tipo) {
    case 'leitura':
      return { rotulo: 'LEITURA', icone: BookOpen, corIcone: 'text-emerald-400', badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' };
    case 'exercicio':
      return { rotulo: 'EXERCÍCIO', icone: PenTool, corIcone: 'text-amber-400', badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/60' };
    case 'outro':
      return { rotulo: 'MATERIAL', icone: LinkIcon, corIcone: 'text-purple-400', badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-800/60' };
    case 'video':
    default:
      return { rotulo: 'VÍDEO', icone: PlayCircle, corIcone: 'text-[#3B82F6]', badgeClass: 'badge-sleek-blue' };
  }
};

export const ListaVideos: React.FC<ListaVideosProps> = ({
  videos,
  aoAbrirModalNovoVideo,
  aoAbrirModalEditarVideo,
  aoAlternarVideoAssistido,
  aoExcluirVideo
}) => {
  return (
    <div className="sleek-card p-5 space-y-4">
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#3B82F6]" />
          <h3 className="text-sm font-bold text-white tracking-tight">Materiais de Estudo & Aulas</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-sleek-blue font-semibold">
            {videos.filter((v) => v.assistido).length}/{videos.length} concluídos
          </span>
        </div>

        <button
          onClick={aoAbrirModalNovoVideo}
          className="btn-sleek-secondary flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Novo Conteúdo</span>
        </button>
      </div>

      {/* Lista de Materiais em Ordem Cronológica de Adição (1º adicionado no topo) */}
      {videos.length > 0 ? (
        <div className="space-y-3">
          {videos.map((vid) => {
            const temUrl = vid.url && vid.url.trim() !== '';
            const catInfo = obterInfoCategoria(vid.tipoConteudo);
            const IconeCategoria = catInfo.icone;

            return (
              <div
                key={vid.id}
                className={`bg-[#0F172A] p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                  vid.assistido
                    ? 'border-[#1E293B] opacity-75 bg-[#0B0F19]/60'
                    : 'border-[#1E293B] hover:border-[#3B82F6]'
                }`}
              >
                <div className="flex items-start space-x-3 flex-1">
                  {/* Checkbox de Conteúdo Concluído/Assistido */}
                  <button
                    type="button"
                    onClick={() => aoAlternarVideoAssistido(vid.id)}
                    title={vid.assistido ? 'Marcar como não concluído' : 'Marcar como concluído/lido'}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 cursor-pointer flex-shrink-0 ${
                      vid.assistido
                        ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm'
                        : 'bg-[#1E293B] border-[#334155] text-transparent hover:border-[#3B82F6]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="flex-1">
                    {/* Badge de Categoria */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border font-bold ${catInfo.badgeClass}`}>
                        {catInfo.rotulo}
                      </span>
                      {vid.duracaoMinutos && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {vid.duracaoMinutos} min
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        vid.assistido
                          ? 'line-through text-slate-500'
                          : 'text-slate-100 group-hover:text-[#3B82F6]'
                      }`}
                    >
                      <IconeCategoria className={`w-3.5 h-3.5 ${catInfo.corIcone} flex-shrink-0`} />
                      <span>{vid.titulo}</span>
                    </h4>

                    {temUrl ? (
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] text-[#3B82F6] hover:underline font-mono mt-1.5"
                      >
                        <span>Acessar conteúdo externo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center space-x-1 text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded mt-1.5">
                        <Clock className="w-3 h-3" />
                        <span>Link Pendente / Aguardando Faculdade</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => aoAbrirModalEditarVideo(vid)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#3B82F6] rounded-lg transition-all cursor-pointer hover:bg-[#1E293B]"
                    title="Editar conteúdo (título, categoria ou link)"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => aoExcluirVideo(vid.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer hover:bg-[#1E293B]"
                    title="Excluir material"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EstadoVazio
          icone={BookOpen}
          titulo="Nenhum material cadastrado"
          descricao="Adicione vídeo-aulas, artigos de leitura ou listas de exercícios. Eles serão organizados pela ordem de adição."
          textoBotao="Adicionar Conteúdo"
          aoClicarBotao={aoAbrirModalNovoVideo}
        />
      )}
    </div>
  );
};
