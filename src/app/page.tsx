'use client';

import React, { useState } from 'react';
import { useEstudos } from '@/hooks/useEstudos';
import { useAuth } from '@/hooks/useAuth';
import { AbaNavegacao } from '@/lib/types';
import { CabecalhoNavegacao } from '@/components/common/CabecalhoNavegacao';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { SetupMateriaView } from '@/components/setup/SetupMateriaView';
import { AreaFocoView } from '@/components/foco/AreaFocoView';
import { CronogramaView } from '@/components/cronograma/CronogramaView';
import { LandingPageHome } from '@/components/home/LandingPageHome';
import { Loader2 } from 'lucide-react';

export default function PaginaPrincipal() {
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('dashboard');
  const [unidadeSelecionadaFocoId, setUnidadeSelecionadaFocoId] = useState<string | null>(null);
  const [dataFiltroDashboard, setDataFiltroDashboard] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const { usuario, carregandoAuth, registrar, login, logout } = useAuth();

  const {
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
  } = useEstudos();

  const unidadesAtivasHoje = obterUnidadesAtivas(dataFiltroDashboard);

  const totalAtividadesPendentes = atividades.filter((a) => !a.concluida).length;
  const totalAtividadesConcluidas = atividades.filter((a) => a.concluida).length;

  const navegarParaFoco = (unidadeId: string) => {
    setUnidadeSelecionadaFocoId(unidadeId);
    setAbaAtiva('foco');
  };

  if (carregando || carregandoAuth) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Sincronizando ambiente de estudos...</p>
      </div>
    );
  }

  // Se o usuário não estiver logado, exibe a Landing Page de Apresentação da Ferramenta
  if (!usuario) {
    return (
      <LandingPageHome
        aoRegistrar={async (nome, email, senha) => {
          await registrar(nome, email, senha);
          window.location.reload();
        }}
        aoFazerLogin={async (email, senha) => {
          await login(email, senha);
          window.location.reload();
        }}
      />
    );
  }

  // Se o usuário estiver autenticado, exibe o painel operacional da SPA
  return (
    <div className="min-h-screen bg-[#090D16] text-[#F3F4F6] flex flex-col">
      {/* Navegação Superior */}
      <CabecalhoNavegacao
        abaAtiva={abaAtiva}
        aoMudarAba={(aba) => {
          if (aba !== 'foco') {
            setUnidadeSelecionadaFocoId(null);
          }
          setAbaAtiva(aba);
        }}
        unidadeSelecionadaId={unidadeSelecionadaFocoId}
        aoResetarDados={resetarParaMocks}
        usuario={usuario}
        aoRegistrar={async (nome, email, senha) => {
          await registrar(nome, email, senha);
          window.location.reload();
        }}
        aoFazerLogin={async (email, senha) => {
          await login(email, senha);
          window.location.reload();
        }}
        aoFazerLogout={() => {
          logout();
          window.location.reload();
        }}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {abaAtiva === 'dashboard' && (
          <DashboardView
            unidadesAtivas={unidadesAtivasHoje}
            materias={materias}
            totalAtividadesPendentes={totalAtividadesPendentes}
            totalAtividadesConcluidas={totalAtividadesConcluidas}
            dataFiltro={dataFiltroDashboard}
            aoMudarDataFiltro={setDataFiltroDashboard}
            aoSelecionarFoco={navegarParaFoco}
            aoNavegarParaSetup={() => setAbaAtiva('setup')}
          />
        )}

        {abaAtiva === 'cronograma' && (
          <CronogramaView
            materias={materias}
            unidades={unidades}
            videos={videos}
            atividades={atividades}
            aoAlternarAtividade={alternarAtividade}
            aoSelecionarFoco={navegarParaFoco}
            aoNavegarParaSetup={() => setAbaAtiva('setup')}
          />
        )}

        {abaAtiva === 'setup' && (
          <SetupMateriaView
            materias={materias}
            unidades={unidades}
            aoCriarMateria={adicionarMateria}
            aoExcluirMateria={removerMateria}
            aoCriarUnidadeManual={adicionarUnidade}
            aoGerarUnidades={gerarMultiplasUnidades}
            aoExcluirUnidade={removerUnidade}
          />
        )}

        {abaAtiva === 'foco' && (
          <AreaFocoView
            unidadeIdAtiva={unidadeSelecionadaFocoId}
            materias={materias}
            unidades={unidades}
            videos={videos}
            atividades={atividades}
            obterDetalhesUnidade={obterDetalhesUnidade}
            aoMudarUnidade={(id) => setUnidadeSelecionadaFocoId(id)}
            aoCriarUnidade={adicionarUnidade}
            aoAdicionarVideo={adicionarVideo}
            aoEditarVideo={editarVideo}
            aoAlternarVideoAssistido={alternarVideoAssistido}
            aoExcluirVideo={removerVideo}
            aoAdicionarAtividade={adicionarAtividade}
            aoAlternarAtividade={alternarAtividade}
            aoExcluirAtividade={removerAtividade}
            aoNavegarParaSetup={() => setAbaAtiva('setup')}
          />
        )}
      </main>

      {/* Rodapé Sleek Style */}
      <footer className="border-t border-[#1E293B] py-6 text-center text-xs text-zinc-500 font-mono">
        <p>FACU SPA — Minimalist Academic Workspace (Vercel Serverless & Node.js Backend)</p>
      </footer>
    </div>
  );
}
