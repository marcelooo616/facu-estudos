import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { gerarToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { mensagem: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const emailMinusculo = email.trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailMinusculo }
    });

    if (!usuario) {
      return NextResponse.json(
        { mensagem: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return NextResponse.json(
        { mensagem: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    const token = gerarToken(usuario.id, usuario.email);

    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error('Erro no login de usuário:', erro);
    return NextResponse.json(
      { mensagem: 'Erro interno no servidor ao realizar login.' },
      { status: 500 }
    );
  }
}
