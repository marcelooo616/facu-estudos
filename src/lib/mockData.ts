import { Materia, Unidade, Video, Atividade } from './types';

export const MOCK_MATERIAS: Materia[] = [
  {
    id: 'mat-1',
    nome: 'Estruturas de Dados e Algoritmos',
    semestre: '2026.1',
    descricao: 'Estudo avançado de listas, árvores, grafos, ordenação e complexidade de algoritmos.',
    codigo: 'COMP301'
  },
  {
    id: 'mat-2',
    nome: 'Sistemas Operacionais',
    semestre: '2026.1',
    descricao: 'Conceitos de processos, threads, gerenciamento de memória, sistemas de arquivos e concorrência.',
    codigo: 'COMP302'
  },
  {
    id: 'mat-3',
    nome: 'Arquitetura de Software',
    semestre: '2026.1',
    descricao: 'Padrões de projeto, arquitetura orientada a serviços, microsserviços e Clean Architecture.',
    codigo: 'COMP303'
  }
];

export const MOCK_UNIDADES: Unidade[] = [
  // Matéria 1: ED (Ativa agora)
  {
    id: 'uni-1',
    materiaId: 'mat-1',
    titulo: 'Unidade 3: Árvores Binárias de Busca e AVL',
    dataInicio: '2026-08-03',
    dataFim: '2026-08-16'
  },
  {
    id: 'uni-2',
    materiaId: 'mat-1',
    titulo: 'Unidade 4: Algoritmos em Grafos (BFS e DFS)',
    dataInicio: '2026-08-17',
    dataFim: '2026-08-30'
  },

  // Matéria 2: SO (Ativa agora)
  {
    id: 'uni-3',
    materiaId: 'mat-2',
    titulo: 'Unidade 2: Gerenciamento de Memória Paginada e Virtual',
    dataInicio: '2026-08-01',
    dataFim: '2026-08-14'
  },

  // Matéria 3: Arq Soft (Futura/Passada)
  {
    id: 'uni-4',
    materiaId: 'mat-3',
    titulo: 'Unidade 1: Padrões Criacionais e Estruturais',
    dataInicio: '2026-07-20',
    dataFim: '2026-08-02'
  },
  {
    id: 'uni-5',
    materiaId: 'mat-3',
    titulo: 'Unidade 2: Arquiteturas Hexagonal e Clean Architecture',
    dataInicio: '2026-08-10',
    dataFim: '2026-08-24'
  }
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    unidadeId: 'uni-1',
    titulo: 'Conceito e Propriedades de Árvores AVL',
    url: 'https://www.youtube.com/watch?v=FNeL18KsWPc',
    duracaoMinutos: 45
  },
  {
    id: 'vid-2',
    unidadeId: 'uni-1',
    titulo: 'Rotação Simples e Dupla em Árvores Balanceadas',
    url: 'https://www.youtube.com/watch?v=vRwiTWevlGg',
    duracaoMinutos: 32
  },
  {
    id: 'vid-3',
    unidadeId: 'uni-3',
    titulo: 'Algoritmos de Substituição de Páginas (LRU, FIFO)',
    url: 'https://www.youtube.com/watch?v=3-N1G159tE0',
    duracaoMinutos: 50
  }
];

export const MOCK_ATIVIDADES: Atividade[] = [
  {
    id: 'ati-1',
    unidadeId: 'uni-1',
    titulo: 'Implementar inserção com balanceamento em C++',
    descricao: 'Criar uma classe AVLTree com métodos de inserção e rotação à esquerda e à direita.',
    concluida: true
  },
  {
    id: 'ati-2',
    unidadeId: 'uni-1',
    titulo: 'Resolver Lista de Exercícios 3 (Complexidade)',
    descricao: 'Demonstrar por indução a altura máxima de uma árvore AVL com N nós.',
    concluida: false
  },
  {
    id: 'ati-3',
    unidadeId: 'uni-3',
    titulo: 'Simulador de Paging em Python',
    descricao: 'Desenvolver script que calcula os faltas de página (page faults) para uma dada referência.',
    concluida: false
  }
];
