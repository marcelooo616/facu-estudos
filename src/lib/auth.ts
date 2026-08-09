import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'facu-estudos-super-secret-key-2026-vercel-jwt';

export interface PayloadUsuario {
  usuarioId: string;
  email: string;
}

export function gerarToken(usuarioId: string, email: string): string {
  return jwt.sign({ usuarioId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verificarToken(token: string): PayloadUsuario | null {
  try {
    const decodificado = jwt.verify(token, JWT_SECRET) as PayloadUsuario;
    return decodificado;
  } catch (err) {
    return null;
  }
}

export async function obterUsuarioAutenticado(req: Request): Promise<PayloadUsuario | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return verificarToken(token);
}
