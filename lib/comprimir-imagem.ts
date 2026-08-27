export const TAMANHO_MAX_FOTO_PX = 500;

/**
 * Redimensiona (máx. 500x500, preservando proporção) e comprime uma imagem
 * no navegador antes do upload, para não estourar o plano gratuito do
 * Supabase Storage. Retorna sempre um JPEG.
 */
export async function comprimirImagem(
  file: File,
  maxLado = TAMANHO_MAX_FOTO_PX,
  qualidade = 0.85
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
    const largura = Math.max(1, Math.round(bitmap.width * escala));
    const altura = Math.max(1, Math.round(bitmap.height * escala));

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível preparar a imagem para envio.");
    ctx.drawImage(bitmap, 0, 0, largura, altura);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem."))),
        "image/jpeg",
        qualidade
      );
    });
  } finally {
    bitmap.close();
  }
}
