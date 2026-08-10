import { useState, useEffect, useCallback } from 'react';
import { Materia, Unidade, Video, Atividade, UnidadeComDetalhes, TipoConteudoMaterial, StatusCorUnidade, ConfiguracaoCronograma } from '@/lib/types';
import { estudosService } from '@/lib/estudosService';

export function useEstudos() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [configuracaoCronograma, setConfiguracaoCronograma] = useState<ConfiguracaoCronograma>({
    diasSemana: [1, 2, 3, 4, 5],
    materiasPorDia: 'auto',
    incluirConcluidas: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('facu_cronograma_config');
      if (raw) {
        try {
          setConfiguracaoCronograma(JSON.parse(raw));
        } catch (e) {}
      }
    }
  }, []);

  const salvarConfiguracaoCronograma = (novaConfig: ConfiguracaoCronograma) => {
    setConfiguracaoCronograma(novaConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('facu_cronograma_config', JSON.stringify(novaConfig));
    }
  };

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

  // Obter unidades com vigência na data informada
  const obterUnidadesAtivas = useCallback(
    (dataFiltroStr: string): UnidadeComDetalhes[] => {
      return unidades
        .filter((u) => u.dataInicio <= dataFiltroStr && u.dataFim >= dataFiltroStr)
        .map((uni) => {
          const materia = materias.find((m) => m.id === uni.materiaId);
          const vids = videos.filter((v) => v.unidadeId === uni.id);
          const vidsAssistidos = vids.filter((v) => v.assistido).length;
          const ativs = atividades.filter((a) => a.unidadeId === uni.id);
          const ativsConcluidas = ativs.filter((a) => a.concluida).length;

          const totalItens = vids.length + ativs.length;
          const itensConcluidos = vidsAssistidos + ativsConcluidas;
          const percentualConclusao = uni.concluida
            ? 100
            : totalItens > 0
            ? Math.round((itensConcluidos / totalItens) * 100)
            : 0;

          let statusCor: StatusCorUnidade = 'vermelho';
          if (percentualConclusao >= 100 || uni.concluida) {
            statusCor = 'verde';
          } else if (percentualConclusao >= 50) {
            statusCor = 'amarelo';
          }

          return {
            ...uni,
            materiaNome: materia ? materia.nome : 'Matéria Não Encontrada',
            materiaSemestre: materia ? materia.semestre : '',
            totalVideos: vids.length,
            videosAssistidos: vidsAssistidos,
            totalAtividades: ativs.length,
            atividadesConcluidas: ativsConcluidas,
            percentualConclusao,
            statusCor,
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
      const vidsAssistidos = vids.filter((v) => v.assistido).length;
      const ativs = atividades.filter((a) => a.unidadeId === uni.id);
      const ativsConcluidas = ativs.filter((a) => a.concluida).length;

      const totalItens = vids.length + ativs.length;
      const itensConcluidos = vidsAssistidos + ativsConcluidas;
      const percentualConclusao = uni.concluida
        ? 100
        : totalItens > 0
        ? Math.round((itensConcluidos / totalItens) * 100)
        : 0;

      let statusCor: StatusCorUnidade = 'vermelho';
      if (percentualConclusao >= 100 || uni.concluida) {
        statusCor = 'verde';
      } else if (percentualConclusao >= 50) {
        statusCor = 'amarelo';
      }

      const hojeStr = new Date().toISOString().split('T')[0];
      const ativa = uni.dataInicio <= hojeStr && uni.dataFim >= hojeStr;

      return {
        ...uni,
        materiaNome: materia ? materia.nome : 'Matéria Não Encontrada',
        materiaSemestre: materia ? materia.semestre : '',
        totalVideos: vids.length,
        videosAssistidos: vidsAssistidos,
        totalAtividades: ativs.length,
        atividadesConcluidas: ativsConcluidas,
        percentualConclusao,
        statusCor,
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

  const alternarUnidadeConcluida = async (id: string) => {
    await estudosService.alternarUnidadeConcluida(id);
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
    configuracaoCronograma,
    salvarConfiguracaoCronograma,
    obterUnidadesAtivas,
    obterDetalhesUnidade,
    adicionarMateria,
    removerMateria,
    adicionarUnidade,
    gerarMultiplasUnidades,
    removerUnidade,
    alternarUnidadeConcluida,
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
