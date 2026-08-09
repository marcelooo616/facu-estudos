import React, { useState } from 'react';
import { ModalAutenticacao } from '../auth/ModalAutenticacao';
import { Zap, CalendarDays, Target, ShieldCheck, ArrowRight, BookOpen, Layers, CheckCircle2, Sparkles } from 'lucide-react';

interface LandingPageHomeProps {
  aoRegistrar: (nome: string, email: string, senha: string) => Promise<void>;
  aoFazerLogin: (email: string, senha: string) => Promise<void>;
}

export const LandingPageHome: React.FC<LandingPageHomeProps> = ({
  aoRegistrar,
  aoFazerLogin
}) => {
  const [modalAuthAberto, setModalAuthAberto] = useState(false);

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* Cabeçalho da Landing Page */}
      <header className="w-full border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
              <Zap className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              FACU<span className="text-[10px] px-1.5 py-0.5 rounded font-mono badge-sleek-blue font-semibold">SLEEK</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModalAuthAberto(true)}
              className="btn-sleek-secondary px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => setModalAuthAberto(true)}
              className="btn-sleek-primary px-4 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center space-y-6 animate-sleek-in">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full badge-sleek-blue font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Controle Acadêmico Inteligente & Sem Desorganização</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          O Portal de Estudos Universitários Criado para o Seu <span className="text-[#3B82F6]">Foco Absoluto</span>.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Resolva o caos dos portais acadêmicos tradicionais. O FACU organiza seu semestre em disciplinas, unidades com datas manuais precisas, vídeos e checklists diários adaptativos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setModalAuthAberto(true)}
            className="w-full sm:w-auto btn-sleek-primary px-6 py-3 text-sm font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-[#3B82F6]/20"
          >
            <span>Acessar Meu Painel Privado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Grade de Recursos (Features) */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sleek-card p-6 space-y-3 border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Cronograma Adaptativo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O algoritmo distribui vídeos e tarefas respeitando estritamente o limite de matérias por dia e a data de término de cada unidade.
            </p>
          </div>

          <div className="sleek-card p-6 space-y-3 border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Gestão por Unidades</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organize matérias em unidades com datas manuais livres ou gerador em lote para cobrir todo o semestre acadêmico.
            </p>
          </div>

          <div className="sleek-card p-6 space-y-3 border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Área de Foco Dividida</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Painel split-screen limpo com vídeo-aulas à esquerda e checklist de atividades interativas à direita.
            </p>
          </div>

          <div className="sleek-card p-6 space-y-3 border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Nuvem Multi-inquilino</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ambiente 100% seguro e privado. Faça login para acessar seus dados isolados e sincronizados via JWT e Node.js.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="sleek-card p-8 border-[#1E293B] space-y-4 bg-gradient-to-b from-[#111827] to-[#0D131F]">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Pronto para assumir o controle dos seus estudos?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Cadastre-se gratuitamente em segundos e crie seu cronograma de estudos personalizado.
          </p>
          <button
            onClick={() => setModalAuthAberto(true)}
            className="btn-sleek-primary px-6 py-2.5 text-xs font-bold rounded-xl cursor-pointer"
          >
            Criar Minha Conta Grátis
          </button>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-[#1E293B] py-6 text-center text-xs text-zinc-500 font-mono mt-auto">
        <p>FACU SPA — Minimalist Academic Workspace (Vercel Serverless & Node.js Backend)</p>
      </footer>

      <ModalAutenticacao
        estaAberto={modalAuthAberto}
        aoFechar={() => setModalAuthAberto(false)}
        aoRegistrar={aoRegistrar}
        aoFazerLogin={aoFazerLogin}
      />
    </div>
  );
};
