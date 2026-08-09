import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obterUsuarioAutenticado } from '@/lib/auth';

export async function POST(req: Request) {
  const payload = await obterUsuarioAutenticado(req);
  if (!payload) return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 });

  const { materiaId, quantidade, dataInicioInicial, diasPorUnidade } = await req.json();
  if (!materiaId || !quantidade || !dataInicioInicial || !diasPorUnidade) {
    return NextResponse.json({ mensagem: 'Campos obrigatórios ausentes.' }, { status: 400 });
  }

  const criadas = [];
  let dataAtual = new Date(dataInicioInicial);

  for (let i = 1; i <= quantidade; i++) {
    const inicioStr = dataAtual.toISOString().split('T')[0];
    const dataFimObj = new Date(dataAtual);
    dataFimObj.setDate(dataFimObj.getDate() + (diasPorUnidade - 1));
    const fimStr = dataFimObj.toISOString().split('T')[0];

    const novaUnidade = await prisma.unidade.create({
      data: {
        usuarioId: payload.usuarioId,
        materiaId,
        titulo: `Unidade ${i}`,
        dataInicio: inicioStr,
        dataFim: fimStr
      }
    });

    criadas.push(novaUnidade);
    dataAtual.setDate(dataAtual.getDate() + diasPorUnidade);
  }

  return NextResponse.json({ unidades: criadas }, { status: 201 });
}
