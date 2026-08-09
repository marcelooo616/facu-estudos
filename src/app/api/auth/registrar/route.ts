import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { gerarToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { mensagem: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const emailMinusculo = email.trim().toLowerCase();

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: emailMinusculo }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { mensagem: 'Este e-mail já está cadastrado.' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        email: emailMinusculo,
        senhaHash
      }
    });

    // Criar Matéria e Unidade iniciais de exemplo para o novo usuário
    const mat = await prisma.materia.create({
      data: {
        usuarioId: novoUsuario.id,
        nome: 'Introdução aos Estudos Universitários',
        semestre: '2026.1',
        descricao: 'Matéria inicial para organização do seu semestre.',
        codigo: 'FACU101'
      }
    });

    const hoje = new Date();
    const inicioStr = hoje.toISOString().split('T')[0];
    const fimObj = new Date(hoje);
    fimObj.setDate(fimObj.getDate() + 14);
    const fimStr = fimObj.toISOString().split('T')[0];

    await prisma.unidade.create({
      data: {
        usuarioId: novoUsuario.id,
        materiaId: mat.id,
        titulo: 'Unidade 1: Planejamento e Organização',
        dataInicio: inicioStr,
        dataFim: fimStr
      }
    });

    const token = gerarToken(novoUsuario.id, novoUsuario.email);

    return NextResponse.json({
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (erro) {
    console.error('Erro no registro de usuário:', erro);
    return NextResponse.json(
      { mensagem: 'Erro interno no servidor ao registrar usuário.' },
      { status: 500 }
    );
  }
}
