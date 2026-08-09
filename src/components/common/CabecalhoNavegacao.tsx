import React, { useState } from 'react';
import { AbaNavegacao } from '@/lib/types';
import { Usuario } from '@/hooks/useAuth';
import { ModalAutenticacao } from '../auth/ModalAutenticacao';
import { LayoutDashboard, Settings, Target, CalendarDays, RefreshCw, Zap, User, LogOut, LogIn } from 'lucide-react';

interface CabecalhoNavegacaoProps {
  abaAtiva: AbaNavegacao;
  aoMudarAba: (aba: AbaNavegacao) => void;
  unidadeSelecionadaId: string | null;
  aoResetarDados: () => void;
  usuario: Usuario | null;
  aoRegistrar: (nome: string, email: string, senha: string) => Promise<void>;
  aoFazerLogin: (email: string, senha: string) => Promise<void>;
  aoFazerLogout: () => void;
}

export const CabecalhoNavegacao: React.FC<CabecalhoNavegacaoProps> = ({
  abaAtiva,
  aoMudarAba,
  unidadeSelecionadaId,
  aoResetarDados,
  usuario,
  aoRegistrar,
  aoFazerLogin,
  aoFazerLogout
}) => {
  const [modalAuthAberto, setModalAuthAberto] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Marca Sleek */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
                <Zap className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  FACU<span className="text-[10px] px-1.5 py-0.5 rounded font-mono badge-sleek-blue font-semibold">SLEEK</span>
                </span>
                <p className="text-[10px] text-zinc-400 hidden sm:block font-mono">
                  {usuario ? `Ambiente Privado de ${usuario.nome}` : 'Minimalist Academic Workspace'}
                </p>
              </div>
            </div>

            {/* Navegação de Abas Sleek */}
            <nav className="flex items-center space-x-1 bg-[#111827] p-1.5 rounded-xl border border-[#1E293B]">
              <button
                onClick={() => aoMudarAba('dashboard')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'dashboard'
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1F2937]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Visão Geral</span>
              </button>

              <button
                onClick={() => aoMudarAba('cronograma')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'cronograma'
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1F2937]'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Cronograma</span>
              </button>

              <button
                onClick={() => aoMudarAba('setup')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'setup'
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1F2937]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Setup Matérias</span>
              </button>

              <button
                onClick={() => aoMudarAba('foco')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'foco'
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1F2937]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Área de Foco</span>
                {unidadeSelecionadaId && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            </nav>

            {/* Painel do Usuário / Login / Mocks */}
            <div className="flex items-center space-x-2">
              {usuario ? (
                <div className="flex items-center space-x-2 bg-[#111827] p-1.5 rounded-xl border border-[#1E293B]">
                  <div className="flex items-center space-x-2 px-2">
                    <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-xs font-bold font-mono">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-zinc-200 font-semibold max-w-[100px] truncate hidden md:inline">
                      {usuario.nome}
                    </span>
                  </div>
                  <button
                    onClick={aoFazerLogout}
                    title="Sair da Conta"
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-[#1F2937] rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setModalAuthAberto(true)}
                  className="btn-sleek-primary flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar / Cadastrar</span>
                </button>
              )}

              {!usuario && (
                <button
                  onClick={aoResetarDados}
                  title="Restaurar dados de demonstração local"
                  className="btn-sleek-secondary flex items-center space-x-1.5 px-2.5 py-1.5 text-xs cursor-pointer font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden lg:inline text-[11px]">Mocks</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <ModalAutenticacao
        estaAberto={modalAuthAberto}
        aoFechar={() => setModalAuthAberto(false)}
        aoRegistrar={aoRegistrar}
        aoFazerLogin={aoFazerLogin}
      />
    </>
  );
};
