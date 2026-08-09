import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export async function GET(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const config = await prisma.configuracaoCronograma.findUnique({
    where: { usuarioId: payload.usuarioId }
  });

  if (!config) {
    return NextResponse.json({
      configuracao: {
        diasSemana: [1, 2, 3, 4, 5],
        materiasPorDia: 'auto',
        incluirConcluidas: false
      }
    });
  }

  return NextResponse.json({
    configuracao: {
      diasSemana: JSON.parse(config.diasSemana),
      materiasPorDia: config.materiasPorDia === 'auto' ? 'auto' : parseInt(config.materiasPorDia),
      incluirConcluidas: false
    }
  });
}

export async function POST(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { diasSemana, materiasPorDia } = await req.json();

  if (!diasSemana || !Array.isArray(diasSemana)) {
    return NextResponse.json({ mensagem: 'Dias da semana inválidos.' }, { status: 400 });
  }

  const configAtualizada = await prisma.configuracaoCronograma.upsert({
    where: { usuarioId: payload.usuarioId },
    update: {
      diasSemana: JSON.stringify(diasSemana),
      materiasPorDia: String(materiasPorDia)
    },
    create: {
      usuarioId: payload.usuarioId,
      diasSemana: JSON.stringify(diasSemana),
      materiasPorDia: String(materiasPorDia)
    }
  });

  return NextResponse.json({
    configuracao: {
      diasSemana: JSON.parse(configAtualizada.diasSemana),
      materiasPorDia: configAtualizada.materiasPorDia === 'auto' ? 'auto' : parseInt(configAtualizada.materiasPorDia),
      incluirConcluidas: false
    }
  });
}
