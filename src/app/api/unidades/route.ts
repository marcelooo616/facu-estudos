import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const unidades = await prisma.unidade.findMany({
      where: { usuarioId: payload.usuarioId },
      orderBy: { dataInicio: 'asc' }
    });

    return NextResponse.json({ unidades });
  } catch (err: any) {
    console.error('Erro no GET /api/unidades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao carregar unidades.', erro: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
  } catch (err: any) {
    console.error('Erro no POST /api/unidades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao criar unidade.', erro: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
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

    const unidadeAtualizada = await prisma.unidade.update({
      where: { id },
      data: {
        concluida: novoStatusConcluida,
        ...(titulo ? { titulo: titulo.trim() } : {}),
        ...(dataInicio ? { dataInicio } : {}),
        ...(dataFim ? { dataFim } : {})
      }
    });

    return NextResponse.json({ unidade: unidadeAtualizada });
  } catch (err: any) {
    console.error('Erro no PUT /api/unidades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao atualizar unidade.', erro: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
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
  } catch (err: any) {
    console.error('Erro no DELETE /api/unidades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao excluir unidade.', erro: err.message }, { status: 500 });
  }
}
