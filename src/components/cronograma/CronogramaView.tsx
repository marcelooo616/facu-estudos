import React, { useState, useEffect } from 'react';
import { Materia, Unidade, Video, Atividade, ConfiguracaoCronograma } from '@/lib/types';
import { gerarPlanoEstudos } from '@/lib/cronogramaAlgoritmo';
import { CardDiaCronograma } from './CardDiaCronograma';
import { ModalConfigCronograma } from './ModalConfigCronograma';
import { EstadoVazio } from '../common/EstadoVazio';
import { Calendar, Sliders, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface CronogramaViewProps {
  materias: Materia[];
  unidades: Unidade[];
  videos: Video[];
  atividades: Atividade[];
  aoAlternarAtividade: (id: string) => void;
  aoSelecionarFoco: (unidadeId: string) => void;
  aoNavegarParaSetup: () => void;
}

export const CronogramaView: React.FC<CronogramaViewProps> = ({
  materias,
  unidades,
  videos,
  atividades,
  aoAlternarAtividade,
  aoSelecionarFoco,
  aoNavegarParaSetup
}) => {
  const [config, setConfig] = useState<ConfiguracaoCronograma>({
    diasSemana: [1, 2, 3, 4, 5],
    materiasPorDia: 'auto',
    incluirConcluidas: false
  });
  const [modalConfigAberto, setModalConfigAberto] = useState(false);

  useEffect(() => {
    async function carregarConfigDB() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('facu_estudos_token') : null;
        if (token) {
          const res = await fetch('/api/cronograma/config', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setConfig(data.configuracao);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar configuracao do cronograma:', err);
      }
    }
    carregarConfigDB();
  }, []);

  const salvarConfigDB = async (novaConfig: ConfiguracaoCronograma) => {
    setConfig(novaConfig);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('facu_estudos_token') : null;
      if (token) {
        await fetch('/api/cronograma/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(novaConfig)
        });
      }
    } catch (err) {
      console.error('Erro ao salvar configuracao do cronograma:', err);
    }
  };

  const planoDiario = gerarPlanoEstudos(materias, unidades, videos, atividades, config);
  const totalMetasPlano = planoDiario.reduce((acc, dia) => acc + dia.itens.length, 0);

  if (materias.length === 0 || unidades.length === 0) {
    return (
      <div className="space-y-6 animate-sleek-in">
        <div className="border-b border-[#1E293B] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Cronograma Inteligente
            <Calendar className="w-5 h-5 text-[#3B82F6]" />
          </h1>
        </div>
        <EstadoVazio
          icone={Layers}
          titulo="Nenhum cronograma a ser calculado"
          descricao="Cadastre suas matérias e unidades com datas de término para que o sistema gere seu plano de estudos flexível."
          textoBotao="Configurar Matérias"
          aoClicarBotao={aoNavegarParaSetup}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-sleek-in">
      {/* Cabeçalho do Cronograma */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono badge-sleek-blue font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#3B82F6]" /> AGENDA ADAPTATIVA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Cronograma de Estudos Flexível
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Plano diário inteligente ajustado aos prazos de término e suas preferências de rotina.
          </p>
        </div>

        <button
          onClick={() => setModalConfigAberto(true)}
          className="btn-sleek-primary flex items-center justify-center space-x-2 px-4 py-2.5 text-xs rounded-xl cursor-pointer self-start md:self-auto"
        >
          <Sliders className="w-4 h-4" />
          <span>Ajustar Preferências</span>
        </button>
      </div>

      {/* Resumo da Configuração Atual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sleek-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-mono">Dias Selecionados</p>
            <h3 className="text-xl font-bold text-white mt-1 font-mono">{config.diasSemana.length} dias / semana</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="sleek-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-mono">Carga por Dia</p>
            <h3 className="text-xl font-bold text-[#3B82F6] mt-1 font-mono uppercase">
              {config.materiasPorDia === 'auto' ? 'Automático (IA)' : `${config.materiasPorDia} Matéria(s)`}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="sleek-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-mono">Total de Obrigações</p>
            <h3 className="text-xl font-bold text-emerald-400 mt-1 font-mono">{totalMetasPlano} Metas Alocadas</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grade Diária do Cronograma */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">Próximos Dias de Estudo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planoDiario.map((dia) => (
            <CardDiaCronograma
              key={dia.data}
              metaDia={dia}
              aoAlternarAtividade={aoAlternarAtividade}
              aoNavegarParaFoco={aoSelecionarFoco}
            />
          ))}
        </div>
      </div>

      {/* Modal de Preferências */}
      <ModalConfigCronograma
        estaAberto={modalConfigAberto}
        config={config}
        aoFechar={() => setModalConfigAberto(false)}
        aoSalvar={salvarConfigDB}
      />
    </div>
  );
};
