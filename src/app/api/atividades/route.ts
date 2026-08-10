import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const atividades = await prisma.atividade.findMany({
      where: { usuarioId: payload.usuarioId },
      orderBy: { criadoEm: 'desc' }
    });

    return NextResponse.json({ atividades });
  } catch (err: any) {
    console.error('Erro no GET /api/atividades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao carregar atividades.', erro: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { unidadeId, titulo, descricao } = await req.json();
    if (!unidadeId || !titulo) {
      return NextResponse.json({ mensagem: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const novaAtividade = await prisma.atividade.create({
      data: {
        usuarioId: payload.usuarioId,
        unidadeId,
        titulo: titulo.trim(),
        descricao: (descricao || '').trim(),
        concluida: false
      }
    });

    return NextResponse.json({ atividade: novaAtividade }, { status: 201 });
  } catch (err: any) {
    console.error('Erro no POST /api/atividades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao criar atividade.', erro: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

    const atividadeExistente = await prisma.atividade.findFirst({
      where: { id, usuarioId: payload.usuarioId }
    });

    if (!atividadeExistente) {
      return NextResponse.json({ mensagem: 'Atividade não encontrada.' }, { status: 404 });
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id },
      data: { concluida: !atividadeExistente.concluida }
    });

    return NextResponse.json({ atividade: atividadeAtualizada });
  } catch (err: any) {
    console.error('Erro no PUT /api/atividades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao atualizar atividade.', erro: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

    await prisma.atividade.deleteMany({
      where: {
        id,
        usuarioId: payload.usuarioId
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Erro no DELETE /api/atividades:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao excluir atividade.', erro: err.message }, { status: 500 });
  }
}
