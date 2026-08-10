import React from 'react';
import { AbaNavegacao } from '@/lib/types';
import { LayoutDashboard, Settings, Target, Calendar, Gamepad2, LogOut, User } from 'lucide-react';

interface CabecalhoNavegacaoProps {
  abaAtiva: AbaNavegacao;
  aoMudarAba: (aba: AbaNavegacao) => void;
  usuarioNome?: string;
  aoFazerLogout?: () => void;
}

export const CabecalhoNavegacao: React.FC<CabecalhoNavegacaoProps> = ({
  abaAtiva,
  aoMudarAba,
  usuarioNome,
  aoFazerLogout
}) => {
  const abas: { id: AbaNavegacao; rotulo: string; icone: any; corActive: string }[] = [
    { id: 'dashboard', rotulo: 'Dashboard', icone: LayoutDashboard, corActive: 'btn-tetris-primary' },
    { id: 'setup', rotulo: 'Setup Matérias', icone: Settings, corActive: 'btn-tetris-purple' },
    { id: 'foco', rotulo: 'Área de Foco', icone: Target, corActive: 'btn-tetris-purple' },
    { id: 'cronograma', rotulo: 'Cronograma', icone: Calendar, corActive: 'btn-tetris-green' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b-2 border-[#1E293B] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Arcade Style */}
          <div
            onClick={() => aoMudarAba('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#06B6D4] via-[#A855F7] to-[#EC4899] flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white font-mono flex items-center gap-1">
                FACU<span className="text-[#06B6D4]">.SPA</span>
              </span>
              <p className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                Academic Tetris Grid
              </p>
            </div>
          </div>

          {/* Abas Estilo Arcade Buttons */}
          <nav className="hidden md:flex items-center space-x-2 bg-[#0F172A] p-1.5 rounded-xl border-2 border-[#1E293B]">
            {abas.map((aba) => {
              const IconeComponente = aba.icone;
              const ativa = abaAtiva === aba.id;

              return (
                <button
                  key={aba.id}
                  onClick={() => aoMudarAba(aba.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    ativa
                      ? `${aba.corActive}`
                      : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <IconeComponente className="w-4 h-4" />
                  <span>{aba.rotulo}</span>
                </button>
              );
            })}
          </nav>

          {/* Perfil e Logout */}
          <div className="flex items-center space-x-3">
            {usuarioNome && (
              <div className="hidden sm:flex items-center space-x-2 bg-[#0F172A] px-3 py-1.5 rounded-xl border-2 border-[#1E293B] text-xs font-mono">
                <User className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="text-slate-200 font-semibold">{usuarioNome}</span>
              </div>
            )}

            {aoFazerLogout && (
              <button
                onClick={aoFazerLogout}
                className="btn-tetris-secondary p-2 rounded-xl text-slate-400 hover:text-red-400 cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navegação Mobile */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#1E293B]">
          {abas.map((aba) => {
            const IconeComponente = aba.icone;
            const ativa = abaAtiva === aba.id;

            return (
              <button
                key={aba.id}
                onClick={() => aoMudarAba(aba.id)}
                className={`flex flex-col items-center space-y-1 py-1 px-2.5 rounded-lg text-[10px] font-mono ${
                  ativa ? 'text-[#06B6D4] font-bold' : 'text-slate-400'
                }`}
              >
                <IconeComponente className="w-4 h-4" />
                <span>{aba.rotulo}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
