'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEstudos } from '@/hooks/useEstudos';
import { CabecalhoNavegacao } from '@/components/common/CabecalhoNavegacao';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { SetupMateriaView } from '@/components/setup/SetupMateriaView';
import { AreaFocoView } from '@/components/foco/AreaFocoView';
import { CronogramaView } from '@/components/cronograma/CronogramaView';
import { LandingPageHome } from '@/components/home/LandingPageHome';
import { ModalAutenticacao } from '@/components/auth/ModalAutenticacao';
import { AbaNavegacao } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { usuario, carregandoAuth: authCarregando, login, registrar, logout } = useAuth();
  const {
    materias,
    unidades,
    videos,
    atividades,
    configuracaoCronograma,
    salvarConfiguracaoCronograma,
    carregando: estudosCarregando,
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
    removerAtividade
  } = useEstudos();

  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('dashboard');
  const [unidadeSelecionadaFocoId, setUnidadeSelecionadaFocoId] = useState<string | null>(null);

  // Estados para Modal de Autenticação na Landing Page
  const [modalAuthAberto, setModalAuthAberto] = useState(false);
  const [modoAuthInicial, setModoAuthInicial] = useState<'login' | 'registrar'>('login');

  const hojeStr = new Date().toISOString().split('T')[0];
  const unidadesAtivasHoje = obterUnidadesAtivas(hojeStr);

  const navegarParaFoco = (unidadeId: string) => {
    setUnidadeSelecionadaFocoId(unidadeId);
    setAbaAtiva('foco');
  };

  // Carregamento Inicial
  if (authCarregando || (usuario && estudosCarregando)) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center space-y-4 font-mono">
        <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" />
        <p className="text-xs text-slate-400">Sincronizando ambiente de estudos Tetris Workspace...</p>
      </div>
    );
  }

  // Se o usuário NÃO estiver logado, exibe a Landing Page de Apresentação com Modal de Login/Registro
  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col justify-between p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full pt-4 font-mono">
          <span className="font-extrabold text-base tracking-wider text-white">
            FACU<span className="text-[#06B6D4]">.SPA</span>
          </span>

          <div className="space-x-3">
            <button
              onClick={() => {
                setModoAuthInicial('login');
                setModalAuthAberto(true);
              }}
              className="btn-tetris-secondary px-4 py-2 text-xs rounded-xl cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setModoAuthInicial('registrar');
                setModalAuthAberto(true);
              }}
              className="btn-tetris-purple px-4 py-2 text-xs rounded-xl cursor-pointer"
            >
              Cadastre-se
            </button>
          </div>
        </div>

        <LandingPageHome
          aoAbrirLogin={() => {
            setModoAuthInicial('login');
            setModalAuthAberto(true);
          }}
          aoAbrirRegistro={() => {
            setModoAuthInicial('registrar');
            setModalAuthAberto(true);
          }}
        />

        <ModalAutenticacao
          estaAberto={modalAuthAberto}
          modoInicial={modoAuthInicial}
          aoFechar={() => setModalAuthAberto(false)}
          aoFazerLogin={login}
          aoRegistrar={registrar}
        />

        <footer className="text-center text-xs text-slate-500 font-mono py-4">
          FACU SPA — Tetris Geometric Academic Workspace
        </footer>
      </div>
    );
  }

  // Usuário Autenticado: Exibe o Painel Operacional da SPA
  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] flex flex-col">
      {/* Navegação Superior Arcade Scoreboard */}
      <CabecalhoNavegacao
        abaAtiva={abaAtiva}
        aoMudarAba={(aba) => {
          if (aba !== 'foco') {
            setUnidadeSelecionadaFocoId(null);
          }
          setAbaAtiva(aba);
        }}
        usuarioNome={usuario.nome}
        aoFazerLogout={logout}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {abaAtiva === 'dashboard' && (
          <DashboardView
            unidadesAtivas={unidadesAtivasHoje}
            materias={materias}
            unidades={unidades}
            videos={videos}
            atividades={atividades}
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
            configuracao={configuracaoCronograma}
            aoSalvarConfiguracao={salvarConfiguracaoCronograma}
            aoSelecionarFoco={navegarParaFoco}
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
            aoAlternarUnidadeConcluida={alternarUnidadeConcluida}
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

      {/* Rodapé Sleek Tetris */}
      <footer className="border-t-2 border-[#1E293B] py-6 text-center text-xs text-slate-500 font-mono">
        <p>FACU SPA — Tetris Geometric Academic Workspace (Vercel Serverless & Node.js Backend)</p>
      </footer>
    </div>
  );
}
