// Store externa mínima (padrão useSyncExternalStore) para propagar, em tempo
// real, que a foto de uma pessoa acabou de ser trocada — todo <Avatar> daquela
// pessoa espalhado pela tela (seletor, calendário, gráficos, ranking, modal)
// se atualiza sozinho, sem prop-drilling e sem recarregar a página.

type Listener = () => void;

const versoes: Record<string, number> = {};
const listeners = new Set<Listener>();

export function getFotoVersion(pessoaId: string): number {
  return versoes[pessoaId] ?? 0;
}

export function bumpFotoVersion(pessoaId: string) {
  versoes[pessoaId] = Date.now();
  listeners.forEach((listener) => listener());
}

export function subscribeFotoVersion(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
