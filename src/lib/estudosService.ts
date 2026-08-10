import { Materia, Unidade, Video, Atividade, TipoConteudoMaterial } from './types';
import { MOCK_MATERIAS, MOCK_UNIDADES, MOCK_VIDEOS, MOCK_ATIVIDADES } from './mockData';

const CHAVE_STORAGE_MATERIAS = 'facu_estudos_materias';
const CHAVE_STORAGE_UNIDADES = 'facu_estudos_unidades';
const CHAVE_STORAGE_VIDEOS = 'facu_estudos_videos';
const CHAVE_STORAGE_ATIVIDADES = 'facu_estudos_atividades';
const CHAVE_TOKEN = 'facu_estudos_token';

class EstudosService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private obterHeadersAuth(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.isBrowser()) {
      const token = localStorage.getItem(CHAVE_TOKEN);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private temToken(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(CHAVE_TOKEN);
  }

  // Inicialização local para modo demonstração
  public async inicializarDados(): Promise<void> {
    if (!this.isBrowser() || this.temToken()) return;

    if (!localStorage.getItem(CHAVE_STORAGE_MATERIAS)) {
      localStorage.setItem(CHAVE_STORAGE_MATERIAS, JSON.stringify(MOCK_MATERIAS));
    }
    if (!localStorage.getItem(CHAVE_STORAGE_UNIDADES)) {
      localStorage.setItem(CHAVE_STORAGE_UNIDADES, JSON.stringify(MOCK_UNIDADES));
    }
    if (!localStorage.getItem(CHAVE_STORAGE_VIDEOS)) {
      localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(MOCK_VIDEOS));
    }
    if (!localStorage.getItem(CHAVE_STORAGE_ATIVIDADES)) {
      localStorage.setItem(CHAVE_STORAGE_ATIVIDADES, JSON.stringify(MOCK_ATIVIDADES));
    }
  }

  public async resetarParaMocks(): Promise<void> {
    if (!this.isBrowser()) return;
    localStorage.setItem(CHAVE_STORAGE_MATERIAS, JSON.stringify(MOCK_MATERIAS));
    localStorage.setItem(CHAVE_STORAGE_UNIDADES, JSON.stringify(MOCK_UNIDADES));
    localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(MOCK_VIDEOS));
    localStorage.setItem(CHAVE_STORAGE_ATIVIDADES, JSON.stringify(MOCK_ATIVIDADES));
  }

  // MATÉRIAS
  public async obterMaterias(): Promise<Materia[]> {
    if (this.temToken()) {
      const res = await fetch('/api/materias', { headers: this.obterHeadersAuth() });
      if (res.ok) {
        const data = await res.json();
        return data.materias;
      }
    }
    const raw = localStorage.getItem(CHAVE_STORAGE_MATERIAS);
    return raw ? JSON.parse(raw) : MOCK_MATERIAS;
  }

  public async criarMateria(materia: Omit<Materia, 'id'>): Promise<Materia> {
    if (this.temToken()) {
      const res = await fetch('/api/materias', {
        method: 'POST',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify(materia)
      });
      if (res.ok) {
        const data = await res.json();
        return data.materia;
      }
    }

    const materias = await this.obterMaterias();
    const novaMateria: Materia = { ...materia, id: `mat-${Date.now()}` };
    materias.push(novaMateria);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_MATERIAS, JSON.stringify(materias));
    }
    return novaMateria;
  }

  public async excluirMateria(id: string): Promise<void> {
    if (this.temToken()) {
      await fetch(`/api/materias?id=${id}`, {
        method: 'DELETE',
        headers: this.obterHeadersAuth()
      });
      return;
    }

    let materias = await this.obterMaterias();
    materias = materias.filter((m) => m.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_MATERIAS, JSON.stringify(materias));
    }
  }

  // UNIDADES
  public async obterUnidades(): Promise<Unidade[]> {
    if (this.temToken()) {
      const res = await fetch('/api/unidades', { headers: this.obterHeadersAuth() });
      if (res.ok) {
        const data = await res.json();
        return data.unidades;
      }
    }
    const raw = localStorage.getItem(CHAVE_STORAGE_UNIDADES);
    return raw ? JSON.parse(raw) : MOCK_UNIDADES;
  }

  public async criarUnidade(unidade: Omit<Unidade, 'id'>): Promise<Unidade> {
    if (this.temToken()) {
      const res = await fetch('/api/unidades', {
        method: 'POST',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify(unidade)
      });
      if (res.ok) {
        const data = await res.json();
        return data.unidade;
      }
    }

    const unidades = await this.obterUnidades();
    const novaUnidade: Unidade = {
      ...unidade,
      id: `uni-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    unidades.push(novaUnidade);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_UNIDADES, JSON.stringify(unidades));
    }
    return novaUnidade;
  }

  public async criarMultiplasUnidades(
    materiaId: string,
    quantidade: number,
    dataInicioInicial: string,
    diasPorUnidade: number = 7
  ): Promise<Unidade[]> {
    if (this.temToken()) {
      const res = await fetch('/api/unidades/lote', {
        method: 'POST',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify({ materiaId, quantidade, dataInicioInicial, diasPorUnidade })
      });
      if (res.ok) {
        const data = await res.json();
        return data.unidades;
      }
    }

    const unidadesCriadas: Unidade[] = [];
    let dataAtual = new Date(dataInicioInicial);

    for (let i = 1; i <= quantidade; i++) {
      const inicioStr = dataAtual.toISOString().split('T')[0];
      const dataFimObj = new Date(dataAtual);
      dataFimObj.setDate(dataFimObj.getDate() + (diasPorUnidade - 1));
      const fimStr = dataFimObj.toISOString().split('T')[0];

      const novaUnidade = await this.criarUnidade({
        materiaId,
        titulo: `Unidade ${i}`,
        dataInicio: inicioStr,
        dataFim: fimStr
      });
      unidadesCriadas.push(novaUnidade);
      dataAtual.setDate(dataAtual.getDate() + diasPorUnidade);
    }

    return unidadesCriadas;
  }

  public async excluirUnidade(id: string): Promise<void> {
    if (this.temToken()) {
      await fetch(`/api/unidades?id=${id}`, {
        method: 'DELETE',
        headers: this.obterHeadersAuth()
      });
      return;
    }

    let unidades = await this.obterUnidades();
    unidades = unidades.filter((u) => u.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_UNIDADES, JSON.stringify(unidades));
    }
  }

  public async alternarUnidadeConcluida(id: string): Promise<Unidade | null> {
    const unidades = await this.obterUnidades();
    const unidadeExistente = unidades.find((u) => u.id === id);
    if (!unidadeExistente) return null;

    const novoStatus = !unidadeExistente.concluida;

    if (this.temToken()) {
      const res = await fetch('/api/unidades', {
        method: 'PUT',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify({ id, concluida: novoStatus })
      });
      if (res.ok) {
        const data = await res.json();
        return data.unidade;
      }
    }

    unidadeExistente.concluida = novoStatus;
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_UNIDADES, JSON.stringify(unidades));
    }
    return unidadeExistente;
  }

  // VÍDEOS
  public async obterVideos(): Promise<Video[]> {
    if (this.temToken()) {
      const res = await fetch('/api/videos', { headers: this.obterHeadersAuth() });
      if (res.ok) {
        const data = await res.json();
        return data.videos;
      }
    }
    const raw = localStorage.getItem(CHAVE_STORAGE_VIDEOS);
    return raw ? JSON.parse(raw) : MOCK_VIDEOS;
  }

  public async criarVideo(video: Omit<Video, 'id'>): Promise<Video> {
    if (this.temToken()) {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify(video)
      });
      if (res.ok) {
        const data = await res.json();
        return data.video;
      }
    }

    const videos = await this.obterVideos();
    const novoVideo: Video = { ...video, id: `vid-${Date.now()}` };
    videos.push(novoVideo);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(videos));
    }
    return novoVideo;
  }

  public async editarVideo(id: string, dados: { titulo: string; url?: string; duracaoMinutos?: number; tipoConteudo?: TipoConteudoMaterial }): Promise<Video | null> {
    if (this.temToken()) {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify({ id, ...dados })
      });
      if (res.ok) {
        const data = await res.json();
        return data.video;
      }
    }

    const videos = await this.obterVideos();
    const idx = videos.findIndex((v) => v.id === id);
    if (idx === -1) return null;

    videos[idx] = {
      ...videos[idx],
      titulo: dados.titulo,
      url: dados.url,
      duracaoMinutos: dados.duracaoMinutos,
      tipoConteudo: dados.tipoConteudo || videos[idx].tipoConteudo
    };
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(videos));
    }
    return videos[idx];
  }

  public async alternarVideoAssistido(id: string): Promise<Video | null> {
    const videos = await this.obterVideos();
    const videoExistente = videos.find((v) => v.id === id);
    if (!videoExistente) return null;

    const novoAssistido = !videoExistente.assistido;

    if (this.temToken()) {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify({ id, assistido: novoAssistido })
      });
      if (res.ok) {
        const data = await res.json();
        return data.video;
      }
    }

    videoExistente.assistido = novoAssistido;
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(videos));
    }
    return videoExistente;
  }

  public async excluirVideo(id: string): Promise<void> {
    if (this.temToken()) {
      await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE',
        headers: this.obterHeadersAuth()
      });
      return;
    }

    let videos = await this.obterVideos();
    videos = videos.filter((v) => v.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_VIDEOS, JSON.stringify(videos));
    }
  }

  // ATIVIDADES
  public async obterAtividades(): Promise<Atividade[]> {
    if (this.temToken()) {
      const res = await fetch('/api/atividades', { headers: this.obterHeadersAuth() });
      if (res.ok) {
        const data = await res.json();
        return data.atividades;
      }
    }
    const raw = localStorage.getItem(CHAVE_STORAGE_ATIVIDADES);
    return raw ? JSON.parse(raw) : MOCK_ATIVIDADES;
  }

  public async criarAtividade(atividade: Omit<Atividade, 'id' | 'concluida'>): Promise<Atividade> {
    if (this.temToken()) {
      const res = await fetch('/api/atividades', {
        method: 'POST',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify(atividade)
      });
      if (res.ok) {
        const data = await res.json();
        return data.atividade;
      }
    }

    const atividades = await this.obterAtividades();
    const novaAtividade: Atividade = { ...atividade, concluida: false, id: `ati-${Date.now()}` };
    atividades.push(novaAtividade);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_ATIVIDADES, JSON.stringify(atividades));
    }
    return novaAtividade;
  }

  public async alternarStatusAtividade(id: string): Promise<Atividade | null> {
    if (this.temToken()) {
      const res = await fetch('/api/atividades', {
        method: 'PUT',
        headers: this.obterHeadersAuth(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        return data.atividade;
      }
    }

    const atividades = await this.obterAtividades();
    const index = atividades.findIndex((a) => a.id === id);
    if (index === -1) return null;

    atividades[index].concluida = !atividades[index].concluida;
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_ATIVIDADES, JSON.stringify(atividades));
    }
    return atividades[index];
  }

  public async excluirAtividade(id: string): Promise<void> {
    if (this.temToken()) {
      await fetch(`/api/atividades?id=${id}`, {
        method: 'DELETE',
        headers: this.obterHeadersAuth()
      });
      return;
    }

    let atividades = await this.obterAtividades();
    atividades = atividades.filter((a) => a.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(CHAVE_STORAGE_ATIVIDADES, JSON.stringify(atividades));
    }
  }
}

export const estudosService = new EstudosService();
