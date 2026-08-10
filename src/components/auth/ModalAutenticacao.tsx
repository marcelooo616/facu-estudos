import React, { useState } from 'react';
import { Gamepad2, X, Lock, Mail, User, Sparkles } from 'lucide-react';

interface ModalAutenticacaoProps {
  estaAberto: boolean;
  modoInicial?: 'login' | 'registrar';
  aoFechar: () => void;
  aoFazerLogin: (email: string, senha: string) => Promise<boolean>;
  aoRegistrar: (nome: string, email: string, senha: string) => Promise<boolean>;
}

export const ModalAutenticacao: React.FC<ModalAutenticacaoProps> = ({
  estaAberto,
  modoInicial = 'login',
  aoFechar,
  aoFazerLogin,
  aoRegistrar
}) => {
  const [modo, setModo] = useState<'login' | 'registrar'>(modoInicial);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  if (!estaAberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      let sucesso = false;
      if (modo === 'login') {
        sucesso = await aoFazerLogin(email, senha);
      } else {
        if (!nome.trim()) {
          setErro('Por favor, informe seu nome.');
          setCarregando(false);
          return;
        }
        sucesso = await aoRegistrar(nome, email, senha);
      }

      if (sucesso) {
        aoFechar();
      } else {
        setErro(modo === 'login' ? 'E-mail ou senha incorretos.' : 'Erro ao criar conta. E-mail pode já estar em uso.');
      }
    } catch (err) {
      setErro('Ocorreu um erro ao conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-tetris-drop">
      <div className="w-full max-w-md card-tetris card-tetris-purple p-6 shadow-2xl relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#A855F7] flex items-center justify-center border border-slate-800">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-black text-white font-mono tracking-tight">
            {modo === 'login' ? 'Acessar Conta' : 'Criar Conta de Estudante'}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-mono">
          {modo === 'login'
            ? 'Entre para acessar seu ambiente universitário e cronograma.'
            : 'Cadastre-se para obter um workspace exclusivo para suas matérias.'}
        </p>

        {erro && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs font-mono text-red-300">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          {modo === 'registrar' && (
            <div>
              <label className="block text-xs text-slate-300 mb-1">Nome Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Seu Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full input-tetris pl-9 pr-3 py-2 text-sm rounded-lg"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-300 mb-1">E-mail Acadêmico ou Pessoal *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-tetris pl-9 pr-3 py-2 text-sm rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Senha de Acesso *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full input-tetris pl-9 pr-3 py-2 text-sm rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full btn-tetris-purple py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            {carregando ? (
              <span>Conectando...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{modo === 'login' ? 'Entrar no Workspace' : 'Criar Minha Conta'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#1E293B] text-center font-mono text-xs">
          {modo === 'login' ? (
            <p className="text-slate-400">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErro(null);
                  setModo('registrar');
                }}
                className="text-[#06B6D4] hover:underline font-bold"
              >
                Cadastre-se grátis
              </button>
            </p>
          ) : (
            <p className="text-slate-400">
              Já possui conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErro(null);
                  setModo('login');
                }}
                className="text-[#06B6D4] hover:underline font-bold"
              >
                Faça Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
