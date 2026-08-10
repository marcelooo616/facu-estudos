import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';


export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  // Ordenação por ordem cronológica de adição (1º adicionado = 1º na lista)
  const videos = await prisma.video.findMany({
    where: { usuarioId: payload.usuarioId },
    orderBy: { criadoEm: 'asc' }
  });

  return NextResponse.json({ videos });
}

export async function POST(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { unidadeId, titulo, url, duracaoMinutos, tipoConteudo } = await req.json();
  if (!unidadeId || !titulo) {
    return NextResponse.json({ mensagem: 'Título e Unidade são obrigatórios.' }, { status: 400 });
  }

  const urlLimpa = url && typeof url === 'string' ? url.trim() : '';
  const tipo = tipoConteudo || 'video';

  try {
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
  } catch (err) {
    // Fallback via SQL direto caso a DMMF em memória do dev server seja antiga
    const novoVideo = await prisma.video.create({
      data: {
        usuarioId: payload.usuarioId,
        unidadeId,
        titulo: titulo.trim(),
        url: urlLimpa,
        duracaoMinutos: duracaoMinutos ? parseInt(duracaoMinutos) : null
      }
    });

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "Video" SET "tipoConteudo" = ?, "assistido" = 0 WHERE "id" = ?`,
        tipo,
        novoVideo.id
      );
    } catch (e) {
      console.warn('Erro no fallback SQL ao criar:', e);
    }

    return NextResponse.json({ video: { ...novoVideo, assistido: false, tipoConteudo: tipo } }, { status: 201 });
  }
}

export async function PUT(req: Request) {
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
    return NextResponse.json({ mensagem: 'Vídeo não encontrado.' }, { status: 404 });
  }

  const updateData: any = {};
  if (titulo !== undefined) updateData.titulo = titulo.trim();
  if (url !== undefined) updateData.url = typeof url === 'string' ? url.trim() : '';
  if (duracaoMinutos !== undefined) updateData.duracaoMinutos = duracaoMinutos ? parseInt(duracaoMinutos) : null;
  if (assistido !== undefined) updateData.assistido = Boolean(assistido);
  if (tipoConteudo !== undefined) updateData.tipoConteudo = String(tipoConteudo);

  let videoAtualizado;
  try {
    videoAtualizado = await prisma.video.update({
      where: { id },
      data: updateData
    });
  } catch (err) {
    // Fallback resiliente via SQL puro no SQLite caso o processo em memória do dev server seja antigo
    if (assistido !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Video" SET "assistido" = ? WHERE "id" = ? AND "usuarioId" = ?`,
        assistido ? 1 : 0,
        id,
        payload.usuarioId
      );
    }

    if (tipoConteudo !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Video" SET "tipoConteudo" = ? WHERE "id" = ? AND "usuarioId" = ?`,
        String(tipoConteudo),
        id,
        payload.usuarioId
      );
    }

    const fallbackData: any = {};
    if (titulo !== undefined) fallbackData.titulo = titulo.trim();
    if (url !== undefined) fallbackData.url = typeof url === 'string' ? url.trim() : '';
    if (duracaoMinutos !== undefined) fallbackData.duracaoMinutos = duracaoMinutos ? parseInt(duracaoMinutos) : null;

    if (Object.keys(fallbackData).length > 0) {
      videoAtualizado = await prisma.video.update({
        where: { id },
        data: fallbackData
      });
    } else {
      videoAtualizado = await prisma.video.findFirst({
        where: { id, usuarioId: payload.usuarioId }
      });
    }

    videoAtualizado = {
      ...videoAtualizado,
      assistido: assistido !== undefined ? Boolean(assistido) : (videoAtualizado as any)?.assistido || false,
      tipoConteudo: tipoConteudo !== undefined ? String(tipoConteudo) : (videoAtualizado as any)?.tipoConteudo || 'video'
    };
  }

  return NextResponse.json({ video: videoAtualizado });
}

export async function DELETE(req: Request) {
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
}
