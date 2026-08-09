import { useState, useEffect, useCallback } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

const CHAVE_TOKEN = 'facu_estudos_token';

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState<boolean>(true);

  const obterToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CHAVE_TOKEN);
  };

  const verificarAutenticacao = useCallback(async () => {
    setCarregandoAuth(true);
    const tok = obterToken();
    if (!tok) {
      setUsuario(null);
      setToken(null);
      setCarregandoAuth(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${tok}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
        setToken(tok);
      } else {
        localStorage.removeItem(CHAVE_TOKEN);
        setUsuario(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Erro ao verificar token de autenticação:', err);
      setUsuario(null);
      setToken(null);
    } finally {
      setCarregandoAuth(false);
    }
  }, []);

  useEffect(() => {
    verificarAutenticacao();
  }, [verificarAutenticacao]);

  const registrar = async (nome: string, email: string, senha: string) => {
    const res = await fetch('/api/auth/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.mensagem || 'Erro ao cadastrar usuário.');
    }

    localStorage.setItem(CHAVE_TOKEN, data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  };

  const login = async (email: string, senha: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.mensagem || 'Erro ao realizar login.');
    }

    localStorage.setItem(CHAVE_TOKEN, data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  };

  const logout = () => {
    localStorage.removeItem(CHAVE_TOKEN);
    setToken(null);
    setUsuario(null);
  };

  return {
    usuario,
    token,
    carregandoAuth,
    registrar,
    login,
    logout,
    verificarAutenticacao
  };
}
