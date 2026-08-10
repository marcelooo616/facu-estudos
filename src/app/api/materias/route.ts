import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const materias = await prisma.materia.findMany({
      where: { usuarioId: payload.usuarioId },
      orderBy: { criadoEm: 'desc' }
    });

    return NextResponse.json({ materias });
  } catch (err: any) {
    console.error('Erro no GET /api/materias:', err);
    return NextResponse.json({ mensagem: 'Erro interno do servidor.', erro: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { nome, semestre, descricao, codigo } = await req.json();
    if (!nome || !semestre) {
      return NextResponse.json({ mensagem: 'Nome e semestre são obrigatórios.' }, { status: 400 });
    }

    const novaMateria = await prisma.materia.create({
      data: {
        usuarioId: payload.usuarioId,
        nome: nome.trim(),
        semestre: semestre.trim(),
        descricao: (descricao || '').trim(),
        codigo: codigo ? codigo.trim() : null
      }
    });

    return NextResponse.json({ materia: novaMateria }, { status: 201 });
  } catch (err: any) {
    console.error('Erro no POST /api/materias:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao criar matéria.', erro: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

    await prisma.materia.deleteMany({
      where: {
        id,
        usuarioId: payload.usuarioId
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Erro no DELETE /api/materias:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao excluir matéria.', erro: err.message }, { status: 500 });
  }
}
