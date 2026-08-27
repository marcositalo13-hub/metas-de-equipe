"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Pessoa } from "@/lib/types";
import { getFotoPublicUrl } from "@/lib/supabase";
import { getFotoVersion, subscribeFotoVersion } from "@/lib/foto-store";

interface AvatarProps {
  pessoa: Pessoa;
  size?: number;
  className?: string;
  ringColor?: string;
  ringWidth?: number;
}

// Último recurso: um SVG com as iniciais gerado em memória (data URI), que
// nunca depende de rede/arquivo — garante que o avatar nunca apareça quebrado,
// mesmo se tanto a foto do Storage quanto o placeholder em /public/fotos falharem.
function inlineFallback(pessoa: Pessoa): string {
  const [c1, c2] = pessoa.corGradiente;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g)"/>
  <text x="100" y="118" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#ffffff" text-anchor="middle">${pessoa.iniciais}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function Avatar({
  pessoa,
  size = 64,
  className = "",
  ringColor,
  ringWidth = 3,
}: AvatarProps) {
  // Versão da foto desta pessoa: muda sempre que um upload é concluído (ver
  // lib/foto-store.ts), forçando o <img> a buscar a foto nova em vez de uma
  // cópia em cache do navegador/CDN com o mesmo nome de arquivo.
  const versao = useSyncExternalStore(
    subscribeFotoVersion,
    () => getFotoVersion(pessoa.id),
    () => 0
  );

  const fotoUrl = useMemo(() => {
    const url = getFotoPublicUrl(pessoa.id);
    if (!url) return null;
    return versao ? `${url}?v=${versao}` : url;
  }, [pessoa.id, versao]);

  const inline = useMemo(() => inlineFallback(pessoa), [pessoa]);

  // Cadeia de fallback, em ordem: foto do Storage (se configurado) →
  // placeholder local com iniciais → SVG inline (sem rede).
  const tiers = useMemo(
    () => [fotoUrl, pessoa.placeholder, inline].filter((t): t is string => Boolean(t)),
    [fotoUrl, pessoa.placeholder, inline]
  );

  const [nivel, setNivel] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sempre que uma foto nova é enviada (versao muda) ou a pessoa muda,
  // recomeça a cadeia de fallback a partir da foto real. Ajuste feito durante
  // a própria renderização (padrão recomendado pelo React para "resetar
  // estado quando uma prop muda"), em vez de um useEffect.
  const [ultimaFotoUrl, setUltimaFotoUrl] = useState(fotoUrl);
  if (fotoUrl !== ultimaFotoUrl) {
    setUltimaFotoUrl(fotoUrl);
    setNivel(0);
  }

  function avancarNivel() {
    setNivel((n) => (n < tiers.length - 1 ? n + 1 : n));
  }

  // Rede de segurança contra corrida com o cache do navegador: se a URL já
  // tiver falhado antes, o browser pode resolver o load como erro
  // instantaneamente, antes do React terminar de conectar o onError — o
  // elemento nasce "complete" e já quebrado sem nunca disparar o evento.
  // Este efeito confere isso após cada render e avança o fallback manualmente.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      avancarNivel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers[nivel]]);

  const src = tiers[Math.min(nivel, tiers.length - 1)];

  return (
    // <img> é necessário aqui para o fallback via onError quando a foto ainda não existe no Storage.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      onError={avancarNivel}
      alt={pessoa.nome}
      width={size}
      height={size}
      className={`rounded-full object-cover bg-white/20 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        boxShadow: ringColor ? `0 0 0 ${ringWidth}px ${ringColor}` : undefined,
      }}
      draggable={false}
    />
  );
}
