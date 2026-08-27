export type TipoMeta = "M" | "S";

export interface Meta {
  id: string;
  pessoa: string;
  tipo: TipoMeta;
  data: string; // formato YYYY-MM-DD
  created_at?: string;
}

export interface Pessoa {
  id: string;
  nome: string;
  // Foto de perfil: buscada em runtime no Supabase Storage (bucket "fotos",
  // arquivo "<id>.jpg") — ver lib/supabase.ts#getFotoPublicUrl.
  placeholder: string;
  iniciais: string;
  corGradiente: [string, string];
}
