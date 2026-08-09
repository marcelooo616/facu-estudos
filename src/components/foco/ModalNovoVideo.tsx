import React, { useState, useEffect } from 'react';
import { X, Video, BookOpen, PenTool, Link as LinkIcon } from 'lucide-react';
import { Video as VideoType, TipoConteudoMaterial } from '@/lib/types';

interface ModalNovoVideoProps {
  estaAberto: boolean;
  videoParaEditar?: VideoType | null;
  aoFechar: () => void;
  aoSalvar: (dados: {
    titulo: string;
    url?: string;
    duracaoMinutos?: number;
    tipoConteudo?: TipoConteudoMaterial;
  }) => void;
}

const CATEGORIAS: { id: TipoConteudoMaterial; rotulo: string; icone: any; cor: string }[] = [
  { id: 'video', rotulo: 'Vídeo-Aula', icone: Video, cor: 'text-[#3B82F6]' },
  { id: 'leitura', rotulo: 'Leitura / Artigo', icone: BookOpen, cor: 'text-emerald-400' },
  { id: 'exercicio', rotulo: 'Exercício / Prática', icone: PenTool, cor: 'text-amber-400' },
  { id: 'outro', rotulo: 'Outro Material', icone: LinkIcon, cor: 'text-purple-400' }
];

export const ModalNovoVideo: React.FC<ModalNovoVideoProps> = ({
  estaAberto,
  videoParaEditar,
  aoFechar,
  aoSalvar
}) => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [duracao, setDuracao] = useState('');
  const [tipoConteudo, setTipoConteudo] = useState<TipoConteudoMaterial>('video');

  useEffect(() => {
    if (videoParaEditar) {
      setTitulo(videoParaEditar.titulo || '');
      setUrl(videoParaEditar.url || '');
      setDuracao(videoParaEditar.duracaoMinutos ? String(videoParaEditar.duracaoMinutos) : '');
      setTipoConteudo(videoParaEditar.tipoConteudo || 'video');
    } else {
      setTitulo('');
      setUrl('');
      setDuracao('');
      setTipoConteudo('video');
    }
  }, [videoParaEditar, estaAberto]);

  if (!estaAberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    aoSalvar({
      titulo: titulo.trim(),
      url: url.trim() || undefined,
      duracaoMinutos: duracao ? parseInt(duracao) : undefined,
      tipoConteudo
    });
    setTitulo('');
    setUrl('');
    setDuracao('');
    setTipoConteudo('video');
    aoFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-sleek-in">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl p-6 border border-[#1E293B] shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <Video className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg font-bold text-white">
            {videoParaEditar ? 'Editar Conteúdo / Material' : 'Adicionar Material de Estudo'}
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Selecione o tipo de conteúdo (Vídeo, Leitura, Exercício) e insira o título e o link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seletor de Categoria de Conteúdo */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-2">
              Tipo / Categoria de Conteúdo *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {CATEGORIAS.map((cat) => {
                const IconeComponente = cat.icone;
                const selecionado = tipoConteudo === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTipoConteudo(cat.id)}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      selecionado
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-white font-bold shadow-sm'
                        : 'bg-[#0F172A] border-[#1E293B] text-zinc-400 hover:text-white hover:border-[#334155]'
                    }`}
                  >
                    <IconeComponente className={`w-4 h-4 ${cat.cor}`} />
                    <span className="truncate">{cat.rotulo}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Título do Material *</label>
            <input
              type="text"
              required
              placeholder={
                tipoConteudo === 'leitura'
                  ? 'Ex: Artigo: Algoritmos de Busca em Grafos (PDF)'
                  : tipoConteudo === 'exercicio'
                  ? 'Ex: Lista de Exercícios 3'
                  : 'Ex: Aula 4: Introdução às Árvores Balanceadas'
              }
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              URL / Link Externo <span className="text-zinc-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="url"
              placeholder={
                tipoConteudo === 'leitura'
                  ? 'https://drive.google.com/... ou link do PDF/artigo'
                  : 'https://www.youtube.com/... (Deixe em branco se não foi liberado)'
              }
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Duração Estimada em Minutos <span className="text-zinc-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              placeholder="30"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              className="w-full input-sleek px-3 py-2 text-sm rounded-lg font-mono"
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
              {videoParaEditar ? 'Salvar Alterações' : 'Cadastrar Conteúdo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
