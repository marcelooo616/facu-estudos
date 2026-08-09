import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) {
      return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.usuarioId },
      select: { id: true, nome: true, email: true, criadoEm: true }
    });

    if (!usuario) {
      return NextResponse.json({ mensagem: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ usuario });
  } catch (erro) {
    console.error('Erro na validação do perfil:', erro);
    return NextResponse.json({ mensagem: 'Erro ao validar perfil.' }, { status: 500 });
  }
}
