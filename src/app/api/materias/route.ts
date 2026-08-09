import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export async function GET(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const materias = await prisma.materia.findMany({
    where: { usuarioId: payload.usuarioId },
    orderBy: { criadoEm: 'desc' }
  });

  return NextResponse.json({ materias });
}

export async function POST(req: Request) {
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
}

export async function DELETE(req: Request) {
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
}
