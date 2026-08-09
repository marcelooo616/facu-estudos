import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';

interface ModalAutenticacaoProps {
  estaAberto: boolean;
  aoFechar: () => void;
  aoRegistrar: (nome: string, email: string, senha: string) => Promise<void>;
  aoFazerLogin: (email: string, senha: string) => Promise<void>;
}

export const ModalAutenticacao: React.FC<ModalAutenticacaoProps> = ({
  estaAberto,
  aoFechar,
  aoRegistrar,
  aoFazerLogin
}) => {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!estaAberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      if (modo === 'login') {
        await aoFazerLogin(email, senha);
      } else {
        if (!nome.trim()) {
          setErro('Por favor, informe seu nome.');
          setCarregando(false);
          return;
        }
        await aoRegistrar(nome, email, senha);
      }
      setNome('');
      setEmail('');
      setSenha('');
      aoFechar();
    } catch (err: any) {
      setErro(err.message || 'Erro ao processar solicitação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-sleek-in">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl p-6 border border-[#1E293B] shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Abas Login / Cadastro */}
        <div className="flex items-center space-x-2 bg-[#0F172A] p-1 rounded-xl border border-[#1E293B] mb-6">
          <button
            type="button"
            onClick={() => {
              setModo('login');
              setErro(null);
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              modo === 'login' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar na Conta</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('registro');
              setErro(null);
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              modo === 'registro' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Nova Conta</span>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">
            {modo === 'login' ? 'Acesse seu Ambiente de Estudos' : 'Cadastre-se na Plataforma FACU'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {modo === 'login'
              ? 'Seus dados e cronogramas sincronizados na nuvem em ambiente 100% isolado.'
              : 'Crie seu ambiente privado com matérias, unidades e tarefas organizadas.'}
          </p>
        </div>

        {erro && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg mb-4 font-mono">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === 'registro' && (
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Nome Completo *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Seu Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full input-sleek pl-9 pr-3 py-2 text-sm rounded-lg"
                />
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">E-mail Universitário / Pessoal *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="aluno@facu.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-sleek pl-9 pr-3 py-2 text-sm rounded-lg font-mono"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Senha de Acesso *</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full input-sleek pl-9 pr-3 py-2 text-sm rounded-lg font-mono"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={carregando}
              className="w-full btn-sleek-primary py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {carregando
                  ? 'Aguarde...'
                  : modo === 'login'
                  ? 'Entrar no Sistema'
                  : 'Criar Minha Conta Grátis'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
