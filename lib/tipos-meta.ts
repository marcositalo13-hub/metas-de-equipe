import { TipoMeta } from "./types";

// Cores fixas dos dois tipos de meta — usadas no calendário, botões e gráficos.
export const TIPO_META_COLORS: Record<TipoMeta, string> = {
  M: "#FF7A1A",
  S: "#E5262B",
};

export const TIPO_META_LABELS: Record<TipoMeta, string> = {
  M: "Meta M",
  S: "Meta S",
};

export const TIPOS_META: TipoMeta[] = ["M", "S"];
