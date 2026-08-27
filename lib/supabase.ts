import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Cliente único, criado apenas quando as variáveis de ambiente existem.
// Acesso direto pelo browser com a chave anônima — sem autenticação, é uma
// ferramenta interna (ver aviso em supabase/schema.sql sobre as policies RLS).
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(supabaseUrl as string, supabaseAnonKey as string);
  }
  return client;
}

export const BUCKET_FOTOS = "fotos";

/** Nome do arquivo fixo por pessoa no bucket — sempre .jpg (comprimimos para
 * esse formato antes do upload), sobrescrito a cada troca de foto. */
export function nomeArquivoFoto(pessoaId: string): string {
  return `${pessoaId}.jpg`;
}

/** URL pública da foto de uma pessoa no Supabase Storage, ou null se o
 * Supabase não estiver configurado. O bucket "fotos" precisa ser público
 * para leitura (ver supabase/storage-policies.sql). Não garante que o
 * arquivo exista — o componente Avatar cai no placeholder se a URL 404. */
export function getFotoPublicUrl(pessoaId: string): string | null {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(nomeArquivoFoto(pessoaId));
  return data.publicUrl;
}
