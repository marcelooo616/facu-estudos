import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export async function GET(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const unidades = await prisma.unidade.findMany({
    where: { usuarioId: payload.usuarioId },
    orderBy: { dataInicio: 'asc' }
  });

  return NextResponse.json({ unidades });
}

export async function POST(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { materiaId, titulo, dataInicio, dataFim } = await req.json();
  if (!materiaId || !titulo || !dataInicio || !dataFim) {
    return NextResponse.json({ mensagem: 'Campos obrigatórios ausentes.' }, { status: 400 });
  }

  const novaUnidade = await prisma.unidade.create({
    data: {
      usuarioId: payload.usuarioId,
      materiaId,
      titulo: titulo.trim(),
      dataInicio,
      dataFim
    }
  });

  return NextResponse.json({ unidade: novaUnidade }, { status: 201 });
}

export async function DELETE(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

  await prisma.unidade.deleteMany({
    where: {
      id,
      usuarioId: payload.usuarioId
    }
  });

  return NextResponse.json({ ok: true });
}
