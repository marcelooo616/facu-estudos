import { useState, useEffect, useCallback } from 'react';
import { Materia, Unidade, Video, Atividade, UnidadeComDetalhes, TipoConteudoMaterial } from '@/lib/types';
import { estudosService } from '@/lib/estudosService';

export function useEstudos() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      await estudosService.inicializarDados();
      const [m, u, v, a] = await Promise.all([
        estudosService.obterMaterias(),
        estudosService.obterUnidades(),
        estudosService.obterVideos(),
        estudosService.obterAtividades()
      ]);
      setMaterias(m);
      setUnidades(u);
      setVideos(v);
      setAtividades(a);
    } catch (err) {
      console.error('Erro ao carregar dados de estudos:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Obter Unidades ativas em uma data (default: hoje)
  const obterUnidadesAtivas = useCallback(
    (dataRefStr?: string): UnidadeComDetalhes[] => {
      const hojeStr = dataRefStr || new Date().toISOString().split('T')[0];

      return unidades
        .filter((uni) => uni.dataInicio <= hojeStr && uni.dataFim >= hojeStr)
        .map((uni) => {
          const materia = materias.find((m) => m.id === uni.materiaId);
          const vids = videos.filter((v) => v.unidadeId === uni.id);
          const ativs = atividades.filter((a) => a.unidadeId === uni.id);
          const concluidas = ativs.filter((a) => a.concluida).length;

          return {
            ...uni,
            materiaNome: materia ? materia.nome : 'Matéria Não Encontrada',
            materiaSemestre: materia ? materia.semestre : '',
            totalVideos: vids.length,
            totalAtividades: ativs.length,
            atividadesConcluidas: concluidas,
            statusAtiva: true
          };
        });
    },
    [unidades, materias, videos, atividades]
  );

  // Obter detalhes de uma unidade específica
  const obterDetalhesUnidade = useCallback(
    (unidadeId: string): UnidadeComDetalhes | null => {
      const uni = unidades.find((u) => u.id === unidadeId);
      if (!uni) return null;

      const materia = materias.find((m) => m.id === uni.materiaId);
      const vids = videos.filter((v) => v.unidadeId === uni.id);
      const ativs = atividades.filter((a) => a.unidadeId === uni.id);
      const concluidas = ativs.filter((a) => a.concluida).length;

      const hojeStr = new Date().toISOString().split('T')[0];
      const ativa = uni.dataInicio <= hojeStr && uni.dataFim >= hojeStr;

      return {
        ...uni,
        materiaNome: materia ? materia.nome : 'Matéria Não Encontrada',
        materiaSemestre: materia ? materia.semestre : '',
        totalVideos: vids.length,
        totalAtividades: ativs.length,
        atividadesConcluidas: concluidas,
        statusAtiva: ativa
      };
    },
    [unidades, materias, videos, atividades]
  );

  // AÇÕES
  const adicionarMateria = async (dados: Omit<Materia, 'id'>) => {
    await estudosService.criarMateria(dados);
    await carregarDados();
  };

  const removerMateria = async (id: string) => {
    await estudosService.excluirMateria(id);
    await carregarDados();
  };

  const adicionarUnidade = async (dados: Omit<Unidade, 'id'>) => {
    await estudosService.criarUnidade(dados);
    await carregarDados();
  };

  const gerarMultiplasUnidades = async (
    materiaId: string,
    quantidade: number,
    dataInicio: string,
    diasPorUnidade: number
  ) => {
    await estudosService.criarMultiplasUnidades(materiaId, quantidade, dataInicio, diasPorUnidade);
    await carregarDados();
  };

  const removerUnidade = async (id: string) => {
    await estudosService.excluirUnidade(id);
    await carregarDados();
  };

  const adicionarVideo = async (dados: Omit<Video, 'id'>) => {
    await estudosService.criarVideo(dados);
    await carregarDados();
  };

  const editarVideo = async (
    id: string,
    dados: { titulo: string; url?: string; duracaoMinutos?: number; tipoConteudo?: TipoConteudoMaterial }
  ) => {
    await estudosService.editarVideo(id, dados);
    await carregarDados();
  };

  const alternarVideoAssistido = async (id: string) => {
    await estudosService.alternarVideoAssistido(id);
    await carregarDados();
  };

  const removerVideo = async (id: string) => {
    await estudosService.excluirVideo(id);
    await carregarDados();
  };

  const adicionarAtividade = async (dados: Omit<Atividade, 'id' | 'concluida'>) => {
    await estudosService.criarAtividade(dados);
    await carregarDados();
  };

  const alternarAtividade = async (id: string) => {
    await estudosService.alternarStatusAtividade(id);
    await carregarDados();
  };

  const removerAtividade = async (id: string) => {
    await estudosService.excluirAtividade(id);
    await carregarDados();
  };

  const resetarParaMocks = async () => {
    await estudosService.resetarParaMocks();
    await carregarDados();
  };

  return {
    materias,
    unidades,
    videos,
    atividades,
    carregando,
    obterUnidadesAtivas,
    obterDetalhesUnidade,
    adicionarMateria,
    removerMateria,
    adicionarUnidade,
    gerarMultiplasUnidades,
    removerUnidade,
    adicionarVideo,
    editarVideo,
    alternarVideoAssistido,
    removerVideo,
    adicionarAtividade,
    alternarAtividade,
    removerAtividade,
    resetarParaMocks
  };
}
