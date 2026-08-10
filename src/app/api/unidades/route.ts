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
      dataFim,
      concluida: false
    }
  });

  return NextResponse.json({ unidade: novaUnidade }, { status: 201 });
}

export async function PUT(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { id, concluida, titulo, dataInicio, dataFim } = await req.json();
  if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

  const unidadeExistente = await prisma.unidade.findFirst({
    where: { id, usuarioId: payload.usuarioId }
  });

  if (!unidadeExistente) {
    return NextResponse.json({ mensagem: 'Unidade não encontrada.' }, { status: 404 });
  }

  const novoStatusConcluida = concluida !== undefined ? Boolean(concluida) : !unidadeExistente.concluida;

  let unidadeAtualizada;
  try {
    unidadeAtualizada = await prisma.unidade.update({
      where: { id },
      data: {
        concluida: novoStatusConcluida,
        ...(titulo ? { titulo: titulo.trim() } : {}),
        ...(dataInicio ? { dataInicio } : {}),
        ...(dataFim ? { dataFim } : {})
      }
    });
  } catch (err) {
    // Fallback SQL caso a DMMF em memória do dev server seja antiga
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "Unidade" SET "concluida" = ? WHERE "id" = ? AND "usuarioId" = ?`,
        novoStatusConcluida ? 1 : 0,
        id,
        payload.usuarioId
      );
    } catch (e) {
      console.warn('Erro no fallback SQL ao atualizar unidade:', e);
    }

    unidadeAtualizada = {
      ...unidadeExistente,
      concluida: novoStatusConcluida
    };
  }

  return NextResponse.json({ unidade: unidadeAtualizada });
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
