import { Materia, Unidade, Video, Atividade, ConfiguracaoCronograma, MetaEstudoDiario, ItemMetaEstudo } from './types';

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

  // 3. Monta lista de tarefas e vídeos pendentes organizados por matéria e prazo
  interface ItemExt extends ItemMetaEstudo {
    materiaId: string;
  }

  const todosItens: ItemExt[] = [];

  unidadesOrdenadas.forEach((uni) => {
    const mat = mapaMaterias.get(uni.materiaId);
    const materiaNome = mat ? mat.nome : 'Matéria';

    // Vídeos da unidade (apenas pendentes/não assistidos)
    const vids = videos.filter((v) => v.unidadeId === uni.id);
    vids.forEach((v) => {
      if (!v.assistido || config.incluirConcluidas) {
        todosItens.push({
          id: v.id,
          tipo: 'video',
          titulo: v.titulo,
          url: v.url,
          concluido: Boolean(v.assistido),
          materiaId: uni.materiaId,
          materiaNome,
          unidadeId: uni.id,
          unidadeTitulo: uni.titulo,
          dataFimUnidade: uni.dataFim
        });
      }
    });

    // Atividades da unidade
    const ativs = atividades.filter((a) => a.unidadeId === uni.id);
    ativs.forEach((a) => {
      if (!a.concluida || config.incluirConcluidas) {
        todosItens.push({
          id: a.id,
          tipo: 'atividade',
          titulo: a.titulo,
          concluido: a.concluida,
          materiaId: uni.materiaId,
          materiaNome,
          unidadeId: uni.id,
          unidadeTitulo: uni.titulo,
          dataFimUnidade: uni.dataFim
        });
      }
    });
  });

  // Limite estrito de matérias distintas por dia
  const maxMateriasDistintasPorDia =
    config.materiasPorDia === 'auto'
      ? 2
      : typeof config.materiasPorDia === 'number'
      ? config.materiasPorDia
      : 1;

  // 4. Constrói os próximos 14 dias de estudo respeitando estritamente o limite de matérias distintas por dia
  const planoDiario: MetaEstudoDiario[] = [];
  const itensProcessados = new Set<string>();

  for (let offset = 0; offset < 14; offset++) {
    const dataAtual = new Date(hoje);
    dataAtual.setDate(dataAtual.getDate() + offset);
    const diaDaSemana = dataAtual.getDay();
    const dataStr = dataAtual.toISOString().split('T')[0];

    // Se não for um dos dias escolhidos pelo aluno, pula este dia
    if (!config.diasSemana.includes(diaDaSemana)) {
      continue;
    }

    const materiasAlocadasNoDia = new Set<string>();
    const itensDoDia: ItemMetaEstudo[] = [];

    for (const item of todosItens) {
      if (itensProcessados.has(item.id)) continue;

      // Se a matéria do item já foi adicionada hoje OU se o dia ainda aceita novas matérias
      if (
        materiasAlocadasNoDia.has(item.materiaId) ||
        materiasAlocadasNoDia.size < maxMateriasDistintasPorDia
      ) {
        materiasAlocadasNoDia.add(item.materiaId);
        itensDoDia.push(item);
        itensProcessados.add(item.id);

        // Limita a quantidade máxima de itens por dia para não sobrecarregar
        if (itensDoDia.length >= maxMateriasDistintasPorDia * 3) {
          break;
        }
      }
    }

    planoDiario.push({
      data: dataStr,
      diaSemanaNome: NOMES_DIAS[diaDaSemana],
      isHoje: dataStr === hojeStr,
      itens: itensDoDia
    });

    if (itensProcessados.size >= todosItens.length && offset >= 6) {
      break;
    }
  }

  return planoDiario;
}
