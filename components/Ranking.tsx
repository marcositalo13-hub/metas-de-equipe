"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Meta } from "@/lib/types";
import { PESSOAS, getPessoa } from "@/lib/pessoas";
import Avatar from "./Avatar";

interface RankingProps {
  metas: Meta[];
  ano: number;
}

interface Entrada {
  pessoaId: string;
  total: number;
  posicao: number;
}

// Estilo por posição — sempre via gradiente/cor, nunca emoji ou caractere
// especial, como pedido.
const ESTILO_POSICAO: Record<number, { anel: string; glow: string; badge: string }> = {
  1: {
    anel: "linear-gradient(135deg, #FFF3C4, #FFC542 45%, #D89412)",
    glow: "0 0 30px 7px rgba(255, 197, 66, 0.55)",
    badge: "linear-gradient(135deg, #FFE9A8, #D89412)",
  },
  2: {
    anel: "linear-gradient(135deg, #F8FAFC, #CBD5E1 50%, #94A3B8)",
    glow: "0 0 22px 5px rgba(203, 213, 225, 0.45)",
    badge: "linear-gradient(135deg, #F1F5F9, #94A3B8)",
  },
  3: {
    anel: "linear-gradient(135deg, #F3C08C, #C87A3B 55%, #8A5324)",
    glow: "0 0 18px 4px rgba(200, 122, 59, 0.42)",
    badge: "linear-gradient(135deg, #F3C08C, #8A5324)",
  },
};

function estiloParaPosicao(posicao: number) {
  return ESTILO_POSICAO[Math.min(posicao, 3)] ?? ESTILO_POSICAO[3];
}

function calcularRanking(metas: Meta[], ano: number): Entrada[] {
  const totais = new Map<string, number>();
  for (const p of PESSOAS) totais.set(p.id, 0);
  for (const m of metas) {
    const ano_m = Number(m.data.slice(0, 4));
    if (ano_m !== ano) continue;
    totais.set(m.pessoa, (totais.get(m.pessoa) ?? 0) + 1);
  }

  const ordenado = PESSOAS.map((p) => ({ pessoaId: p.id, total: totais.get(p.id) ?? 0 })).sort(
    (a, b) => b.total - a.total
  );

  let posicaoAtual = 1;
  let totalAnterior: number | null = null;
  return ordenado.map((entrada, i) => {
    if (entrada.total !== totalAnterior) {
      posicaoAtual = i + 1;
      totalAnterior = entrada.total;
    }
    return { ...entrada, posicao: posicaoAtual };
  });
}

export default function Ranking({ metas, ano }: RankingProps) {
  const ranking = useMemo(() => calcularRanking(metas, ano), [metas, ano]);

  return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-3 sm:p-5">
      <h2 className="text-white font-black text-lg sm:text-2xl mb-3 sm:mb-4 tracking-tight">
        Ranking de {ano}
      </h2>
      {/* Grid de 3 colunas fixas — sempre lado a lado, mesmo em mobile. */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
        {ranking.map((entrada) => {
          const pessoa = getPessoa(entrada.pessoaId);
          if (!pessoa) return null;
          const estilo = estiloParaPosicao(entrada.posicao);

          return (
            <motion.div
              key={entrada.pessoaId}
              layout
              className="min-w-0 flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl px-1.5 sm:px-4 py-2.5 sm:py-5 bg-white/5 border border-white/10"
            >
              <div className="relative shrink-0">
                <div
                  className="rounded-full p-[2px] sm:p-[3px]"
                  style={{ background: estilo.anel, boxShadow: estilo.glow }}
                >
                  <div className="rounded-full bg-indigo-900/60 p-0.5">
                    <Avatar pessoa={pessoa} size={32} className="sm:!w-14 sm:!h-14" />
                  </div>
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full text-[8px] sm:text-[11px] font-black text-indigo-950 border sm:border-2 border-white/80 shadow"
                  style={{ background: estilo.badge }}
                >
                  {entrada.posicao}
                </span>
              </div>

              <p className="w-full text-center truncate text-white/90 font-semibold text-[10px] sm:text-base leading-tight">
                {pessoa.nome}
              </p>

              {/* Número total: elemento visualmente dominante do card. */}
              <p
                className="font-black leading-none bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(1.5rem, 7vw, 4.25rem)",
                  backgroundImage: estilo.anel,
                  WebkitBackgroundClip: "text",
                  filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
                }}
              >
                {entrada.total}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
