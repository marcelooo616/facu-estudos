export interface Materia {
  id: string;
  nome: string;
  semestre: string;
  descricao: string;
  codigo?: string;
}

export interface Unidade {
  id: string;
  materiaId: string;
  titulo: string;
  dataInicio: string; // Formato YYYY-MM-DD
  dataFim: string; // Formato YYYY-MM-DD
  concluida?: boolean;
}

export type TipoConteudoMaterial = 'video' | 'leitura' | 'exercicio' | 'outro';

export interface Video {
  id: string;
  unidadeId: string;
  titulo: string;
  url?: string;
  duracaoMinutos?: number;
  assistido?: boolean;
  tipoConteudo?: TipoConteudoMaterial;
}

export interface Atividade {
  id: string;
  unidadeId: string;
  titulo: string;
  descricao: string;
  concluida: boolean;
}

export type AbaNavegacao = 'dashboard' | 'setup' | 'foco' | 'cronograma';

export type StatusCorUnidade = 'vermelho' | 'amarelo' | 'verde';

export interface UnidadeComDetalhes extends Unidade {
  materiaNome: string;
  materiaSemestre: string;
  totalVideos: number;
  videosAssistidos: number;
  totalAtividades: number;
  atividadesConcluidas: number;
  percentualConclusao: number;
  statusCor: StatusCorUnidade;
  statusAtiva: boolean;
}

export interface ConfiguracaoCronograma {
  diasSemana: number[]; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  materiasPorDia: 'auto' | 1 | 2 | 3;
  incluirConcluidas: boolean;
}

export interface ItemMetaEstudo {
  id: string;
  tipo: 'video' | 'atividade';
  titulo: string;
  url?: string;
  concluido: boolean;
  materiaNome: string;
  unidadeId: string;
  unidadeTitulo: string;
  dataFimUnidade: string;
  tipoConteudo?: TipoConteudoMaterial;
}

export interface MateriaAgendadaDiaria {
  materiaId: string;
  materiaNome: string;
  unidadeId: string;
  unidadeTitulo: string;
  totalItensPendentes: number;
  dataFimUnidade: string;
}

export interface MetaEstudoDiario {
  data: string; // YYYY-MM-DD
  diaSemanaNome: string;
  isHoje: boolean;
  materiasAgendadas: MateriaAgendadaDiaria[];
  itens: ItemMetaEstudo[];
}
