import Database from 'better-sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const postgresUrl = process.argv[2] || process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!postgresUrl || !postgresUrl.startsWith('postgres')) {
  console.error('❌ Por favor, informe a URL do PostgreSQL da Vercel!');
  console.log('\nExemplo de uso:');
  console.log('node scripts/migrar-dados.mjs "postgresql://usuario:senha@host:5432/banco"');
  process.exit(1);
}

const sqliteDbPath = path.join(process.cwd(), 'dev.db');
console.log(`📂 Lendo banco de dados local SQLite: ${sqliteDbPath}`);

const sqlite = new Database(sqliteDbPath);
const pool = new pg.Pool({
  connectionString: postgresUrl,
  ssl: { rejectUnauthorized: false }
});

async function migrar() {
  console.log('⚡ Conectando ao PostgreSQL na Vercel...');
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error('❌ Não foi possível conectar ao PostgreSQL. Verifique a URL fornecida:', err.message);
    process.exit(1);
  }

  try {
    // 1. Ler dados do SQLite
    const usuarios = sqlite.prepare('SELECT * FROM Usuario').all();
    const configs = sqlite.prepare('SELECT * FROM ConfiguracaoCronograma').all();
    const materias = sqlite.prepare('SELECT * FROM Materia').all();
    const unidades = sqlite.prepare('SELECT * FROM Unidade').all();
    const videos = sqlite.prepare('SELECT * FROM Video').all();
    const atividades = sqlite.prepare('SELECT * FROM Atividade').all();

    console.log(`\n📊 Encontrados no SQLite local:`);
    console.log(` - ${usuarios.length} usuário(s)`);
    console.log(` - ${configs.length} configuração(ões)`);
    console.log(` - ${materias.length} matéria(s)`);
    console.log(` - ${unidades.length} unidade(s)`);
    console.log(` - ${videos.length} vídeo(s)/leitura(s)`);
    console.log(` - ${atividades.length} atividade(s)\n`);

    // 2. Inserir Usuários
    for (const u of usuarios) {
      const dataCriacao = u.criadoEm ? new Date(u.criadoEm) : new Date();
      await client.query(
        `INSERT INTO "Usuario" ("id", "nome", "email", "senhaHash", "criadoEm")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("id") DO UPDATE SET "nome" = EXCLUDED."nome", "senhaHash" = EXCLUDED."senhaHash"`,
        [u.id, u.nome, u.email, u.senhaHash, dataCriacao]
      );
    }

    // 3. Inserir Configurações
    for (const c of configs) {
      await client.query(
        `INSERT INTO "ConfiguracaoCronograma" ("id", "usuarioId", "diasSemana", "materiasPorDia")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("id") DO NOTHING`,
        [c.id, c.usuarioId, c.diasSemana, c.materiasPorDia]
      );
    }

    // 4. Inserir Matérias
    for (const m of materias) {
      const dataCriacao = m.criadoEm ? new Date(m.criadoEm) : new Date();
      await client.query(
        `INSERT INTO "Materia" ("id", "usuarioId", "nome", "semestre", "descricao", "codigo", "criadoEm")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ("id") DO NOTHING`,
        [m.id, m.usuarioId, m.nome, m.semestre, m.descricao, m.codigo || null, dataCriacao]
      );
    }

    // 5. Inserir Unidades
    for (const uni of unidades) {
      const dataCriacao = uni.criadoEm ? new Date(uni.criadoEm) : new Date();
      await client.query(
        `INSERT INTO "Unidade" ("id", "usuarioId", "materiaId", "titulo", "dataInicio", "dataFim", "concluida", "criadoEm")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT ("id") DO NOTHING`,
        [uni.id, uni.usuarioId, uni.materiaId, uni.titulo, uni.dataInicio, uni.dataFim, Boolean(uni.concluida), dataCriacao]
      );
    }

    // 6. Inserir Vídeos
    for (const v of videos) {
      const dataCriacao = v.criadoEm ? new Date(v.criadoEm) : new Date();
      await client.query(
        `INSERT INTO "Video" ("id", "usuarioId", "unidadeId", "titulo", "url", "duracaoMinutos", "assistido", "tipoConteudo", "criadoEm")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT ("id") DO NOTHING`,
        [v.id, v.usuarioId, v.unidadeId, v.titulo, v.url || null, v.duracaoMinutos || null, Boolean(v.assistido), v.tipoConteudo || 'video', dataCriacao]
      );
    }

    // 7. Inserir Atividades
    for (const a of atividades) {
      const dataCriacao = a.criadoEm ? new Date(a.criadoEm) : new Date();
      await client.query(
        `INSERT INTO "Atividade" ("id", "usuarioId", "unidadeId", "titulo", "descricao", "concluida", "criadoEm")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ("id") DO NOTHING`,
        [a.id, a.usuarioId, a.unidadeId, a.titulo, a.descricao, Boolean(a.concluida), dataCriacao]
      );
    }

    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('Todos os seus dados locais (usuários, matérias, unidades, vídeos/leituras e tarefas) foram copiados para o banco de dados remoto da Vercel!');
  } catch (err) {
    console.error('❌ Erro durante a migração:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrar();
