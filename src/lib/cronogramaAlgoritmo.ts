import { Materia, Unidade, Video, Atividade, ConfiguracaoCronograma, MetaEstudoDiario, ItemMetaEstudo, MateriaAgendadaDiaria } from './types';

const NOMES_DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function gerarPlanoEstudos(
  materias: Materia[],
  unidades: Unidade[],
  videos: Video[],
  atividades: Atividade[],
  config: ConfiguracaoCronograma
): MetaEstudoDiario[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeStr = hoje.toISOString().split('T')[0];

  // 1. Mapeia matérias para busca rápida
  const mapaMaterias = new Map<string, { id: string; nome: string }>();
  materias.forEach((m) => mapaMaterias.set(m.id, { id: m.id, nome: m.nome }));

  // 2. Ordena unidades prioritariamente por dataFim mais próxima
  const unidadesOrdenadas = [...unidades].sort((a, b) => a.dataFim.localeCompare(b.dataFim));

  // 3. Agrupa unidades e contagem de pendências por matéria
  interface MateriaPendenteInfo {
    materiaId: string;
    materiaNome: string;
    unidadeId: string;
    unidadeTitulo: string;
    dataFimUnidade: string;
    itensPendentes: ItemMetaEstudo[];
  }

  const materiasPendentesMap = new Map<string, MateriaPendenteInfo>();

  unidadesOrdenadas.forEach((uni) => {
    const mat = mapaMaterias.get(uni.materiaId);
    const materiaNome = mat ? mat.nome : 'Matéria';

    const vids = videos.filter((v) => v.unidadeId === uni.id && (!v.assistido || config.incluirConcluidas));
    const ativs = atividades.filter((a) => a.unidadeId === uni.id && (!a.concluida || config.incluirConcluidas));

    if (vids.length > 0 || ativs.length > 0 || !materiasPendentesMap.has(uni.materiaId)) {
      const itens: ItemMetaEstudo[] = [
        ...vids.map((v) => ({
          id: v.id,
          tipo: 'video' as const,
          titulo: v.titulo,
          url: v.url,
          concluido: Boolean(v.assistido),
          materiaNome,
          unidadeId: uni.id,
          unidadeTitulo: uni.titulo,
          dataFimUnidade: uni.dataFim,
          tipoConteudo: v.tipoConteudo
        })),
        ...ativs.map((a) => ({
          id: a.id,
          tipo: 'atividade' as const,
          titulo: a.titulo,
          concluido: a.concluida,
          materiaNome,
          unidadeId: uni.id,
          unidadeTitulo: uni.titulo,
          dataFimUnidade: uni.dataFim
        }))
      ];

      if (!materiasPendentesMap.has(uni.materiaId)) {
        materiasPendentesMap.set(uni.materiaId, {
          materiaId: uni.materiaId,
          materiaNome,
          unidadeId: uni.id,
          unidadeTitulo: uni.titulo,
          dataFimUnidade: uni.dataFim,
          itensPendentes: itens
        });
      } else {
        const existente = materiasPendentesMap.get(uni.materiaId)!;
        existente.itensPendentes.push(...itens);
      }
    }
  });

  const listaMateriasDisponiveis = Array.from(materiasPendentesMap.values());

  // Limite estrito de matérias distintas por dia
  const maxMateriasPorDia =
    config.materiasPorDia === 'auto'
      ? 2
      : typeof config.materiasPorDia === 'number'
      ? config.materiasPorDia
      : 1;

  // 4. Monta o cronograma diário alocando apenas as MATÉRIAS
  const planoDiario: MetaEstudoDiario[] = [];
  let indexMateriaAtual = 0;

  for (let offset = 0; offset < 14; offset++) {
    const dataAtual = new Date(hoje);
    dataAtual.setDate(dataAtual.getDate() + offset);
    const diaDaSemana = dataAtual.getDay();
    const dataStr = dataAtual.toISOString().split('T')[0];

    // Se o dia não foi selecionado pelo usuário nas opções de estudo, pula
    if (!config.diasSemana.includes(diaDaSemana)) {
      continue;
    }

    const materiasAgendadasDoDia: MateriaAgendadaDiaria[] = [];
    const todosItensDoDia: ItemMetaEstudo[] = [];

    if (listaMateriasDisponiveis.length > 0) {
      for (let i = 0; i < maxMateriasPorDia; i++) {
        const materiaObj = listaMateriasDisponiveis[indexMateriaAtual % listaMateriasDisponiveis.length];
        
        // Evita duplicatas no mesmo dia caso haja poucas matérias
        if (!materiasAgendadasDoDia.some((m) => m.materiaId === materiaObj.materiaId)) {
          materiasAgendadasDoDia.push({
            materiaId: materiaObj.materiaId,
            materiaNome: materiaObj.materiaNome,
            unidadeId: materiaObj.unidadeId,
            unidadeTitulo: materiaObj.unidadeTitulo,
            totalItensPendentes: materiaObj.itensPendentes.length,
            dataFimUnidade: materiaObj.dataFimUnidade
          });

          todosItensDoDia.push(...materiaObj.itensPendentes);
        }
        indexMateriaAtual++;
      }
    }

    planoDiario.push({
      data: dataStr,
      diaSemanaNome: NOMES_DIAS[diaDaSemana],
      isHoje: dataStr === hojeStr,
      materiasAgendadas: materiasAgendadasDoDia,
      itens: todosItensDoDia
    });
  }

  return planoDiario;
}
