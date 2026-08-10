import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const videos = await prisma.video.findMany({
      where: { usuarioId: payload.usuarioId },
      orderBy: { criadoEm: 'asc' }
    });

    return NextResponse.json({ videos });
  } catch (err: any) {
    console.error('Erro no GET /api/videos:', err);
    return NextResponse.json({ mensagem: 'Erro interno do servidor ao carregar conteúdos.', erro: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { unidadeId, titulo, url, duracaoMinutos, tipoConteudo } = await req.json();
    if (!unidadeId || !titulo) {
      return NextResponse.json({ mensagem: 'Título e Unidade são obrigatórios.' }, { status: 400 });
    }

    const urlLimpa = url && typeof url === 'string' ? url.trim() : '';
    const tipo = tipoConteudo || 'video';

    const novoVideo = await prisma.video.create({
      data: {
        usuarioId: payload.usuarioId,
        unidadeId,
        titulo: titulo.trim(),
        url: urlLimpa,
        duracaoMinutos: duracaoMinutos ? parseInt(duracaoMinutos) : null,
        assistido: false,
        tipoConteudo: tipo
      }
    });

    return NextResponse.json({ video: novoVideo }, { status: 201 });
  } catch (err: any) {
    console.error('Erro no POST /api/videos:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao salvar conteúdo.', erro: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { id, titulo, url, duracaoMinutos, assistido, tipoConteudo } = await req.json();
    if (!id) {
      return NextResponse.json({ mensagem: 'ID é obrigatório para editar.' }, { status: 400 });
    }

    const videoExistente = await prisma.video.findFirst({
      where: { id, usuarioId: payload.usuarioId }
    });

    if (!videoExistente) {
      return NextResponse.json({ mensagem: 'Material não encontrado.' }, { status: 404 });
    }

    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo.trim();
    if (url !== undefined) updateData.url = typeof url === 'string' ? url.trim() : '';
    if (duracaoMinutos !== undefined) updateData.duracaoMinutos = duracaoMinutos ? parseInt(duracaoMinutos) : null;
    if (assistido !== undefined) updateData.assistido = Boolean(assistido);
    if (tipoConteudo !== undefined) updateData.tipoConteudo = String(tipoConteudo);

    const videoAtualizado = await prisma.video.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ video: videoAtualizado });
  } catch (err: any) {
    console.error('Erro no PUT /api/videos:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao atualizar material.', erro: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await obterUsuarioAutenticado(req);
    if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ mensagem: 'ID é obrigatório.' }, { status: 400 });

    await prisma.video.deleteMany({
      where: {
        id,
        usuarioId: payload.usuarioId
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Erro no DELETE /api/videos:', err);
    return NextResponse.json({ mensagem: 'Erro interno ao excluir material.', erro: err.message }, { status: 500 });
  }
}
