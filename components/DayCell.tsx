"use client";

import { motion } from "framer-motion";
import { Meta, TipoMeta } from "@/lib/types";
import { PESSOAS, getPessoa } from "@/lib/pessoas";
import { TIPO_META_COLORS } from "@/lib/tipos-meta";
import { formatDateKey, todayKey } from "@/lib/date-utils";
import Avatar from "./Avatar";

interface DayCellProps {
  date: Date;
  metasDoDia: Meta[];
  onClick: () => void;
  popping: boolean;
}

interface BadgeGroup {
  pessoaId: string;
  tipo: TipoMeta;
  count: number;
}

export default function DayCell({ date, metasDoDia, onClick, popping }: DayCellProps) {
  const key = formatDateKey(date);
  const isToday = key === todayKey();

  // Agrupa por (pessoa, tipo) e conta quantas marcações há em cada combinação.
  const badgeMap = new Map<string, BadgeGroup>();
  for (const m of metasDoDia) {
    const k = `${m.pessoa}:${m.tipo}`;
    const existing = badgeMap.get(k);
    if (existing) {
      existing.count++;
    } else {
      badgeMap.set(k, { pessoaId: m.pessoa, tipo: m.tipo as TipoMeta, count: 1 });
    }
  }

  // Ordena pela posição fixa de cada pessoa em PESSOAS, depois por tipo (M antes de S).
  const badges = [...badgeMap.values()]
    .filter((b) => getPessoa(b.pessoaId))
    .sort((a, b) => {
      const diff =
        PESSOAS.findIndex((p) => p.id === a.pessoaId) -
        PESSOAS.findIndex((p) => p.id === b.pessoaId);
      return diff !== 0 ? diff : a.tipo < b.tipo ? -1 : 1;
    });

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-start justify-start rounded-xl sm:rounded-2xl p-1 sm:p-2 min-h-[58px] sm:min-h-[86px] w-full text-left transition-colors overflow-hidden
        bg-white/10 hover:bg-white/20 border ${
          isToday ? "border-white/80" : "border-white/10"
        }`}
      animate={popping ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <span
        className={`text-[11px] sm:text-sm font-bold ${
          isToday ? "text-white" : "text-white/80"
        }`}
      >
        {date.getDate()}
      </span>
      <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
        {badges.slice(0, 6).map((b) => {
          const pessoa = getPessoa(b.pessoaId)!;
          return (
            <div
              key={`${b.pessoaId}:${b.tipo}`}
              title={`${pessoa.nome} — ${b.tipo}${b.count > 1 ? ` ×${b.count}` : ""}`}
              className="relative rounded-full"
              style={{ boxShadow: `0 0 0 2px ${TIPO_META_COLORS[b.tipo]}` }}
            >
              <Avatar pessoa={pessoa} size={18} />
              {b.count > 1 && (
                <span
                  className="absolute -bottom-1 -right-1 rounded-full text-white font-black leading-none flex items-center justify-center"
                  style={{
                    fontSize: 8,
                    minWidth: 13,
                    height: 13,
                    backgroundColor: TIPO_META_COLORS[b.tipo],
                    padding: "0 2px",
                  }}
                >
                  ×{b.count}
                </span>
              )}
            </div>
          );
        })}
        {badges.length > 6 && (
          <span className="text-[9px] sm:text-[10px] text-white/70 font-bold self-center">
            +{badges.length - 6}
          </span>
        )}
      </div>
    </motion.button>
  );
}
